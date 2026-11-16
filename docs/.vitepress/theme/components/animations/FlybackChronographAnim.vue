<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type WatchMode = 'flyback' | 'standard'
type ChronoState = 'idle' | 'running' | 'paused' | 'flyback_hold' | 'conflict'

const rootEl = ref<HTMLElement | null>(null)
const isVisible = ref<boolean>(true)

const mode = ref<WatchMode>('flyback')
const state = ref<ChronoState>('idle')
const activeStep = ref<number>(0)

const elapsed = ref<number>(0)
const smallSec = ref<number>(0)
const lapRecords = ref<{ lap: number; time: number; mode: WatchMode }[]>([])

// Mechanical visual states
const clutchEngaged = ref<boolean>(false)
const hammerStrike = ref<number>(0) // 0 = lifted, 1 = striking heart cam
const conflictFlash = ref<boolean>(false)
const pusher2Pressed = ref<boolean>(false)
const pusher4Pressed = ref<boolean>(false)

const statusHint = ref<string>(
  '当前为「飞返计时模式」：点击 2 点位启动，走时中直接按 4 点位即可“归零+松手瞬走”。'
)

let rafId: number | null = null
let lastTs = 0
let observer: IntersectionObserver | null = null
let demoTimers: number[] = []

function clearDemoTimers() {
  for (const id of demoTimers) {
    window.clearTimeout(id)
  }
  demoTimers = []
}

function pulsePusher(which: 2 | 4) {
  if (which === 2) {
    pusher2Pressed.value = true
    const id = window.setTimeout(() => {
      pusher2Pressed.value = false
    }, 180)
    demoTimers.push(id)
  } else {
    pusher4Pressed.value = true
    const id = window.setTimeout(() => {
      pusher4Pressed.value = false
    }, 180)
    demoTimers.push(id)
  }
}

// Angles in degrees (0 = 12 o'clock)
const secAngle = computed(() => (elapsed.value % 60) * 6)
const minAngle = computed(() => ((elapsed.value / 60) % 60) * 6)
const smallSecAngle = computed(() => (smallSec.value % 60) * 6)

// Heart cam SVG path (cleft at top when rotation = 0)
const heartCamPath = computed(() => {
  const pts: string[] = []
  const steps = 72
  const rMin = 15
  const rMax = 30
  for (let i = 0; i <= steps; i++) {
    const phi = (i / steps) * Math.PI * 2
    const r = rMin + ((rMax - rMin) * (1 - Math.cos(phi))) / 2
    const svgAngle = phi - Math.PI / 2
    const x = r * Math.cos(svgAngle)
    const y = r * Math.sin(svgAngle)
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return pts.join(' ') + ' Z'
})

// Hammer Y offset: lifted at -46, strikes cleft at -20
const hammerY = computed(() => (hammerStrike.value > 0.5 ? -21 : -44))
// Flyback lever rotation: 0 deg at rest, -18 deg when pushing clutch open
const flybackLeverAngle = computed(() =>
  mode.value === 'flyback' && state.value === 'flyback_hold' ? -18 : 0
)

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = (sec % 60).toFixed(2).padStart(5, '0')
  return `${String(m).padStart(2, '0')}:${s}`
}

function tick(now: number) {
  if (!lastTs) lastTs = now
  const dt = Math.min((now - lastTs) / 1000, 0.08)
  lastTs = now

  if (isVisible.value) {
    smallSec.value += dt
    if (state.value === 'running') {
      elapsed.value += dt
    }
  }
  rafId = requestAnimationFrame(tick)
}

function switchMode(newMode: WatchMode) {
  if (mode.value === newMode) return
  mode.value = newMode
  resetAll()
  if (newMode === 'flyback') {
    statusHint.value =
      '已切换至「飞返计时模式」：走时中只需按一下 4 点位，杠杆强制脱开离合并敲击归零，松手立即开启下一段！'
  } else {
    statusHint.value =
      '已切换至「普通计时模式」：必须按“2点暂停 → 4点归零 → 2点重启”三步操作；走时中误按 4 点将触发机械冲突！'
  }
}

function pressPusher2() {
  clearDemoTimers()
  pulsePusher(2)
  conflictFlash.value = false

  if (state.value === 'idle' || state.value === 'paused') {
    state.value = 'running'
    clutchEngaged.value = true
    hammerStrike.value = 0
    activeStep.value = 1
    statusHint.value =
      mode.value === 'flyback'
        ? '2 点位启动：垂直离合器啮合，计时秒针开始走时。现在可直接按 4 点位体验飞返！'
        : '2 点位启动：垂直离合器啮合，计时秒针走时中。若此时误按 4 点位将发生机械冲突。'
  } else if (state.value === 'running' || state.value === 'conflict') {
    state.value = 'paused'
    clutchEngaged.value = false
    activeStep.value = mode.value === 'standard' ? 2 : 0
    statusHint.value =
      '2 点位暂停：垂直离合器脱开，计时针停走。此时可安全按 4 点位归零。'
  }
}

function holdPusher4() {
  clearDemoTimers()
  pusher4Pressed.value = true
  conflictFlash.value = false

  if (state.value === 'idle') {
    hammerStrike.value = 1
    statusHint.value = '当前处于归零待命状态，请先按 2 点位启动计时。'
    return
  }

  if (state.value === 'paused') {
    if (elapsed.value > 0) {
      lapRecords.value.unshift({
        lap: lapRecords.value.length + 1,
        time: elapsed.value,
        mode: mode.value
      })
      if (lapRecords.value.length > 4) lapRecords.value.pop()
    }
    elapsed.value = 0
    hammerStrike.value = 1
    activeStep.value = mode.value === 'standard' ? 3 : 0
    statusHint.value =
      mode.value === 'standard'
        ? '4 点位归零完成（第 2 步）：离合已提前脱开，归零锤安全敲击心形凸轮回零。需再按 2 点位才能重启。'
        : '4 点位归零完成：离合脱开，归零锤将秒针敲回 12 点位。'
    return
  }

  if (state.value === 'running') {
    if (mode.value === 'flyback') {
      // Record lap before zeroing
      lapRecords.value.unshift({
        lap: lapRecords.value.length + 1,
        time: elapsed.value,
        mode: 'flyback'
      })
      if (lapRecords.value.length > 4) lapRecords.value.pop()

      state.value = 'flyback_hold'
      clutchEngaged.value = false
      hammerStrike.value = 1
      elapsed.value = 0
      activeStep.value = 2
      statusHint.value =
        '按住 4 点位（待命）：专用飞返杠杆强制脱开离合器，归零锤同时敲击心形凸轮瞬时回零，松手即起跑！'
    } else {
      // Standard chrono conflict!
      state.value = 'conflict'
      conflictFlash.value = true
      activeStep.value = 2
      statusHint.value =
        '⚠️ 机械冲突拦截：普通计时离合器仍处于啮合状态！强行按 4 点位会导致归零锤顶撞心形凸轮与齿轮。请先按 2 点位暂停！'
    }
  }
}

function releasePusher4() {
  pusher4Pressed.value = false
  if (state.value === 'flyback_hold') {
    hammerStrike.value = 0
    clutchEngaged.value = true
    state.value = 'running'
    activeStep.value = 3
    statusHint.value =
      '松开 4 点位：归零锤抬起，垂直离合器瞬间重新咬合，下一航段无缝起跑！'
  } else if (state.value === 'paused' || state.value === 'idle') {
    hammerStrike.value = 0
  }
}

function clickPusher4Once() {
  holdPusher4()
  if (mode.value === 'flyback' && state.value === 'flyback_hold') {
    const id = window.setTimeout(() => {
      releasePusher4()
    }, 520)
    demoTimers.push(id)
  } else {
    const id = window.setTimeout(() => {
      releasePusher4()
    }, 220)
    demoTimers.push(id)
  }
}

function runFlybackDemo() {
  clearDemoTimers()
  mode.value = 'flyback'
  resetAll()

  // Step 1: start running
  pressPusher2()
  statusHint.value = '自动演示 [1/3]：2 点位启动第一段计时...'

  const t1 = window.setTimeout(() => {
    // Step 2: hold 4H (flyback zero & hold)
    holdPusher4()
    statusHint.value = '自动演示 [2/3]：走时中直接按住 4 点位 — 杠杆脱开离合 + 锤击心形轮归零待命！'
  }, 1800)

  const t2 = window.setTimeout(() => {
    // Step 3: release 4H (instant restart)
    releasePusher4()
    statusHint.value = '自动演示 [3/3]：松开 4 点位 — 离合瞬间重新啮合，第二段无缝起跑！'
  }, 2800)

  demoTimers.push(t1, t2)
}

function selectStep(step: number) {
  clearDemoTimers()
  if (mode.value === 'flyback') {
    if (step === 1) {
      if (state.value !== 'running') pressPusher2()
    } else if (step === 2) {
      if (state.value === 'idle' || state.value === 'paused') {
        elapsed.value = 4.25
        state.value = 'running'
        clutchEngaged.value = true
      }
      holdPusher4()
    } else if (step === 3) {
      if (state.value !== 'flyback_hold') {
        elapsed.value = 4.25
        state.value = 'running'
        clutchEngaged.value = true
        holdPusher4()
      }
      const id = window.setTimeout(() => releasePusher4(), 160)
      demoTimers.push(id)
    }
  } else {
    if (step === 1) {
      if (state.value !== 'running') pressPusher2()
    } else if (step === 2) {
      if (state.value === 'idle') {
        elapsed.value = 3.5
        state.value = 'running'
        clutchEngaged.value = true
      }
      if (state.value === 'running') pressPusher2()
    } else if (step === 3) {
      if (state.value !== 'paused') {
        elapsed.value = 3.5
        state.value = 'paused'
        clutchEngaged.value = false
      }
      clickPusher4Once()
    }
  }
}

function resetAll() {
  clearDemoTimers()
  state.value = 'idle'
  activeStep.value = 0
  elapsed.value = 0
  clutchEngaged.value = false
  hammerStrike.value = 0
  conflictFlash.value = false
  pusher2Pressed.value = false
  pusher4Pressed.value = false
  lapRecords.value = []
}

onMounted(() => {
  if (typeof IntersectionObserver !== 'undefined' && rootEl.value) {
    observer = new IntersectionObserver(
      (entries) => {
        isVisible.value = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.1 }
    )
    observer.observe(rootEl.value)
  }
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  clearDemoTimers()
  if (rafId !== null) cancelAnimationFrame(rafId)
  if (observer) observer.disconnect()
})
</script>

<template>
  <div ref="rootEl" class="fb-card">
    <div class="fb-header">
      <div>
        <div class="fb-title">飞返计时 vs 普通计时：双视图机械原理对比</div>
        <div class="fb-subtitle">
          切换模式并点击表壳 2 点 / 4 点位按钮（飞返模式支持“按住归零、松手瞬走”交互）
        </div>
      </div>
      <div class="fb-mode-tabs">
        <button
          type="button"
          class="fb-mode-btn"
          :class="{ active: mode === 'flyback' }"
          @click="switchMode('flyback')"
        >
          飞返计时模式（1 步瞬跳）
        </button>
        <button
          type="button"
          class="fb-mode-btn"
          :class="{ active: mode === 'standard' }"
          @click="switchMode('standard')"
        >
          普通计时模式（3 步 / 防误触）
        </button>
      </div>
    </div>

    <div class="fb-toolbar">
      <div class="fb-btn-group">
        <button type="button" class="fb-btn primary" @click="pressPusher2">
          {{ state === 'running' ? '2点位 暂停' : '2点位 启动' }}
        </button>
        <button
          type="button"
          class="fb-btn accent"
          @mousedown="holdPusher4"
          @mouseup="releasePusher4"
          @mouseleave="releasePusher4"
          @touchstart.prevent="holdPusher4"
          @touchend.prevent="releasePusher4"
        >
          4点位 {{ mode === 'flyback' ? '飞返（按住/松手）' : '归零' }}
        </button>
        <button type="button" class="fb-btn demo" @click="runFlybackDemo">
          一键飞返演示
        </button>
        <button type="button" class="fb-btn ghost" @click="resetAll">重置</button>
      </div>
    </div>

    <div class="fb-steps">
      <template v-if="mode === 'flyback'">
        <button
          type="button"
          class="fb-step-btn"
          :class="{ active: activeStep === 1 }"
          @click="selectStep(1)"
        >
          1. 2点启动走时
        </button>
        <button
          type="button"
          class="fb-step-btn"
          :class="{ active: activeStep === 2 }"
          @click="selectStep(2)"
        >
          2. 按住4点（脱开+归零）
        </button>
        <button
          type="button"
          class="fb-step-btn"
          :class="{ active: activeStep === 3 }"
          @click="selectStep(3)"
        >
          3. 松手4点（重咬合起跑）
        </button>
      </template>
      <template v-else>
        <button
          type="button"
          class="fb-step-btn"
          :class="{ active: activeStep === 1 }"
          @click="selectStep(1)"
        >
          1. 2点启动走时
        </button>
        <button
          type="button"
          class="fb-step-btn"
          :class="{ active: activeStep === 2 }"
          @click="selectStep(2)"
        >
          2. 2点暂停（脱开离合）
        </button>
        <button
          type="button"
          class="fb-step-btn"
          :class="{ active: activeStep === 3 }"
          @click="selectStep(3)"
        >
          3. 4点归零（再按2点重启）
        </button>
      </template>
    </div>

    <div class="fb-views">
      <!-- Left: Dial View -->
      <div class="fb-panel">
        <div class="fb-panel-head">
          <span class="fb-panel-label">表盘操作视图</span>
          <span class="fb-state-pill" :class="state">
            {{
              state === 'idle'
                ? '待命归零'
                : state === 'running'
                  ? '计时走时中'
                  : state === 'flyback_hold'
                    ? '按住4点：归零待命'
                    : state === 'conflict'
                      ? '机械冲突拦截'
                      : '已暂停'
            }}
          </span>
        </div>

        <div class="fb-svg-wrap">
          <svg viewBox="0 0 280 280" class="fb-svg" aria-label="飞返计时表盘交互视图">
            <defs>
              <radialGradient id="fbDialGrad" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stop-color="#1e293b" />
                <stop offset="100%" stop-color="#0b1120" />
              </radialGradient>
            </defs>

            <!-- 2 o'clock pusher (Start/Stop) -->
            <g
              class="fb-pusher"
              :transform="`translate(${pusher2Pressed ? -3 : 0}, ${pusher2Pressed ? 2 : 0})`"
              @click="pressPusher2"
            >
              <rect
                x="222"
                y="62"
                width="20"
                height="16"
                rx="3"
                transform="rotate(30 232 70)"
                fill="#475569"
                stroke="#94a3b8"
                stroke-width="1.2"
              />
              <text x="242" y="54" fill="#38bdf8" font-size="10" font-weight="700">2H</text>
            </g>

            <!-- Crown at 3 o'clock -->
            <rect
              x="246"
              y="128"
              width="14"
              height="24"
              rx="3"
              fill="#334155"
              stroke="#64748b"
              stroke-width="1.2"
            />

            <!-- 4 o'clock pusher (Flyback / Reset) -->
            <g
              class="fb-pusher"
              :transform="`translate(${pusher4Pressed ? -3 : 0}, ${pusher4Pressed ? -2 : 0})`"
              @mousedown="holdPusher4"
              @mouseup="releasePusher4"
              @mouseleave="releasePusher4"
              @touchstart.prevent="holdPusher4"
              @touchend.prevent="releasePusher4"
            >
              <rect
                x="222"
                y="202"
                width="20"
                height="16"
                rx="3"
                transform="rotate(-30 232 210)"
                :fill="mode === 'flyback' ? '#b45309' : '#475569'"
                :stroke="mode === 'flyback' ? '#fbbf24' : '#94a3b8'"
                stroke-width="1.4"
              />
              <text
                x="242"
                y="228"
                :fill="mode === 'flyback' ? '#fbbf24' : '#94a3b8'"
                font-size="10"
                font-weight="700"
              >
                4H {{ mode === 'flyback' ? '飞返' : '归零' }}
              </text>
            </g>

            <!-- Case & Bezel -->
            <circle cx="140" cy="140" r="110" fill="#1e293b" stroke="#475569" stroke-width="3" />
            <circle cx="140" cy="140" r="100" fill="url(#fbDialGrad)" stroke="#334155" stroke-width="1.5" />

            <!-- Dial ticks -->
            <g v-for="i in 60" :key="i" :transform="`rotate(${i * 6} 140 140)`">
              <line
                x1="140"
                :y1="i % 5 === 0 ? 44 : 47"
                x2="140"
                y2="52"
                :stroke="i % 5 === 0 ? '#cbd5e1' : '#475569'"
                :stroke-width="i % 5 === 0 ? 1.8 : 1"
              />
            </g>

            <!-- Mode badge on dial -->
            <text
              x="140"
              y="88"
              text-anchor="middle"
              :fill="mode === 'flyback' ? '#fbbf24' : '#64748b'"
              font-size="9.5"
              font-weight="700"
              letter-spacing="1.2"
            >
              {{ mode === 'flyback' ? 'FLYBACK' : 'CHRONOGRAPH' }}
            </text>

            <!-- 6 o'clock 60-min counter subdial -->
            <g transform="translate(140, 185)">
              <circle r="30" fill="#0f172a" stroke="#334155" stroke-width="1.2" />
              <text x="0" y="-17" text-anchor="middle" fill="#64748b" font-size="7.5">60</text>
              <text x="19" y="3" text-anchor="middle" fill="#64748b" font-size="7.5">15</text>
              <text x="0" y="23" text-anchor="middle" fill="#64748b" font-size="7.5">30</text>
              <text x="-19" y="3" text-anchor="middle" fill="#64748b" font-size="7.5">45</text>
              <g :transform="`rotate(${minAngle})`">
                <line x1="0" y1="4" x2="0" y2="-22" stroke="#f97316" stroke-width="2" stroke-linecap="round" />
                <circle r="3" fill="#f97316" />
              </g>
            </g>

            <!-- 9 o'clock small running seconds -->
            <g transform="translate(88, 140)">
              <circle r="20" fill="#0f172a" stroke="#334155" stroke-width="1" />
              <text x="0" y="13" text-anchor="middle" fill="#475569" font-size="6.5">SEC</text>
              <g :transform="`rotate(${smallSecAngle})`">
                <line x1="0" y1="3" x2="0" y2="-15" stroke="#94a3b8" stroke-width="1.4" stroke-linecap="round" />
                <circle r="2.2" fill="#94a3b8" />
              </g>
            </g>

            <!-- Central Chrono Seconds Hand -->
            <g :transform="`rotate(${secAngle} 140 140)`">
              <line
                x1="140"
                y1="160"
                x2="140"
                y2="46"
                stroke="#f97316"
                stroke-width="2.2"
                stroke-linecap="round"
              />
              <circle cx="140" cy="140" r="5" fill="#f97316" />
              <circle cx="140" cy="140" r="2" fill="#0f172a" />
            </g>
          </svg>
        </div>

        <div class="fb-readouts">
          <div class="fb-readout-box">
            <span class="fb-readout-label">当前计时读数</span>
            <span class="fb-readout-val">{{ formatTime(elapsed) }}</span>
          </div>
          <div class="fb-readout-box">
            <span class="fb-readout-label">分段记录</span>
            <span class="fb-readout-val">
              {{ lapRecords.length > 0 ? `#${lapRecords[0].lap} ${formatTime(lapRecords[0].time)}` : '暂无' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Micro Movement View -->
      <div class="fb-panel">
        <div class="fb-panel-head">
          <span class="fb-panel-label">机芯微观透视（离合 + 归零锤）</span>
          <span
            class="fb-iso-pill"
            :class="{
              engaged: clutchEngaged && !conflictFlash,
              conflict: conflictFlash
            }"
          >
            {{
              conflictFlash
                ? '碰撞冲突！离合未脱开'
                : clutchEngaged
                  ? '垂直离合：已啮合'
                  : '垂直离合：已脱开'
            }}
          </span>
        </div>

        <div class="fb-svg-wrap">
          <svg viewBox="0 0 280 280" class="fb-svg" aria-label="飞返机芯微观透视图">
            <rect x="8" y="8" width="264" height="264" rx="14" fill="#0b1120" stroke="#1e293b" stroke-width="1.2" />

            <!-- Vertical Clutch Assembly (Bottom Half) -->
            <g transform="translate(140, 208)">
              <text x="0" y="-42" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="600">
                垂直离合器（Vertical Clutch）
              </text>
              <!-- Driving wheel (always rotating subtly) -->
              <rect x="-42" y="16" width="84" height="10" rx="2" fill="#334155" stroke="#64748b" stroke-width="1.2" />
              <text x="52" y="24" fill="#64748b" font-size="8.5">主动轮</text>

              <!-- Driven chrono wheel (moves down to engage, up to disengage) -->
              <g :transform="`translate(0, ${clutchEngaged ? 0 : -16})`">
                <rect
                  x="-38"
                  y="4"
                  width="76"
                  height="10"
                  rx="2"
                  :fill="conflictFlash ? '#7f1d1d' : clutchEngaged ? '#065f46' : '#1e293b'"
                  :stroke="conflictFlash ? '#f43f5e' : clutchEngaged ? '#34d399' : '#64748b'"
                  stroke-width="1.5"
                />
                <text x="48" y="12" :fill="clutchEngaged ? '#6ee7b7' : '#94a3b8'" font-size="8.5">
                  计时摩擦盘
                </text>
              </g>

              <!-- Engagement indicator arrows -->
              <text
                x="0"
                y="42"
                text-anchor="middle"
                :fill="conflictFlash ? '#fda4af' : clutchEngaged ? '#34d399' : '#fbbf24'"
                font-size="9.5"
                font-weight="700"
              >
                {{
                  conflictFlash
                    ? '离合咬死中 — 严禁强行归零！'
                    : clutchEngaged
                      ? '▲ 贴合传力中（走时）'
                      : '▼ 摩擦盘抬起脱开（安全归零态）'
                }}
              </text>
            </g>

            <!-- Flyback Lever linking 4H pusher to Clutch & Hammer -->
            <g
              v-if="mode === 'flyback'"
              :transform="`translate(215, 145) rotate(${flybackLeverAngle})`"
            >
              <path
                d="M 28 -10 L -18 0 L -38 35"
                fill="none"
                :stroke="state === 'flyback_hold' ? '#fbbf24' : '#64748b'"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="-18" cy="0" r="4" fill="#94a3b8" />
              <text x="0" y="-14" text-anchor="middle" fill="#fbbf24" font-size="8.5">飞返联动杆</text>
            </g>

            <!-- Heart Cam & Reset Hammer Assembly (Top Half) -->
            <g transform="translate(125, 92)">
              <text x="0" y="-64" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="600">
                心形归零凸轮 &amp; 归零锤
              </text>

              <!-- Heart Cam rotating with chrono seconds -->
              <g :transform="`rotate(${secAngle})`">
                <path
                  :d="heartCamPath"
                  :fill="conflictFlash ? '#4c0519' : '#1e293b'"
                  :stroke="conflictFlash ? '#f43f5e' : '#eab308'"
                  stroke-width="2"
                />
                <circle r="4.5" fill="#eab308" />
              </g>

              <!-- Reset Hammer -->
              <g :transform="`translate(0, ${hammerY})`">
                <path
                  d="M -18 -14 L 18 -14 L 6 4 L -6 4 Z"
                  :fill="hammerStrike > 0.5 ? '#f59e0b' : '#475569'"
                  :stroke="hammerStrike > 0.5 ? '#fde047' : '#cbd5e1'"
                  stroke-width="1.5"
                />
              </g>

              <!-- Conflict spark if standard mode mis-clicked -->
              <g v-if="conflictFlash">
                <circle cx="0" cy="-22" r="14" fill="rgba(244,63,94,0.28)" stroke="#f43f5e" stroke-width="1.5" />
                <text x="0" y="-19" text-anchor="middle" fill="#fda4af" font-size="10" font-weight="800">
                  撞击!
                </text>
              </g>
            </g>
          </svg>
        </div>

        <div class="fb-laps-list">
          <div v-if="lapRecords.length === 0" class="fb-lap-empty">
            按 4 点位执行飞返/归零后，分段圈速将记录在此处
          </div>
          <div v-else class="fb-lap-items">
            <span v-for="rec in lapRecords" :key="rec.lap" class="fb-lap-chip">
              第 {{ rec.lap }} 段: {{ formatTime(rec.time) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="fb-hint-bar" :class="{ conflict: conflictFlash }">
      {{ statusHint }}
    </div>
  </div>
</template>

<style scoped>
.fb-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 14px;
  padding: 16px;
  color: #e2e8f0;
  margin: 18px 0;
  box-shadow: 0 10px 28px rgba(2, 6, 23, 0.35);
}

.fb-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.fb-title {
  font-size: 15px;
  font-weight: 700;
  color: #f8fafc;
}

.fb-subtitle {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.fb-mode-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.fb-mode-btn {
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.15s;
}

.fb-mode-btn.active {
  background: rgba(245, 158, 11, 0.18);
  border-color: #f59e0b;
  color: #fde68a;
}

.fb-toolbar {
  margin-bottom: 10px;
}

.fb-btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.fb-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #e2e8f0;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s;
}

.fb-btn.primary {
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
}

.fb-btn.accent {
  background: #b45309;
  border-color: #f59e0b;
  color: #fef3c7;
}

.fb-btn.demo {
  background: #065f46;
  border-color: #10b981;
  color: #d1fae5;
}

.fb-btn.ghost:hover {
  background: #334155;
}

.fb-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}

.fb-step-btn {
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

.fb-step-btn.active {
  background: rgba(37, 99, 235, 0.22);
  border-color: #3b82f6;
  color: #93c5fd;
}

.fb-views {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.fb-panel {
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.fb-panel-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.fb-panel-label {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
}

.fb-state-pill,
.fb-iso-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: #1e293b;
  color: #94a3b8;
}

.fb-state-pill.running,
.fb-iso-pill.engaged {
  background: rgba(34, 197, 94, 0.18);
  color: #86efac;
}

.fb-state-pill.flyback_hold {
  background: rgba(245, 158, 11, 0.22);
  color: #fde047;
}

.fb-state-pill.conflict,
.fb-iso-pill.conflict {
  background: rgba(244, 63, 94, 0.22);
  color: #fda4af;
}

.fb-svg-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.fb-svg {
  width: 100%;
  max-width: 280px;
  height: auto;
  display: block;
}

.fb-pusher {
  cursor: pointer;
}

.fb-readouts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.fb-readout-box {
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11.5px;
}

.fb-readout-label {
  color: #94a3b8;
}

.fb-readout-val {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: #f8fafc;
}

.fb-laps-list {
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 8px 10px;
  min-height: 46px;
  display: flex;
  align-items: center;
}

.fb-lap-empty {
  font-size: 11.5px;
  color: #64748b;
}

.fb-lap-items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.fb-lap-chip {
  font-size: 11px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  background: rgba(245, 158, 11, 0.14);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #fde68a;
  padding: 2px 7px;
  border-radius: 6px;
}

.fb-hint-bar {
  margin-top: 12px;
  background: #0b1120;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12.5px;
  line-height: 1.55;
  color: #cbd5e1;
}

.fb-hint-bar.conflict {
  border-color: rgba(244, 63, 94, 0.55);
  background: rgba(127, 29, 29, 0.24);
  color: #fecdd3;
}

@media (max-width: 768px) {
  .fb-card {
    padding: 12px;
  }

  .fb-steps {
    grid-template-columns: 1fr;
  }

  .fb-views {
    grid-template-columns: 1fr;
  }

  .fb-readouts {
    grid-template-columns: 1fr;
  }
}
</style>
