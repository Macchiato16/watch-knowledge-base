import type * as THREEType from 'three'
import { CASE_OVERALL_SUBPARTS, type PartId } from './partsData'

export type PhysicalPartId = Exclude<PartId, 'case-overall'>

const SHELL_PARTS: Set<PhysicalPartId> = new Set([
  'crystal',
  'mid-case',
  'lugs',
  'case-back',
  'strap',
  'clasp'
])

interface BaseMatState {
  colorHex: number
  opacity: number
  transparent: boolean
  depthWrite: boolean
  envMapIntensity: number
}

export interface WatchTeachingModel {
  root: THREEType.Group
  getRaycastTargets: () => THREEType.Object3D[]
  setState: (opts: {
    explode: number
    shellGhost: number
    selectedPart: PartId | null
  }) => void
  stepAnimation: (dt: number, advanceMechanism: boolean) => boolean
  resetAnimationPose: () => void
  dispose: () => void
}

export function createWatchTeachingModel(THREE: typeof THREEType): WatchTeachingModel {
  const root = new THREE.Group()

  const geometries: THREEType.BufferGeometry[] = []
  const materials: THREEType.Material[] = []
  const partGroups = new Map<PhysicalPartId, THREEType.Group>()
  const partMeshes = new Map<PhysicalPartId, THREEType.Mesh[]>()
  const allPickables: THREEType.Mesh[] = []

  const trackGeo = <T extends THREEType.BufferGeometry>(g: T): T => {
    geometries.push(g)
    return g
  }

  const createPartMat = (
    params: THREEType.MeshStandardMaterialParameters
  ): THREEType.MeshStandardMaterial => {
    const mat = new THREE.MeshStandardMaterial(params)
    materials.push(mat)
    return mat
  }

  // 共享的高亮轮廓线材质（随呼吸脉冲动态调节不透明度，使选中部件边缘一目了然）
  const sharedEdgeMat = new THREE.LineBasicMaterial({
    color: 0xa5f3fc,
    transparent: true,
    opacity: 0.95,
    depthTest: true
  })
  materials.push(sharedEdgeMat)

  const registerMesh = (
    partId: PhysicalPartId,
    mesh: THREEType.Mesh,
    isHitProxy = false
  ): THREEType.Mesh => {
    mesh.userData.partId = partId
    mesh.userData.isHitProxy = isHitProxy
    if (!isHitProxy) {
      const mat = mesh.material as THREEType.MeshStandardMaterial
      const baseState: BaseMatState = {
        colorHex: mat.color.getHex(),
        opacity: mat.opacity,
        transparent: mat.transparent,
        depthWrite: mat.depthWrite,
        envMapIntensity: mat.envMapIntensity ?? 1
      }
      mesh.userData.baseMat = baseState

      // 为每个可视网格附加高精度折角轮廓线，选中时点亮描边
      const edgeGeo = trackGeo(new THREE.EdgesGeometry(mesh.geometry, 26))
      const edgeLines = new THREE.LineSegments(edgeGeo, sharedEdgeMat)
      edgeLines.visible = false
      edgeLines.raycast = () => {}
      edgeLines.renderOrder = 4
      mesh.add(edgeLines)
      mesh.userData.edgeLines = edgeLines

      const list = partMeshes.get(partId) ?? []
      list.push(mesh)
      partMeshes.set(partId, list)
    }
    allPickables.push(mesh)
    return mesh
  }

  const initPartGroup = (partId: PhysicalPartId): THREEType.Group => {
    const g = new THREE.Group()
    g.name = `part-${partId}`
    partGroups.set(partId, g)
    root.add(g)
    return g
  }

  const steelBrushedMat = () =>
    createPartMat({
      color: 0xd4dce6,
      metalness: 0.82,
      roughness: 0.26
    })
  const steelPolishedMat = () =>
    createPartMat({
      color: 0xeaf0f6,
      metalness: 0.9,
      roughness: 0.14
    })

  // =========================================================================
  // 1. 中壳 (mid-case)：环形主体 + 斜面表圈口 + 把管护肩（不含表耳，与表耳独立区分）
  // =========================================================================
  const midCaseGroup = initPartGroup('mid-case')

  const caseProfile = [
    new THREE.Vector2(1.21, -0.27),
    new THREE.Vector2(1.45, -0.27),
    new THREE.Vector2(1.53, -0.18),
    new THREE.Vector2(1.55, 0.0),
    new THREE.Vector2(1.52, 0.17),
    new THREE.Vector2(1.42, 0.29),
    new THREE.Vector2(1.19, 0.3),
    new THREE.Vector2(1.19, 0.2),
    new THREE.Vector2(1.23, 0.18),
    new THREE.Vector2(1.23, -0.2),
    new THREE.Vector2(1.21, -0.27)
  ]
  const midCaseBody = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(caseProfile, 64)),
    steelBrushedMat()
  )
  registerMesh('mid-case', midCaseBody)
  midCaseGroup.add(midCaseBody)

  const bezelHighlight = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.31, 0.032, 16, 64)),
    steelPolishedMat()
  )
  bezelHighlight.rotation.x = Math.PI / 2
  bezelHighlight.position.y = 0.285
  registerMesh('mid-case', bezelHighlight)
  midCaseGroup.add(bezelHighlight)

  const crownTube = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.2, 24)),
    steelPolishedMat()
  )
  crownTube.rotation.z = Math.PI / 2
  crownTube.position.set(1.55, 0.01, 0)
  registerMesh('mid-case', crownTube)
  midCaseGroup.add(crownTube)

  // =========================================================================
  // 2. 表耳 (lugs)：12点与6点方向四只微弯倒角表耳 + 侧面生耳穿孔细节
  // =========================================================================
  const lugsGroup = initPartGroup('lugs')
  const lugsTopSub = new THREE.Group()
  const lugsBottomSub = new THREE.Group()
  lugsGroup.add(lugsTopSub, lugsBottomSub)

  const lugShape = new THREE.Shape()
  lugShape.moveTo(-0.155, 0)
  lugShape.lineTo(0.155, 0)
  lugShape.lineTo(0.105, 0.7)
  lugShape.quadraticCurveTo(0.075, 0.79, 0.0, 0.79)
  lugShape.quadraticCurveTo(-0.075, 0.79, -0.105, 0.7)
  lugShape.closePath()

  const lugGeo = trackGeo(
    new THREE.ExtrudeGeometry(lugShape, {
      depth: 0.27,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.024,
      bevelThickness: 0.024
    })
  )
  lugGeo.translate(0, 0, -0.135)

  const lugPinHoleGeo = trackGeo(new THREE.CylinderGeometry(0.038, 0.038, 0.29, 14))
  lugPinHoleGeo.rotateZ(Math.PI / 2)

  const lugHitGeo = trackGeo(new THREE.BoxGeometry(0.42, 0.38, 0.86))

  const buildLugPair = (holder: THREEType.Group, zDir: 1 | -1) => {
    const pairFrame = new THREE.Group()
    pairFrame.rotation.y = zDir === 1 ? 0 : Math.PI
    for (const x of [-0.86, 0.86]) {
      const lug = new THREE.Mesh(lugGeo, steelBrushedMat())
      lug.rotation.x = Math.PI / 2 + 0.12
      lug.position.set(x, 0.02, 1.31)
      registerMesh('lugs', lug)
      pairFrame.add(lug)

      // 表耳外侧生耳孔端头示意，增强辨识度
      const lugHolePin = new THREE.Mesh(
        lugPinHoleGeo,
        createPartMat({ color: 0x64748b, metalness: 0.85, roughness: 0.3 })
      )
      lugHolePin.position.set(x, -0.03, 1.72)
      registerMesh('lugs', lugHolePin)
      pairFrame.add(lugHolePin)

      // 手机端表耳独立点击热区
      const lugHit = new THREE.Mesh(
        lugHitGeo,
        new THREE.MeshBasicMaterial({ visible: false })
      )
      lugHit.position.set(x, -0.01, 1.68)
      registerMesh('lugs', lugHit, true)
      pairFrame.add(lugHit)
    }
    holder.add(pairFrame)
  }

  buildLugPair(lugsTopSub, -1)
  buildLugPair(lugsBottomSub, 1)

  // =========================================================================
  // 3. 表镜 (crystal)：微拱蓝宝石玻璃 + 边缘高光密封环
  // =========================================================================
  const crystalGroup = initPartGroup('crystal')
  const crystalProfile = [
    new THREE.Vector2(0, 0.065),
    new THREE.Vector2(0.75, 0.058),
    new THREE.Vector2(1.16, 0.035),
    new THREE.Vector2(1.2, 0.0),
    new THREE.Vector2(1.2, -0.03),
    new THREE.Vector2(0.8, -0.015),
    new THREE.Vector2(0, -0.01)
  ]
  const crystalGlass = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(crystalProfile, 56)),
    createPartMat({
      color: 0xdbeafe,
      metalness: 0.08,
      roughness: 0.06,
      transparent: true,
      opacity: 0.28,
      depthWrite: false
    })
  )
  registerMesh('crystal', crystalGlass)
  crystalGroup.add(crystalGlass)

  const crystalRim = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.195, 0.024, 14, 64)),
    createPartMat({
      color: 0x93c5fd,
      metalness: 0.25,
      roughness: 0.18,
      transparent: true,
      opacity: 0.75
    })
  )
  crystalRim.rotation.x = Math.PI / 2
  registerMesh('crystal', crystalRim)
  crystalGroup.add(crystalRim)

  // =========================================================================
  // 4. 底盖 (case-back)：旋入式背透金属外圈（含开盖凹槽）+ 背透蓝宝石镜片
  // =========================================================================
  const caseBackGroup = initPartGroup('case-back')
  const backRingProfile = [
    new THREE.Vector2(1.02, 0.05),
    new THREE.Vector2(1.42, 0.05),
    new THREE.Vector2(1.44, -0.02),
    new THREE.Vector2(1.36, -0.075),
    new THREE.Vector2(1.02, -0.075),
    new THREE.Vector2(1.02, 0.05)
  ]
  const caseBackRing = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(backRingProfile, 64)),
    steelBrushedMat()
  )
  registerMesh('case-back', caseBackRing)
  caseBackGroup.add(caseBackRing)

  const notchGeo = trackGeo(new THREE.BoxGeometry(0.11, 0.05, 0.07))
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const notch = new THREE.Mesh(
      notchGeo,
      createPartMat({ color: 0x64748b, metalness: 0.7, roughness: 0.4 })
    )
    notch.position.set(Math.cos(angle) * 1.32, -0.062, Math.sin(angle) * 1.32)
    notch.rotation.y = -angle
    registerMesh('case-back', notch)
    caseBackGroup.add(notch)
  }

  const backGlass = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.025, 1.025, 0.035, 48)),
    createPartMat({
      color: 0xe0f2fe,
      metalness: 0.06,
      roughness: 0.08,
      transparent: true,
      opacity: 0.24,
      depthWrite: false
    })
  )
  backGlass.position.y = -0.02
  registerMesh('case-back', backGlass)
  caseBackGroup.add(backGlass)

  // =========================================================================
  // 5. 表冠 (crown)：防滑坑纹旋钮 + 内部上链把芯（柄轴）
  // =========================================================================
  const crownGroup = initPartGroup('crown')
  const crownHead = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.22, 32)),
    steelPolishedMat()
  )
  crownHead.rotation.z = Math.PI / 2
  crownHead.position.x = 0.14
  registerMesh('crown', crownHead)
  crownGroup.add(crownHead)

  const crownCap = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.19, 0.23, 0.045, 32)),
    steelBrushedMat()
  )
  crownCap.rotation.z = -Math.PI / 2
  crownCap.position.x = 0.265
  registerMesh('crown', crownCap)
  crownGroup.add(crownCap)

  const ridgeGeo = trackGeo(new THREE.BoxGeometry(0.205, 0.024, 0.024))
  const ridgeMat = steelBrushedMat()
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2
    const ridge = new THREE.Mesh(ridgeGeo, ridgeMat)
    ridge.position.set(0.14, Math.cos(a) * 0.242, Math.sin(a) * 0.242)
    ridge.rotation.x = -a
    registerMesh('crown', ridge)
    crownGroup.add(ridge)
  }

  const windingStem = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.042, 0.042, 0.62, 16)),
    createPartMat({ color: 0x94a3b8, metalness: 0.85, roughness: 0.22 })
  )
  windingStem.rotation.z = Math.PI / 2
  windingStem.position.x = -0.26
  registerMesh('crown', windingStem)
  crownGroup.add(windingStem)

  const crownHitProxy = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.35, 12, 12)),
    new THREE.MeshBasicMaterial({ visible: false })
  )
  crownHitProxy.position.x = 0.12
  registerMesh('crown', crownHitProxy, true)
  crownGroup.add(crownHitProxy)

  // =========================================================================
  // 6. 表带 (strap)：上下两端弧形多节渐变表带 + 生耳栓 + 活动游环（表扣已独立拆分）
  // =========================================================================
  const strapGroup = initPartGroup('strap')
  const strapTopSub = new THREE.Group()
  const strapBottomSub = new THREE.Group()
  strapGroup.add(strapTopSub, strapBottomSub)

  const strapRubberMat = () =>
    createPartMat({
      color: 0x1e293b,
      metalness: 0.15,
      roughness: 0.58
    })
  const strapAccentMat = () =>
    createPartMat({
      color: 0x334155,
      metalness: 0.22,
      roughness: 0.45
    })

  const buildStrapHalf = (targetGroup: THREEType.Group, zDir: 1 | -1, isTopShortEnd: boolean) => {
    const springBar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 1.7, 16)),
      steelPolishedMat()
    )
    springBar.rotation.z = Math.PI / 2
    springBar.position.set(0, -0.02, zDir * 1.72)
    registerMesh('strap', springBar)
    targetGroup.add(springBar)

    const segments = [
      { w: 1.48, len: 0.42, thick: 0.16, y: -0.03, zOff: 1.9, tilt: 0.08 },
      { w: 1.38, len: 0.46, thick: 0.145, y: -0.1, zOff: 2.33, tilt: 0.2 },
      { w: 1.28, len: 0.48, thick: 0.13, y: -0.23, zOff: 2.77, tilt: 0.32 },
      { w: 1.2, len: 0.44, thick: 0.115, y: -0.39, zOff: 3.18, tilt: 0.44 }
    ]

    segments.forEach((seg, idx) => {
      const block = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(seg.w, seg.thick, seg.len)),
        strapRubberMat()
      )
      block.position.set(0, seg.y, zDir * seg.zOff)
      block.rotation.x = zDir * seg.tilt
      registerMesh('strap', block)
      targetGroup.add(block)

      const groove = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(seg.w * 0.56, seg.thick + 0.014, seg.len * 0.82)),
        strapAccentMat()
      )
      groove.position.copy(block.position)
      groove.rotation.copy(block.rotation)
      registerMesh('strap', groove)
      targetGroup.add(groove)

      // 6点方向长带端扣眼孔细节
      if (!isTopShortEnd && idx >= 1) {
        const holeDot = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.048, 0.048, seg.thick + 0.024, 12)),
          createPartMat({ color: 0x0f172a, metalness: 0.1, roughness: 0.9 })
        )
        holeDot.position.copy(block.position)
        holeDot.rotation.copy(block.rotation)
        registerMesh('strap', holeDot)
        targetGroup.add(holeDot)
      }
    })

    // 12点方向表带游环（Keeper loop）
    if (isTopShortEnd) {
      const keeper = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(1.34, 0.22, 0.16)),
        strapAccentMat()
      )
      keeper.position.set(0, -0.31, zDir * 2.98)
      keeper.rotation.x = zDir * 0.38
      registerMesh('strap', keeper)
      targetGroup.add(keeper)
    }
  }

  buildStrapHalf(strapTopSub, -1, true)
  buildStrapHalf(strapBottomSub, 1, false)

  // =========================================================================
  // 7. 表扣 (clasp)：12点方向表带末端独立金属表扣（铰链生耳轴 + 左右弧臂 + 前横梁 + 中央扣针）
  // =========================================================================
  const claspGroup = initPartGroup('clasp')
  const claspLocalFrame = new THREE.Group()
  claspLocalFrame.position.set(0, -0.49, -3.38)
  claspLocalFrame.rotation.x = -0.44
  claspGroup.add(claspLocalFrame)

  // 表扣连接横轴
  const claspHingeBar = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 1.32, 18)),
    steelPolishedMat()
  )
  claspHingeBar.rotation.z = Math.PI / 2
  registerMesh('clasp', claspHingeBar)
  claspLocalFrame.add(claspHingeBar)

  // 左右两侧倒角金属扣框臂
  const claspSideArmGeo = trackGeo(new THREE.BoxGeometry(0.11, 0.11, 0.62))
  for (const sideX of [-0.64, 0.64]) {
    const arm = new THREE.Mesh(claspSideArmGeo, steelBrushedMat())
    arm.position.set(sideX, 0.01, -0.29)
    registerMesh('clasp', arm)
    claspLocalFrame.add(arm)
  }

  // 前端加宽表扣横梁（含微凹扣针槽视觉层次）
  const claspFrontCrossbar = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.39, 0.125, 0.15)),
    steelPolishedMat()
  )
  claspFrontCrossbar.position.set(0, 0.015, -0.58)
  registerMesh('clasp', claspFrontCrossbar)
  claspLocalFrame.add(claspFrontCrossbar)

  // 中央活动扣针（Tang Pin）+ 针座轴套
  const pinCollar = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.075, 0.075, 0.16, 16)),
    steelBrushedMat()
  )
  pinCollar.rotation.z = Math.PI / 2
  registerMesh('clasp', pinCollar)
  claspLocalFrame.add(pinCollar)

  const bucklePin = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.085, 0.045, 0.64)),
    steelPolishedMat()
  )
  bucklePin.position.set(0, 0.055, -0.3)
  bucklePin.rotation.x = 0.09
  registerMesh('clasp', bucklePin)
  claspLocalFrame.add(bucklePin)

  // 表扣放大点击热区（方便手机端一眼点中末端表扣）
  const claspHitBox = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.65, 0.45, 0.85)),
    new THREE.MeshBasicMaterial({ visible: false })
  )
  claspHitBox.position.set(0, 0.02, -0.3)
  registerMesh('clasp', claspHitBox, true)
  claspLocalFrame.add(claspHitBox)

  // =========================================================================
  // 8. 机芯 (movement)：镂空窗口主夹板 + 发条盒 + 传动齿轮系 + 桥板/红宝石 + 镂空刻度指针圈
  // =========================================================================
  const movementGroup = initPartGroup('movement')
  const plateMat = () =>
    createPartMat({
      color: 0x64748b,
      metalness: 0.72,
      roughness: 0.34
    })
  const bridgeMat = () =>
    createPartMat({
      color: 0x94a3b8,
      metalness: 0.78,
      roughness: 0.28
    })
  const brassGearMat = () =>
    createPartMat({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.24
    })
  const rubyMat = () =>
    createPartMat({
      color: 0xe11d48,
      metalness: 0.2,
      roughness: 0.15
    })
  const bluedScrewMat = () =>
    createPartMat({
      color: 0x2563eb,
      metalness: 0.85,
      roughness: 0.2
    })

  const mainplateShape = new THREE.Shape()
  mainplateShape.absarc(0, 0, 1.18, 0, Math.PI * 2, false)
  const balanceCutout = new THREE.Path()
  balanceCutout.absarc(-0.38, -0.52, 0.42, 0, Math.PI * 2, true)
  mainplateShape.holes.push(balanceCutout)

  const mainplateGeo = trackGeo(
    new THREE.ExtrudeGeometry(mainplateShape, {
      depth: 0.09,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012
    })
  )
  const mainplate = new THREE.Mesh(mainplateGeo, plateMat())
  mainplate.rotation.x = -Math.PI / 2
  mainplate.position.y = -0.045
  registerMesh('movement', mainplate)
  movementGroup.add(mainplate)

  const barrel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.13, 36)),
    createPartMat({ color: 0xcbd5e1, metalness: 0.82, roughness: 0.25 })
  )
  barrel.position.set(0.36, 0.01, -0.36)
  registerMesh('movement', barrel)
  movementGroup.add(barrel)

  const gearMeshes: Array<{ mesh: THREEType.Group; speed: number }> = []
  const createSpokedGear = (radius: number, teethCount: number) => {
    const g = new THREE.Group()
    const rim = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(radius, 0.022, 10, 36)),
      brassGearMat()
    )
    rim.rotation.x = Math.PI / 2
    registerMesh('movement', rim)
    g.add(rim)

    for (let s = 0; s < 4; s++) {
      const spoke = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(radius * 1.9, 0.018, 0.028)),
        brassGearMat()
      )
      spoke.rotation.y = (s / 4) * Math.PI
      registerMesh('movement', spoke)
      g.add(spoke)
    }

    const toothGeo = trackGeo(new THREE.BoxGeometry(0.036, 0.022, 0.026))
    for (let t = 0; t < teethCount; t++) {
      const a = (t / teethCount) * Math.PI * 2
      const tooth = new THREE.Mesh(toothGeo, brassGearMat())
      tooth.position.set(Math.cos(a) * (radius + 0.022), 0, Math.sin(a) * (radius + 0.022))
      tooth.rotation.y = -a
      registerMesh('movement', tooth)
      g.add(tooth)
    }
    return g
  }

  const centerWheel = createSpokedGear(0.28, 18)
  centerWheel.position.set(0, 0.055, 0)
  movementGroup.add(centerWheel)
  gearMeshes.push({ mesh: centerWheel, speed: 0.35 })

  const thirdWheel = createSpokedGear(0.21, 14)
  thirdWheel.position.set(-0.46, 0.045, -0.22)
  movementGroup.add(thirdWheel)
  gearMeshes.push({ mesh: thirdWheel, speed: -0.55 })

  const fourthWheel = createSpokedGear(0.17, 12)
  fourthWheel.position.set(0.32, 0.045, 0.42)
  movementGroup.add(fourthWheel)
  gearMeshes.push({ mesh: fourthWheel, speed: 0.85 })

  const upperBridgeShape = new THREE.Shape()
  upperBridgeShape.moveTo(-0.85, 0.08)
  upperBridgeShape.quadraticCurveTo(0, 0.95, 0.92, 0.15)
  upperBridgeShape.quadraticCurveTo(0.88, -0.35, 0.25, -0.25)
  upperBridgeShape.quadraticCurveTo(-0.35, -0.15, -0.85, 0.08)
  const upperBridge = new THREE.Mesh(
    trackGeo(
      new THREE.ExtrudeGeometry(upperBridgeShape, {
        depth: 0.055,
        bevelEnabled: true,
        bevelSegments: 1,
        bevelSize: 0.01,
        bevelThickness: 0.01
      })
    ),
    bridgeMat()
  )
  upperBridge.rotation.x = -Math.PI / 2
  upperBridge.position.y = -0.095
  registerMesh('movement', upperBridge)
  movementGroup.add(upperBridge)

  const jewelPositions: Array<[number, number]> = [
    [0, 0],
    [0.36, -0.36],
    [-0.46, -0.22],
    [0.32, 0.42]
  ]
  const jewelGeo = trackGeo(new THREE.CylinderGeometry(0.042, 0.042, 0.16, 16))
  for (const [jx, jz] of jewelPositions) {
    const jewel = new THREE.Mesh(jewelGeo, rubyMat())
    jewel.position.set(jx, -0.025, jz)
    registerMesh('movement', jewel)
    movementGroup.add(jewel)
  }

  const screwPositions: Array<[number, number]> = [
    [-0.68, -0.32],
    [0.68, -0.18],
    [0.12, -0.78],
    [0.72, 0.45]
  ]
  const screwGeo = trackGeo(new THREE.CylinderGeometry(0.036, 0.036, 0.15, 14))
  for (const [sx, sz] of screwPositions) {
    const screw = new THREE.Mesh(screwGeo, bluedScrewMat())
    screw.position.set(sx, -0.025, sz)
    registerMesh('movement', screw)
    movementGroup.add(screw)
  }

  const chapterRing = new THREE.Mesh(
    trackGeo(new THREE.RingGeometry(1.03, 1.17, 64)),
    createPartMat({
      color: 0x1e293b,
      metalness: 0.5,
      roughness: 0.4,
      side: THREE.DoubleSide
    })
  )
  chapterRing.rotation.x = -Math.PI / 2
  chapterRing.position.y = 0.095
  registerMesh('movement', chapterRing)
  movementGroup.add(chapterRing)

  const markerGeo = trackGeo(new THREE.BoxGeometry(0.032, 0.022, 0.12))
  for (let h = 0; h < 12; h++) {
    const angle = (h / 12) * Math.PI * 2
    if (h === 0) {
      for (const offset of [-0.032, 0.032]) {
        const m12 = new THREE.Mesh(markerGeo, steelPolishedMat())
        m12.position.set(offset, 0.11, -1.08)
        registerMesh('movement', m12)
        movementGroup.add(m12)
      }
    } else {
      const marker = new THREE.Mesh(markerGeo, steelPolishedMat())
      marker.position.set(Math.sin(angle) * 1.08, 0.11, -Math.cos(angle) * 1.08)
      marker.rotation.y = -angle
      registerMesh('movement', marker)
      movementGroup.add(marker)
    }
  }

  const hourHand = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.055, 0.018, 0.62)),
    steelPolishedMat()
  )
  hourHand.geometry.translate(0, 0, -0.24)
  hourHand.position.set(0, 0.125, 0)
  hourHand.rotation.y = (Math.PI / 6) * 2
  registerMesh('movement', hourHand)
  movementGroup.add(hourHand)

  const minuteHand = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.04, 0.018, 0.92)),
    steelPolishedMat()
  )
  minuteHand.geometry.translate(0, 0, -0.38)
  minuteHand.position.set(0, 0.145, 0)
  minuteHand.rotation.y = -(Math.PI / 6) * 2
  registerMesh('movement', minuteHand)
  movementGroup.add(minuteHand)

  const centerPinion = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.065, 0.065, 0.08, 20)),
    brassGearMat()
  )
  centerPinion.position.set(0, 0.13, 0)
  registerMesh('movement', centerPinion)
  movementGroup.add(centerPinion)

  // =========================================================================
  // 9. 摆轮 (balance-wheel)：7点位镂空窗金色往复飞轮 + 砝码钉 + 摆轮夹板
  // =========================================================================
  const BALANCE_X = -0.38
  const BALANCE_Z = 0.52

  const balanceGroup = initPartGroup('balance-wheel')
  const balanceSpinGroup = new THREE.Group()
  balanceGroup.add(balanceSpinGroup)

  const goldBalanceMat = () =>
    createPartMat({
      color: 0xf59e0b,
      metalness: 0.88,
      roughness: 0.18
    })

  const balanceRim = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.31, 0.032, 16, 48)),
    goldBalanceMat()
  )
  balanceRim.rotation.x = Math.PI / 2
  registerMesh('balance-wheel', balanceRim)
  balanceSpinGroup.add(balanceRim)

  for (let i = 0; i < 3; i++) {
    const spoke = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.3, 0.02, 0.03)),
      goldBalanceMat()
    )
    spoke.geometry.translate(0.15, 0, 0)
    spoke.rotation.y = (i / 3) * Math.PI * 2
    registerMesh('balance-wheel', spoke)
    balanceSpinGroup.add(spoke)
  }

  const weightGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 0.045, 10))
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const wPin = new THREE.Mesh(weightGeo, goldBalanceMat())
    wPin.rotation.z = Math.PI / 2
    wPin.rotation.y = -a
    wPin.position.set(Math.cos(a) * 0.34, 0, Math.sin(a) * 0.34)
    registerMesh('balance-wheel', wPin)
    balanceSpinGroup.add(wPin)
  }

  const balanceStaff = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.025, 0.025, 0.15, 14)),
    steelPolishedMat()
  )
  registerMesh('balance-wheel', balanceStaff)
  balanceGroup.add(balanceStaff)

  const balanceBridge = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.46, 0.032, 0.11)),
    bridgeMat()
  )
  balanceBridge.position.set(-0.18, -0.072, 0.12)
  balanceBridge.rotation.y = 0.55
  registerMesh('balance-wheel', balanceBridge)
  balanceGroup.add(balanceBridge)

  const balanceJewel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.045, 16)),
    rubyMat()
  )
  balanceJewel.position.set(0, -0.072, 0)
  registerMesh('balance-wheel', balanceJewel)
  balanceGroup.add(balanceJewel)

  const balanceHitRing = new THREE.Mesh(
    trackGeo(new THREE.RingGeometry(0.185, 0.37, 32)),
    new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })
  )
  balanceHitRing.rotation.x = -Math.PI / 2
  registerMesh('balance-wheel', balanceHitRing, true)
  balanceGroup.add(balanceHitRing)

  // =========================================================================
  // 10. 游丝 (hairspring)：同轴阿基米德螺旋细簧，呼吸式收放动画
  // =========================================================================
  const hairspringGroup = initPartGroup('hairspring')
  const hairspringBreathGroup = new THREE.Group()
  hairspringGroup.add(hairspringBreathGroup)

  const hairspringMat = () =>
    createPartMat({
      color: 0x38bdf8,
      metalness: 0.72,
      roughness: 0.2
    })

  const spiralPoints: THREEType.Vector3[] = []
  const turns = 4.25
  const totalSteps = 150
  const rInner = 0.038
  const rOuter = 0.175
  for (let i = 0; i <= totalSteps; i++) {
    const t = i / totalSteps
    const theta = t * turns * Math.PI * 2
    const r = rInner + (rOuter - rInner) * t
    spiralPoints.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r))
  }
  const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints)
  const hairspringTube = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(spiralCurve, 160, 0.0085, 8, false)),
    hairspringMat()
  )
  registerMesh('hairspring', hairspringTube)
  hairspringBreathGroup.add(hairspringTube)

  const collet = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.038, 0.038, 0.035, 16)),
    hairspringMat()
  )
  registerMesh('hairspring', collet)
  hairspringGroup.add(collet)

  const stud = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.042, 0.04, 0.042)),
    hairspringMat()
  )
  const lastPt = spiralPoints[spiralPoints.length - 1]
  stud.position.copy(lastPt)
  registerMesh('hairspring', stud)
  hairspringGroup.add(stud)

  const hairspringHitDisk = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24)),
    new THREE.MeshBasicMaterial({ visible: false })
  )
  registerMesh('hairspring', hairspringHitDisk, true)
  hairspringGroup.add(hairspringHitDisk)

  // =========================================================================
  // 11. 自动陀 (rotor)：背面中央轴承 + 半圆形镂空偏心重锤 + 玫瑰金配重外弧
  // =========================================================================
  const rotorGroup = initPartGroup('rotor')
  const rotorSpinGroup = new THREE.Group()
  const DEFAULT_ROTOR_ANGLE = -Math.PI * 0.42
  rotorSpinGroup.rotation.y = DEFAULT_ROTOR_ANGLE
  rotorGroup.add(rotorSpinGroup)

  const rotorBodyShape = new THREE.Shape()
  rotorBodyShape.absarc(0, 0, 1.02, -Math.PI * 0.48, Math.PI * 0.48, false)
  rotorBodyShape.lineTo(0, 0.18)
  rotorBodyShape.absarc(0, 0, 0.18, Math.PI * 0.5, -Math.PI * 0.5, true)
  rotorBodyShape.closePath()

  for (const sign of [-1, 1]) {
    const win = new THREE.Path()
    const aStart = sign > 0 ? 0.16 : -0.41 * Math.PI
    const aEnd = sign > 0 ? 0.41 * Math.PI : -0.16
    win.absarc(0, 0, 0.78, aStart, aEnd, false)
    win.absarc(0, 0, 0.34, aEnd, aStart, true)
    win.closePath()
    rotorBodyShape.holes.push(win)
  }

  const rotorPlate = new THREE.Mesh(
    trackGeo(
      new THREE.ExtrudeGeometry(rotorBodyShape, {
        depth: 0.042,
        bevelEnabled: true,
        bevelSegments: 1,
        bevelSize: 0.008,
        bevelThickness: 0.008
      })
    ),
    createPartMat({
      color: 0xcbd5e1,
      metalness: 0.85,
      roughness: 0.22
    })
  )
  rotorPlate.rotation.x = -Math.PI / 2
  registerMesh('rotor', rotorPlate)
  rotorSpinGroup.add(rotorPlate)

  const heavyRimShape = new THREE.Shape()
  heavyRimShape.absarc(0, 0, 1.09, -Math.PI * 0.48, Math.PI * 0.48, false)
  heavyRimShape.absarc(0, 0, 0.94, Math.PI * 0.48, -Math.PI * 0.48, true)
  heavyRimShape.closePath()

  const rotorHeavyRim = new THREE.Mesh(
    trackGeo(
      new THREE.ExtrudeGeometry(heavyRimShape, {
        depth: 0.068,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.01,
        bevelThickness: 0.01
      })
    ),
    createPartMat({
      color: 0xd97706,
      metalness: 0.88,
      roughness: 0.2
    })
  )
  rotorHeavyRim.rotation.x = -Math.PI / 2
  rotorHeavyRim.position.y = -0.012
  registerMesh('rotor', rotorHeavyRim)
  rotorSpinGroup.add(rotorHeavyRim)

  const bearingHub = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.19, 0.19, 0.075, 28)),
    steelPolishedMat()
  )
  bearingHub.position.y = -0.02
  registerMesh('rotor', bearingHub)
  rotorSpinGroup.add(bearingHub)

  const ballGeo = trackGeo(new THREE.SphereGeometry(0.022, 10, 10))
  const ballMat = createPartMat({ color: 0xf8fafc, metalness: 0.3, roughness: 0.15 })
  for (let b = 0; b < 7; b++) {
    const ba = (b / 7) * Math.PI * 2
    const ball = new THREE.Mesh(ballGeo, ballMat)
    ball.position.set(Math.cos(ba) * 0.115, -0.058, Math.sin(ba) * 0.115)
    registerMesh('rotor', ball)
    rotorSpinGroup.add(ball)
  }

  // =========================================================================
  // 展开插值、外壳透视与强对比度高亮描边系统
  // =========================================================================
  let currentExplode = 0
  let currentShellGhost = 0
  let currentSelected: PartId | null = null
  let animElapsed = 0
  let pulseElapsed = 0

  // 高对比度青蓝自发光 + 亮色提亮，配合未选中部件 X 光透视压暗（opacity 0.17）
  const highlightEmissive = new THREE.Color(0x06b6d4)
  const selectedTintBoost = new THREE.Color(0x67e8f9)
  const zeroColor = new THREE.Color(0x000000)
  const scratchColor = new THREE.Color()
  const dimTargetColor = new THREE.Color(0x0f172a)

  const applyHighlightVisuals = () => {
    const activeSet = new Set<PhysicalPartId>()
    if (currentSelected === 'case-overall') {
      for (const sub of CASE_OVERALL_SUBPARTS) {
        if (sub !== 'case-overall') activeSet.add(sub)
      }
    } else if (currentSelected) {
      activeSet.add(currentSelected)
    }

    const hasSelection = activeSet.size > 0
    // 柔和的呼吸光效，使高亮区域极其醒目
    const pulseWave = 0.5 + 0.5 * Math.sin(pulseElapsed * 4.5)
    sharedEdgeMat.opacity = 0.72 + 0.28 * pulseWave

    for (const [partId, meshes] of partMeshes.entries()) {
      const isSelected = activeSet.has(partId)
      const isShell = SHELL_PARTS.has(partId)
      const ghostAmount = isShell && !isSelected ? currentShellGhost : 0

      for (const mesh of meshes) {
        const mat = mesh.material as THREEType.MeshStandardMaterial
        const base = mesh.userData.baseMat as BaseMatState
        const edgeLines = mesh.userData.edgeLines as THREEType.LineSegments | undefined

        if (edgeLines) {
          edgeLines.visible = isSelected
        }

        scratchColor.setHex(base.colorHex)

        if (isSelected) {
          // 提亮深色材质（如深灰表带、夹板），叠加高亮青色自发光与环境反射增强
          scratchColor.lerp(selectedTintBoost, 0.34)
          mat.color.copy(scratchColor)
          mat.emissive.copy(highlightEmissive)
          const baseGlow = base.transparent ? 0.75 : 0.55
          mat.emissiveIntensity = baseGlow + 0.32 * pulseWave
          mat.envMapIntensity = 1.35

          const selOpacity = base.transparent ? Math.max(base.opacity, 0.78) : 1
          if (mat.transparent !== base.transparent || mat.depthWrite !== true) {
            mat.transparent = base.transparent
            mat.depthWrite = true
            mat.needsUpdate = true
          }
          mat.opacity = selOpacity
          mesh.renderOrder = 1
        } else if (hasSelection) {
          // 未选中部件显著退居背景（17% X光半透明轮廓 + 抑制高光反射），突出选中主角
          scratchColor.lerp(dimTargetColor, 0.68)
          mat.color.copy(scratchColor)
          mat.emissive.copy(zeroColor)
          mat.emissiveIntensity = 0
          mat.envMapIntensity = 0.14

          const dimmedOpacity =
            ghostAmount > 0.01
              ? THREE.MathUtils.lerp(0.17, 0.06, ghostAmount)
              : base.transparent
                ? Math.min(base.opacity, 0.12)
                : 0.17

          if (!mat.transparent || mat.depthWrite) {
            mat.transparent = true
            mat.depthWrite = false
            mat.needsUpdate = true
          }
          mat.opacity = dimmedOpacity
          mesh.renderOrder = 2
        } else {
          // 无选中状态：恢复真实金属与玻璃质感
          mat.color.copy(scratchColor)
          mat.emissive.copy(zeroColor)
          mat.emissiveIntensity = 0
          mat.envMapIntensity = base.envMapIntensity

          const targetOpacity =
            ghostAmount > 0.01
              ? THREE.MathUtils.lerp(base.opacity, 0.07, ghostAmount)
              : base.opacity
          const shouldBeTransparent = base.transparent || ghostAmount > 0.01
          const nextDepthWrite = ghostAmount > 0.2 ? false : base.depthWrite

          if (mat.transparent !== shouldBeTransparent || mat.depthWrite !== nextDepthWrite) {
            mat.transparent = shouldBeTransparent
            mat.depthWrite = nextDepthWrite
            mat.needsUpdate = true
          }
          mat.opacity = targetOpacity
          mesh.renderOrder = 0
        }
      }
    }
  }

  const setState = (opts: {
    explode: number
    shellGhost: number
    selectedPart: PartId | null
  }) => {
    const t = THREE.MathUtils.clamp(opts.explode, 0, 1)
    currentExplode = t
    currentShellGhost = THREE.MathUtils.clamp(opts.shellGhost, 0, 1)
    if (opts.selectedPart !== currentSelected) {
      // 新选中某一部件时从脉冲波峰起步，提供即时醒目的点亮反馈
      pulseElapsed = Math.PI / (2 * 4.5)
      currentSelected = opts.selectedPart
    }

    // 按装配关系执行轴向与径向爆炸插值（中壳 -> 表耳 -> 表带 -> 表扣 依次拉开）
    crystalGroup.position.set(0, THREE.MathUtils.lerp(0.28, 1.88, t), 0)
    midCaseGroup.position.set(0, THREE.MathUtils.lerp(0, 0.85, t), 0)

    lugsGroup.position.set(0, THREE.MathUtils.lerp(0, 0.85, t), 0)
    lugsTopSub.position.set(0, 0, THREE.MathUtils.lerp(0, -0.26, t))
    lugsBottomSub.position.set(0, 0, THREE.MathUtils.lerp(0, 0.26, t))

    strapGroup.position.set(0, THREE.MathUtils.lerp(0, 0.85, t), 0)
    strapTopSub.position.set(0, 0, THREE.MathUtils.lerp(0, -0.92, t))
    strapBottomSub.position.set(0, 0, THREE.MathUtils.lerp(0, 0.92, t))

    claspGroup.position.set(
      0,
      THREE.MathUtils.lerp(0, 1.02, t),
      THREE.MathUtils.lerp(0, -1.5, t)
    )

    crownGroup.position.set(THREE.MathUtils.lerp(1.56, 2.62, t), 0.01, 0)
    movementGroup.position.set(0, 0, 0)

    hairspringGroup.position.set(
      BALANCE_X,
      THREE.MathUtils.lerp(0.032, -0.28, t),
      BALANCE_Z
    )
    balanceGroup.position.set(
      BALANCE_X,
      THREE.MathUtils.lerp(-0.01, -0.58, t),
      BALANCE_Z
    )
    rotorGroup.position.set(0, THREE.MathUtils.lerp(-0.155, -1.12, t), 0)
    caseBackGroup.position.set(0, THREE.MathUtils.lerp(-0.285, -1.85, t), 0)

    applyHighlightVisuals()
  }

  const getRaycastTargets = (): THREEType.Object3D[] => {
    if (currentShellGhost > 0.5) {
      return allPickables.filter((m) => !SHELL_PARTS.has(m.userData.partId))
    }
    return allPickables
  }

  const stepAnimation = (dt: number, advanceMechanism: boolean): boolean => {
    const clampedDt = Math.min(dt, 0.05)
    let changed = false

    if (advanceMechanism) {
      animElapsed += clampedDt

      const swingPhase = Math.sin(animElapsed * 5.3)
      balanceSpinGroup.rotation.y = swingPhase * 0.68

      const breathScale = 1 + swingPhase * 0.09
      hairspringBreathGroup.scale.set(breathScale, 1, breathScale)
      hairspringBreathGroup.rotation.y = swingPhase * 0.15

      rotorSpinGroup.rotation.y =
        DEFAULT_ROTOR_ANGLE + animElapsed * 0.65 + Math.sin(animElapsed * 1.2) * 0.35

      for (const g of gearMeshes) {
        g.mesh.rotation.y += clampedDt * g.speed
      }
      changed = true
    }

    // 当有部件被选中高亮时，持续更新呼吸描边亮度，保证暂停运转时选中态依然醒目
    if (currentSelected !== null) {
      pulseElapsed += clampedDt
      applyHighlightVisuals()
      changed = true
    }

    return changed
  }

  const resetAnimationPose = () => {
    animElapsed = 0
    pulseElapsed = 0
    balanceSpinGroup.rotation.y = 0
    hairspringBreathGroup.scale.set(1, 1, 1)
    hairspringBreathGroup.rotation.y = 0
    rotorSpinGroup.rotation.y = DEFAULT_ROTOR_ANGLE
    for (const g of gearMeshes) {
      g.mesh.rotation.y = 0
    }
    setState({ explode: currentExplode, shellGhost: currentShellGhost, selectedPart: currentSelected })
  }

  const dispose = () => {
    for (const g of geometries) g.dispose()
    for (const m of materials) m.dispose()
    allPickables.length = 0
    partGroups.clear()
    partMeshes.clear()
  }

  setState({ explode: 0, shellGhost: 0, selectedPart: null })

  return {
    root,
    getRaycastTargets,
    setState,
    stepAnimation,
    resetAnimationPose,
    dispose
  }
}
