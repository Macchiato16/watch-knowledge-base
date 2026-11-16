<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type ScenarioId = 'm31' | 'm30' | 'feb28' | 'feb29'

interface Scenario {
  id: ScenarioId
  label: string
  shortLabel: string
  daysInMonth: number
  jumpTeeth: number
  startMonthIdx: number // 0..47 in 48-month cycle (0=Y1 Jan, 1=Y1 Feb, 3=Y1 Apr, 37=Y4(L) Feb)
  fromText: string
  toText: string
  leapLabel: string
  depthName: string
  color: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'm31',
    label: '大月 1月31日→2月1日',
    shortLabel: '大月 31→1',
    daysInMonth: 31,
    jumpTeeth: 1,
    startMonthIdx: 0, // 第1年 1月
    fromText: '1月 31日',
    toText: '2月 1日',
    leapLabel: '1（平年）',
    depthName: '最浅凸台（31天）',
    color: '#38bdf8'
  },
  {
    id: 'm30',
    label: '小月 4月30日→5月1日',
    shortLabel: '小月 30→1',
    daysInMonth: 30,
    jumpTeeth: 2,
    startMonthIdx: 3, // 第1年 4月
    fromText: '4月 30日',
    toText: '5月 1日',
    leapLabel: '1（平年）',
    depthName: '中浅凹槽（30天）',
    color: '#fbbf24'
  },
  {
    id: 'feb28',
    label: '平年 2月28日→3月1日（连跳4格）',
    shortLabel: '平年 28→1',
    daysInMonth: 28,
    jumpTeeth: 4,
    startMonthIdx: 1, // 第1年 2月
    fromText: '2月 28日',
    toText: '3月 1日',
    leapLabel: '1（平年）',
    depthName: '最深凹槽（28天）',
    color: '#fb7185'
  },
  {
    id: 'feb29',
    label: '闰年 2月29日→3月1日（连跳3格）',
    shortLabel: '闰年 29→1',
    daysInMonth: 29,
    jumpTeeth: 3,
    startMonthIdx: 37, // 第4年(L) 2月
    fromText: '2月 29日',
    toText: '3月 1日',
    leapLabel: 'L（闰年）',
    depthName: '次深凹槽（29天）',
    color: '#34d399'
  }
]

const DAYS_PER_YEAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

// 生成 48 个月凸轮每格天数（第4年即索引 36..47 为闰年 L，37 为 29 天）
const CAM_MONTH_DAYS: number[] = Array.from({ length: 48 }, (_, i) => {
  const m = i % 12
  const y = Math.floor(i / 12)
  if (m === 1 && y === 3) return 29
  return DAYS_PER_YEAR[m]
})

// 四种槽深对应的半径（px）
function radiusForDays(days: number): number {
  if (days === 31) return 102
  if (days === 30) return 90
  if (days === 29) return 76
  return 62 // 28
}

function colorForDays(days: number): string {
  if (days === 31) return '#38bdf8'
  if (days === 30) return '#fbbf24'
  if (days === 29) return '#34d399'
  return '#fb7185'
}

// 48 格凸轮 SVG 扇形路径（以 0° 为 3 点钟方向）
const camOutlinePath = computed(() => {
  const cx = 175
  const cy = 190
  const stepAngle = (Math.PI * 2) / 48
  const parts: string[] = []
  for (let i = 0; i < 48; i++) {
    const r = radiusForDays(CAM_MONTH_DAYS[i])
    const a0 = i * stepAngle - stepAngle / 2
    const a1 = (i + 1) * stepAngle - stepAngle / 2
    const x0 = cx + r * Math.cos(a0)
    const y0 = cy + r * Math.sin(a0)
    const x1 = cx + r * Math.cos(a1)
    const y1 = cy + r * Math.sin(a1)
    parts.push(i === 0 ? `M ${x0.toFixed(2)} ${y0.toFixed(2)}` : `L ${x0.toFixed(2)} ${y0.toFixed(2)}`)
    parts.push(`A ${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`)
  }
  parts.push('Z')
  return parts.join(' ')
})

// 48 格颜色刻度段（外缘高亮）
const camSegments = computed(() => {
  const cx = 175
  const cy = 190
  const stepAngle = (Math.PI * 2) / 48
  return CAM_MONTH_DAYS.map((days, i) => {
    const r = radiusForDays(days)
    const a0 = i * stepAngle - stepAngle / 2 + 0.012
    const a1 = (i + 1) * stepAngle - stepAngle / 2 - 0.012
    const x0 = cx + r * Math.cos(a0)
    const y0 = cy + r * Math.sin(a0)
    const x1 = cx + r * Math.cos(a1)
    const y1 = cy + r * Math.sin(a1)
    return {
      idx: i,
      days,
      color: colorForDays(days),
      d: `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`
    }
  })
})

// 31 齿日历环齿牙与数字（以 12 点钟 -90° 为读数窗）
const dateRingTeeth = computed(() => {
  const cx = 545
  const cy = 200
  const rOuter = 112
  const rInner = 98
  const rText = 82
  const step = (Math.PI * 2) / 31
  return Array.from({ length: 31 }, (_, i) => {
    const day = i + 1
    // 1 日在索引 0，角度从 -90° 开始顺时针
    const aCenter = -Math.PI / 2 + i * step
    const aLeft = aCenter - step * 0.36
    const aRight = aCenter + step * 0.36
    const x1 = cx + rInner * Math.cos(aLeft)
    const y1 = cy + rInner * Math.sin(aLeft)
    const x2 = cx + rOuter * Math.cos(aCenter)
    const y2 = cy + rOuter * Math.sin(aCenter)
    const x3 = cx + rInner * Math.cos(aRight)
    const y3 = cy + rInner * Math.sin(aRight)
    const tx = cx + rText * Math.cos(aCenter)
    const ty = cy + rText * Math.sin(aCenter)
    return {
      day,
      toothPath: `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)}`,
      tx,
      ty,
      deg: (aCenter * 180) / Math.PI + 90
    }
  })
})

const activeScenarioId = ref<ScenarioId>('feb28')
const activeScenario = computed(() => SCENARIOS.find((s) => s.id === activeScenarioId.value)!)

// 动画阶段：0=待机（月末），1=探针采样，2=杠杆蓄力，3=拨齿跨跳，4=换月完成
const phase = ref<number>(0)
// 阶段内插值 0..1
const phaseProgress = ref<number>(0)
const isPlaying = ref<boolean>(false)
const rootRef = ref<HTMLElement | null>(null)
const isInViewport = ref<boolean>(true)

let rafId: number | null = null
let lastTs = 0
let observer: IntersectionObserver | null = null

const PHASE_DURATION_MS = [650, 950, 900, 1150, 1400]

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  lastTs = 0
}

function tick(ts: number) {
  if (!isPlaying.value || !isInViewport.value) {
    stopLoop()
    return
  }
  if (!lastTs) lastTs = ts
  const dt = ts - lastTs
  lastTs = ts

  const dur = PHASE_DURATION_MS[phase.value] ?? 1000
  phaseProgress.value += dt / dur
  if (phaseProgress.value >= 1) {
    phaseProgress.value = 0
    if (phase.value < 4) {
      phase.value += 1
    } else {
      // 完成一轮后回到待机并继续循环演示
      phase.value = 0
    }
  }
  rafId = requestAnimationFrame(tick)
}

function startPlay() {
  if (phase.value === 4) {
    phase.value = 0
    phaseProgress.value = 0
  }
  isPlaying.value = true
  if (isInViewport.value && rafId === null) {
    lastTs = 0
    rafId = requestAnimationFrame(tick)
  }
}

function pausePlay() {
  isPlaying.value = false
  stopLoop()
}

function togglePlay() {
  if (isPlaying.value) {
    pausePlay()
  } else {
    startPlay()
  }
}

function nextStep() {
  pausePlay()
  phaseProgress.value = 1
  if (phase.value < 4) {
    phase.value += 1
  } else {
    phase.value = 0
    phaseProgress.value = 0
  }
}

function resetAnim() {
  pausePlay()
  phase.value = 0
  phaseProgress.value = 0
}

function selectScenario(id: ScenarioId) {
  activeScenarioId.value = id
  phase.value = 0
  phaseProgress.value = 0
  if (isPlaying.value && isInViewport.value && rafId === null) {
    lastTs = 0
    rafId = requestAnimationFrame(tick)
  }
}

// 平滑缓动
function easeInOut(t: number): number {
  const c = Math.max(0, Math.min(1, t))
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2
}

// 48 个月凸轮旋转角度（使当前月份对齐 3 点钟探针；第 4 步换月完成后推进 1 格）
const camRotationDeg = computed(() => {
  const baseIdx = activeScenario.value.startMonthIdx
  let extra = 0
  if (phase.value === 3) {
    extra = easeInOut(phaseProgress.value) * 0.35
  } else if (phase.value === 4) {
    extra = 0.35 + easeInOut(Math.min(1, phaseProgress.value * 2)) * 0.65
  }
  return -((baseIdx + extra) * (360 / 48))
})

// 闰年盘指针角度：0..11月 -> 1 (0°), 12..23 -> 2 (90°), 24..35 -> 3 (180°), 36..47 -> L (270°)
const leapAngleDeg = computed(() => {
  const baseIdx = activeScenario.value.startMonthIdx
  const yearFloat = (baseIdx + (phase.value === 4 ? 1 : 0)) / 12
  return yearFloat * 90
})

// 探针深入程度（0=悬空待机，1=完全落入当前月凹槽）
const probeDropRatio = computed(() => {
  if (phase.value === 0) return 0.15
  if (phase.value === 1) return 0.15 + 0.85 * easeInOut(phaseProgress.value)
  if (phase.value === 2) return 1
  if (phase.value === 3) return 1 - 0.85 * easeInOut(phaseProgress.value)
  return 0.15
})

// 探针当前与凸轮中心的半径距离
const probeTargetR = computed(() => {
  const notchR = radiusForDays(activeScenario.value.daysInMonth)
  const restR = 114
  return restR - (restR - notchR) * probeDropRatio.value
})

// 采样大杠杆旋转角度（以支点 (340, 82) 为中心，逆时针下压使探针深入凸轮）
// 槽越深（28天 R=62），摆角越大
const leverAngleDeg = computed(() => {
  const maxSwing = (114 - radiusForDays(activeScenario.value.daysInMonth)) * 0.36
  return -maxSwing * probeDropRatio.value
})

// 31 齿日历环旋转角度：初始让 daysInMonth 对齐 12 点钟窗；第 3 步跳过 jumpTeeth 格到达 1 日
const dateRingRotationDeg = computed(() => {
  const stepDeg = 360 / 31
  const startDay = activeScenario.value.daysInMonth
  // 1 日在 0°；要让 day N 位于顶部 12 点钟，需逆时针转 (N - 1) * stepDeg
  const startAngle = -(startDay - 1) * stepDeg
  let jumped = 0
  if (phase.value === 3) {
    jumped = easeInOut(phaseProgress.value) * activeScenario.value.jumpTeeth
  } else if (phase.value === 4) {
    jumped = activeScenario.value.jumpTeeth
  }
  return startAngle - jumped * stepDeg
})

const currentDisplayDate = computed(() => {
  if (phase.value >= 4) return activeScenario.value.toText
  if (phase.value === 3 && phaseProgress.value > 0.65) return activeScenario.value.toText
  return activeScenario.value.fromText
})

const phaseTitle = computed(() => {
  switch (phase.value) {
    case 0:
      return '① 月末待机'
    case 1:
      return '② 探针采样'
    case 2:
      return '③ 杠杆蓄力'
    case 3:
      return '④ 拨齿跨跳'
    default:
      return '⑤ 换月完成'
  }
})

const phaseExplanation = computed(() => {
  const s = activeScenario.value
  switch (phase.value) {
    case 0:
      return `当前停留在「${s.fromText}」（闰年盘：${s.leapLabel}）。午夜换历前，48 个月凸轮已将该月对应的「${s.depthName}」转至 3 点钟采样位。`
    case 1:
      return `采样大杠杆释放，前端探针落入 48 个月凸轮的「${s.depthName}」。槽位越深，探针下探距离越大，杠杆摆角也随之放大。`
    case 2:
      return `探针抵住凸轮槽底完成“记忆读取”，大杠杆另一端的拨日齿爪按对应行程蓄力就位（本次需推进 ${s.jumpTeeth} 格）。`
    case 3:
      return `午夜瞬间释放！拨日爪一次性推动 31 齿日历环连跳 ${s.jumpTeeth} 格，跳过不存在的日期直达次月 1 日。`
    default:
      return `换月完成：日历已精准跳至「${s.toText}」，48 个月凸轮同步前进 1 格准备下月计算。`
  }
})

onMounted(() => {
  if (typeof IntersectionObserver !== 'undefined' && rootRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting)
        isInViewport.value = visible
        if (!visible) {
          stopLoop()
        } else if (isPlaying.value && rafId === null) {
          lastTs = 0
          rafId = requestAnimationFrame(tick)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(rootRef.value)
  }
})

onBeforeUnmount(() => {
  stopLoop()
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <div ref="rootRef" class="qp-anim-card" role="region" aria-label="万年历 48 个月凸轮与大杠杆跨跳原理交互演示">
    <div class="qp-header">
      <div>
        <div class="qp-badge">2D 机械联动原理 · 48 个月凸轮与大杠杆</div>
        <h4 class="qp-title">万年历月末跨跳交互拆解</h4>
      </div>
      <div class="qp-readout">
        <span class="qp-readout-label">当前视窗</span>
        <span class="qp-readout-val" :style="{ color: activeScenario.color }">{{ currentDisplayDate }}</span>
      </div>
    </div>

    <!-- 4 个典型月末预设场景 -->
    <div class="qp-presets" role="group" aria-label="月末场景切换">
      <button
        v-for="s in SCENARIOS"
        :key="s.id"
        type="button"
        class="qp-preset-btn"
        :class="{ active: activeScenarioId === s.id }"
        :style="activeScenarioId === s.id ? { borderColor: s.color, color: s.color } : {}"
        @click="selectScenario(s.id)"
      >
        <span class="qp-dot" :style="{ backgroundColor: s.color }"></span>
        <span>{{ s.shortLabel }}</span>
        <span class="qp-jump-tag">跳{{ s.jumpTeeth }}格</span>
      </button>
    </div>

    <!-- 响应式 SVG 机械原理图 -->
    <div class="qp-svg-wrap">
      <svg viewBox="0 0 720 400" class="qp-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="qp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(148,163,184,0.08)" stroke-width="1" />
          </pattern>
          <radialGradient id="qp-cam-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#0f172a" />
          </radialGradient>
        </defs>

        <!-- 蓝图底纹 -->
        <rect x="0" y="0" width="720" height="400" fill="url(#qp-grid)" rx="10" />

        <!-- 1. 48 个月阶梯凸轮（左侧 cx=175, cy=190） -->
        <g>
          <circle cx="175" cy="190" r="118" fill="none" stroke="rgba(148,163,184,0.18)" stroke-dasharray="3 4" />
          <g :transform="`rotate(${camRotationDeg} 175 190)`">
            <path :d="camOutlinePath" fill="url(#qp-cam-bg)" stroke="#64748b" stroke-width="1.5" />
            <path
              v-for="seg in camSegments"
              :key="seg.idx"
              :d="seg.d"
              fill="none"
              :stroke="seg.color"
              stroke-width="3.2"
              stroke-linecap="round"
            />
            <!-- 凸轮中心十字与轮辐 -->
            <circle cx="175" cy="190" r="24" fill="#0f172a" stroke="#94a3b8" stroke-width="1.5" />
            <line x1="151" y1="190" x2="199" y2="190" stroke="#475569" stroke-width="1.2" />
            <line x1="175" y1="166" x2="175" y2="214" stroke="#475569" stroke-width="1.2" />
            <circle cx="175" cy="190" r="6" fill="#fbbf24" />
          </g>
          <!-- 3 点钟采样基准线 -->
          <line x1="230" y1="190" x2="305" y2="190" stroke="rgba(251,191,36,0.28)" stroke-dasharray="3 3" />
          <text x="175" y="54" text-anchor="middle" class="svg-label">48 个月阶梯凸轮（4 年一圈）</text>
        </g>

        <!-- 2. 闰年指示盘（左下 cx=92, cy=335） -->
        <g>
          <circle cx="92" cy="335" r="40" fill="#0f172a" stroke="#475569" stroke-width="1.5" />
          <circle cx="92" cy="335" r="32" fill="none" stroke="rgba(148,163,184,0.2)" stroke-dasharray="2 3" />
          <text x="92" y="309" text-anchor="middle" class="svg-leap-num">1</text>
          <text x="120" y="339" text-anchor="middle" class="svg-leap-num">2</text>
          <text x="92" y="369" text-anchor="middle" class="svg-leap-num">3</text>
          <text x="64" y="339" text-anchor="middle" class="svg-leap-l">L</text>
          <g :transform="`rotate(${leapAngleDeg} 92 335)`">
            <line x1="92" y1="335" x2="92" y2="310" stroke="#34d399" stroke-width="2.4" stroke-linecap="round" />
            <circle cx="92" cy="335" r="4" fill="#34d399" />
          </g>
          <text x="92" y="390" text-anchor="middle" class="svg-sub">闰年盘 (1-2-3-L)</text>
        </g>

        <!-- 3. 31 齿日历环（右侧 cx=545, cy=200） -->
        <g>
          <circle cx="545" cy="200" r="122" fill="none" stroke="rgba(148,163,184,0.16)" />
          <g :transform="`rotate(${dateRingRotationDeg} 545 200)`">
            <circle cx="545" cy="200" r="98" fill="#0f172a" stroke="#475569" stroke-width="1.5" />
            <circle cx="545" cy="200" r="66" fill="#0b1120" stroke="#334155" stroke-width="1.2" />
            <g v-for="t in dateRingTeeth" :key="t.day">
              <path
                :d="t.toothPath"
                :fill="t.day === 1 ? '#34d399' : t.day >= 28 ? '#fbbf24' : '#334155'"
                :stroke="t.day === 1 ? '#6ee7b7' : '#64748b'"
                stroke-width="1"
              />
              <text
                :x="t.tx"
                :y="t.ty"
                text-anchor="middle"
                dominant-baseline="central"
                :transform="`rotate(${t.deg} ${t.tx} ${t.ty})`"
                class="svg-date-num"
                :fill="t.day === 1 ? '#34d399' : t.day >= 28 ? '#fde68a' : '#94a3b8'"
              >
                {{ t.day }}
              </text>
            </g>
          </g>
          <!-- 12 点钟日期读数窗口框 -->
          <rect x="528" y="96" width="34" height="28" rx="5" fill="none" stroke="#f8fafc" stroke-width="2" />
          <polygon points="545,76 539,86 551,86" fill="#f8fafc" />
          <text x="545" y="54" text-anchor="middle" class="svg-label">31 齿日历环（12点位读数窗）</text>
          <!-- 环心状态显示 -->
          <text x="545" y="194" text-anchor="middle" class="svg-ring-center-title">跨跳格数</text>
          <text x="545" y="218" text-anchor="middle" class="svg-ring-center-val" :fill="activeScenario.color">
            +{{ activeScenario.jumpTeeth }} 格
          </text>
        </g>

        <!-- 4. 采样大杠杆与探针（支点 cx=340, cy=82） -->
        <g>
          <!-- 支点宝石轴承 -->
          <circle cx="340" cy="82" r="10" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
          <circle cx="340" cy="82" r="4" fill="#fb7185" />
          <text x="340" y="62" text-anchor="middle" class="svg-label">大杠杆支点</text>

          <g :transform="`rotate(${leverAngleDeg} 340 82)`">
            <!-- 左臂：通往凸轮 3 点钟方向 -->
            <path
              d="M 340 82 L 308 188 L 288 190"
              fill="none"
              stroke="#e2e8f0"
              stroke-width="6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- 右臂：通往日历环拨齿区 -->
            <path
              d="M 340 82 L 420 156 L 444 176"
              fill="none"
              stroke="#cbd5e1"
              stroke-width="5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- 拨日爪（靠近 31 齿日历环左侧齿牙） -->
            <polygon points="440,172 454,180 442,186" fill="#fbbf24" />
          </g>

          <!-- 动态探针指示点（直观落入凸轮槽底） -->
          <circle
            :cx="175 + probeTargetR"
            cy="190"
            r="5.5"
            :fill="activeScenario.color"
            stroke="#0f172a"
            stroke-width="1.5"
          />
          <text :x="175 + probeTargetR + 10" y="210" class="svg-sub" :fill="activeScenario.color">探针</text>
        </g>

        <!-- 图例 -->
        <g transform="translate(215, 344)">
          <rect x="0" y="-12" width="470" height="38" rx="6" fill="rgba(15,23,42,0.8)" stroke="rgba(148,163,184,0.22)" />
          <circle cx="18" cy="7" r="4.5" fill="#38bdf8" />
          <text x="28" y="11" class="svg-legend">31天(最浅·跳1)</text>
          <circle cx="132" cy="7" r="4.5" fill="#fbbf24" />
          <text x="142" y="11" class="svg-legend">30天(中浅·跳2)</text>
          <circle cx="246" cy="7" r="4.5" fill="#34d399" />
          <text x="256" y="11" class="svg-legend">29天(闰2月·跳3)</text>
          <circle cx="368" cy="7" r="4.5" fill="#fb7185" />
          <text x="378" y="11" class="svg-legend">28天(平2月·跳4)</text>
        </g>
      </svg>
    </div>

    <!-- 播放与单步拆解控制栏 -->
    <div class="qp-controls">
      <div class="qp-btn-group">
        <button type="button" class="qp-ctrl-btn primary" @click="togglePlay">
          {{ isPlaying ? '⏸ 暂停' : '▶ 播放' }}
        </button>
        <button type="button" class="qp-ctrl-btn" @click="nextStep">⏭ 单步拆解</button>
        <button type="button" class="qp-ctrl-btn" @click="resetAnim">↺ 重置</button>
      </div>
      <div class="qp-step-pills" aria-label="步骤进度">
        <span
          v-for="(name, idx) in ['待机', '采样', '蓄力', '跨跳', '完成']"
          :key="name"
          class="qp-step-pill"
          :class="{ current: phase === idx, done: phase > idx }"
        >
          {{ name }}
        </span>
      </div>
    </div>

    <!-- 实时中文步骤解说栏 -->
    <div class="qp-explainer">
      <div class="qp-explainer-head">
        <span class="qp-phase-badge">{{ phaseTitle }}</span>
        <span class="qp-scenario-meta">{{ activeScenario.label }}</span>
      </div>
      <p class="qp-explainer-text">{{ phaseExplanation }}</p>
    </div>
  </div>
</template>

<style scoped>
.qp-anim-card {
  margin: 24px 0;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(155deg, #0b1120 0%, #111a2e 100%);
  border: 1px solid rgba(148, 163, 184, 0.24);
  color: #f8fafc;
  box-shadow: 0 12px 32px rgba(2, 6, 23, 0.35);
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.qp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.qp-badge {
  font-size: 11px;
  letter-spacing: 0.04em;
  color: #93c5fd;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.qp-title {
  margin: 0 !important;
  font-size: 16px !important;
  font-weight: 700;
  color: #f8fafc !important;
  border: none !important;
  padding: 0 !important;
}

.qp-readout {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 8px;
  padding: 6px 10px;
}

.qp-readout-label {
  font-size: 11px;
  color: #94a3b8;
}

.qp-readout-val {
  font-size: 15px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.qp-presets {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.qp-preset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 6px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.7);
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.qp-preset-btn:hover {
  background: rgba(30, 41, 59, 0.9);
}

.qp-preset-btn.active {
  background: rgba(30, 41, 59, 0.95);
  box-shadow: 0 0 0 1px currentColor inset;
}

.qp-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  flex-shrink: 0;
}

.qp-jump-tag {
  font-size: 11px;
  opacity: 0.85;
}

.qp-svg-wrap {
  width: 100%;
  border-radius: 10px;
  background: #070d19;
  border: 1px solid rgba(148, 163, 184, 0.18);
  overflow: hidden;
}

.qp-svg {
  display: block;
  width: 100%;
  height: auto;
}

.svg-label {
  fill: #e2e8f0;
  font-size: 13px;
  font-weight: 600;
}

.svg-sub {
  fill: #94a3b8;
  font-size: 11px;
  font-weight: 500;
}

.svg-leap-num {
  fill: #cbd5e1;
  font-size: 12px;
  font-weight: 700;
}

.svg-leap-l {
  fill: #34d399;
  font-size: 12px;
  font-weight: 800;
}

.svg-date-num {
  font-size: 9.5px;
  font-weight: 700;
}

.svg-ring-center-title {
  fill: #94a3b8;
  font-size: 12px;
}

.svg-ring-center-val {
  font-size: 20px;
  font-weight: 800;
}

.svg-legend {
  fill: #cbd5e1;
  font-size: 11px;
}

.qp-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.qp-btn-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.qp-ctrl-btn {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(30, 41, 59, 0.85);
  color: #f1f5f9;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.qp-ctrl-btn:hover {
  background: rgba(51, 65, 85, 0.95);
}

.qp-ctrl-btn.primary {
  background: #2563eb;
  border-color: #3b82f6;
  color: #ffffff;
}

.qp-ctrl-btn.primary:hover {
  background: #1d4ed8;
}

.qp-step-pills {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.qp-step-pill {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.8);
  color: #64748b;
  border: 1px solid rgba(148, 163, 184, 0.16);
}

.qp-step-pill.done {
  color: #93c5fd;
  border-color: rgba(59, 130, 246, 0.35);
}

.qp-step-pill.current {
  background: rgba(37, 99, 235, 0.28);
  color: #f8fafc;
  border-color: #60a5fa;
  font-weight: 700;
}

.qp-explainer {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.85);
  border-left: 3px solid #60a5fa;
}

.qp-explainer-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.qp-phase-badge {
  font-size: 12px;
  font-weight: 700;
  color: #93c5fd;
}

.qp-scenario-meta {
  font-size: 12px;
  color: #94a3b8;
}

.qp-explainer-text {
  margin: 0 !important;
  font-size: 13.5px !important;
  line-height: 1.65 !important;
  color: #e2e8f0 !important;
}

@media (max-width: 640px) {
  .qp-anim-card {
    padding: 12px;
  }

  .qp-presets {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .qp-readout {
    align-items: flex-start;
  }
}
</style>
