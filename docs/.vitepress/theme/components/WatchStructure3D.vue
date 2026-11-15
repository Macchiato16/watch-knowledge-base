<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  WATCH_PARTS,
  WATCH_PARTS_MAP,
  type PartId,
  type ViewMode
} from './watch-structure/partsData'
import type { WatchTeachingModel } from './watch-structure/watchModel'

const containerRef = ref<HTMLElement | null>(null)
const canvasHostRef = ref<HTMLElement | null>(null)

const status = ref<'loading' | 'ready' | 'error'>('loading')
const errorMessage = ref('')

const viewMode = ref<ViewMode>('assembled')
const explodePercent = ref(0)
const isPlaying = ref(true)
const selectedPartId = ref<PartId | null>('case-overall')

const exteriorParts = WATCH_PARTS.filter((p) => p.category === 'exterior')
const interiorParts = WATCH_PARTS.filter((p) => p.category === 'interior')

const selectedPart = computed(() =>
  selectedPartId.value ? WATCH_PARTS_MAP[selectedPartId.value] : null
)

// 运行时控制句柄（仅客户端挂载后赋值）
let runtimeActions: {
  applyMode: (mode: ViewMode) => void
  setExplodeManual: (ratio: number) => void
  focusPart: (partId: PartId | null, autoSwitchMode?: boolean) => void
  resetView: () => void
  togglePlay: (playing: boolean) => void
  retryInit: () => void
  cleanup: () => void
} | null = null

function switchMode(mode: ViewMode) {
  viewMode.value = mode
  runtimeActions?.applyMode(mode)
}

function onExplodeInput(event: Event) {
  const val = Number((event.target as HTMLInputElement).value)
  explodePercent.value = val
  viewMode.value = val > 8 ? 'exploded' : 'assembled'
  runtimeActions?.setExplodeManual(val / 100)
}

function togglePlayState() {
  isPlaying.value = !isPlaying.value
  runtimeActions?.togglePlay(isPlaying.value)
}

function handleResetView() {
  selectedPartId.value = null
  viewMode.value = 'assembled'
  explodePercent.value = 0
  isPlaying.value = true
  runtimeActions?.resetView()
}

function selectPartChip(partId: PartId) {
  const next = selectedPartId.value === partId ? null : partId
  selectedPartId.value = next
  runtimeActions?.focusPart(next, true)
}

function clearSelection() {
  selectedPartId.value = null
  runtimeActions?.focusPart(null, false)
}

function scrollToArticleAnchor(anchor: string) {
  if (typeof document === 'undefined') return
  const el = document.querySelector(anchor)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (history.replaceState) {
      history.replaceState(null, '', anchor)
    }
  }
}

function retryLoad() {
  runtimeActions?.retryInit()
}

onMounted(() => {
  let disposed = false
  let cleanupScene: (() => void) | null = null

  const handleExternalFocus = (e: Event) => {
    const customEvent = e as CustomEvent<{ partId?: PartId }>
    const pid = customEvent.detail?.partId
    if (pid && WATCH_PARTS_MAP[pid]) {
      selectedPartId.value = pid
      runtimeActions?.focusPart(pid, true)
    }
  }
  window.addEventListener('watch-structure:focus-part', handleExternalFocus)

  const initThreeScene = async () => {
    status.value = 'loading'
    errorMessage.value = ''
    cleanupScene?.()
    cleanupScene = null

    try {
      const [THREE, { OrbitControls }, { RoomEnvironment }, { createWatchTeachingModel }] =
        await Promise.all([
          import('three'),
          import('three/examples/jsm/controls/OrbitControls.js'),
          import('three/examples/jsm/environments/RoomEnvironment.js'),
          import('./watch-structure/watchModel')
        ])

      if (disposed || !canvasHostRef.value) return

      const host = canvasHostRef.value
      host.innerHTML = ''

      const width = Math.max(host.clientWidth, 280)
      const height = Math.max(host.clientHeight, 320)
      const isMobileScreen = window.innerWidth < 768

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileScreen ? 1.6 : 2))
      renderer.setSize(width, height)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.08
      host.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x0f172a)

      // 使用内置工作室环境反射增强金属拉丝、黄金摆轮与蓝宝石镜面质感（零外部贴图依赖）
      const pmremGenerator = new THREE.PMREMGenerator(renderer)
      const envScene = new RoomEnvironment()
      const envRT = pmremGenerator.fromScene(envScene, 0.04)
      scene.environment = envRT.texture
      envScene.dispose()
      pmremGenerator.dispose()

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.45)
      scene.add(ambientLight)

      const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.35)
      keyLight.position.set(4, 6, 4)
      scene.add(keyLight)

      const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.85)
      rimLight.position.set(-4, -4, -3)
      scene.add(rimLight)

      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 40)

      // 根据窄竖屏自动拉远相机距离，确保展开视图与表带在 375px 手机屏幕下完整入镜
      const getAspectScale = () => {
        const aspect = camera.aspect || 1
        return aspect < 0.92 ? Math.min(1.38, 0.96 / Math.max(aspect, 0.62)) : 1
      }

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.08
      controls.enablePan = false
      controls.minDistance = 1.45
      controls.maxDistance = 11.5
      controls.minPolarAngle = 0.08
      controls.maxPolarAngle = Math.PI - 0.08

      const watchModel: WatchTeachingModel = createWatchTeachingModel(THREE)
      scene.add(watchModel.root)

      // 动画与相机平滑过渡状态
      let currentExplode = 0
      let targetExplode = 0
      let currentGhost = 0
      let targetGhost = 0

      const camGoalPos = new THREE.Vector3(3.25, 2.35, 3.35)
      const camGoalTarget = new THREE.Vector3(0, 0.05, 0)
      let isCameraTweening = false
      let dirtyRender = true
      let inViewport = true
      let pageVisible = !document.hidden

      const setCameraPreset = (pos: [number, number, number], target: [number, number, number]) => {
        const scale = getAspectScale()
        camGoalPos.set(pos[0] * scale, pos[1] * scale, pos[2] * scale)
        camGoalTarget.set(target[0], target[1], target[2])
        isCameraTweening = true
        dirtyRender = true
      }

      // 初始视角对准默认选中的「表壳整体」
      const initScale = getAspectScale()
      camera.position.set(3.25 * initScale, 2.35 * initScale, 3.35 * initScale)
      controls.target.set(0, 0.05, 0)
      controls.update()
      watchModel.setState({
        explode: 0,
        shellGhost: 0,
        selectedPart: selectedPartId.value
      })

      // 用户手势拖动视角时立即接管相机，避免过渡拉扯
      const onControlStart = () => {
        isCameraTweening = false
        dirtyRender = true
      }
      const onControlChange = () => {
        dirtyRender = true
      }
      controls.addEventListener('start', onControlStart)
      controls.addEventListener('change', onControlChange)

      // 点击拾取（严格区分轻点与拖拽旋转，防止手机滑动误触部件）
      const raycaster = new THREE.Raycaster()
      const pointerNDC = new THREE.Vector2()
      let downX = 0
      let downY = 0
      let downTime = 0

      const onPointerDown = (ev: PointerEvent) => {
        downX = ev.clientX
        downY = ev.clientY
        downTime = performance.now()
      }

      const onPointerUp = (ev: PointerEvent) => {
        const dist = Math.hypot(ev.clientX - downX, ev.clientY - downY)
        const elapsed = performance.now() - downTime
        if (dist > 6 || elapsed > 400) return

        const rect = renderer.domElement.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0) return

        pointerNDC.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1
        pointerNDC.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1

        raycaster.setFromCamera(pointerNDC, camera)
        const hits = raycaster.intersectObjects(watchModel.getRaycastTargets(), false)
        if (hits.length > 0) {
          const hitPart = hits[0].object.userData.partId as PartId | undefined
          if (hitPart) {
            selectedPartId.value = selectedPartId.value === hitPart ? null : hitPart
            dirtyRender = true
          }
        } else {
          if (selectedPartId.value !== null) {
            selectedPartId.value = null
            dirtyRender = true
          }
        }

        watchModel.setState({
          explode: currentExplode,
          shellGhost: currentGhost,
          selectedPart: selectedPartId.value
        })
      }

      renderer.domElement.addEventListener('pointerdown', onPointerDown)
      renderer.domElement.addEventListener('pointerup', onPointerUp)

      // 尺寸自适应（支持窄屏、横竖屏切换）
      const resizeObserver = new ResizeObserver(() => {
        if (!canvasHostRef.value) return
        const w = Math.max(canvasHostRef.value.clientWidth, 260)
        const h = Math.max(canvasHostRef.value.clientHeight, 300)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
        dirtyRender = true
      })
      resizeObserver.observe(host)

      // 视口与标签页可见性监听：离开屏幕停止渲染节省手机电量
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          inViewport = entries[0]?.isIntersecting ?? true
          if (inViewport) {
            lastFrameTime = performance.now()
            dirtyRender = true
          }
        },
        { threshold: 0.05 }
      )
      if (containerRef.value) {
        intersectionObserver.observe(containerRef.value)
      }

      const onVisibilityChange = () => {
        pageVisible = !document.hidden
        if (pageVisible) {
          lastFrameTime = performance.now()
          dirtyRender = true
        }
      }
      document.addEventListener('visibilitychange', onVisibilityChange)

      // 主循环：动静结合，静止时按需渲染
      let rafId = 0
      let lastFrameTime = performance.now()

      const tick = (now: number) => {
        rafId = requestAnimationFrame(tick)
        if (!inViewport || !pageVisible) return

        const dt = Math.min((now - lastFrameTime) / 1000, 0.05)
        lastFrameTime = now

        let stateAnimating = false

        if (Math.abs(targetExplode - currentExplode) > 0.0015) {
          currentExplode += (targetExplode - currentExplode) * Math.min(1, dt * 8.5)
          explodePercent.value = Math.round(currentExplode * 100)
          stateAnimating = true
        } else if (currentExplode !== targetExplode) {
          currentExplode = targetExplode
          explodePercent.value = Math.round(currentExplode * 100)
          stateAnimating = true
        }

        if (Math.abs(targetGhost - currentGhost) > 0.002) {
          currentGhost += (targetGhost - currentGhost) * Math.min(1, dt * 8.5)
          stateAnimating = true
        } else if (currentGhost !== targetGhost) {
          currentGhost = targetGhost
          stateAnimating = true
        }

        if (stateAnimating) {
          watchModel.setState({
            explode: currentExplode,
            shellGhost: currentGhost,
            selectedPart: selectedPartId.value
          })
        }

        if (isCameraTweening) {
          const lerpAlpha = Math.min(1, dt * 6.5)
          camera.position.lerp(camGoalPos, lerpAlpha)
          controls.target.lerp(camGoalTarget, lerpAlpha)
          if (
            camera.position.distanceTo(camGoalPos) < 0.015 &&
            controls.target.distanceTo(camGoalTarget) < 0.015
          ) {
            camera.position.copy(camGoalPos)
            controls.target.copy(camGoalTarget)
            isCameraTweening = false
          }
          dirtyRender = true
        }

        if (isPlaying.value) {
          watchModel.stepAnimation(dt)
          dirtyRender = true
        }

        const controlsMoved = controls.update()
        if (dirtyRender || stateAnimating || controlsMoved) {
          renderer.render(scene, camera)
          dirtyRender = false
        }
      }

      rafId = requestAnimationFrame(tick)

      // 暴露给 Vue 模板的控制接口
      runtimeActions = {
        applyMode(mode: ViewMode) {
          if (mode === 'assembled') {
            targetExplode = 0
            targetGhost = 0
            setCameraPreset([3.25, 2.35, 3.35], [0, 0.05, 0])
          } else if (mode === 'exploded') {
            targetExplode = 1
            targetGhost = 0
            setCameraPreset([4.15, 2.45, 4.15], [0, 0, 0])
          } else if (mode === 'movement') {
            targetExplode = 0
            targetGhost = 1
            setCameraPreset([-1.35, 1.48, 1.78], [-0.22, 0.0, 0.34])
          }
          watchModel.setState({
            explode: currentExplode,
            shellGhost: currentGhost,
            selectedPart: selectedPartId.value
          })
          dirtyRender = true
        },

        setExplodeManual(ratio: number) {
          targetExplode = ratio
          if (ratio > 0.08 && targetGhost > 0) {
            targetGhost = 0
          }
          dirtyRender = true
        },

        focusPart(partId: PartId | null, autoSwitchMode = false) {
          if (partId) {
            const info = WATCH_PARTS_MAP[partId]
            if (autoSwitchMode) {
              if (info.focusCamera.preferMode === 'movement' && targetExplode < 0.35) {
                viewMode.value = 'movement'
                targetGhost = 1
              } else if (info.category === 'exterior' && viewMode.value === 'movement') {
                viewMode.value = targetExplode > 0.35 ? 'exploded' : 'assembled'
                targetGhost = 0
              }
            }
            // 在展开状态下根据爆炸偏移微调观察目标高度，确保相机对准展开后的实际部件层
            const [px, py, pz] = info.focusCamera.position
            const [tx, ty, tz] = info.focusCamera.target
            let explodedYShift = 0
            if (targetExplode > 0.3) {
              const yMap: Partial<Record<PartId, number>> = {
                crystal: 1.55 * targetExplode,
                'mid-case': 0.85 * targetExplode,
                strap: 0.85 * targetExplode,
                hairspring: -0.28 * targetExplode,
                'balance-wheel': -0.58 * targetExplode,
                rotor: -1.0 * targetExplode,
                'case-back': -1.6 * targetExplode
              }
              explodedYShift = yMap[partId] ?? 0
            }
            const distBoost = targetExplode > 0.3 ? 1.18 : 1
            setCameraPreset(
              [px * distBoost, py * distBoost + explodedYShift * 0.65, pz * distBoost],
              [tx, ty + explodedYShift, tz]
            )
          }
          watchModel.setState({
            explode: currentExplode,
            shellGhost: currentGhost,
            selectedPart: partId
          })
          dirtyRender = true
        },

        resetView() {
          targetExplode = 0
          targetGhost = 0
          watchModel.resetAnimationPose()
          watchModel.setState({
            explode: 0,
            shellGhost: 0,
            selectedPart: null
          })
          setCameraPreset([3.25, 2.35, 3.35], [0, 0.05, 0])
          dirtyRender = true
        },

        togglePlay() {
          lastFrameTime = performance.now()
          dirtyRender = true
        },

        retryInit() {
          initThreeScene()
        },

        cleanup() {
          cancelAnimationFrame(rafId)
          resizeObserver.disconnect()
          intersectionObserver.disconnect()
          document.removeEventListener('visibilitychange', onVisibilityChange)
          renderer.domElement.removeEventListener('pointerdown', onPointerDown)
          renderer.domElement.removeEventListener('pointerup', onPointerUp)
          controls.removeEventListener('start', onControlStart)
          controls.removeEventListener('change', onControlChange)
          controls.dispose()
          watchModel.dispose()
          envRT.dispose()
          renderer.dispose()
          if (renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement)
          }
        }
      }

      cleanupScene = runtimeActions.cleanup
      status.value = 'ready'
    } catch (err) {
      console.error('[WatchStructure3D] WebGL init failed:', err)
      status.value = 'error'
      errorMessage.value =
        err instanceof Error ? err.message : '当前浏览器或显卡环境未启用 WebGL 支持'
      runtimeActions = {
        applyMode: () => {},
        setExplodeManual: () => {},
        focusPart: () => {},
        resetView: () => {},
        togglePlay: () => {},
        retryInit: () => initThreeScene(),
        cleanup: () => {}
      }
    }
  }

  initThreeScene()

  onBeforeUnmount(() => {
    disposed = true
    window.removeEventListener('watch-structure:focus-part', handleExternalFocus)
    cleanupScene?.()
    runtimeActions = null
  })
})
</script>

<template>
  <section
    id="watch-structure-viewer"
    ref="containerRef"
    class="watch-viewer-card"
    aria-label="腕表结构三维交互教学演示"
  >
    <!-- 顶部控制栏：三大教学视图 + 动效开关 + 重置 -->
    <div class="viewer-toolbar">
      <div class="mode-tabs" role="tablist" aria-label="观察模式">
        <button
          type="button"
          role="tab"
          :aria-selected="viewMode === 'assembled'"
          :class="['mode-tab', { active: viewMode === 'assembled' }]"
          @click="switchMode('assembled')"
        >
          整表观察
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="viewMode === 'exploded'"
          :class="['mode-tab', { active: viewMode === 'exploded' }]"
          @click="switchMode('exploded')"
        >
          部件展开
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="viewMode === 'movement'"
          :class="['mode-tab', { active: viewMode === 'movement' }]"
          @click="switchMode('movement')"
        >
          机芯局部
        </button>
      </div>

      <div class="action-btns">
        <button
          type="button"
          :class="['ctrl-btn', { playing: isPlaying }]"
          @click="togglePlayState"
        >
          <span aria-hidden="true">{{ isPlaying ? '⏸' : '▶' }}</span>
          <span>{{ isPlaying ? '暂停运转' : '播放运转' }}</span>
        </button>
        <button type="button" class="ctrl-btn" @click="handleResetView">
          重置
        </button>
      </div>
    </div>

    <!-- 分步展开进度条（支持任意比例观察装配关系） -->
    <div class="explode-slider-bar">
      <label for="watch-explode-range" class="slider-label">
        拆解展开度：<strong>{{ explodePercent }}%</strong>
      </label>
      <input
        id="watch-explode-range"
        type="range"
        min="0"
        max="100"
        step="1"
        :value="explodePercent"
        class="explode-range"
        @input="onExplodeInput"
      />
    </div>

    <!-- 3D 渲染舞台与加载/降级状态 -->
    <div class="canvas-stage-wrapper">
      <div ref="canvasHostRef" class="canvas-host" />

      <!-- 加载状态遮罩 -->
      <div v-if="status === 'loading'" class="stage-overlay loading-overlay">
        <div class="spinner" aria-hidden="true" />
        <p class="overlay-title">正在初始化腕表三维教学模型…</p>
        <p class="overlay-sub">按需加载渲染组件，首次进入约需 1 秒</p>
      </div>

      <!-- 失败降级视图：保留完整示意结构图、文字联动与重试按钮 -->
      <div v-else-if="status === 'error'" class="stage-overlay fallback-overlay">
        <div class="fallback-header">
          <p class="overlay-title">当前环境无法启动 3D 硬件渲染，已切换为分层结构示意图</p>
          <button type="button" class="retry-btn" @click="retryLoad">重新尝试加载 3D</button>
        </div>
        <svg
          class="fallback-svg"
          viewBox="0 0 360 210"
          role="img"
          aria-label="腕表结构分层示意图"
        >
          <rect x="8" y="8" width="344" height="194" rx="10" fill="#1e293b" />
          <ellipse cx="145" cy="34" rx="74" ry="13" fill="none" stroke="#93c5fd" stroke-width="2" />
          <text x="235" y="38" fill="#cbd5e1" font-size="12">表镜（蓝宝石玻璃）</text>
          <ellipse cx="145" cy="68" rx="84" ry="16" fill="none" stroke="#e2e8f0" stroke-width="3" />
          <rect x="231" y="61" width="16" height="14" rx="3" fill="#e2e8f0" />
          <text x="255" y="72" fill="#cbd5e1" font-size="12">中壳 + 表冠 / 表带</text>
          <ellipse cx="145" cy="106" rx="72" ry="14" fill="#475569" stroke="#94a3b8" stroke-width="1.5" />
          <circle cx="122" cy="108" r="14" fill="none" stroke="#f59e0b" stroke-width="2.5" />
          <circle cx="122" cy="108" r="6" fill="none" stroke="#38bdf8" stroke-width="1.8" />
          <text x="235" y="110" fill="#fde68a" font-size="12">机芯 + 摆轮 + 游丝</text>
          <path d="M 85 142 A 62 13 0 0 0 205 142 Z" fill="#d97706" opacity="0.85" />
          <text x="235" y="146" fill="#fdba74" font-size="12">自动陀（偏心重锤）</text>
          <ellipse cx="145" cy="178" rx="80" ry="14" fill="none" stroke="#cbd5e1" stroke-width="2" />
          <text x="235" y="182" fill="#cbd5e1" font-size="12">底盖（背透 / 密底）</text>
        </svg>
        <p class="fallback-note">
          下方部件按钮与正文说明仍可正常点选查阅（原因：{{ errorMessage }}）
        </p>
      </div>

      <!-- 画布辅助浮层：手势提示与当前选中标签 -->
      <template v-if="status === 'ready'">
        <div class="gesture-hint">单指旋转 · 双指缩放 · 点击模型或下方按钮选部件</div>
        <div v-if="selectedPart" class="floating-selected-badge">
          <span>当前高亮：<strong>{{ selectedPart.name }}</strong></span>
          <button
            type="button"
            class="badge-close"
            aria-label="取消选中部件"
            @click="clearSelection"
          >
            ×
          </button>
        </div>
      </template>
    </div>

    <!-- 10个已确认教学部件选择器（与正文术语严格一一对应） -->
    <div class="parts-selector-panel">
      <div class="part-group-row">
        <span class="group-tag">外部结构</span>
        <div class="part-chips">
          <button
            v-for="part in exteriorParts"
            :key="part.id"
            type="button"
            :class="['part-chip', { active: selectedPartId === part.id }]"
            @click="selectPartChip(part.id)"
          >
            {{ part.name }}
          </button>
        </div>
      </div>

      <div class="part-group-row">
        <span class="group-tag interior">机芯内部</span>
        <div class="part-chips">
          <button
            v-for="part in interiorParts"
            :key="part.id"
            type="button"
            :class="['part-chip', { active: selectedPartId === part.id }]"
            @click="selectPartChip(part.id)"
          >
            {{ part.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 同步讲解卡片：选中任一部件时即时展示要点，并可跳转正文锚点 -->
    <div v-if="selectedPart" class="part-inspector-card">
      <div class="inspector-header">
        <div class="inspector-title-wrap">
          <span class="inspector-badge">{{ selectedPart.categoryLabel }}</span>
          <h4 class="inspector-title">{{ selectedPart.name }}</h4>
          <span class="inspector-alias">常见称呼：{{ selectedPart.alias }}</span>
        </div>
        <button
          type="button"
          class="jump-doc-btn"
          @click="scrollToArticleAnchor(selectedPart.anchor)"
        >
          定位正文详解 ↓
        </button>
      </div>
      <p class="inspector-summary">{{ selectedPart.summary }}</p>
      <div class="inspector-meta-grid">
        <div class="meta-item">
          <strong>结构关系：</strong>{{ selectedPart.relationNote }}
        </div>
        <div class="meta-item">
          <strong>业务观察：</strong>{{ selectedPart.businessTip }}
        </div>
      </div>
    </div>
    <div v-else class="part-inspector-empty">
      点击三维模型中的任意部位或上方十个部件按钮，即可高亮观察对应位置并查看结构讲解。
    </div>

    <!-- 简化教学模型边界说明 -->
    <p class="model-disclaimer">
      说明：上图为代码构建的<strong>通用自动机械腕表简化教学模型</strong>，重点还原各核心部件的空间层级与基础动态关系（摆轮往复、游丝收放、自动陀旋转），不对应特定品牌型号的机芯夹板造型或完整齿轮传动比。
    </p>
  </section>
</template>

<style scoped>
.watch-viewer-card {
  margin: 20px 0 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.viewer-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.mode-tabs {
  display: inline-flex;
  background: var(--vp-c-bg-soft);
  padding: 3px;
  border-radius: 9px;
  border: 1px solid var(--vp-c-divider);
}

.mode-tab {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.16s ease;
  white-space: nowrap;
}

.mode-tab.active {
  background: var(--vp-c-brand-1);
  color: #ffffff;
}

.action-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ctrl-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 11px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}

.ctrl-btn:hover {
  border-color: var(--vp-c-brand-1);
}

.explode-slider-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
}

.slider-label {
  color: var(--vp-c-text-2);
  white-space: nowrap;
  min-width: 112px;
}

.explode-range {
  flex: 1;
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
  height: 6px;
}

.canvas-stage-wrapper {
  position: relative;
  width: 100%;
  height: 440px;
  background: #0f172a;
}

.canvas-host {
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: grab;
}

.canvas-host:active {
  cursor: grabbing;
}

.stage-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #0f172a;
  color: #e2e8f0;
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(148, 163, 184, 0.25);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: watch-spin 0.85s linear infinite;
  margin-bottom: 12px;
}

@keyframes watch-spin {
  to {
    transform: rotate(360deg);
  }
}

.overlay-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #f8fafc;
}

.overlay-sub {
  margin: 6px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.fallback-overlay {
  justify-content: space-between;
  padding: 14px;
}

.fallback-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.retry-btn {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  background: #2563eb;
  border-radius: 6px;
  cursor: pointer;
}

.fallback-svg {
  width: 100%;
  max-width: 380px;
  height: auto;
}

.fallback-note {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
}

.gesture-hint {
  position: absolute;
  left: 12px;
  bottom: 10px;
  padding: 4px 9px;
  font-size: 12px;
  color: rgba(226, 232, 240, 0.85);
  background: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(4px);
  border-radius: 6px;
  pointer-events: none;
}

.floating-selected-badge {
  position: absolute;
  top: 10px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  font-size: 12px;
  color: #f8fafc;
  background: rgba(30, 64, 175, 0.85);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(96, 165, 250, 0.45);
  border-radius: 999px;
}

.badge-close {
  font-size: 15px;
  line-height: 1;
  color: #bfdbfe;
  cursor: pointer;
  padding: 0 2px;
}

.parts-selector-panel {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--vp-c-bg);
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.part-group-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.group-tag {
  flex-shrink: 0;
  margin-top: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.group-tag.interior {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-color: transparent;
}

.part-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.part-chip {
  padding: 5px 11px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.part-chip:hover {
  border-color: var(--vp-c-brand-1);
}

.part-chip.active {
  color: #ffffff;
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.part-inspector-card {
  padding: 14px 16px;
  background: var(--vp-c-bg-soft);
}

.inspector-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.inspector-title-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
}

.inspector-badge {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border-radius: 4px;
}

.inspector-title {
  margin: 0 !important;
  font-size: 17px !important;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.inspector-alias {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.jump-doc-btn {
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
}

.jump-doc-btn:hover {
  background: var(--vp-c-brand-soft);
}

.inspector-summary {
  margin: 6px 0 10px !important;
  font-size: 14px !important;
  line-height: 1.65 !important;
  color: var(--vp-c-text-1);
}

.inspector-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 8px 14px;
  padding-top: 8px;
  border-top: 1px dashed var(--vp-c-divider);
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.meta-item strong {
  color: var(--vp-c-text-1);
}

.part-inspector-empty {
  padding: 14px 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-align: center;
}

.model-disclaimer {
  margin: 0 !important;
  padding: 9px 16px 12px;
  font-size: 12px !important;
  line-height: 1.55 !important;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-divider);
}

@media (max-width: 640px) {
  .viewer-toolbar {
    padding: 10px 12px;
  }

  .mode-tabs {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .mode-tab {
    text-align: center;
    padding: 6px 6px;
  }

  .action-btns {
    width: 100%;
    justify-content: space-between;
  }

  .ctrl-btn {
    flex: 1;
    justify-content: center;
  }

  .canvas-stage-wrapper {
    height: min(56vh, 390px);
    min-height: 310px;
  }

  .gesture-hint {
    right: 12px;
    text-align: center;
    font-size: 11px;
  }

  .part-group-row {
    flex-direction: column;
    gap: 6px;
  }

  .group-tag {
    margin-top: 0;
  }
}
</style>
