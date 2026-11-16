<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type StrikeTone = 'low' | 'high'
type StrikePhase = 'hour' | 'quarter' | 'minute'

interface StrikeStep {
  index: number
  phase: StrikePhase
  tone: StrikeTone
  label: string
  groupIndex: number
  groupTotal: number
  delayAfterMs: number
}

const rootEl = ref<HTMLElement | null>(null)
const selectedHour = ref<number>(10)
const selectedMinute = ref<number>(38)

const isPlaying = ref<boolean>(false)
const isPaused = ref<boolean>(false)
const soundEnabled = ref<boolean>(true)
const audioSupported = ref<boolean>(true)

const currentStepIdx = ref<number>(-1)
const slideProgress = ref<number>(0) // 0 = 顶部待机, 1 = 推到底
const lowHammerAngle = ref<number>(0)
const highHammerAngle = ref<number>(0)
const lowGongPulse = ref<number>(0)
const highGongPulse = ref<number>(0)
const governorAngle = ref<number>(0)
const lastToneText = ref<string>('推下左侧滑杆或点击“推杆报时”开始演示')

let audioCtx: AudioContext | null = null
let strikeTimer: number | null = null
let rafId: number | null = null
let lastRafTime = 0
let observer: IntersectionObserver | null = null

const presets = [
  { label: '10:38（常规多段）', hour: 10, minute: 38 },
  { label: '03:15（整刻无分）', hour: 3, minute: 15 },
  { label: '12:04（无刻有分）', hour: 12, minute: 4 },
  { label: '12:59（满载 32 声）', hour: 12, minute: 59 },
]

const hourCount = computed(() => selectedHour.value)
const quarterCount = computed(() => Math.floor(selectedMinute.value / 15))
const minuteCount = computed(() => selectedMinute.value % 15)

const formattedTime = computed(() => {
  const hh = String(selectedHour.value).padStart(2, '0')
  const mm = String(selectedMinute.value).padStart(2, '0')
  return `${hh}:${mm}`
})

const strikeSequence = computed<StrikeStep[]>(() => {
  const steps: StrikeStep[] = []
  let idx = 0

  for (let h = 1; h <= hourCount.value; h++) {
    steps.push({
      index: idx++,
      phase: 'hour',
      tone: 'low',
      label: `报时 · 第 ${h}/${hourCount.value} 声（咚）`,
      groupIndex: h,
      groupTotal: hourCount.value,
      delayAfterMs: h === hourCount.value && (quarterCount.value > 0 || minuteCount.value > 0) ? 560 : 400,
    })
  }

  for (let q = 1; q <= quarterCount.value; q++) {
    steps.push({
      index: idx++,
      phase: 'quarter',
      tone: 'high',
      label: `报刻 · 第 ${q}/${quarterCount.value} 组（叮）`,
      groupIndex: q,
      groupTotal: quarterCount.value,
      delayAfterMs: 250,
    })
    steps.push({
      index: idx++,
      phase: 'quarter',
      tone: 'low',
      label: `报刻 · 第 ${q}/${quarterCount.value} 组（咚）`,
      groupIndex: q,
      groupTotal: quarterCount.value,
      delayAfterMs: q === quarterCount.value && minuteCount.value > 0 ? 560 : 450,
    })
  }

  for (let m = 1; m <= minuteCount.value; m++) {
    steps.push({
      index: idx++,
      phase: 'minute',
      tone: 'high',
      label: `报分 · 第 ${m}/${minuteCount.value} 声（叮）`,
      groupIndex: m,
      groupTotal: minuteCount.value,
      delayAfterMs: 370,
    })
  }

  return steps
})

const totalStrikes = computed(() => strikeSequence.value.length)

const currentStep = computed(() => {
  if (currentStepIdx.value < 0 || currentStepIdx.value >= strikeSequence.value.length) {
    return null
  }
  return strikeSequence.value[currentStepIdx.value]
})

const completedHours = computed(() => {
  if (currentStepIdx.value < 0) return 0
  let c = 0
  for (let i = 0; i <= currentStepIdx.value; i++) {
    if (strikeSequence.value[i]?.phase === 'hour') c++
  }
  return c
})

const completedQuarters = computed(() => {
  if (currentStepIdx.value < 0) return 0
  let lowInQuarter = 0
  for (let i = 0; i <= currentStepIdx.value; i++) {
    const s = strikeSequence.value[i]
    if (s?.phase === 'quarter' && s.tone === 'low') lowInQuarter++
  }
  return lowInQuarter
})

const completedMinutes = computed(() => {
  if (currentStepIdx.value < 0) return 0
  let c = 0
  for (let i = 0; i <= currentStepIdx.value; i++) {
    if (strikeSequence.value[i]?.phase === 'minute') c++
  }
  return c
})

// 蜗形轮旋转角度示意
const hourSnailAngle = computed(() => ((selectedHour.value % 12) / 12) * 360)
const quarterSnailAngle = computed(() => (quarterCount.value / 4) * 360)
const minuteSnailAngle = computed(() => (minuteCount.value / 15) * 360)

function ensureAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) {
    audioSupported.value = false
    return null
  }
  if (!audioCtx) {
    try {
      audioCtx = new Ctor()
    } catch {
      audioSupported.value = false
      return null
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

function playGongTone(tone: StrikeTone) {
  if (!soundEnabled.value) return
  const ctx = ensureAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    // 低音簧（咚）：约 Eb4 (311.13Hz) 搭配泛音；高音簧（叮）：约 C5 (523.25Hz) 搭配清脆泛音
    const baseFreq = tone === 'low' ? 311.13 : 523.25
    const partials =
      tone === 'low'
        ? [
            { ratio: 1, gain: 0.32, decay: 1.05 },
            { ratio: 2.0, gain: 0.14, decay: 0.65 },
            { ratio: 3.01, gain: 0.06, decay: 0.35 },
          ]
        : [
            { ratio: 1, gain: 0.28, decay: 0.85 },
            { ratio: 2.0, gain: 0.13, decay: 0.5 },
            { ratio: 3.02, gain: 0.05, decay: 0.28 },
          ]

    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.85, now)
    masterGain.connect(ctx.destination)

    for (const p of partials) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(baseFreq * p.ratio, now)

      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.linearRampToValueAtTime(p.gain, now + 0.006)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay)

      osc.connect(gain)
      gain.connect(masterGain)
      osc.start(now)
      osc.stop(now + p.decay + 0.03)
    }
  } catch {
    // 平滑降级为纯视觉声波，不抛出异常
  }
}

function clearStrikeTimer() {
  if (strikeTimer !== null) {
    window.clearTimeout(strikeTimer)
    strikeTimer = null
  }
}

function triggerVisualStrike(tone: StrikeTone) {
  if (tone === 'low') {
    lowHammerAngle.value = -26
    lowGongPulse.value = 1
  } else {
    highHammerAngle.value = 26
    highGongPulse.value = 1
  }
}

function executeStep(stepIndex: number, continueAuto: boolean) {
  const seq = strikeSequence.value
  if (stepIndex >= seq.length) {
    isPlaying.value = false
    isPaused.value = false
    slideProgress.value = 0
    lastToneText.value = `报时完成：${formattedTime.value} 共敲击 ${seq.length} 声`
    return
  }

  currentStepIdx.value = stepIndex
  const step = seq[stepIndex]
  lastToneText.value = step.label
  triggerVisualStrike(step.tone)
  playGongTone(step.tone)

  if (continueAuto && isPlaying.value && !isPaused.value) {
    clearStrikeTimer()
    strikeTimer = window.setTimeout(() => {
      executeStep(stepIndex + 1, true)
    }, step.delayAfterMs)
  }
}

function startPlay() {
  ensureAudioContext()
  clearStrikeTimer()

  if (isPaused.value && currentStepIdx.value >= 0 && currentStepIdx.value < strikeSequence.value.length - 1) {
    isPlaying.value = true
    isPaused.value = false
    slideProgress.value = 1
    executeStep(currentStepIdx.value + 1, true)
    return
  }

  currentStepIdx.value = -1
  isPlaying.value = true
  isPaused.value = false
  slideProgress.value = 1
  lastToneText.value = '滑杆推到底上紧报时发条，蜗形轮采样中…'

  strikeTimer = window.setTimeout(() => {
    executeStep(0, true)
  }, 320)
}

function pausePlay() {
  if (!isPlaying.value) return
  clearStrikeTimer()
  isPlaying.value = false
  isPaused.value = true
  lastToneText.value = `已暂停（当前进度 ${currentStepIdx.value + 1}/${totalStrikes.value} 声）`
}

function stepOnce() {
  ensureAudioContext()
  clearStrikeTimer()
  isPlaying.value = false
  isPaused.value = true
  slideProgress.value = 1

  const nextIdx = currentStepIdx.value + 1
  if (nextIdx >= strikeSequence.value.length) {
    resetAll()
    return
  }
  executeStep(nextIdx, false)
}

function resetAll() {
  clearStrikeTimer()
  isPlaying.value = false
  isPaused.value = false
  currentStepIdx.value = -1
  slideProgress.value = 0
  lowHammerAngle.value = 0
  highHammerAngle.value = 0
  lowGongPulse.value = 0
  highGongPulse.value = 0
  lastToneText.value = '推下左侧滑杆或点击“推杆报时”开始演示'
}

function applyPreset(hour: number, minute: number) {
  resetAll()
  selectedHour.value = hour
  selectedMinute.value = minute
}

function toggleSound() {
  soundEnabled.value = !soundEnabled.value
  if (soundEnabled.value) {
    ensureAudioContext()
  }
}

watch([selectedHour, selectedMinute], () => {
  if (isPlaying.value || isPaused.value || currentStepIdx.value >= 0) {
    resetAll()
  }
})

function tickAnimation(ts: number) {
  if (!lastRafTime) lastRafTime = ts
  const dt = Math.min((ts - lastRafTime) / 1000, 0.1)
  lastRafTime = ts

  // 音锤弹性回弹
  lowHammerAngle.value += (0 - lowHammerAngle.value) * Math.min(1, dt * 14)
  highHammerAngle.value += (0 - highHammerAngle.value) * Math.min(1, dt * 14)

  // 音簧声波光晕衰减
  lowGongPulse.value = Math.max(0, lowGongPulse.value - dt * 1.65)
  highGongPulse.value = Math.max(0, highGongPulse.value - dt * 1.85)

  // 离心调速器旋转：播放时高速匀速旋转
  if (isPlaying.value && !isPaused.value) {
    governorAngle.value = (governorAngle.value + dt * 520) % 360
  }

  rafId = window.requestAnimationFrame(tickAnimation)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    audioSupported.value = Boolean(Ctor)
    rafId = window.requestAnimationFrame(tickAnimation)

    if ('IntersectionObserver' in window && rootEl.value) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting && isPlaying.value) {
              pausePlay()
            }
          }
        },
        { threshold: 0.15 }
      )
      observer.observe(rootEl.value)
    }
  }
})

onBeforeUnmount(() => {
  clearStrikeTimer()
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId)
    rafId = null
  }
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (audioCtx) {
    audioCtx.close().catch(() => {})
    audioCtx = null
  }
})
</script>

<template>
  <div ref="rootEl" class="mr-bench">
    <div class="mr-header">
      <div class="mr-title-wrap">
        <span class="mr-badge">2D 声学原理交互台</span>
        <h4 class="mr-title">三问机芯报时与听音演示</h4>
      </div>
      <div class="mr-time-display">
        <span class="mr-time-val">{{ formattedTime }}</span>
        <span class="mr-strike-total">共 {{ totalStrikes }} 声</span>
      </div>
    </div>

    <!-- 预设时刻快捷按钮 -->
    <div class="mr-presets">
      <button
        v-for="p in presets"
        :key="p.label"
        type="button"
        class="mr-preset-btn"
        :class="{ active: selectedHour === p.hour && selectedMinute === p.minute }"
        @click="applyPreset(p.hour, p.minute)"
      >
        {{ p.label }}
      </button>
    </div>

    <!-- 自选时间滑块 -->
    <div class="mr-sliders">
      <label class="mr-slider-item">
        <span>小时：<strong>{{ selectedHour }}</strong> 时</span>
        <input v-model.number="selectedHour" type="range" min="1" max="12" step="1" />
      </label>
      <label class="mr-slider-item">
        <span>分钟：<strong>{{ String(selectedMinute).padStart(2, '0') }}</strong> 分</span>
        <input v-model.number="selectedMinute" type="range" min="0" max="59" step="1" />
      </label>
    </div>

    <!-- SVG 机芯声学工作台 -->
    <div class="mr-svg-wrap">
      <svg viewBox="0 0 640 400" class="mr-svg" role="img" aria-label="三问腕表机芯音簧、音锤、蜗形轮与离心调速器工作原理示意图">
        <defs>
          <radialGradient id="mrPlateGrad" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stop-color="#1e293b" />
            <stop offset="75%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="#090d16" />
          </radialGradient>
          <linearGradient id="mrGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fde68a" />
            <stop offset="50%" stop-color="#d97706" />
            <stop offset="100%" stop-color="#92400e" />
          </linearGradient>
          <linearGradient id="mrSteelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f1f5f9" />
            <stop offset="55%" stop-color="#94a3b8" />
            <stop offset="100%" stop-color="#475569" />
          </linearGradient>
        </defs>

        <!-- 背景表壳外廓 -->
        <circle cx="320" cy="200" r="182" fill="#111827" stroke="#334155" stroke-width="6" />
        <circle cx="320" cy="200" r="168" fill="url(#mrPlateGrad)" stroke="#475569" stroke-width="1.5" />

        <!-- 9点位左侧报时滑杆（可点击启动） -->
        <g class="mr-slide-group" @click="isPlaying ? pausePlay() : startPlay()">
          <rect x="116" y="132" width="14" height="136" rx="7" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
          <g :transform="`translate(0, ${slideProgress * 58})`">
            <rect x="110" y="140" width="22" height="58" rx="6" fill="url(#mrGoldGrad)" stroke="#fef3c7" stroke-width="1" />
            <line x1="115" y1="162" x2="127" y2="162" stroke="#78350f" stroke-width="2" />
            <line x1="115" y1="169" x2="127" y2="169" stroke="#78350f" stroke-width="2" />
            <line x1="115" y1="176" x2="127" y2="176" stroke="#78350f" stroke-width="2" />
          </g>
          <text x="102" y="205" text-anchor="end" fill="#cbd5e1" font-size="11" font-weight="600">报时</text>
          <text x="102" y="220" text-anchor="end" fill="#fbbf24" font-size="10">滑杆</text>
        </g>

        <!-- 音簧固定座（Gong Block） -->
        <rect x="298" y="34" width="44" height="22" rx="4" fill="url(#mrSteelGrad)" stroke="#cbd5e1" stroke-width="1" />
        <circle cx="311" cy="45" r="3" fill="#0f172a" />
        <circle cx="329" cy="45" r="3" fill="#0f172a" />
        <text x="320" y="26" text-anchor="middle" fill="#94a3b8" font-size="10">音簧固定座</text>

        <!-- 外圈：低音簧（Bass / Cathedral 环绕示意，琥珀金声波） -->
        <circle
          v-if="lowGongPulse > 0.02"
          cx="320"
          cy="200"
          :r="156 + (1 - lowGongPulse) * 16"
          fill="none"
          stroke="#f59e0b"
          :stroke-width="3.5 * lowGongPulse"
          :stroke-opacity="lowGongPulse * 0.75"
        />
        <path
          d="M 308 48 A 154 154 0 1 0 338 49"
          fill="none"
          :stroke="lowGongPulse > 0.1 ? '#fbbf24' : '#b45309'"
          :stroke-width="lowGongPulse > 0.1 ? 4.5 : 3.2"
          stroke-linecap="round"
        />

        <!-- 内圈：高音簧（Treble Gong，银蓝声波） -->
        <circle
          v-if="highGongPulse > 0.02"
          cx="320"
          cy="200"
          :r="142 + (1 - highGongPulse) * 14"
          fill="none"
          stroke="#38bdf8"
          :stroke-width="3.5 * highGongPulse"
          :stroke-opacity="highGongPulse * 0.8"
        />
        <path
          d="M 332 52 A 140 140 0 1 1 296 55"
          fill="none"
          :stroke="highGongPulse > 0.1 ? '#7dd3fc' : '#64748b'"
          :stroke-width="highGongPulse > 0.1 ? 4.2 : 2.8"
          stroke-linecap="round"
        />

        <!-- 三阶采样蜗形轮区（中央左侧） -->
        <g transform="translate(248, 178)">
          <circle cx="0" cy="0" r="66" fill="#0f172a" fill-opacity="0.72" stroke="#334155" stroke-width="1" stroke-dasharray="3 3" />
          <!-- 小时蜗形轮 -->
          <g transform="translate(-26, -18)">
            <g :transform="`rotate(${hourSnailAngle})`">
              <path
                d="M 0 -22 C 13 -22, 22 -11, 20 3 C 18 15, 7 22, -6 20 C -17 18, -22 8, -17 -3 L 0 0 Z"
                fill="url(#mrGoldGrad)"
                fill-opacity="0.88"
                stroke="#fef3c7"
                stroke-width="1"
              />
              <circle cx="0" cy="0" r="4" fill="#0f172a" />
            </g>
            <text x="0" y="34" text-anchor="middle" fill="#cbd5e1" font-size="10">时蜗轮({{ hourCount }})</text>
          </g>

          <!-- 刻钟蜗形轮 -->
          <g transform="translate(30, -18)">
            <g :transform="`rotate(${quarterSnailAngle})`">
              <path
                d="M 0 -17 L 15 -4 L 10 15 L -10 15 L -15 -4 Z"
                fill="#38bdf8"
                fill-opacity="0.75"
                stroke="#bae6fd"
                stroke-width="1"
              />
              <circle cx="0" cy="0" r="3.5" fill="#0f172a" />
            </g>
            <text x="0" y="34" text-anchor="middle" fill="#cbd5e1" font-size="10">刻蜗轮({{ quarterCount }})</text>
          </g>

          <!-- 分钟惊喜蜗形轮 -->
          <g transform="translate(2, 34)">
            <g :transform="`rotate(${minuteSnailAngle})`">
              <path
                d="M 0 -16 C 12 -16, 18 -6, 14 7 C 10 16, -4 18, -13 10 C -19 4, -17 -9, -7 -14 Z"
                fill="#94a3b8"
                fill-opacity="0.85"
                stroke="#f1f5f9"
                stroke-width="1"
              />
              <circle cx="0" cy="0" r="3.5" fill="#0f172a" />
            </g>
            <text x="0" y="28" text-anchor="middle" fill="#cbd5e1" font-size="10">分蜗轮({{ minuteCount }})</text>
          </g>
        </g>

        <!-- 右侧：离心式静音调速器（Centrifugal Governor） -->
        <g transform="translate(408, 174)">
          <circle cx="0" cy="0" r="44" fill="#0f172a" stroke="#475569" stroke-width="1.5" />
          <g :transform="`rotate(${governorAngle})`">
            <line x1="-28" y1="0" x2="28" y2="0" stroke="#94a3b8" stroke-width="2" />
            <line x1="0" y1="-28" x2="0" y2="28" stroke="#94a3b8" stroke-width="2" />
            <!-- 离心飞块 -->
            <circle :cx="isPlaying ? -26 : -19" cy="0" r="6.5" fill="url(#mrGoldGrad)" stroke="#fef3c7" stroke-width="0.8" />
            <circle :cx="isPlaying ? 26 : 19" cy="0" r="6.5" fill="url(#mrGoldGrad)" stroke="#fef3c7" stroke-width="0.8" />
            <circle cx="0" cy="0" r="7" fill="#334155" stroke="#cbd5e1" stroke-width="1.2" />
          </g>
          <text x="0" y="58" text-anchor="middle" fill="#cbd5e1" font-size="10.5" font-weight="600">离心调速器</text>
          <text x="0" y="71" text-anchor="middle" fill="#64748b" font-size="9.5">
            {{ isPlaying ? '匀速旋转控拍中' : '待机静止' }}
          </text>
        </g>

        <!-- 底部双音锤（Hammers） -->
        <!-- 左锤：低音锤（敲击外圈低音簧） -->
        <g transform="translate(274, 308)">
          <g :transform="`rotate(${lowHammerAngle})`">
            <path d="M -5 0 L -8 -44 L 8 -48 L 6 0 Z" fill="url(#mrSteelGrad)" stroke="#e2e8f0" stroke-width="1" />
            <rect x="-12" y="-52" width="16" height="10" rx="3" fill="url(#mrGoldGrad)" stroke="#fef3c7" stroke-width="0.9" />
          </g>
          <circle cx="0" cy="0" r="6" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5" />
          <text x="-38" y="18" text-anchor="middle" fill="#fbbf24" font-size="10.5" font-weight="600">低音锤 (咚)</text>
        </g>

        <!-- 右锤：高音锤（敲击内圈高音簧） -->
        <g transform="translate(366, 308)">
          <g :transform="`rotate(${highHammerAngle})`">
            <path d="M -6 0 L -8 -48 L 8 -44 L 5 0 Z" fill="url(#mrSteelGrad)" stroke="#e2e8f0" stroke-width="1" />
            <rect x="-4" y="-52" width="16" height="10" rx="3" fill="#38bdf8" stroke="#bae6fd" stroke-width="0.9" />
          </g>
          <circle cx="0" cy="0" r="6" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5" />
          <text x="38" y="18" text-anchor="middle" fill="#7dd3fc" font-size="10.5" font-weight="600">高音锤 (叮)</text>
        </g>

        <!-- 图例标识 -->
        <g transform="translate(495, 34)">
          <line x1="0" y1="6" x2="18" y2="6" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" />
          <text x="24" y="10" fill="#cbd5e1" font-size="10.5">低音簧 (咚)</text>
          <line x1="0" y1="24" x2="18" y2="24" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
          <text x="24" y="28" fill="#cbd5e1" font-size="10.5">高音簧 (叮)</text>
        </g>
      </svg>
    </div>

    <!-- 当前敲击状态与分段进度条 -->
    <div class="mr-status-panel">
      <div class="mr-status-text" :class="{ active: isPlaying }">
        <span class="mr-dot" :class="currentStep?.tone ?? 'idle'"></span>
        <span>{{ lastToneText }}</span>
      </div>

      <div class="mr-progress-grid">
        <div class="mr-prog-box" :class="{ highlighting: currentStep?.phase === 'hour' }">
          <div class="mr-prog-head">
            <span>① 报时（低音 咚）</span>
            <strong>{{ completedHours }} / {{ hourCount }}</strong>
          </div>
          <div class="mr-bar">
            <div class="mr-bar-fill hour" :style="{ width: hourCount ? `${(completedHours / hourCount) * 100}%` : '0%' }"></div>
          </div>
        </div>

        <div class="mr-prog-box" :class="{ highlighting: currentStep?.phase === 'quarter' }">
          <div class="mr-prog-head">
            <span>② 报刻（双音 叮-咚）</span>
            <strong>{{ completedQuarters }} / {{ quarterCount }} 组</strong>
          </div>
          <div class="mr-bar">
            <div
              class="mr-bar-fill quarter"
              :style="{ width: quarterCount ? `${(completedQuarters / quarterCount) * 100}%` : '0%' }"
            ></div>
          </div>
        </div>

        <div class="mr-prog-box" :class="{ highlighting: currentStep?.phase === 'minute' }">
          <div class="mr-prog-head">
            <span>③ 报分（高音 叮）</span>
            <strong>{{ completedMinutes }} / {{ minuteCount }}</strong>
          </div>
          <div class="mr-bar">
            <div
              class="mr-bar-fill minute"
              :style="{ width: minuteCount ? `${(completedMinutes / minuteCount) * 100}%` : '0%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部控制栏 -->
    <div class="mr-controls">
      <button v-if="!isPlaying" type="button" class="mr-btn primary" @click="startPlay">
        {{ isPaused && currentStepIdx >= 0 ? '继续报时' : '推杆报时' }}
      </button>
      <button v-else type="button" class="mr-btn warning" @click="pausePlay">暂停</button>

      <button type="button" class="mr-btn" @click="stepOnce">单步敲击</button>
      <button type="button" class="mr-btn" @click="resetAll">重置</button>

      <button
        type="button"
        class="mr-btn sound"
        :class="{ muted: !soundEnabled || !audioSupported }"
        :disabled="!audioSupported"
        @click="toggleSound"
      >
        {{ !audioSupported ? '仅视觉脉冲' : soundEnabled ? '音效：开启' : '音效：静音' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.mr-bench {
  background: linear-gradient(160deg, #0b1120 0%, #111827 100%);
  border: 1px solid #273449;
  border-radius: 14px;
  padding: 16px;
  margin: 22px 0;
  color: #e2e8f0;
  box-shadow: 0 12px 32px rgba(2, 6, 23, 0.35);
  max-width: 100%;
  box-sizing: border-box;
}

.mr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.mr-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mr-badge {
  display: inline-block;
  width: fit-content;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.14);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 999px;
  padding: 2px 9px;
}

.mr-title {
  margin: 0 !important;
  font-size: 17px !important;
  font-weight: 700;
  color: #f8fafc;
}

.mr-time-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 6px 12px;
}

.mr-time-val {
  font-family: var(--vp-font-family-mono);
  font-size: 22px;
  font-weight: 700;
  color: #fbbf24;
}

.mr-strike-total {
  font-size: 12px;
  color: #94a3b8;
}

.mr-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.mr-preset-btn {
  border: 1px solid #334155;
  background: #1e293b;
  color: #cbd5e1;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.16s ease;
}

.mr-preset-btn:hover {
  border-color: #60a5fa;
  color: #ffffff;
}

.mr-preset-btn.active {
  background: rgba(37, 99, 235, 0.24);
  border-color: #60a5fa;
  color: #93c5fd;
  font-weight: 600;
}

.mr-sliders {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.mr-slider-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 13px;
  color: #cbd5e1;
}

.mr-slider-item strong {
  color: #fbbf24;
  font-family: var(--vp-font-family-mono);
}

.mr-slider-item input[type='range'] {
  width: 100%;
  accent-color: #f59e0b;
  cursor: pointer;
}

.mr-svg-wrap {
  width: 100%;
  border-radius: 12px;
  background: radial-gradient(circle at center, #0f172a 0%, #070b14 100%);
  border: 1px solid #1e293b;
  overflow: hidden;
}

.mr-svg {
  display: block;
  width: 100%;
  height: auto;
}

.mr-slide-group {
  cursor: pointer;
}

.mr-status-panel {
  margin-top: 12px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid #263348;
  border-radius: 10px;
  padding: 10px 12px;
}

.mr-status-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 10px;
}

.mr-status-text.active {
  color: #f8fafc;
}

.mr-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.mr-dot.idle {
  background: #64748b;
}

.mr-dot.low {
  background: #f59e0b;
  box-shadow: 0 0 8px #f59e0b;
}

.mr-dot.high {
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
}

.mr-progress-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.mr-prog-box {
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 7px 9px;
  transition: border-color 0.16s ease;
}

.mr-prog-box.highlighting {
  border-color: #60a5fa;
}

.mr-prog-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11.5px;
  color: #94a3b8;
  margin-bottom: 5px;
  gap: 4px;
}

.mr-prog-head strong {
  color: #f8fafc;
  font-family: var(--vp-font-family-mono);
}

.mr-bar {
  height: 5px;
  background: #1e293b;
  border-radius: 999px;
  overflow: hidden;
}

.mr-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.2s ease;
}

.mr-bar-fill.hour {
  background: linear-gradient(90deg, #d97706, #fbbf24);
}

.mr-bar-fill.quarter {
  background: linear-gradient(90deg, #38bdf8, #fbbf24);
}

.mr-bar-fill.minute {
  background: linear-gradient(90deg, #0284c7, #38bdf8);
}

.mr-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.mr-btn {
  flex: 1 1 auto;
  min-width: 84px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 9px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.16s ease;
}

.mr-btn:hover:not(:disabled) {
  background: #283548;
  border-color: #64748b;
}

.mr-btn.primary {
  background: #d97706;
  border-color: #f59e0b;
  color: #ffffff;
}

.mr-btn.primary:hover {
  background: #b45309;
}

.mr-btn.warning {
  background: #2563eb;
  border-color: #3b82f6;
  color: #ffffff;
}

.mr-btn.sound.muted {
  color: #94a3b8;
  border-color: #273449;
}

@media (max-width: 560px) {
  .mr-bench {
    padding: 12px;
  }

  .mr-sliders {
    grid-template-columns: 1fr;
  }

  .mr-progress-grid {
    grid-template-columns: 1fr;
  }
}
</style>
