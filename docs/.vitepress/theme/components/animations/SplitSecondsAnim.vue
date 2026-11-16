<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type PhaseState = 'idle' | 'running' | 'split' | 'snapping' | 'paused'

const rootEl = ref<HTMLElement | null>(null)

const phase = ref<PhaseState>('idle')
const activeStep = ref<number>(0)
const isVisible = ref<boolean>(true)
const speedMultiplier = ref<number>(1)

// Elapsed times in seconds
const primaryTime = ref<number>(0)
const splitTime = ref<number>(0)
const splitRecords = ref<{ label: string; value: number }[]>([])
const statusHint = ref<string>('点击「2点位 启动」或下方第 1 步，观察双针同步走时')

// Snap animation state (when clamp opens and split hand catches up to primary)
const snapProgress = ref<number>(1)
const snapStartSplit = ref<number>(0)

let rafId: number | null = null
let lastTimestamp = 0
let observer: IntersectionObserver | null = null

const isRunning = computed(() => phase.value === 'running' || phase.value === 'split' || phase.value === 'snapping')
const isClamped = computed(() => phase.value === 'split')

// Angles in degrees (0 = 12 o'clock, clockwise positive)
const primaryAngle = computed(() => (primaryTime.value % 60) * 6)
const splitAngle = computed(() => (splitTime.value % 60) * 6)

// Relative angle between heart cam (primary) and ruby roller (split) in radians
const deltaRad = computed(() => {
  const diffDeg = primaryAngle.value - splitAngle.value
  return (diffDeg * Math.PI) / 180
})

// Heart cam radius function: cleft at phi=0 (R_min=20), peak at phi=PI (R_max=42)
const R_MIN = 20
const R_MAX = 42
const ROLLER_R = 5.5

const heartCamPath = computed(() => {
  const pts: string[] = []
  const steps = 72
  for (let i = 0; i <= steps; i++) {
    const phi = (i / steps) * Math.PI * 2
    // Cleft at top (-PI/2 in SVG coords) when cam rotation = 0
    const r = R_MIN + ((R_MAX - R_MIN) * (1 - Math.cos(phi))) / 2
    const svgAngle = phi - Math.PI / 2
    const x = r * Math.cos(svgAngle)
    const y = r * Math.sin(svgAngle)
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return pts.join(' ') + ' Z'
})

// Ruby roller distance from center along split-wheel axis
const rollerRadialDist = computed(() => {
  const r = R_MIN + ((R_MAX - R_MIN) * (1 - Math.cos(deltaRad.value))) / 2
  return r + ROLLER_R
})

// Spring tension percentage (0% at cleft, 100% at peak)
const springTensionPct = computed(() => {
  return Math.round(((1 - Math.cos(deltaRad.value)) / 2) * 100)
})

// Pincer clamp opening angle (0 = closed gripping wheel, 14 = open)
const clampSpread = computed(() => (isClamped.value ? 0 : 12))

// Split column wheel rotation (toggles 30 deg per clamp action)
const columnWheelAngle = computed(() => (isClamped.value ? 30 : 0))

// Minute counter hand (30-min subdial at 3 o'clock)
const minuteAngle = computed(() => ((primaryTime.value / 60) % 30) * 12)

// Small seconds hand (decorative continuous running seconds at 9 o'clock)
const smallSecondsTime = ref<number>(0)
const smallSecondsAngle = computed(() => (smallSecondsTime.value % 60) * 6)

function formatSec(sec: number): string {
  const mins = Math.floor(sec / 60)
  const rem = sec % 60
  const s = rem.toFixed(2).padStart(5, '0')
  return mins > 0 ? `${String(mins).padStart(2, '0')}:${s}` : `${s}s`
}

function tick(now: number) {
  if (!lastTimestamp) lastTimestamp = now
  const dt = Math.min((now - lastTimestamp) / 1000, 0.08)
  lastTimestamp = now

  if (isVisible.value) {
    // Small running seconds always ticks gently to show movement is alive
    smallSecondsTime.value += dt

    if (phase.value === 'running') {
      primaryTime.value += dt * speedMultiplier.value
      splitTime.value = primaryTime.value
    } else if (phase.value === 'split') {
      primaryTime.value += dt * speedMultiplier.value
      // splitTime stays frozen!
    } else if (phase.value === 'snapping') {
      primaryTime.value += dt * speedMultiplier.value
      snapProgress.value = Math.min(1, snapProgress.value + dt / 0.22)
      // Ease-out cubic snap
      const ease = 1 - Math.pow(1 - snapProgress.value, 3)
      splitTime.value =
        snapStartSplit.value + (primaryTime.value - snapStartSplit.value) * ease
      if (snapProgress.value >= 1) {
        splitTime.value = primaryTime.value
        phase.value = 'running'
        statusHint.value = '松钳瞬间，红宝石滚轮滑回心形凸轮凹槽，追针已瞬跳对齐主计时针！'
      }
    }
  }

  rafId = requestAnimationFrame(tick)
}

function startLoop() {
  if (rafId !== null) return
  lastTimestamp = 0
  rafId = requestAnimationFrame(tick)
}

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

// Pusher 1: 2 o'clock Start / Stop
function onStartStop() {
  if (phase.value === 'idle' || phase.value === 'paused') {
    phase.value = 'running'
    activeStep.value = 1
    statusHint.value = '计时启动：钳夹张开，滚轮稳坐心形凸轮凹槽，双针严格重合同步走时。'
  } else if (phase.value === 'running' || phase.value === 'snapping') {
    phase.value = 'paused'
    activeStep.value = 4
    statusHint.value = '计时已暂停，可读取最终成绩，或点击「4点位 归零」复位。'
  } else if (phase.value === 'split') {
    // Allow pausing while split, keep split frozen
    phase.value = 'paused'
    activeStep.value = 4
    statusHint.value = '计时已暂停（追针仍处于分段锁定状态）。'
  }
}

// Pusher 2: 10 o'clock / Coaxial Split / Catch-up
function onSplitToggle() {
  if (phase.value === 'idle') {
    statusHint.value = '请先按「2点位 启动」开始计时，再使用追针分段功能。'
    return
  }
  if (phase.value === 'paused') {
    statusHint.value = '计时处于暂停状态，请先恢复走时再切换追针状态。'
    return
  }
  if (phase.value === 'running') {
    phase.value = 'split'
    activeStep.value = 2
    const label = `第 ${splitRecords.value.length + 1} 段`
    splitRecords.value = [...splitRecords.value.slice(-1), { label, value: splitTime.value }]
    statusHint.value = `钳夹闭合锁死追针轮！追针定格在 ${formatSec(splitTime.value)}，主针与心形凸轮继续旋转，滚轮沿凸轮斜坡爬升。`
  } else if (phase.value === 'split') {
    snapStartSplit.value = splitTime.value
    snapProgress.value = 0
    phase.value = 'snapping'
    activeStep.value = 3
    statusHint.value = '钳夹松开！回位弹簧推动滚轮滑入心形凸轮最低凹槽，追针瞬跳追平主针！'
  }
}

// Pusher 3: 4 o'clock Reset
function onReset() {
  if (isRunning.value) {
    statusHint.value = '提示：请先按「2点位 暂停」，再按「4点位 归零」（避免损伤机芯）。'
    return
  }
  phase.value = 'idle'
  activeStep.value = 0
  primaryTime.value = 0
  splitTime.value = 0
  splitRecords.value = []
  snapProgress.value = 1
  statusHint.value = '双针已归零至 12 点位，钳夹张开、滚轮复位。'
}

// 4-step guided teaching actions
function runGuidedStep(step: number) {
  activeStep.value = step
  if (step === 1) {
    primaryTime.value = 0
    splitTime.value = 0
    splitRecords.value = []
    phase.value = 'running'
    statusHint.value = '第 1 步：主计时导柱轮啮合，追针与主针叠合同步出发，滚轮位于心形凸轮凹槽底部。'
  } else if (step === 2) {
    if (phase.value === 'idle' || phase.value === 'paused') {
      primaryTime.value = 4.25
      splitTime.value = 4.25
    }
    phase.value = 'split'
    const label = `第 ${splitRecords.value.length + 1} 段`
    splitRecords.value = [...splitRecords.value.slice(-1), { label, value: splitTime.value }]
    statusHint.value = `第 2 步：追针钳夹闭合锁死追针轮，记录 ${formatSec(splitTime.value)}；主针与心形凸轮继续旋转，滚轮被迫爬坡压缩弹簧。`
  } else if (step === 3) {
    if (phase.value !== 'split') {
      // Ensure visible gap before snapping
      primaryTime.value = Math.max(primaryTime.value, 12.8)
      splitTime.value = Math.max(0, primaryTime.value - 8.5)
    }
    snapStartSplit.value = splitTime.value
    snapProgress.value = 0
    phase.value = 'snapping'
    statusHint.value = '第 3 步：松开钳夹！弹簧推力使红宝石滚轮瞬间滑入心形凸轮凹槽，追针瞬跳追平主针。'
  } else if (step === 4) {
    phase.value = 'paused'
    setTimeout(() => {
      if (phase.value === 'paused') {
        primaryTime.value = 0
        splitTime.value = 0
        splitRecords.value = []
        phase.value = 'idle'
        statusHint.value = '第 4 步：先暂停再归零，双针严丝合缝回到 12 点位（验表重点：静止时应完全重合）。'
      }
    }, 350)
  }
}

function togglePlayPause() {
  if (isRunning.value) {
    phase.value = 'paused'
    statusHint.value = '演示已暂停。'
  } else {
    phase.value = splitTime.value < primaryTime.value - 0.05 ? 'split' : 'running'
    statusHint.value = '演示继续运行。'
  }
}

onMounted(() => {
  startLoop()
  if (typeof IntersectionObserver !== 'undefined' && rootEl.value) {
    observer = new IntersectionObserver(
      (entries) => {
        isVisible.value = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.1 }
    )
    observer.observe(rootEl.value)
  }
})

onBeforeUnmount(() => {
  stopLoop()
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div ref="rootEl" class="ss-card">
    <!-- Header -->
    <div class="ss-header">
      <div class="ss-title-wrap">
        <span class="ss-badge">2D 交互原理</span>
        <h4 class="ss-title">双秒追针（Rattrapante）双视图联动演示</h4>
      </div>
      <div class="ss-top-controls">
        <button type="button" class="ss-ctrl-btn" @click="togglePlayPause">
          {{ isRunning ? '⏸ 暂停' : '▶ 播放' }}
        </button>
        <button type="button" class="ss-ctrl-btn" @click="onReset">
          ↺ 重置
        </button>
      </div>
    </div>

    <!-- Guided 4-step teaching bar -->
    <div class="ss-steps">
      <button
        type="button"
        class="ss-step-btn"
        :class="{ active: activeStep === 1 }"
        @click="runGuidedStep(1)"
      >
        1. 同步启动
      </button>
      <button
        type="button"
        class="ss-step-btn"
        :class="{ active: activeStep === 2 }"
        @click="runGuidedStep(2)"
      >
        2. 钳夹锁死读分段
      </button>
      <button
        type="button"
        class="ss-step-btn"
        :class="{ active: activeStep === 3 }"
        @click="runGuidedStep(3)"
      >
        3. 松钳沿心形轮瞬跳追平
      </button>
      <button
        type="button"
        class="ss-step-btn"
        :class="{ active: activeStep === 4 }"
        @click="runGuidedStep(4)"
      >
        4. 暂停并归零
      </button>
    </div>

    <!-- Dual Views -->
    <div class="ss-views">
      <!-- Left/Top: Dial + 3 Physical Pushers -->
      <div class="ss-panel">
        <div class="ss-panel-head">
          <span class="ss-panel-label">表盘视图：双大秒针与三枚实体按钮</span>
          <span class="ss-state-pill" :class="phase">
            {{
              phase === 'idle'
                ? '待机归零'
                : phase === 'running'
                  ? '双针重合走时'
                  : phase === 'split'
                    ? '追针定格分段中'
                    : phase === 'snapping'
                      ? '瞬跳追平中'
                      : '已暂停'
            }}
          </span>
        </div>

        <div class="ss-svg-wrap">
          <svg viewBox="0 0 300 280" class="ss-svg" role="img" aria-label="双秒追针表盘与按钮交互图">
            <defs>
              <radialGradient id="dialGrad" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stop-color="#1e293b" />
                <stop offset="100%" stop-color="#090d16" />
              </radialGradient>
              <linearGradient id="caseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#94a3b8" />
                <stop offset="50%" stop-color="#475569" />
                <stop offset="100%" stop-color="#cbd5e1" />
              </linearGradient>
            </defs>

            <!-- Clickable Pushers on Case -->
            <!-- 10 o'clock Split Pusher -->
            <g class="ss-pusher-group" transform="translate(150, 140) rotate(-60)" @click="onSplitToggle">
              <rect x="-12" y="-122" width="24" height="16" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="1.5" />
              <text x="0" y="-128" text-anchor="middle" fill="#fca5a5" font-size="9.5" font-weight="700" transform="rotate(60, 0, -132)">
                10点 追针分段
              </text>
            </g>

            <!-- 2 o'clock Start/Stop Pusher -->
            <g class="ss-pusher-group" transform="translate(150, 140) rotate(60)" @click="onStartStop">
              <rect x="-12" y="-122" width="24" height="16" rx="4" fill="#22c55e" stroke="#86efac" stroke-width="1.5" />
            </g>
            <text x="256" y="64" text-anchor="middle" fill="#86efac" font-size="9.5" font-weight="700" class="ss-pusher-label" @click="onStartStop">
              2点 启动/暂停
            </text>

            <!-- 4 o'clock Reset Pusher -->
            <g class="ss-pusher-group" transform="translate(150, 140) rotate(120)" @click="onReset">
              <rect x="-12" y="-122" width="24" height="16" rx="4" fill="#3b82f6" stroke="#93c5fd" stroke-width="1.5" />
            </g>
            <text x="258" y="218" text-anchor="middle" fill="#93c5fd" font-size="9.5" font-weight="700" class="ss-pusher-label" @click="onReset">
              4点 归零
            </text>

            <!-- 3 o'clock Crown (Coaxial Split hint) -->
            <g class="ss-pusher-group" @click="onSplitToggle">
              <rect x="252" y="128" width="14" height="24" rx="3" fill="#64748b" stroke="#cbd5e1" stroke-width="1.2" />
              <circle cx="266" cy="140" r="4.5" fill="#ef4444" stroke="#fecaca" stroke-width="1" />
              <text x="274" y="158" text-anchor="middle" fill="#cbd5e1" font-size="8.5">表冠(或同轴)</text>
            </g>

            <!-- Watch Case & Bezel -->
            <circle cx="150" cy="140" r="106" fill="url(#caseGrad)" />
            <circle cx="150" cy="140" r="98" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
            <circle cx="150" cy="140" r="92" fill="url(#dialGrad)" stroke="#475569" stroke-width="1" />

            <!-- 60 second ticks -->
            <g transform="translate(150, 140)">
              <g v-for="n in 60" :key="n" :transform="`rotate(${(n - 1) * 6})`">
                <line
                  x1="0"
                  :y1="(n - 1) % 5 === 0 ? -89 : -89"
                  x2="0"
                  :y2="(n - 1) % 5 === 0 ? -81 : -85"
                  :stroke="(n - 1) % 5 === 0 ? '#e2e8f0' : '#475569'"
                  :stroke-width="(n - 1) % 5 === 0 ? 1.8 : 1"
                />
              </g>
              <text x="0" y="-69" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="600">60</text>
              <text x="72" y="3" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="600">15</text>
              <text x="0" y="76" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="600">30</text>
              <text x="-72" y="3" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="600">45</text>
            </g>

            <!-- 9 o'clock Continuous Small Seconds Subdial -->
            <g transform="translate(106, 140)">
              <circle cx="0" cy="0" r="22" fill="#0b1120" stroke="#334155" stroke-width="1" />
              <text x="0" y="-11" text-anchor="middle" fill="#64748b" font-size="6.5">常走小秒</text>
              <g :transform="`rotate(${smallSecondsAngle})`">
                <line x1="0" y1="4" x2="0" y2="-16" stroke="#94a3b8" stroke-width="1.3" stroke-linecap="round" />
              </g>
              <circle cx="0" cy="0" r="2" fill="#cbd5e1" />
            </g>

            <!-- 3 o'clock 30-min Chrono Counter Subdial -->
            <g transform="translate(194, 140)">
              <circle cx="0" cy="0" r="22" fill="#0b1120" stroke="#334155" stroke-width="1" />
              <text x="0" y="-11" text-anchor="middle" fill="#64748b" font-size="6.5">30分累计</text>
              <g :transform="`rotate(${minuteAngle})`">
                <line x1="0" y1="4" x2="0" y2="-16" stroke="#fbbf24" stroke-width="1.4" stroke-linecap="round" />
              </g>
              <circle cx="0" cy="0" r="2" fill="#fbbf24" />
            </g>

            <!-- Primary Chronograph Seconds Hand (Gold/White) -->
            <g transform="translate(150, 140)">
              <g :transform="`rotate(${primaryAngle})`">
                <line x1="0" y1="18" x2="0" y2="-82" stroke="#facc15" stroke-width="2.6" stroke-linecap="round" />
                <circle cx="0" cy="14" r="2.8" fill="#facc15" />
              </g>
            </g>

            <!-- Split-Seconds (Rattrapante) Hand (Crimson Red) -->
            <g transform="translate(150, 140)">
              <g :transform="`rotate(${splitAngle})`">
                <line x1="0" y1="15" x2="0" y2="-82" stroke="#f43f5e" stroke-width="1.8" stroke-linecap="round" />
                <polygon points="0,-85 -2.5,-77 2.5,-77" fill="#f43f5e" />
              </g>
              <!-- Center Coaxial Pin -->
              <circle cx="0" cy="0" r="4.5" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.2" />
            </g>
          </svg>
        </div>

        <!-- Digital Readouts -->
        <div class="ss-readouts">
          <div class="ss-readout-box">
            <span class="ss-readout-label"><i class="dot gold"></i>主计时针</span>
            <span class="ss-readout-val">{{ formatSec(primaryTime) }}</span>
          </div>
          <div class="ss-readout-box">
            <span class="ss-readout-label"><i class="dot red"></i>追针读数</span>
            <span class="ss-readout-val">{{ formatSec(splitTime) }}</span>
          </div>
          <div v-for="rec in splitRecords" :key="rec.label + rec.value" class="ss-readout-box lap">
            <span class="ss-readout-label">{{ rec.label }}</span>
            <span class="ss-readout-val">{{ formatSec(rec.value) }}</span>
          </div>
        </div>
      </div>

      <!-- Right/Bottom: Movement Mechanism (Heart Cam + Pincers + Ruby Roller) -->
      <div class="ss-panel">
        <div class="ss-panel-head">
          <span class="ss-panel-label">机芯微观视图：钳夹 + 心形凸轮 + 滚轮杠杆</span>
          <span class="ss-iso-pill" :class="{ active: isClamped }">
            {{ isClamped ? '隔离器：已脱开防降摆幅' : '隔离器：常规耦合' }}
          </span>
        </div>

        <div class="ss-svg-wrap">
          <svg viewBox="0 0 300 280" class="ss-svg" role="img" aria-label="双秒追针机芯心形凸轮与钳夹原理图">
            <defs>
              <radialGradient id="plateGrad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stop-color="#1e293b" />
                <stop offset="100%" stop-color="#0b1120" />
              </radialGradient>
            </defs>

            <!-- Movement mainplate backdrop -->
            <rect x="8" y="8" width="284" height="264" rx="14" fill="url(#plateGrad)" stroke="#334155" stroke-width="1.2" />

            <!-- Split Column Wheel (Top Left) -->
            <g transform="translate(52, 54)">
              <circle cx="0" cy="0" r="20" fill="#1e293b" stroke="#64748b" stroke-width="1.2" />
              <g :transform="`rotate(${columnWheelAngle})`" style="transition: transform 0.25s ease">
                <circle cx="0" cy="0" r="14" fill="#334155" stroke="#94a3b8" stroke-width="1" />
                <g v-for="c in 6" :key="c" :transform="`rotate(${(c - 1) * 60})`">
                  <rect x="-2.5" y="-18" width="5" height="6" rx="1" fill="#e2e8f0" />
                </g>
              </g>
              <circle cx="0" cy="0" r="4" fill="#cbd5e1" />
              <text x="0" y="32" text-anchor="middle" fill="#94a3b8" font-size="8.5">追针导柱轮</text>
            </g>

            <!-- Clamp Status Label -->
            <text x="242" y="34" text-anchor="middle" :fill="isClamped ? '#f43f5e' : '#22c55e'" font-size="9.5" font-weight="700">
              {{ isClamped ? '钳夹闭合（锁死追针轮）' : '钳夹张开（追针自由）' }}
            </text>

            <!-- Central Coaxial Mechanism -->
            <g transform="translate(155, 148)">
              <!-- Split-Seconds Wheel (Rotates with splitAngle) -->
              <g :transform="`rotate(${splitAngle})`">
                <circle cx="0" cy="0" r="68" fill="none" stroke="#f43f5e" stroke-width="3" stroke-dasharray="4 3" opacity="0.75" />
                <circle cx="0" cy="0" r="62" fill="#0f172a" fill-opacity="0.55" stroke="#fb7185" stroke-width="1.2" />
                <!-- Spokes on split wheel -->
                <line x1="-62" y1="0" x2="62" y2="0" stroke="#475569" stroke-width="2" />
                <line x1="0" y1="-62" x2="0" y2="62" stroke="#475569" stroke-width="2" />

                <!-- Return Spring + Ruby Roller Lever mounted on Split Wheel -->
                <line
                  x1="0"
                  y1="-58"
                  x2="0"
                  :y2="-rollerRadialDist"
                  stroke="#38bdf8"
                  stroke-width="2.2"
                  stroke-dasharray="2.5 2"
                />
                <!-- Ruby Roller -->
                <circle
                  cx="0"
                  :cy="-rollerRadialDist"
                  r="5.5"
                  fill="#ec4899"
                  stroke="#fbcfe8"
                  stroke-width="1.5"
                />
              </g>

              <!-- Heart-Shaped Cam (Rotates with primaryAngle) -->
              <g :transform="`rotate(${primaryAngle})`">
                <path :d="heartCamPath" fill="#facc15" fill-opacity="0.22" stroke="#facc15" stroke-width="2.2" />
                <!-- Indicator dot at cam cleft -->
                <circle cx="0" cy="-20" r="2.2" fill="#fef08a" />
              </g>

              <!-- Center Jewel -->
              <circle cx="0" cy="0" r="6" fill="#be123c" stroke="#fda4af" stroke-width="1.5" />

              <!-- Pincer Arms (Clamp jaws) gripping top & bottom of Split Wheel -->
              <!-- Left Pincer Arm -->
              <g :transform="`translate(-78, 0) rotate(${-clampSpread})`" style="transition: transform 0.2s ease">
                <path d="M 0,48 C -10,16 -8,-28 10,-52" fill="none" stroke="#cbd5e1" stroke-width="5.5" stroke-linecap="round" />
                <circle cx="10" cy="-52" r="3.5" :fill="isClamped ? '#f43f5e' : '#94a3b8'" />
              </g>
              <!-- Right Pincer Arm -->
              <g :transform="`translate(78, 0) rotate(${clampSpread})`" style="transition: transform 0.2s ease">
                <path d="M 0,48 C 10,16 8,-28 -10,-52" fill="none" stroke="#cbd5e1" stroke-width="5.5" stroke-linecap="round" />
                <circle cx="-10" cy="-52" r="3.5" :fill="isClamped ? '#f43f5e' : '#94a3b8'" />
              </g>
            </g>

            <!-- Legend / Annotations -->
            <g transform="translate(18, 248)">
              <circle cx="6" cy="-3" r="4" fill="#ec4899" />
              <text x="14" y="0" fill="#cbd5e1" font-size="8.5">红宝石滚轮</text>

              <rect x="76" y="-7" width="10" height="8" rx="1.5" fill="#facc15" fill-opacity="0.4" stroke="#facc15" stroke-width="1" />
              <text x="90" y="0" fill="#cbd5e1" font-size="8.5">心形凸轮(随主针)</text>

              <text x="192" y="0" fill="#38bdf8" font-size="8.5" font-weight="600">
                弹簧张力: {{ springTensionPct }}%
              </text>
            </g>
          </svg>
        </div>

        <!-- Hint Bar -->
        <div class="ss-hint-bar">
          {{ statusHint }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ss-card {
  margin: 22px 0;
  padding: 16px;
  border-radius: 14px;
  background: #0b1120;
  border: 1px solid #1e293b;
  color: #e2e8f0;
  box-shadow: 0 12px 32px rgba(2, 6, 23, 0.35);
  box-sizing: border-box;
  max-width: 100%;
  overflow: hidden;
}

.ss-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.ss-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ss-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.ss-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #f8fafc;
}

.ss-top-controls {
  display: flex;
  gap: 8px;
}

.ss-ctrl-btn {
  padding: 5px 11px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #e2e8f0;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.ss-ctrl-btn:hover {
  background: #334155;
  border-color: #475569;
}

.ss-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}

.ss-step-btn {
  padding: 7px 8px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #1e293b;
  background: #111827;
  color: #94a3b8;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;
}

.ss-step-btn:hover {
  color: #f8fafc;
  border-color: #334155;
}

.ss-step-btn.active {
  background: rgba(37, 99, 235, 0.22);
  border-color: #3b82f6;
  color: #93c5fd;
}

.ss-views {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.ss-panel {
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.ss-panel-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.ss-panel-label {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
}

.ss-state-pill,
.ss-iso-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: #1e293b;
  color: #94a3b8;
}

.ss-state-pill.running {
  background: rgba(34, 197, 94, 0.18);
  color: #86efac;
}

.ss-state-pill.split,
.ss-iso-pill.active {
  background: rgba(244, 63, 94, 0.2);
  color: #fda4af;
}

.ss-state-pill.snapping {
  background: rgba(250, 204, 21, 0.2);
  color: #fde047;
}

.ss-svg-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.ss-svg {
  width: 100%;
  max-width: 320px;
  height: auto;
  display: block;
}

.ss-pusher-group,
.ss-pusher-label {
  cursor: pointer;
}

.ss-pusher-group:hover rect {
  filter: brightness(1.2);
}

.ss-readouts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.ss-readout-box {
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.ss-readout-box.lap {
  border-color: rgba(244, 63, 94, 0.35);
}

.ss-readout-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
}

.ss-readout-val {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: #f8fafc;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot.gold {
  background: #facc15;
}

.dot.red {
  background: #f43f5e;
}

.ss-hint-bar {
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12.5px;
  line-height: 1.55;
  color: #cbd5e1;
  min-height: 44px;
}

@media (max-width: 768px) {
  .ss-card {
    padding: 12px;
  }

  .ss-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ss-views {
    grid-template-columns: 1fr;
  }
}
</style>
