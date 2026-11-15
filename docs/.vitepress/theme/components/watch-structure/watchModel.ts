import type * as THREEType from 'three'
import { CASE_OVERALL_SUBPARTS, type PartId } from './partsData'

export type PhysicalPartId = Exclude<PartId, 'case-overall'>

const SHELL_PARTS: Set<PhysicalPartId> = new Set(['crystal', 'mid-case', 'case-back', 'strap'])

interface BaseMatState {
  colorHex: number
  opacity: number
  transparent: boolean
  depthWrite: boolean
}

export interface WatchTeachingModel {
  root: THREEType.Group
  getRaycastTargets: () => THREEType.Object3D[]
  setState: (opts: {
    explode: number
    shellGhost: number
    selectedPart: PartId | null
  }) => void
  stepAnimation: (dt: number) => void
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
        depthWrite: mat.depthWrite
      }
      mesh.userData.baseMat = baseState
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

  // =========================================================================
  // 1. 中壳 (mid-case)：环形主体 + 斜面表圈口 + 四只一体表耳 + 把管护肩
  // =========================================================================
  const midCaseGroup = initPartGroup('mid-case')
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

  // 车削环形中壳与上表圈轮廓
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

  // 抛光表圈倒角亮边
  const bezelHighlight = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.31, 0.032, 16, 64)),
    steelPolishedMat()
  )
  bezelHighlight.rotation.x = Math.PI / 2
  bezelHighlight.position.y = 0.285
  registerMesh('mid-case', bezelHighlight)
  midCaseGroup.add(bezelHighlight)

  // 四只表耳（12点与6点方向各一对，略向下弯曲贴合手腕）
  const lugShape = new THREE.Shape()
  lugShape.moveTo(-0.14, 0)
  lugShape.lineTo(0.14, 0)
  lugShape.lineTo(0.095, 0.68)
  lugShape.quadraticCurveTo(0.07, 0.76, 0.0, 0.76)
  lugShape.quadraticCurveTo(-0.07, 0.76, -0.095, 0.68)
  lugShape.closePath()

  const lugGeo = trackGeo(
    new THREE.ExtrudeGeometry(lugShape, {
      depth: 0.26,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.022,
      bevelThickness: 0.022
    })
  )
  lugGeo.translate(0, 0, -0.13)

  for (const zDir of [1, -1] as const) {
    const lugPairHolder = new THREE.Group()
    lugPairHolder.rotation.y = zDir === 1 ? 0 : Math.PI
    for (const x of [-0.86, 0.86]) {
      const lug = new THREE.Mesh(lugGeo, steelBrushedMat())
      lug.rotation.x = Math.PI / 2 + 0.12
      lug.position.set(x, 0.02, 1.32)
      registerMesh('mid-case', lug)
      lugPairHolder.add(lug)
    }
    midCaseGroup.add(lugPairHolder)
  }

  // 3点位把管座（连接表冠处）
  const crownTube = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.2, 24)),
    steelPolishedMat()
  )
  crownTube.rotation.z = Math.PI / 2
  crownTube.position.set(1.55, 0.01, 0)
  registerMesh('mid-case', crownTube)
  midCaseGroup.add(crownTube)

  // =========================================================================
  // 2. 表镜 (crystal)：微拱蓝宝石玻璃 + 边缘淡蓝倒角圈（保证透明且清晰可辨）
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

  // 表镜边缘密封衬圈与光学折射高光环（方便识别与点击边缘）
  const crystalRim = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.195, 0.022, 14, 64)),
    createPartMat({
      color: 0x93c5fd,
      metalness: 0.25,
      roughness: 0.18,
      transparent: true,
      opacity: 0.72
    })
  )
  crystalRim.rotation.x = Math.PI / 2
  registerMesh('crystal', crystalRim)
  crystalGroup.add(crystalRim)

  // =========================================================================
  // 3. 底盖 (case-back)：旋入式背透金属外圈（含开盖凹槽）+ 背透蓝宝石镜片
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

  // 6个旋入式开盖槽口标识块
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

  // 背透玻璃窗
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
  // 4. 表冠 (crown)：防滑坑纹旋钮 + 内部上链把芯（柄轴）
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

  // 表冠端面微拱圆帽
  const crownCap = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.19, 0.23, 0.045, 32)),
    steelBrushedMat()
  )
  crownCap.rotation.z = -Math.PI / 2
  crownCap.position.x = 0.265
  registerMesh('crown', crownCap)
  crownGroup.add(crownCap)

  // 18道表冠防滑坑纹棱条
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

  // 把芯（上链柄轴，展开时清晰看到表冠如何伸入机芯）
  const windingStem = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.042, 0.042, 0.62, 16)),
    createPartMat({ color: 0x94a3b8, metalness: 0.85, roughness: 0.22 })
  )
  windingStem.rotation.z = Math.PI / 2
  windingStem.position.x = -0.26
  registerMesh('crown', windingStem)
  crownGroup.add(windingStem)

  // 隐形点击热区放大（手机端手指轻松点中表冠）
  const crownHitProxy = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.34, 12, 12)),
    new THREE.MeshBasicMaterial({ visible: false })
  )
  crownHitProxy.position.x = 0.12
  registerMesh('crown', crownHitProxy, true)
  crownGroup.add(crownHitProxy)

  // =========================================================================
  // 5. 表带 (strap)：上下两端弧形多节渐变表带 + 生耳栓 + 针扣示意
  // =========================================================================
  const strapGroup = initPartGroup('strap')
  const strapTopSub = new THREE.Group()
  const strapBottomSub = new THREE.Group()
  strapGroup.add(strapTopSub, strapBottomSub)

  const strapRubberMat = () =>
    createPartMat({
      color: 0x1e293b,
      metalness: 0.15,
      roughness: 0.62
    })
  const strapAccentMat = () =>
    createPartMat({
      color: 0x334155,
      metalness: 0.22,
      roughness: 0.48
    })

  const buildStrapHalf = (targetGroup: THREEType.Group, zDir: 1 | -1, withBuckle: boolean) => {
    // 生耳连接端头
    const springBar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 1.72, 16)),
      steelPolishedMat()
    )
    springBar.rotation.z = Math.PI / 2
    springBar.position.set(0, -0.02, zDir * 1.72)
    registerMesh('strap', springBar)
    targetGroup.add(springBar)

    // 4段沿手腕自然下弯的渐缩表带节块
    const segments = [
      { w: 1.5, len: 0.42, thick: 0.16, y: -0.03, zOff: 1.88, tilt: 0.08 },
      { w: 1.4, len: 0.46, thick: 0.145, y: -0.1, zOff: 2.31, tilt: 0.2 },
      { w: 1.3, len: 0.48, thick: 0.13, y: -0.23, zOff: 2.75, tilt: 0.32 },
      { w: 1.2, len: 0.46, thick: 0.115, y: -0.4, zOff: 3.17, tilt: 0.44 }
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

      // 表面纵向运动凹槽压纹条，提升表带质感与辨识度
      const groove = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(seg.w * 0.56, seg.thick + 0.014, seg.len * 0.82)),
        strapAccentMat()
      )
      groove.position.copy(block.position)
      groove.rotation.copy(block.rotation)
      registerMesh('strap', groove)
      targetGroup.add(groove)

      // 6点方向末节调节孔示意
      if (!withBuckle && idx >= 2) {
        const holeDot = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(0.045, 0.045, seg.thick + 0.02, 12)),
          createPartMat({ color: 0x0f172a, metalness: 0.1, roughness: 0.9 })
        )
        holeDot.position.copy(block.position)
        holeDot.rotation.copy(block.rotation)
        registerMesh('strap', holeDot)
        targetGroup.add(holeDot)
      }
    })

    // 12点方向针扣金属外框示意
    if (withBuckle) {
      const buckleFrame = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(0.46, 0.055, 12, 24)),
        steelPolishedMat()
      )
      buckleFrame.scale.set(1.45, 0.62, 1)
      buckleFrame.rotation.x = -Math.PI / 2 - 0.44
      buckleFrame.position.set(0, -0.52, zDir * 3.45)
      registerMesh('strap', buckleFrame)
      targetGroup.add(buckleFrame)
    }
  }

  buildStrapHalf(strapTopSub, -1, true)
  buildStrapHalf(strapBottomSub, 1, false)

  // =========================================================================
  // 6. 机芯 (movement)：镂空窗口主夹板 + 发条盒 + 传动齿轮系 + 桥板/红宝石 + 镂空刻度指针圈
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

  // 带摆轮镂空视窗（位于 x=-0.38, z=+0.52）的主夹板
  const mainplateShape = new THREE.Shape()
  mainplateShape.absarc(0, 0, 1.18, 0, Math.PI * 2, false)
  const balanceCutout = new THREE.Path()
  // Shape在XY平面，extrude后旋转 X=-PI/2，使得 shape(x, y) -> world(x, -z)
  // 目标世界坐标 (x=-0.38, z=+0.52) 对应 shape(x=-0.38, y=-0.52)
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

  // 发条盒（1-2点位银灰拉丝圆鼓，标注储能核心）
  const barrel = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.13, 36)),
    createPartMat({ color: 0xcbd5e1, metalness: 0.82, roughness: 0.25 })
  )
  barrel.position.set(0.36, 0.01, -0.36)
  registerMesh('movement', barrel)
  movementGroup.add(barrel)

  // 传动轮系（3枚金色辐条齿轮，运转时缓慢联动）
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

  // 背面夹板桥板 + 红宝石轴承 + 蓝钢螺丝（提升机芯立体层次）
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

  // 红宝石轴承与蓝钢螺丝点缀
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

  // 正面镂空刻度外圈与指针示意（明确正面读时朝向，且不遮挡机芯内部）
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
      // 12点位双条刻度，帮助快速辨认正上方12点方向
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

  // 时针与分针（经典10点10分张角，避开7点位摆轮视窗）
  const hourHand = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.055, 0.018, 0.62)),
    steelPolishedMat()
  )
  hourHand.geometry.translate(0, 0, -0.24)
  hourHand.position.set(0, 0.125, 0)
  hourHand.rotation.y = (Math.PI / 6) * 2 // 10点方向
  registerMesh('movement', hourHand)
  movementGroup.add(hourHand)

  const minuteHand = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.04, 0.018, 0.92)),
    steelPolishedMat()
  )
  minuteHand.geometry.translate(0, 0, -0.38)
  minuteHand.position.set(0, 0.145, 0)
  minuteHand.rotation.y = -(Math.PI / 6) * 2 // 2点方向
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
  // 7. 摆轮 (balance-wheel)：7点位镂空窗金色往复飞轮 + 砝码钉 + 摆轮夹板
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

  // 摆轮外圈
  const balanceRim = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.31, 0.032, 16, 48)),
    goldBalanceMat()
  )
  balanceRim.rotation.x = Math.PI / 2
  registerMesh('balance-wheel', balanceRim)
  balanceSpinGroup.add(balanceRim)

  // 3根摆轮辐条
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

  // 8枚惯性调校砝码微钉（典型高端无卡度摆轮特征）
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

  // 摆轴与摆轮夹板横桥
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

  // 环形无重叠点击热区（外圈点中摆轮，内圈留给游丝，手机点击互不干扰）
  const balanceHitRing = new THREE.Mesh(
    trackGeo(new THREE.RingGeometry(0.185, 0.37, 32)),
    new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })
  )
  balanceHitRing.rotation.x = -Math.PI / 2
  registerMesh('balance-wheel', balanceHitRing, true)
  balanceGroup.add(balanceHitRing)

  // =========================================================================
  // 8. 游丝 (hairspring)：同轴阿基米德螺旋细簧，呼吸式收放动画
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

  // 生成 4.25 圈阿基米德螺旋曲线管道
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

  // 游丝内桩圆环（Collet）与外桩固定块（Stud）
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

  // 游丝中心圆形热区（半径 <= 0.18，与摆轮外圈热区严格无重叠）
  const hairspringHitDisk = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 24)),
    new THREE.MeshBasicMaterial({ visible: false })
  )
  registerMesh('hairspring', hairspringHitDisk, true)
  hairspringGroup.add(hairspringHitDisk)

  // =========================================================================
  // 9. 自动陀 (rotor)：背面中央轴承 + 半圆形镂空偏心重锤 + 玫瑰金配重外弧
  // =========================================================================
  const rotorGroup = initPartGroup('rotor')
  const rotorSpinGroup = new THREE.Group()
  // 默认停靠角度朝向 12-1 点位，完全避开 7 点位摆轮游丝，保证正反面都不遮挡
  const DEFAULT_ROTOR_ANGLE = -Math.PI * 0.42
  rotorSpinGroup.rotation.y = DEFAULT_ROTOR_ANGLE
  rotorGroup.add(rotorSpinGroup)

  // 半圆形镂空陀身（外径 1.08，内有两扇镂空减重窗，使重心集中在外缘）
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

  // 外缘高密度玫瑰金配重弧边（直观体现“偏心重锤”物理特征）
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

  // 中央滚珠轴承毂与陶瓷滚珠点缀
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
  // 展开插值、外壳透视与部件高亮状态控制
  // =========================================================================
  let currentShellGhost = 0
  let currentSelected: PartId | null = null
  let animElapsed = 0

  const highlightEmissive = new THREE.Color(0x2563eb)
  const zeroColor = new THREE.Color(0x000000)
  const dimScratchColor = new THREE.Color()
  const dimTargetColor = new THREE.Color(0x475569)

  const setState = (opts: {
    explode: number
    shellGhost: number
    selectedPart: PartId | null
  }) => {
    const t = THREE.MathUtils.clamp(opts.explode, 0, 1)
    currentShellGhost = THREE.MathUtils.clamp(opts.shellGhost, 0, 1)
    currentSelected = opts.selectedPart

    // 1) 按真实装配层次进行轴向与径向爆炸插值
    crystalGroup.position.set(0, THREE.MathUtils.lerp(0.28, 1.85, t), 0)
    midCaseGroup.position.set(0, THREE.MathUtils.lerp(0, 0.85, t), 0)

    strapGroup.position.set(0, THREE.MathUtils.lerp(0, 0.85, t), 0)
    strapTopSub.position.set(0, 0, THREE.MathUtils.lerp(0, -0.82, t))
    strapBottomSub.position.set(0, 0, THREE.MathUtils.lerp(0, 0.82, t))

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

    // 2) 计算高亮集合与外壳虚化透明度
    const activeSet = new Set<PhysicalPartId>()
    if (currentSelected === 'case-overall') {
      for (const sub of CASE_OVERALL_SUBPARTS) {
        if (sub !== 'case-overall') activeSet.add(sub)
      }
    } else if (currentSelected) {
      activeSet.add(currentSelected)
    }

    const hasSelection = activeSet.size > 0

    for (const [partId, meshes] of partMeshes.entries()) {
      const isSelected = activeSet.has(partId)
      const isShell = SHELL_PARTS.has(partId)
      // 若正在观察机芯局部放大，且该外壳部件未被主动选中，则虚化外壳避免遮挡
      const ghostAmount = isShell && !isSelected ? currentShellGhost : 0

      for (const mesh of meshes) {
        const mat = mesh.material as THREEType.MeshStandardMaterial
        const base = mesh.userData.baseMat as BaseMatState

        dimScratchColor.setHex(base.colorHex)
        if (hasSelection && !isSelected) {
          dimScratchColor.lerp(dimTargetColor, 0.35)
        }
        mat.color.copy(dimScratchColor)

        if (isSelected) {
          mat.emissive.copy(highlightEmissive)
          mat.emissiveIntensity = base.transparent ? 0.55 : 0.38
        } else {
          mat.emissive.copy(zeroColor)
          mat.emissiveIntensity = 0
        }

        let targetOpacity = base.opacity
        if (isSelected && base.transparent) {
          // 选中表镜等透明件时适度提高不透明度，让轮廓清晰可见
          targetOpacity = Math.max(base.opacity, 0.56)
        } else if (ghostAmount > 0.01) {
          targetOpacity = THREE.MathUtils.lerp(base.opacity, 0.07, ghostAmount)
        } else if (hasSelection && !isSelected && !base.transparent) {
          targetOpacity = 0.88
        }

        const shouldBeTransparent =
          base.transparent || ghostAmount > 0.01 || (hasSelection && !isSelected)
        const nextDepthWrite = ghostAmount > 0.2 ? false : base.depthWrite

        if (mat.transparent !== shouldBeTransparent || mat.depthWrite !== nextDepthWrite) {
          mat.transparent = shouldBeTransparent
          mat.depthWrite = nextDepthWrite
          mat.needsUpdate = true
        }
        mat.opacity = targetOpacity
      }
    }
  }

  const getRaycastTargets = (): THREEType.Object3D[] => {
    // 机芯局部放大模式下外壳虚化时，跳过外壳拾取，使手指可直接点选内部机芯、摆轮与游丝
    if (currentShellGhost > 0.5) {
      return allPickables.filter((m) => !SHELL_PARTS.has(m.userData.partId))
    }
    return allPickables
  }

  const stepAnimation = (dt: number) => {
    animElapsed += Math.min(dt, 0.05)

    // 摆轮规律往复摆动（约 0.85 Hz 教学节奏，肉眼可清晰观察摆幅与转向）
    const swingPhase = Math.sin(animElapsed * 5.3)
    balanceSpinGroup.rotation.y = swingPhase * 0.68

    // 游丝随摆轮同相呼吸收放与微扭转
    const breathScale = 1 + swingPhase * 0.09
    hairspringBreathGroup.scale.set(breathScale, 1, breathScale)
    hairspringBreathGroup.rotation.y = swingPhase * 0.15

    // 自动陀连续平顺偏转上链运动
    rotorSpinGroup.rotation.y =
      DEFAULT_ROTOR_ANGLE + animElapsed * 0.65 + Math.sin(animElapsed * 1.2) * 0.35

    // 传动轮系缓慢联动示意
    for (const g of gearMeshes) {
      g.mesh.rotation.y += dt * g.speed
    }
  }

  const resetAnimationPose = () => {
    animElapsed = 0
    balanceSpinGroup.rotation.y = 0
    hairspringBreathGroup.scale.set(1, 1, 1)
    hairspringBreathGroup.rotation.y = 0
    rotorSpinGroup.rotation.y = DEFAULT_ROTOR_ANGLE
    for (const g of gearMeshes) {
      g.mesh.rotation.y = 0
    }
  }

  const dispose = () => {
    for (const g of geometries) g.dispose()
    for (const m of materials) m.dispose()
    allPickables.length = 0
    partGroups.clear()
    partMeshes.clear()
  }

  // 初始化默认整表姿态
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
