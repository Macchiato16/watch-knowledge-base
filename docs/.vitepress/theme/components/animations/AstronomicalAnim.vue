<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type TabKey = 'moon' | 'eot'
type GearType = 59 | 135

const SYNODIC_MONTH = 29.530588

const activeTab = ref<TabKey>('moon')
const rootEl = ref<HTMLElement | null>(null)
const isVisible = ref(true)

// ==================== Tab 1: 月相双月盘遮罩 ====================
const lunarDay = ref(14.77) // 默认停在满月，方便直观看到完整月亮
const gearType = ref<GearType>(135)
const showXray = ref(true)
const moonPlaying = ref(false)
let moonRaf: number | null = null
let moonLastTs = 0

const moonPresets = [
  { label: '新月(朔)', day: 0 },
  { label: '蛾眉月', day: 3.7 },
  { label: '上弦月', day: 7.4 },
  { label: '盈凸月', day: 11.1 },
  { label: '满月(望)', day: 14.77 },
  { label: '亏凸月', day: 18.45 },
  { label: '下弦月', day: 22.15 },
  { label: '残月', day: 25.85 }
]

const normalizedLunarDay = computed(() => {
  const d = lunarDay.value % SYNODIC_MONTH
  return d < 0 ? d + SYNODIC_MONTH : d
})

const moonPhaseInfo = computed(() => {
  const d = normalizedLunarDay.value
  const ratio = d / SYNODIC_MONTH
  const illum = Math.round(((1 - Math.cos(2 * Math.PI * ratio)) / 2) * 100)
  let name = '新月（朔）'
  if (d < 1.2 || d >= 28.3) name = '新月（朔）'
  else if (d < 6.4) name = '蛾眉月'
  else if (d < 8.4) name = '上弦月'
  else if (d < 13.5) name = '盈凸月'
  else if (d < 16.0) name = '满月（望）'
  else if (d < 21.1) name = '亏凸月'
  else if (d < 23.1) name = '下弦月'
  else name = '残月'
  return { name, illum, ratio }
})

// 双月亮圆盘旋转角度：一个朔望月（29.53天）转 180°
// 满月（14.765天）时月亮位于正上方 0°；新月（0天）时位于 -90°/+90° 被拱桥完全遮挡
const discAngleDeg = computed(() => {
  return (normalizedLunarDay.value / SYNODIC_MONTH) * 180 - 90
})

const moonOrbitRadius = 56
const moonCenter = { x: 205, y: 202 }

const moonPositions = computed(() => {
  const rad1 = ((discAngleDeg.value - 90) * Math.PI) / 180
  const rad2 = rad1 + Math.PI
  return [
    {
      x: moonCenter.x + moonOrbitRadius * Math.cos(rad1),
      y: moonCenter.y + moonOrbitRadius * Math.sin(rad1)
    },
    {
      x: moonCenter.x + moonOrbitRadius * Math.cos(rad2),
      y: moonCenter.y + moonOrbitRadius * Math.sin(rad2)
    }
  ]
})

const gearTeethPath = computed(() => {
  const teeth = gearType.value
  const rOuter = 96
  const rInner = 91
  const cx = moonCenter.x
  const cy = moonCenter.y
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2
    const a2 = ((i + 0.45) / teeth) * Math.PI * 2
    const x1 = cx + rInner * Math.cos(a1)
    const y1 = cy + rInner * Math.sin(a1)
    const x2 = cx + rOuter * Math.cos(a1 + 0.01)
    const y2 = cy + rOuter * Math.sin(a1 + 0.01)
    const x3 = cx + rOuter * Math.cos(a2)
    const y3 = cy + rOuter * Math.sin(a2)
    const x4 = cx + rInner * Math.cos(a2 + 0.01)
    const y4 = cy + rInner * Math.sin(a2 + 0.01)
    d += `${i === 0 ? 'M' : 'L'} ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} L ${x4.toFixed(1)} ${y4.toFixed(1)} `
  }
  return d + 'Z'
})

// 表盘拱形扇窗路径（外圆 + 内部挖空扇窗，evenodd 填充）
// 扇窗底部为经典双圆弧遮罩拱桥
const dialMaskPath =
  'M 205 170 m -124 0 a 124 124 0 1 0 248 0 a 124 124 0 1 0 -248 0 ' +
  'M 123 188 A 84 84 0 0 1 287 188 ' +
  'A 28 28 0 0 0 233 188 ' +
  'A 28 28 0 0 0 205 168 ' +
  'A 28 28 0 0 0 177 188 ' +
  'A 28 28 0 0 0 123 188 Z'

const gearDriftSummary = computed(() => {
  if (gearType.value === 59) {
    return {
      period: '29.5 天 / 周期',
      errorPerMonth: '每周期慢约 44 分 3 秒',
      oneDayError: '约 2 年 7 个半月累积 1 天误差'
    }
  }
  return {
    period: '29.53056 天 / 周期',
    errorPerMonth: '每周期误差仅约 57 秒',
    oneDayError: '约 122 年才累积 1 天误差'
  }
})

function toggleMoonPlay() {
  moonPlaying.value = !moonPlaying.value
  if (moonPlaying.value) {
    moonLastTs = 0
    moonRaf = requestAnimationFrame(stepMoon)
  } else if (moonRaf !== null) {
    cancelAnimationFrame(moonRaf)
    moonRaf = null
  }
}

function stepMoon(ts: number) {
  if (!moonPlaying.value || !isVisible.value || activeTab.value !== 'moon') {
    moonRaf = null
    return
  }
  if (!moonLastTs) moonLastTs = ts
  const dt = (ts - moonLastTs) / 1000
  moonLastTs = ts
  lunarDay.value = (lunarDay.value + dt * 2.4) % SYNODIC_MONTH
  moonRaf = requestAnimationFrame(stepMoon)
}

function stepOneDay() {
  moonPlaying.value = false
  lunarDay.value = (lunarDay.value + 1) % SYNODIC_MONTH
}

function resetMoon() {
  moonPlaying.value = false
  lunarDay.value = 14.77
}

// ==================== Tab 2: 时间等式与肾形凸轮 ====================
const yearDay = ref(307) // 默认停在 11月3日（全年最大正偏差附近）
const eotPlaying = ref(false)
let eotRaf: number | null = null
let eotLastTs = 0

function calcEotMinutes(day: number): number {
  const b = (2 * Math.PI * (day - 81)) / 365
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b)
}

function dayToMonthDate(day: number): string {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let rem = Math.max(1, Math.min(365, Math.round(day)))
  for (let m = 0; m < 12; m++) {
    if (rem <= daysInMonth[m]) {
      return `${m + 1}月${rem}日`
    }
    rem -= daysInMonth[m]
  }
  return '12月31日'
}

const currentEot = computed(() => calcEotMinutes(yearDay.value))

const currentEotFormatted = computed(() => {
  const val = currentEot.value
  const sign = val >= 0 ? '+' : '-'
  const abs = Math.abs(val)
  const mins = Math.floor(abs)
  const secs = Math.round((abs - mins) * 60)
  return `${sign}${mins}分${secs.toString().padStart(2, '0')}秒`
})

const eotPresets = [
  { label: '2/11 极小', day: 42 },
  { label: '4/15 零差', day: 105 },
  { label: '6/13 零差', day: 164 },
  { label: '9/1 零差', day: 244 },
  { label: '11/3 极大', day: 307 },
  { label: '12/25 零差', day: 359 }
]

// 肾形凸轮路径（局部坐标系，中心在 (0,0)）
const camPath = computed(() => {
  const baseR = 44
  const scale = 1.08
  const pts: string[] = []
  for (let d = 1; d <= 365; d += 3) {
    const theta = ((d - 1) / 365) * Math.PI * 2 - Math.PI / 2
    const r = baseR + calcEotMinutes(d) * scale
    const x = r * Math.cos(theta)
    const y = r * Math.sin(theta)
    pts.push(`${d === 1 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ') + ' Z'
})

// 凸轮当前旋转角：让当前日期对应的轮廓点始终转到正上方 (-90°) 接触探针
const camRotationDeg = computed(() => {
  return -((yearDay.value - 1) / 365) * 360
})

// 探针触点 y 坐标（凸轮中心在 (130, 218)，探针在正上方）
const probeTipY = computed(() => {
  const r = 44 + currentEot.value * 1.08
  return 218 - r
})

// 扇形表盘指针角度：-18m ~ +18m 映射到 -52° ~ +52°
const gaugeAngleDeg = computed(() => {
  return (currentEot.value / 18) * 52
})

// 右侧全年时间等式曲线图坐标映射
const chartBounds = { x: 305, y: 55, w: 305, h: 190 }
const chartZeroY = chartBounds.y + chartBounds.h / 2

function chartX(day: number) {
  return chartBounds.x + ((day - 1) / 364) * chartBounds.w
}

function chartY(eot: number) {
  // +/- 20 min 映射
  return chartZeroY - (eot / 20) * (chartBounds.h / 2)
}

const eotCurvePath = computed(() => {
  const pts: string[] = []
  for (let d = 1; d <= 365; d += 2) {
    const x = chartX(d)
    const y = chartY(calcEotMinutes(d))
    pts.push(`${d === 1 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
})

const zeroCrossings = [
  { day: 105, label: '4/15' },
  { day: 164, label: '6/13' },
  { day: 244, label: '9/1' },
  { day: 359, label: '12/25' }
]

function toggleEotPlay() {
  eotPlaying.value = !eotPlaying.value
  if (eotPlaying.value) {
    eotLastTs = 0
    eotRaf = requestAnimationFrame(stepEot)
  } else if (eotRaf !== null) {
    cancelAnimationFrame(eotRaf)
    eotRaf = null
  }
}

function stepEot(ts: number) {
  if (!eotPlaying.value || !isVisible.value || activeTab.value !== 'eot') {
    eotRaf = null
    return
  }
  if (!eotLastTs) eotLastTs = ts
  const dt = (ts - eotLastTs) / 1000
  eotLastTs = ts
  let next = yearDay.value + dt * 38
  if (next > 365) next -= 365
  yearDay.value = next
  eotRaf = requestAnimationFrame(stepEot)
}

function resetEot() {
  eotPlaying.value = false
  yearDay.value = 307
}

function switchTab(tab: TabKey) {
  activeTab.value = tab
  if (tab !== 'moon') moonPlaying.value = false
  if (tab !== 'eot') eotPlaying.value = false
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof IntersectionObserver !== 'undefined' && rootEl.value) {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isVisible.value = entry.isIntersecting
        if (!entry.isIntersecting) {
          moonPlaying.value = false
          eotPlaying.value = false
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(rootEl.value)
  }
})

onBeforeUnmount(() => {
  if (moonRaf !== null) cancelAnimationFrame(moonRaf)
  if (eotRaf !== null) cancelAnimationFrame(eotRaf)
  if (observer) observer.disconnect()
})
</script>

<template>
  <div ref="rootEl" class="astro-card">
    <div class="astro-header">
      <div class="astro-title-group">
        <span class="astro-badge">2D 交互原理演示</span>
        <h4 class="astro-title">天文星象核心周期对照</h4>
      </div>
      <div class="astro-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'moon'"
          :class="['astro-tab', { active: activeTab === 'moon' }]"
          @click="switchTab('moon')"
        >
          月相双月盘遮罩
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'eot'"
          :class="['astro-tab', { active: activeTab === 'eot' }]"
          @click="switchTab('eot')"
        >
          时间等式与肾形凸轮
        </button>
      </div>
    </div>

    <!-- ==================== TAB 1: 月相双月盘遮罩 ==================== -->
    <div v-show="activeTab === 'moon'" class="astro-panel">
      <div class="astro-toolbar">
        <div class="btn-group">
          <button
            type="button"
            :class="['pill-btn', { active: gearType === 59 }]"
            @click="gearType = 59"
          >
            59 齿传统轮
          </button>
          <button
            type="button"
            :class="['pill-btn', { active: gearType === 135 }]"
            @click="gearType = 135"
          >
            135 齿高精轮
          </button>
        </div>
        <button
          type="button"
          :class="['pill-btn', { active: showXray }]"
          @click="showXray = !showXray"
        >
          {{ showXray ? '透视遮罩：开' : '透视遮罩：关' }}
        </button>
      </div>

      <div class="svg-wrap">
        <svg viewBox="0 0 640 340" class="astro-svg" role="img" aria-label="月相双月盘遮罩原理交互图">
          <defs>
            <radialGradient id="skyBg" cx="50%" cy="40%" r="65%">
              <stop offset="0%" stop-color="#172c59" />
              <stop offset="100%" stop-color="#071022" />
            </radialGradient>
            <radialGradient id="goldMoon" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#fde68a" />
              <stop offset="65%" stop-color="#eab308" />
              <stop offset="100%" stop-color="#b45309" />
            </radialGradient>
            <clipPath id="dialClip">
              <circle cx="205" cy="170" r="122" />
            </clipPath>
          </defs>

          <!-- 星空底板 -->
          <rect x="0" y="0" width="640" height="340" rx="12" fill="url(#skyBg)" />
          <g fill="#e2e8f0" opacity="0.45">
            <circle cx="48" cy="42" r="1.2" />
            <circle cx="96" cy="285" r="1" />
            <circle cx="348" cy="48" r="1.4" />
            <circle cx="372" cy="296" r="1.1" />
            <circle cx="604" cy="42" r="1.2" />
            <circle cx="58" cy="160" r="0.9" />
          </g>

          <!-- 底层月相圆盘与齿轮（透视可见） -->
          <g clip-path="url(#dialClip)">
            <rect x="75" y="40" width="260" height="260" fill="#0b1836" />
            <!-- 齿轮外圈 -->
            <g :transform="`rotate(${discAngleDeg} ${moonCenter.x} ${moonCenter.y})`">
              <path
                :d="gearTeethPath"
                fill="#1e3a8a"
                fill-opacity="0.45"
                stroke="#f59e0b"
                stroke-width="1"
              />
              <circle
                :cx="moonCenter.x"
                :cy="moonCenter.y"
                r="88"
                fill="#0f2352"
                stroke="#60a5fa"
                stroke-opacity="0.35"
                stroke-width="1"
              />
              <!-- 盘面星点 -->
              <g fill="#fef08a" opacity="0.8">
                <circle cx="165" cy="170" r="1.5" />
                <circle cx="245" cy="170" r="1.5" />
                <circle cx="165" cy="235" r="1.5" />
                <circle cx="245" cy="235" r="1.5" />
                <circle cx="205" cy="126" r="1.2" />
                <circle cx="205" cy="278" r="1.2" />
              </g>
            </g>

            <!-- 双金质月亮圆盘 -->
            <g v-for="(m, idx) in moonPositions" :key="idx">
              <circle :cx="m.x" :cy="m.y" r="27" fill="url(#goldMoon)" stroke="#fef3c7" stroke-width="1" />
              <circle :cx="m.x - 7" :cy="m.y - 6" r="4" fill="#ca8a04" opacity="0.28" />
              <circle :cx="m.x + 8" :cy="m.y + 5" r="5.5" fill="#ca8a04" opacity="0.24" />
            </g>

            <!-- 盘轴心 -->
            <circle :cx="moonCenter.x" :cy="moonCenter.y" r="5" fill="#cbd5e1" stroke="#0f172a" stroke-width="1.5" />

            <!-- 上层表盘扇形拱窗遮罩 -->
            <path
              :d="dialMaskPath"
              fill="#0a1328"
              :fill-opacity="showXray ? 0.68 : 0.98"
              fill-rule="evenodd"
            />
          </g>

          <!-- 表壳外框与扇窗金边 -->
          <circle cx="205" cy="170" r="124" fill="none" stroke="#94a3b8" stroke-width="2.5" />
          <circle cx="205" cy="170" r="118" fill="none" stroke="#eab308" stroke-opacity="0.4" stroke-width="1" />
          <path
            d="M 123 188 A 84 84 0 0 1 287 188 A 28 28 0 0 0 233 188 A 28 28 0 0 0 205 168 A 28 28 0 0 0 177 188 A 28 28 0 0 0 123 188 Z"
            fill="none"
            stroke="#f5c565"
            stroke-width="2"
          />

          <!-- 透视标注 -->
          <g v-if="showXray" font-size="11" fill="#93c5fd">
            <text x="205" y="316" text-anchor="middle">
              下方 {{ gearType }} 齿圆盘（两枚金月相距 180°）· 当前转角 {{ Math.round(discAngleDeg) }}°
            </text>
          </g>
          <text v-else x="205" y="316" text-anchor="middle" font-size="11" fill="#94a3b8">
            实景表盘视图：双圆弧拱桥遮挡出弯月与满月
          </text>

          <!-- 右侧数据读数面板 -->
          <g transform="translate(362, 34)">
            <rect x="0" y="0" width="252" height="272" rx="10" fill="#0f1e3d" stroke="#1e3a8a" stroke-width="1.2" />
            <text x="18" y="30" font-size="12" fill="#93c5fd">当前月相状态</text>
            <text x="18" y="60" font-size="22" font-weight="700" fill="#fde68a">
              {{ moonPhaseInfo.name }}
            </text>
            <text x="18" y="84" font-size="13" fill="#cbd5e1">
              月龄：{{ normalizedLunarDay.toFixed(2) }} / 29.53 天
            </text>
            <text x="18" y="106" font-size="13" fill="#cbd5e1">
              月面照度：{{ moonPhaseInfo.illum }}%
            </text>

            <line x1="18" y1="126" x2="234" y2="126" stroke="#1e3a8a" stroke-width="1" />

            <text x="18" y="150" font-size="12" fill="#93c5fd">
              齿轮精度对比（{{ gearType }} 齿）
            </text>
            <text x="18" y="174" font-size="12.5" fill="#e2e8f0">
              • 理论周期：{{ gearDriftSummary.period }}
            </text>
            <text x="18" y="196" font-size="12.5" fill="#e2e8f0">
              • 单月偏差：{{ gearDriftSummary.errorPerMonth }}
            </text>
            <text x="18" y="218" font-size="12.5" fill="#fbbf24" font-weight="600">
              • 累积精度：{{ gearDriftSummary.oneDayError }}
            </text>

            <text x="18" y="250" font-size="11" fill="#94a3b8">
              原理：180°双月亮盘每周期仅转半圈
            </text>
          </g>
        </svg>
      </div>

      <div class="astro-controls">
        <div class="playback-row">
          <button type="button" class="ctrl-btn primary" @click="toggleMoonPlay">
            {{ moonPlaying ? '暂停' : '播放月相周期' }}
          </button>
          <button type="button" class="ctrl-btn" @click="stepOneDay">+1 天</button>
          <button type="button" class="ctrl-btn" @click="resetMoon">重置满月</button>
        </div>
        <div class="preset-row">
          <button
            v-for="p in moonPresets"
            :key="p.label"
            type="button"
            class="preset-chip"
            @click="
              moonPlaying = false;
              lunarDay = p.day
            "
          >
            {{ p.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== TAB 2: 时间等式与肾形凸轮 ==================== -->
    <div v-show="activeTab === 'eot'" class="astro-panel">
      <div class="svg-wrap">
        <svg viewBox="0 0 640 340" class="astro-svg" role="img" aria-label="时间等式肾形凸轮与全年曲线联动图">
          <rect x="0" y="0" width="640" height="340" rx="12" fill="url(#skyBg)" />

          <!-- 左侧：时间等式扇形表盘 + 肾形凸轮 + 探针 -->
          <g>
            <!-- 扇形指示刻度 (-16 ~ +16) -->
            <path
              d="M 55 82 A 86 86 0 0 1 205 82 L 175 112 A 44 44 0 0 0 85 112 Z"
              fill="#0f2352"
              stroke="#60a5fa"
              stroke-opacity="0.45"
              stroke-width="1.2"
            />
            <text x="130" y="42" text-anchor="middle" font-size="11" fill="#93c5fd">
              时间等式扇形指示（真太阳时 - 平太阳时）
            </text>
            <text x="72" y="92" font-size="10.5" fill="#f87171">-16m</text>
            <text x="130" y="64" text-anchor="middle" font-size="11" fill="#34d399" font-weight="700">0</text>
            <text x="174" y="92" font-size="10.5" fill="#fbbf24">+16m</text>

            <!-- 扇形指针 -->
            <g :transform="`rotate(${gaugeAngleDeg} 130 132)`">
              <line x1="130" y1="132" x2="130" y2="68" stroke="#fde68a" stroke-width="2.2" stroke-linecap="round" />
              <circle cx="130" cy="132" r="4" fill="#eab308" />
            </g>

            <!-- 垂直传动探针 -->
            <line
              x1="130"
              y1="136"
              x2="130"
              :y2="probeTipY"
              stroke="#cbd5e1"
              stroke-width="2"
              stroke-dasharray="3 2"
            />
            <circle cx="130" :cy="probeTipY" r="4.5" fill="#ef4444" stroke="#fecaca" stroke-width="1" />

            <!-- 一年一圈的肾形凸轮 -->
            <g :transform="`translate(130, 218) rotate(${camRotationDeg})`">
              <circle cx="0" cy="0" r="66" fill="none" stroke="#1e3a8a" stroke-dasharray="3 3" />
              <path
                :d="camPath"
                fill="#d97706"
                fill-opacity="0.32"
                stroke="#fbbf24"
                stroke-width="2"
              />
              <circle cx="0" cy="0" r="6" fill="#94a3b8" stroke="#0f172a" stroke-width="1.5" />
              <line x1="0" y1="-6" x2="0" y2="-40" stroke="#fde68a" stroke-width="1.2" opacity="0.7" />
            </g>

            <text x="130" y="302" text-anchor="middle" font-size="11.5" fill="#cbd5e1">
              肾形凸轮（每年转 1 圈）
            </text>
            <text x="130" y="320" text-anchor="middle" font-size="10.5" fill="#93c5fd">
              凸轮轮廓半径变化推动探针摆动
            </text>
          </g>

          <!-- 右侧：全年 1~12 月时间等式曲线 -->
          <g>
            <rect x="285" y="24" width="336" height="292" rx="10" fill="#0f1e3d" stroke="#1e3a8a" stroke-width="1.2" />
            <text x="302" y="46" font-size="12" fill="#93c5fd">
              全年真太阳时差双峰曲线（1月–12月）
            </text>

            <!-- 零差参考线 -->
            <line
              :x1="chartBounds.x"
              :y1="chartZeroY"
              :x2="chartBounds.x + chartBounds.w"
              :y2="chartZeroY"
              stroke="#34d399"
              stroke-opacity="0.55"
              stroke-dasharray="4 3"
            />
            <text :x="chartBounds.x - 4" :y="chartZeroY + 4" text-anchor="end" font-size="10" fill="#34d399">0</text>
            <text :x="chartBounds.x - 4" :y="chartY(16) + 3" text-anchor="end" font-size="9.5" fill="#fbbf24">+16</text>
            <text :x="chartBounds.x - 4" :y="chartY(-15) + 3" text-anchor="end" font-size="9.5" fill="#f87171">-15</text>

            <!-- 曲线 -->
            <path :d="eotCurvePath" fill="none" stroke="#60a5fa" stroke-width="2.5" />

            <!-- 四个零差日标注 -->
            <g v-for="z in zeroCrossings" :key="z.label">
              <circle :cx="chartX(z.day)" :cy="chartZeroY" r="3.5" fill="#34d399" />
              <text :x="chartX(z.day)" :y="chartZeroY + 14" text-anchor="middle" font-size="9" fill="#6ee7b7">
                {{ z.label }}
              </text>
            </g>

            <!-- 当前日期垂直游标与高亮圆点 -->
            <line
              :x1="chartX(yearDay)"
              :y1="chartBounds.y"
              :x2="chartX(yearDay)"
              :y2="chartBounds.y + chartBounds.h"
              stroke="#fde68a"
              stroke-opacity="0.45"
              stroke-width="1.2"
            />
            <circle
              :cx="chartX(yearDay)"
              :cy="chartY(currentEot)"
              r="5.5"
              fill="#fde68a"
              stroke="#0f172a"
              stroke-width="1.5"
            />

            <!-- X 轴月份刻度 -->
            <g font-size="9.5" fill="#94a3b8" text-anchor="middle">
              <text :x="chartX(15)" y="264">1月</text>
              <text :x="chartX(75)" y="264">3月</text>
              <text :x="chartX(135)" y="264">5月</text>
              <text :x="chartX(196)" y="264">7月</text>
              <text :x="chartX(258)" y="264">9月</text>
              <text :x="chartX(319)" y="264">11月</text>
            </g>

            <!-- 底部当前数值读数 -->
            <text x="302" y="294" font-size="13" font-weight="700" fill="#fde68a">
              {{ dayToMonthDate(yearDay) }}：{{ currentEotFormatted }}
            </text>
            <text x="490" y="294" font-size="11.5" :fill="currentEot >= 0 ? '#fbbf24' : '#f87171'">
              {{ Math.abs(currentEot) < 0.35 ? '真平太阳时重合' : currentEot > 0 ? '真太阳时偏快' : '真太阳时偏慢' }}
            </text>
          </g>
        </svg>
      </div>

      <div class="astro-controls">
        <div class="slider-row">
          <label class="slider-label" for="eot-day-slider">
            日期（第 {{ Math.round(yearDay) }} 天 · {{ dayToMonthDate(yearDay) }}）
          </label>
          <input
            id="eot-day-slider"
            v-model.number="yearDay"
            type="range"
            min="1"
            max="365"
            step="1"
            class="day-slider"
            @input="eotPlaying = false"
          />
        </div>
        <div class="playback-row">
          <button type="button" class="ctrl-btn primary" @click="toggleEotPlay">
            {{ eotPlaying ? '暂停' : '播放全年变化' }}
          </button>
          <button type="button" class="ctrl-btn" @click="resetEot">重置极值</button>
        </div>
        <div class="preset-row">
          <button
            v-for="p in eotPresets"
            :key="p.label"
            type="button"
            class="preset-chip"
            @click="
              eotPlaying = false;
              yearDay = p.day
            "
          >
            {{ p.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.astro-card {
  margin: 22px 0;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(155deg, #071022 0%, #0d1b38 100%);
  border: 1px solid rgba(96, 165, 250, 0.28);
  color: #e2e8f0;
  box-shadow: 0 12px 32px rgba(7, 16, 34, 0.28);
}

.astro-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.astro-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.astro-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(234, 179, 8, 0.16);
  color: #fde68a;
  border: 1px solid rgba(234, 179, 8, 0.35);
}

.astro-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
}

.astro-tabs {
  display: flex;
  gap: 6px;
  background: rgba(15, 23, 42, 0.7);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.astro-tab {
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.astro-tab.active {
  background: #1d4ed8;
  color: #ffffff;
}

.astro-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.btn-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.pill-btn {
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.65);
  color: #cbd5e1;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.pill-btn.active {
  background: rgba(234, 179, 8, 0.2);
  border-color: #eab308;
  color: #fde68a;
}

.svg-wrap {
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
}

.astro-svg {
  display: block;
  width: 100%;
  height: auto;
}

.astro-controls {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slider-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-label {
  font-size: 12.5px;
  color: #93c5fd;
  font-weight: 600;
}

.day-slider {
  width: 100%;
  accent-color: #eab308;
  cursor: pointer;
}

.playback-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ctrl-btn {
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(30, 41, 59, 0.8);
  color: #f1f5f9;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.ctrl-btn.primary {
  background: #2563eb;
  border-color: #3b82f6;
  color: #ffffff;
}

.preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.preset-chip {
  border: 1px solid rgba(96, 165, 250, 0.3);
  background: rgba(15, 23, 42, 0.55);
  color: #bfdbfe;
  font-size: 12px;
  padding: 4px 9px;
  border-radius: 6px;
  cursor: pointer;
}

.preset-chip:hover {
  background: rgba(37, 99, 235, 0.35);
}

@media (max-width: 640px) {
  .astro-card {
    padding: 12px;
  }

  .astro-tab {
    font-size: 12px;
    padding: 6px 9px;
  }
}
</style>
