export type PartId =
  | 'case-overall'
  | 'mid-case'
  | 'crystal'
  | 'case-back'
  | 'crown'
  | 'strap'
  | 'movement'
  | 'rotor'
  | 'balance-wheel'
  | 'hairspring'

export type ViewMode = 'assembled' | 'exploded' | 'movement'

export interface WatchPartInfo {
  id: PartId
  name: string
  alias: string
  category: 'exterior' | 'interior'
  categoryLabel: string
  anchor: string
  summary: string
  relationNote: string
  businessTip: string
  /** 聚焦该部件时的推荐相机位置与观察目标（相对于当前展开状态微调） */
  focusCamera: {
    position: [number, number, number]
    target: [number, number, number]
    preferMode?: ViewMode
  }
}

export const WATCH_PARTS: WatchPartInfo[] = [
  {
    id: 'case-overall',
    name: '表壳整体',
    alias: '表壳总成 / 壳体',
    category: 'exterior',
    categoryLabel: '外部结构（整体概念）',
    anchor: '#part-case-overall',
    summary:
      '表壳是容纳并保护机芯、表盘的外部壳体总成概念，通常由上方的表镜及外圈固定结构、中间的中壳、背面的底盖共同配合密封组成。',
    relationNote:
      '注意区分「表壳整体」与「中壳」：日常说“精钢表壳、玫瑰金表壳”指整个外壳总成；拆解讨论磕碰或打磨部位时，则细分为中壳、表圈、底盖等具体零件。',
    businessTip:
      '二手评估时整体观察壳形线条是否饱满对称、倒角与拉丝工艺是否一致，判断是否存在重度抛光翻新。',
    focusCamera: {
      position: [3.2, 2.35, 3.35],
      target: [0, 0.05, 0]
    }
  },
  {
    id: 'mid-case',
    name: '中壳',
    alias: '中层表壳（含一体表耳）',
    category: 'exterior',
    categoryLabel: '外部结构',
    anchor: '#part-mid-case',
    summary:
      '表壳的主体骨架，内部车削出容纳机芯的腔体，向上承接表镜（及表圈），向下锁合底盖，右侧开孔安装表冠，上下延伸出连接表带的四只表耳。',
    relationNote:
      '中壳属于「表壳整体」的核心承重部件；多数现代腕表的表耳与中壳一体成型。',
    businessTip:
      '中壳侧面与表耳棱线最易在日常佩戴中留下划痕或磕印，也是查验壳号刻印（视品牌年代而定）与翻新痕迹的重点区域。',
    focusCamera: {
      position: [3.1, 1.65, 2.9],
      target: [0, 0.15, 0]
    }
  },
  {
    id: 'crystal',
    name: '表镜',
    alias: '表蒙 / 蓝宝石镜面',
    category: 'exterior',
    categoryLabel: '外部结构',
    anchor: '#part-crystal',
    summary:
      '装配在腕表正上方、紧密封合于表壳前侧的透明防护片，既保证清晰读时，又阻隔灰尘与水汽进入盘面和机芯。',
    relationNote:
      '现代高端机械腕表普遍采用合成蓝宝石水晶玻璃表镜，借助密封圈压入并固定在表壳上口。',
    businessTip:
      '蓝宝石表镜硬度高、耐磨但具脆性，受硬物撞击易在边缘产生细微“崩口”；查验时需侧光或借助放大镜沿表镜外缘一圈仔细检视。',
    focusCamera: {
      position: [2.2, 2.9, 2.5],
      target: [0, 0.35, 0]
    }
  },
  {
    id: 'case-back',
    name: '底盖',
    alias: '后盖 / 表背',
    category: 'exterior',
    categoryLabel: '外部结构',
    anchor: '#part-case-back',
    summary:
      '封闭表壳背面的盖板部件，按透光性分为全金属封闭的「密底」与镶嵌蓝宝石玻璃的「背透（透底）」两类，常见旋入式、螺丝固定式或压入式锁紧。',
    relationNote:
      '本教学模型采用背透式底盖示意，以便直接从背面观察内部的自动陀、机芯夹板、摆轮与游丝。',
    businessTip:
      '底盖外圈常刻有品牌标识、贵金属印记或编号，开盖槽口与螺丝口是否有滑牙划伤，是判断腕表是否被非规范拆修的重要线索。',
    focusCamera: {
      position: [2.4, -2.55, 2.6],
      target: [0, -0.35, 0]
    }
  },
  {
    id: 'crown',
    name: '表冠',
    alias: '把头',
    category: 'exterior',
    categoryLabel: '外部结构',
    anchor: '#part-crown',
    summary:
      '位于中壳外侧（最常见于 3 点位）、表面带有防滑坑纹的旋钮部件，通过内部的把芯（上链柄轴）伸入机芯，承担手动上链及拔出挡位调校日历、时间的功能。',
    relationNote:
      '表冠连接外部操作与内部机芯，是表壳防水结构的关键通道，运动款常配旋入式锁把设计。',
    businessTip:
      '实操时感受上链手感是否顺滑、拔挡是否清晰；若为旋入式表冠，调校完毕务必轻压旋紧，否则极易导致日常进水受潮。',
    focusCamera: {
      position: [3.2, 1.35, 1.9],
      target: [1.35, 0.02, 0]
    }
  },
  {
    id: 'strap',
    name: '表带',
    alias: '链带 / 胶带 / 皮带（含表扣）',
    category: 'exterior',
    categoryLabel: '外部结构',
    anchor: '#part-strap',
    summary:
      '通过生耳（弹簧栓）或专用螺丝固定在中壳上下表耳之间，配合表扣将腕表稳固佩戴于手腕的部件，常见金属链带、硫化橡胶带、鳄鱼皮/小牛皮带等材质。',
    relationNote:
      '在业务表述中，不含表带的主体部分常称作「表头」；同一基础型号搭配不同表带往往构成不同的官方配置或编码后缀。',
    businessTip:
      '二手流通中需核对金属链带的节数长短与松旷度、皮带/胶带是否为原装及老化程度，以及表扣开合弹力与贵金属印记。',
    focusCamera: {
      position: [3.5, 2.2, 3.4],
      target: [0, 0, 0.3]
    }
  },
  {
    id: 'movement',
    name: '机芯',
    alias: '内芯 / Calibre',
    category: 'interior',
    categoryLabel: '内部核心',
    anchor: '#part-movement',
    summary:
      '腕表的动力储存、齿轮传动与走时控制总成。机械机芯主要由主夹板、各功能桥板、发条盒（储存能量）、传动轮系及擒纵调速机构共同构成。',
    relationNote:
      '按上链方式分为「手动上链机芯」与加装了自动陀组件的「自动上链机芯」；本模型展示其核心骨架层次，省略了完整齿牙啮合细节。',
    businessTip:
      '透过背透观察夹板倒角打磨、红宝石轴承与螺丝状态是否干净无锈蚀，结合校表仪数据判断走时日差、摆幅与偏振是否健康。',
    focusCamera: {
      position: [1.85, 1.85, 2.05],
      target: [0, 0, 0],
      preferMode: 'movement'
    }
  },
  {
    id: 'rotor',
    name: '自动陀',
    alias: '摆陀 / 自动锤',
    category: 'interior',
    categoryLabel: '内部核心',
    anchor: '#part-rotor',
    summary:
      '自动上链机械表特有的偏心重锤部件（最常见为中央安装的半圆形重锤，也有珍珠陀或边缘陀），利用佩戴者手腕日常活动产生的重力偏转绕轴旋转，把动能传递给发条盒自动上弦。',
    relationNote:
      '手动上链机芯没有自动陀，因此背面视野通常更通透；自动陀外缘常采用K金、铂金或钨合金等高密度金属以提升上链效率。',
    businessTip:
      '轻轻晃动腕表时留意自动陀转动是否顺畅、轴承有无异常刮擦声（蹭夹板或蹭底盖），这直接关系到自动上链效率与机芯磨损。',
    focusCamera: {
      position: [1.75, -2.15, 1.85],
      target: [0, -0.2, 0]
    }
  },
  {
    id: 'balance-wheel',
    name: '摆轮',
    alias: '摆轮组件',
    category: 'interior',
    categoryLabel: '内部核心',
    anchor: '#part-balance-wheel',
    summary:
      '机芯调速机构中的环形飞轮部件，在擒纵机构推动与游丝牵引下围绕摆轴高速往复摆动（常见每小时摆动 21,600 次或 28,800 次），把发条能量切割成均匀的时间单位。',
    relationNote:
      '摆轮与游丝共同构成机械表的“心脏”；贴耳听到的规律“滴答”声，就源于摆轮往复摆动时擒纵叉与擒纵轮的周期性锁放。',
    businessTip:
      '机芯正常运转时摆轮应呈现有力、平稳的大角度往复摆动；若肉眼可见摆幅明显萎靡或一碰即停，通常提示动力不足或需要洗油保养。',
    focusCamera: {
      position: [-1.15, 1.25, 1.55],
      target: [-0.38, -0.04, 0.52],
      preferMode: 'movement'
    }
  },
  {
    id: 'hairspring',
    name: '游丝',
    alias: '摆轮游丝（金属游丝 / 硅游丝）',
    category: 'interior',
    categoryLabel: '内部核心',
    anchor: '#part-hairspring',
    summary:
      '盘绕在摆轮轴心上的极细阿基米德螺旋弹性簧片，内端固定于摆轴、外端固定于摆轮夹板外桩。摆轮每偏转一次，游丝便同心收紧与舒张一次，像呼吸一样决定振荡等时性。',
    relationNote:
      '游丝极度纤细娇贵，易受强磁场、剧烈撞击影响；现代高端腕表常采用抗磁合金游丝（如劳力士蓝铌游丝）或硅材质游丝（如百达翡丽 Spiromax）。',
    businessTip:
      '腕表若突然出现每天快几分钟甚至几十分钟，最常见原因之一就是游丝受磁粘连变形，通常需先消磁再复测走时。',
    focusCamera: {
      position: [-0.92, 1.05, 1.22],
      target: [-0.38, -0.02, 0.52],
      preferMode: 'movement'
    }
  }
]

export const WATCH_PARTS_MAP: Record<PartId, WatchPartInfo> = Object.fromEntries(
  WATCH_PARTS.map((p) => [p.id, p])
) as Record<PartId, WatchPartInfo>

/** 「表壳整体」在三维模型中对应高亮的组成部件集合 */
export const CASE_OVERALL_SUBPARTS: PartId[] = ['mid-case', 'crystal', 'case-back']
