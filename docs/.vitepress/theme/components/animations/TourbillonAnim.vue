<template>
  <div ref="containerRef" class="tourbillon-card">
    <div class="tb-header">
      <div class="tb-title-group">
        <span class="tb-badge">2D 机械原理交互</span>
        <h4 class="tb-title">陀飞轮调速系统与重力方位均摊演示</h4>
      </div>
      <div class="tb-mode-switch" role="tablist" aria-label="运行模式切换">
        <button
          type="button"
          class="tb-mode-btn"
          :class="{ active: mode === 'tourbillon' }"
          @click="setMode('tourbillon')"
        >
          陀飞轮旋转均摊模式
        </button>
        <button
          type="button"
          class="tb-mode-btn"
          :class="{ active: mode === 'fixed' }"
          @click="setMode('fixed')"
        >
          普通固定擒纵对照模式
        </button>
      </div>
    </div>

    <div class="tb-stage">
      <svg
        viewBox="0 0 540 370"
        class="tb-svg"
        role="img"
        aria-label="陀飞轮固定四轮、三臂旋转笼架、行星公转擒纵轮与摆轮游丝原理动画"
      >
        <defs>
          <radialGradient id="tb-bg-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stop-color="#1e293b" />
            <stop offset="100%" stop-color="#090d16" />
          </radialGradient>
          <linearGradient id="tb-cage-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e2e8f0" />
            <stop offset="50%" stop-color="#94a3b8" />
            <stop offset="100%" stop-color="#64748b" />
          </linearGradient>
          <linearGradient id="tb-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fde68a" />
            <stop offset="55%" stop-color="#d97706" />
            <stop offset="100%" stop-color="#92400e" />
          </linearGradient>
          <marker
            id="tb-gravity-arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
          </marker>
          <marker
            id="tb-torque-arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#f97316" />
          </marker>
        </defs>

        <!-- 背景底板 -->
        <rect x="0" y="0" width="540" height="370" rx="12" fill="url(#tb-bg-glow)" />

        <!-- 方位角参考虚线圆 -->
        <g transform="translate(245, 185)">
          <circle r="150" fill="none" stroke="#1e293b" stroke-width="1.5" stroke-dasharray="4 4" />
          <line x1="0" y1="-155" x2="0" y2="155" stroke="#1e293b" stroke-width="1" stroke-dasharray="3 4" />
          <line x1="-155" y1="0" x2="155" y2="0" stroke="#1e293b" stroke-width="1" stroke-dasharray="3 4" />

          <!-- 四方位刻度文字 -->
          <text x="0" y="-162" text-anchor="middle" class="tb-deg-label">0° (12点)</text>
          <text x="162" y="4" text-anchor="start" class="tb-deg-label">90°</text>
          <text x="0" y="174" text-anchor="middle" class="tb-deg-label">180° (6点)</text>
          <text x="-162" y="4" text-anchor="end" class="tb-deg-label">270°</text>

          <!-- 1. 外圈：静止的固定四轮齿圈 -->
          <g class="fixed-fourth-wheel">
            <circle r="130" fill="#0f172a" stroke="#334155" stroke-width="2" />
            <path :d="fixedWheelPath" fill="none" stroke="#64748b" stroke-width="2.2" />
            <circle r="115" fill="none" stroke="#475569" stroke-width="1" stroke-dasharray="2 4" />
          </g>

          <!-- 2. 陀飞轮旋转笼架总成 -->
          <g :transform="`rotate(${cageAngle.toFixed(2)})`">
            <!-- 笼架外环 -->
            <circle r="102" fill="none" stroke="url(#tb-cage-metal)" stroke-width="3.5" opacity="0.88" />
            <!-- 笼架三臂支撑桥 -->
            <g v-for="arm in [0, 120, 240]" :key="arm" :transform="`rotate(${arm})`">
              <path
                d="M -6 0 L -4 -102 L 4 -102 L 6 0 Z"
                fill="url(#tb-cage-metal)"
                opacity="0.72"
              />
              <circle cx="0" cy="-102" r="4" fill="#cbd5e1" stroke="#334155" stroke-width="1" />
            </g>

            <!-- 3. 沿固定四轮行星公转的擒纵轮 + 小齿轴 (位于笼架 120° 臂内侧) -->
            <g transform="translate(76, 44)">
              <circle r="21" fill="#0b1120" stroke="#475569" stroke-width="1" opacity="0.75" />
              <g :transform="`rotate(${escapeWheelAngle.toFixed(1)})`">
                <path :d="escapeWheelPath" fill="none" stroke="#fbbf24" stroke-width="1.8" />
                <circle r="7" fill="#94a3b8" stroke="#1e293b" stroke-width="1" />
                <line x1="-15" y1="0" x2="15" y2="0" stroke="#fbbf24" stroke-width="1.2" />
                <line x1="0" y1="-15" x2="0" y2="15" stroke="#fbbf24" stroke-width="1.2" />
              </g>
              <circle r="2.6" fill="#e11d48" />
            </g>

            <!-- 4. 笼架重心偏置点 Δm (位于 0° 臂外缘) -->
            <g transform="translate(0, -86)">
              <circle r="6.5" fill="#f97316" stroke="#fff7ed" stroke-width="1.5" />
              <text
                x="11"
                y="4"
                class="tb-mass-label"
                :transform="`rotate(${(-cageAngle).toFixed(2)})`"
              >
                Δm
              </text>
            </g>

            <!-- 5. 高频往复呼吸的摆轮与阿基米德螺旋游丝 -->
            <g :transform="`rotate(${balanceAngle.toFixed(2)})`">
              <!-- 摆轮圆环与配重螺钉 -->
              <circle r="62" fill="none" stroke="url(#tb-gold)" stroke-width="5" />
              <line x1="-60" y1="0" x2="60" y2="0" stroke="url(#tb-gold)" stroke-width="3" />
              <line x1="0" y1="-60" x2="0" y2="60" stroke="url(#tb-gold)" stroke-width="3" />
              <g v-for="screw in [0, 45, 90, 135, 180, 225, 270, 315]" :key="screw" :transform="`rotate(${screw})`">
                <rect x="-2" y="-67" width="4" height="4" rx="1" fill="#fde68a" />
              </g>
            </g>

            <!-- 阿基米德螺旋游丝（随摆轮摆动呼吸伸缩） -->
            <path :d="hairspringPath" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" />

            <!-- 中心红宝石轴承 -->
            <circle r="7" fill="#e11d48" stroke="#fda4af" stroke-width="1.5" />
            <circle r="2.2" fill="#e2e8f0" />
          </g>

          <!-- 6. 偏置点 Δm 所受瞬时切向重力分量箭头 (在世界坐标系中指示) -->
          <g v-if="Math.abs(tangentialBias) > 0.08" :transform="`translate(${massX.toFixed(1)}, ${massY.toFixed(1)})`">
            <line
              x1="0"
              y1="0"
              x2="0"
              :y2="34"
              stroke="#f97316"
              stroke-width="2"
              stroke-dasharray="3 2"
              marker-end="url(#tb-torque-arrow)"
            />
          </g>
        </g>

        <!-- 右侧图例与恒定重力指示 -->
        <g transform="translate(432, 36)">
          <!-- 恒定重力箭头 g -->
          <rect x="0" y="0" width="96" height="86" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1" />
          <text x="48" y="18" text-anchor="middle" class="tb-legend-title">恒定重力方向</text>
          <line
            x1="48"
            y1="28"
            x2="48"
            y2="68"
            stroke="#38bdf8"
            stroke-width="2.6"
            marker-end="url(#tb-gravity-arrow)"
          />
          <text x="64" y="54" class="tb-gravity-text">g ↓</text>

          <!-- 零件颜色图例 -->
          <g transform="translate(0, 102)">
            <rect x="0" y="0" width="96" height="196" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="1" />
            <text x="10" y="20" class="tb-legend-title">核心构件</text>

            <circle cx="14" cy="40" r="4" fill="none" stroke="#64748b" stroke-width="2" />
            <text x="24" y="44" class="tb-legend-item">固定四轮(静止)</text>

            <rect x="10" y="61" width="8" height="4" rx="1" fill="#cbd5e1" />
            <text x="24" y="67" class="tb-legend-item">旋转笼架(60s)</text>

            <circle cx="14" cy="88" r="4" fill="none" stroke="#fbbf24" stroke-width="2" />
            <text x="24" y="92" class="tb-legend-item">行星擒纵轮</text>

            <circle cx="14" cy="112" r="4" fill="none" stroke="#d97706" stroke-width="2" />
            <text x="24" y="116" class="tb-legend-item">往复摆轮</text>

            <circle cx="14" cy="136" r="4" fill="none" stroke="#38bdf8" stroke-width="1.6" />
            <text x="24" y="140" class="tb-legend-item">螺旋游丝</text>

            <circle cx="14" cy="160" r="4" fill="#f97316" />
            <text x="24" y="164" class="tb-legend-item">重心偏置 Δm</text>

            <text x="10" y="185" class="tb-legend-sub">
              {{ mode === 'tourbillon' ? '状态: 笼架公转' : '状态: 笼架锁死' }}
            </text>
          </g>
        </g>
      </svg>
    </div>

    <!-- 实时方位偏差仪 -->
    <div class="tb-telemetry">
      <div class="tb-metric">
        <span class="tb-metric-label">笼架方位角</span>
        <strong class="tb-metric-value">{{ Math.round(cageAngle) }}°</strong>
      </div>
      <div class="tb-metric">
        <span class="tb-metric-label">瞬时重力偏置</span>
        <strong class="tb-metric-value" :class="biasClass">{{ biasLabel }}</strong>
      </div>
      <div class="tb-metric tb-metric-wide">
        <div class="tb-bar-header">
          <span class="tb-metric-label">累积方位走时偏差</span>
          <span class="tb-bar-readout">
            {{ mode === 'tourbillon' ? '周期正负均摊抵消' : '固定方位单向持续累积' }}
          </span>
        </div>
        <div class="tb-bar-track">
          <div class="tb-bar-center"></div>
          <div
            class="tb-bar-fill"
            :class="{ danger: mode === 'fixed' && Math.abs(cumulativeDrift) > 35 }"
            :style="driftBarStyle"
          ></div>
        </div>
      </div>
    </div>

    <!-- 控制栏 -->
    <div class="tb-controls">
      <div class="tb-ctrl-group">
        <button type="button" class="tb-btn tb-btn-primary" @click="togglePlay">
          {{ isPlaying ? '暂停' : '播放' }}
        </button>
        <button type="button" class="tb-btn" @click="resetAnim">重置</button>
      </div>

      <div class="tb-ctrl-group" aria-label="播放速度">
        <span class="tb-ctrl-label">倍速</span>
        <button
          v-for="s in speeds"
          :key="s.value"
          type="button"
          class="tb-btn"
          :class="{ active: speed === s.value }"
          @click="speed = s.value"
        >
          {{ s.label }}
        </button>
      </div>

      <div class="tb-ctrl-group" aria-label="四方位定格检查">
        <span class="tb-ctrl-label">定格</span>
        <button
          v-for="deg in [0, 90, 180, 270]"
          :key="deg"
          type="button"
          class="tb-btn"
          :class="{ active: !isPlaying && Math.round(cageAngle) === deg }"
          @click="snapToDegree(deg)"
        >
          {{ deg }}°
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type AnimMode = 'tourbillon' | 'fixed'

const containerRef = ref<HTMLElement | null>(null)
const mode = ref<AnimMode>('tourbillon')
const isPlaying = ref(true)
const speed = ref<number>(1)

const speeds = [
  { label: '0.25x', value: 0.25 },
  { label: '1x (60s/圈)', value: 1 },
  { label: '4x', value: 4 }
]

const cageAngle = ref<number>(0)
const balancePhase = ref<number>(0)
const cumulativeDrift = ref<number>(0)

let rafId: number | null = null
let lastTime = 0
let isVisible = true
let observer: IntersectionObserver | null = null

// 固定四轮（60齿环形轮廓）
const fixedWheelPath = computed(() => {
  const teeth = 60
  const rOuter = 130
  const rInner = 123
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2
    const a2 = ((i + 0.45) / teeth) * Math.PI * 2
    const x1 = Math.cos(a1) * rInner
    const y1 = Math.sin(a1) * rInner
    const x2 = Math.cos(a1) * rOuter
    const y2 = Math.sin(a1) * rOuter
    const x3 = Math.cos(a2) * rOuter
    const y3 = Math.sin(a2) * rOuter
    const x4 = Math.cos(a2) * rInner
    const y4 = Math.sin(a2) * rInner
    d += i === 0 ? `M ${x1.toFixed(1)} ${y1.toFixed(1)} ` : `L ${x1.toFixed(1)} ${y1.toFixed(1)} `
    d += `L ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} L ${x4.toFixed(1)} ${y4.toFixed(1)} `
  }
  return d + 'Z'
})

// 行星公转擒纵轮（12齿棘轮）
const escapeWheelPath = computed(() => {
  const teeth = 12
  const rOuter = 17
  const rInner = 11.5
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a1 = (i / teeth) * Math.PI * 2
    const a2 = ((i + 0.28) / teeth) * Math.PI * 2
    const x1 = Math.cos(a1) * rInner
    const y1 = Math.sin(a1) * rInner
    const x2 = Math.cos(a2) * rOuter
    const y2 = Math.sin(a2) * rOuter
    d += i === 0 ? `M ${x1.toFixed(1)} ${y1.toFixed(1)} ` : `L ${x1.toFixed(1)} ${y1.toFixed(1)} `
    d += `L ${x2.toFixed(1)} ${y2.toFixed(1)} `
  }
  return d + 'Z'
})

const escapeWheelAngle = computed(() => -cageAngle.value * 8)

// 摆轮高频往复摆动角度（-200° ~ +200°）
const balanceAngle = computed(() => Math.sin(balancePhase.value) * 195)

// 阿基米德螺旋游丝，外端随摆轮摆动呼吸收放
const hairspringPath = computed(() => {
  const breath = 1 + Math.sin(balancePhase.value) * 0.14
  const turns = 4.2
  const steps = 90
  const rStart = 7
  const rEnd = 33 * breath
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const angle = t * turns * Math.PI * 2 + (balanceAngle.value * Math.PI) / 180 * (1 - t * 0.65)
    const r = rStart + (rEnd - rStart) * t
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)} ` : `L ${x.toFixed(1)} ${y.toFixed(1)} `
  }
  return d
})

// 重心偏置点 Δm 在世界坐标系的位置（初始在 0° 即正上方 (0, -86)）
const massRad = computed(() => ((cageAngle.value - 90) * Math.PI) / 180)
const massX = computed(() => Math.cos(massRad.value) * 86)
const massY = computed(() => Math.sin(massRad.value) * 86)

// 瞬时切向重力偏置分量（正值：顺时针拖曳，负值：逆时针抵消）
const tangentialBias = computed(() => Math.sin((cageAngle.value * Math.PI) / 180))

const biasLabel = computed(() => {
  const v = tangentialBias.value
  if (Math.abs(v) < 0.12) return '垂直平衡 (≈0)'
  return v > 0 ? `正向拖曳 (+${(v * 100).toFixed(0)}%)` : `反向抵消 (${(v * 100).toFixed(0)}%)`
})

const biasClass = computed(() => {
  const v = tangentialBias.value
  if (Math.abs(v) < 0.12) return 'is-neutral'
  return v > 0 ? 'is-pos' : 'is-neg'
})

const driftBarStyle = computed(() => {
  const clamped = Math.max(-100, Math.min(100, cumulativeDrift.value))
  const widthPct = Math.abs(clamped) * 0.5
  if (clamped >= 0) {
    return { left: '50%', width: `${widthPct}%` }
  }
  return { left: `${50 - widthPct}%`, width: `${widthPct}%` }
})

function setMode(nextMode: AnimMode) {
  mode.value = nextMode
  cumulativeDrift.value = 0
  if (nextMode === 'fixed' && Math.abs(tangentialBias.value) < 0.15) {
    // 对照模式默认停在 90° 侧放偏置最大位置，便于一眼看出持续累积偏差
    cageAngle.value = 90
  }
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    lastTime = performance.now()
    scheduleTick()
  }
}

function resetAnim() {
  cageAngle.value = mode.value === 'fixed' ? 90 : 0
  balancePhase.value = 0
  cumulativeDrift.value = 0
  lastTime = performance.now()
}

function snapToDegree(deg: number) {
  isPlaying.value = false
  cageAngle.value = deg
  if (mode.value === 'tourbillon') {
    // 展示对应方位角的理论积分偏置（0° 和 180° 处对称，90° 处达到半周期峰值）
    cumulativeDrift.value = ((1 - Math.cos((deg * Math.PI) / 180)) / 2) * 32
  } else {
    cumulativeDrift.value = Math.sin((deg * Math.PI) / 180) * 65
  }
}

function tick(now: number) {
  if (!isPlaying.value || !isVisible) {
    rafId = null
    return
  }
  if (!lastTime) lastTime = now
  const dt = Math.min(0.05, (now - lastTime) / 1000)
  lastTime = now

  const s = speed.value
  // 摆轮往复呼吸频率：1x 下约 2.2 Hz 教学清晰节奏
  balancePhase.value += dt * s * Math.PI * 4.4

  if (mode.value === 'tourbillon') {
    // 1x 速度下 60 秒转完 360° => 6°/s
    cageAngle.value = (cageAngle.value + dt * s * 6) % 360
    // 旋转模式下，偏置按 sin(θ) 正负对称均摊，一圈积分归零
    cumulativeDrift.value = ((1 - Math.cos((cageAngle.value * Math.PI) / 180)) / 2) * 32
  } else {
    // 固定对照模式下，笼架锁死不动，同方向重力偏置随时间持续累积
    const bias = tangentialBias.value
    const nextDrift = cumulativeDrift.value + bias * dt * s * 14
    cumulativeDrift.value = Math.max(-96, Math.min(96, nextDrift))
  }

  rafId = requestAnimationFrame(tick)
}

function scheduleTick() {
  if (rafId === null && isPlaying.value && isVisible) {
    lastTime = performance.now()
    rafId = requestAnimationFrame(tick)
  }
}

onMounted(() => {
  if (typeof IntersectionObserver !== 'undefined' && containerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        isVisible = Boolean(entry?.isIntersecting)
        if (isVisible && isPlaying.value) {
          scheduleTick()
        } else if (!isVisible && rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(containerRef.value)
  }
  scheduleTick()
})

onBeforeUnmount(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<style scoped>
.tourbillon-card {
  margin: 22px 0;
  padding: 16px;
  border-radius: 14px;
  background: #0b1120;
  border: 1px solid #1e293b;
  color: #e2e8f0;
  box-shadow: 0 12px 32px rgba(2, 6, 23, 0.35);
}

.tb-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.tb-title-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tb-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.16);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.35);
}

.tb-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #f8fafc;
}

.tb-mode-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tb-mode-btn {
  appearance: none;
  border: 1px solid #334155;
  background: #0f172a;
  color: #94a3b8;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tb-mode-btn.active {
  background: #1d4ed8;
  border-color: #3b82f6;
  color: #ffffff;
  font-weight: 600;
}

.tb-stage {
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #1e293b;
}

.tb-svg {
  display: block;
  width: 100%;
  height: auto;
}

.tb-deg-label {
  fill: #64748b;
  font-size: 11px;
  font-family: var(--vp-font-family-mono);
}

.tb-mass-label {
  fill: #fdba74;
  font-size: 12px;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
}

.tb-legend-title {
  fill: #94a3b8;
  font-size: 10.5px;
  font-weight: 600;
}

.tb-gravity-text {
  fill: #38bdf8;
  font-size: 12px;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
}

.tb-legend-item {
  fill: #cbd5e1;
  font-size: 10px;
}

.tb-legend-sub {
  fill: #fbbf24;
  font-size: 10px;
  font-weight: 600;
}

.tb-telemetry {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #0f172a;
  border: 1px solid #1e293b;
}

.tb-metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tb-metric-wide {
  grid-column: 1 / -1;
}

.tb-metric-label {
  font-size: 11px;
  color: #94a3b8;
}

.tb-metric-value {
  font-size: 14px;
  font-family: var(--vp-font-family-mono);
  color: #f8fafc;
}

.tb-metric-value.is-pos {
  color: #fb923c;
}

.tb-metric-value.is-neg {
  color: #38bdf8;
}

.tb-metric-value.is-neutral {
  color: #4ade80;
}

.tb-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.tb-bar-readout {
  font-size: 11px;
  color: #cbd5e1;
}

.tb-bar-track {
  position: relative;
  height: 8px;
  border-radius: 999px;
  background: #1e293b;
  overflow: hidden;
}

.tb-bar-center {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #64748b;
  transform: translateX(-50%);
  z-index: 2;
}

.tb-bar-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  background: #38bdf8;
  transition: background-color 0.2s ease;
}

.tb-bar-fill.danger {
  background: #ef4444;
}

.tb-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
}

.tb-ctrl-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.tb-ctrl-label {
  font-size: 11px;
  color: #94a3b8;
  margin-right: 2px;
}

.tb-btn {
  appearance: none;
  border: 1px solid #334155;
  background: #1e293b;
  color: #cbd5e1;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tb-btn:hover {
  background: #334155;
  color: #ffffff;
}

.tb-btn.active {
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
  font-weight: 600;
}

.tb-btn-primary {
  background: #2563eb;
  border-color: #3b82f6;
  color: #ffffff;
  font-weight: 600;
}

.tb-btn-primary:hover {
  background: #1d4ed8;
}

@media (max-width: 480px) {
  .tourbillon-card {
    padding: 12px;
  }

  .tb-title {
    font-size: 14px;
  }

  .tb-btn,
  .tb-mode-btn {
    padding: 4px 8px;
    font-size: 11.5px;
  }
}
</style>
