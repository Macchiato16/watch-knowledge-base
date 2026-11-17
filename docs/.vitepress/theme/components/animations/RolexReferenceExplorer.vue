<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

type SegmentKind = 'family' | 'bezelPos' | 'material' | 'suffix' | 'config'
type CategoryKey = 'all' | 'daytona' | 'classic' | 'sport'

interface ReferenceSegment {
  kind: SegmentKind
  code: string
  label: string
  meaning: string
  isEmpty?: boolean
}

interface RolexReferenceCase {
  id: string
  ref: string
  category: Exclude<CategoryKey, 'all'>
  series: string
  tag: string
  subtitle: string
  image?: string
  segments: ReferenceSegment[]
  decodable: string[]
  redLines: string[]
}

const referenceCases: RolexReferenceCase[] = [
  {
    id: '126500ln-0001',
    ref: '126500LN-0001',
    category: 'daytona',
    series: '宇宙计型迪通拿 · 2023 新款钢迪',
    tag: 'Cal. 4131 熊猫迪',
    subtitle: '第 5 位 0 锁定蚝式钢链带，尾位 0 锁定蚝式钢材质，LN 锁定黑陶圈，-0001 锁定白盘',
    image: '/images/general/materials/ceramic/rolex-daytona-126500ln-ceramic.jpg',
    segments: [
      {
        kind: 'family',
        code: '1265',
        label: '① 系列代际段',
        meaning: '`1265xx` 为 2023 年换代 `Cal. 4131` 金属包边陶瓷圈迪通拿（区别于老款 `1165xx`）'
      },
      {
        kind: 'bezelPos',
        code: '0',
        label: '② 壳圈隐藏位',
        meaning: '迪通拿倒数第 2 位 `0` = 原厂配金属链带标准表耳结构（非胶带壳型）'
      },
      {
        kind: 'material',
        code: '0',
        label: '③ 尾位材质码',
        meaning: '全品牌铁律 `0` = 蚝式钢（904L / Oystersteel）表壳与表带'
      },
      {
        kind: 'suffix',
        code: 'LN',
        label: '④ 法语后缀',
        meaning: '*Lunette Noire*（黑色外圈），代表黑色 Cerachrom 陶质测速圈'
      },
      {
        kind: 'config',
        code: '-0001',
        label: '⑤ 配置尾码',
        meaning: '精确锁定「白色熊猫盘 + 黑色小计时圈」（`-0002` 为同款黑盘）'
      }
    ],
    decodable: [
      '100% 锁定为 2023 年起新款 `Cal. 4131` 迪通拿（带金属包边陶瓷圈与背透外圈结构升级，注：钢款仍为密底）',
      '表壳与蚝式表带材质 100% 为蚝式钢（尾位 `0`），第 5 位 `0` 确认为金属链带款',
      '黑色 Cerachrom 陶瓷测速圈（`LN`），区别于老款钢圈 `116520`',
      '完整目录尾码 `-0001` 对应白色熊猫盘（白盘黑圈，市场溢价显著高于黑盘 `-0002`）'
    ],
    redLines: [
      '2020 年起新版深绿 NFC 保卡正面只印 `126500LN`，不印 `-0001` 或盘面文字！白盘与黑盘保卡文字完全一致',
      '谨防黑盘 `-0002` 后换组装白盘冒充原装熊猫迪：必须检查 White Tag 白色吊牌完整码与盘针微距工艺',
      '8 位乱码序列号无法反推出厂年份，准确保修起算日须以 NFC 保卡机读/手写日期为准',
      '必须清点蚝式钢带完整表节数（出厂全长通常为 12 节半/13 节含折叠扣微调），缺节按行情扣减'
    ]
  },
  {
    id: '116518ln-0048',
    ref: '116518LN-0048',
    category: 'daytona',
    series: '宇宙计型迪通拿 · 黄金胶带迪',
    tag: '隐藏位 1 = 胶带壳',
    subtitle: '第 5 位变为 1 立即揭秘：出厂必配 Oysterflex 胶带，表耳带一体固定端头绝不可换装全金链带',
    segments: [
      {
        kind: 'family',
        code: '1165',
        label: '① 系列代际段',
        meaning: '`1165xx` 锁定老款 `Cal. 4130` 世代迪通拿（无金属包边陶瓷圈）'
      },
      {
        kind: 'bezelPos',
        code: '1',
        label: '② 壳圈隐藏位',
        meaning: '迪通拿铁律 `1` = 出厂配 Oysterflex 橡胶带（早期皮带）+ 陶瓷圈专用表耳结构'
      },
      {
        kind: 'material',
        code: '8',
        label: '③ 尾位材质码',
        meaning: '全品牌铁律 `8` = 18K 黄金（Yellow Gold）表壳与黄金折叠扣'
      },
      {
        kind: 'suffix',
        code: 'LN',
        label: '④ 法语后缀',
        meaning: '*Lunette Noire*，代表黑色 Cerachrom 陶质外圈'
      },
      {
        kind: 'config',
        code: '-0048',
        label: '⑤ 配置尾码',
        meaning: '对应特定香槟金盘面配黑色计时副盘（俗称“余文乐”经典盘面配置之一）'
      }
    ],
    decodable: [
      '搭载经典 `Cal. 4130` 自动计时机芯（`1165xx` 世代，区别于 2023 新款 `126518LN`）',
      '倒数第 2 位 `1` 铁律：原厂必定配备 Oysterflex 胶带（或早期皮带）及一体式固定表耳端头，绝非后改胶带，也无法直接安装 `116508` 全金链带',
      '表壳与表扣材质 100% 为 18K 黄金（尾位 `8`），外圈为黑色陶瓷（`LN`）'
    ],
    redLines: [
      '高危改盘重灾区！保卡仅印 `116518LN`，普通黑盘/白盘/香槟盘均可后换“余文乐盘”或“保罗纽曼盘”，必须微距验盘面印刷与夜光填充',
      'Oysterflex 胶带左右两端均有独立尺码字母（`C / D / E / F / G / H`），型号无法读出胶带长短，收表必看两端内侧刻字是否匹配买家手腕',
      '若表主自行配过副厂胶带或非原装端头金属片，须逐一核对表扣内侧贵金属印记'
    ]
  },
  {
    id: '116508-0013',
    ref: '116508-0013',
    category: 'daytona',
    series: '宇宙计型迪通拿 · 全黄金链带',
    tag: '绿金迪溢价红线',
    subtitle: '全金测速圈配全金蚝式带：基础型号 116508 同码下囊括绿盘、黑盘、白盘与香槟盘，价差悬殊',
    image: '/images/general/materials/yellow-gold/rolex-daytona-116508-green-gold.jpg',
    segments: [
      {
        kind: 'family',
        code: '1165',
        label: '① 系列代际段',
        meaning: '`1165xx` 为 `Cal. 4130` 世代迪通拿'
      },
      {
        kind: 'bezelPos',
        code: '0',
        label: '② 壳圈隐藏位',
        meaning: '迪通拿 `0` = 标准金属蚝式链带 + 金属测速圈结构'
      },
      {
        kind: 'material',
        code: '8',
        label: '③ 尾位材质码',
        meaning: '全品牌铁律 `8` = 18K 黄金表壳、黄金外圈与黄金蚝式表带'
      },
      {
        kind: 'suffix',
        code: '(无)',
        label: '④ 法语后缀',
        meaning: '全金属测速外圈无陶瓷/宝石法语字母后缀',
        isEmpty: true
      },
      {
        kind: 'config',
        code: '-0013',
        label: '⑤ 配置尾码',
        meaning: '精确指向标志性「亮绿色太阳纹表盘（绿金迪）」（`-0008` 为香槟盘）'
      }
    ],
    decodable: [
      '100% 锁定为 `Cal. 4130` 世代全 18K 黄金迪通拿，出厂原配 18K 黄金蚝式链带与黄金测速外圈',
      '无陶瓷圈后缀，外圈与表壳为同色 18K 黄金一体质感',
      '完整目录编码 `-0013` 对应官方原装绿色盘面配置'
    ],
    redLines: [
      '全市场最高危“换盘溢价陷阱”之一！保卡仅显示 `116508`，绝不写 `-0013` 或 `Green Dial`',
      '若无原厂白色吊牌（White Tag）或劳服官方核档记录，绝不可仅凭保卡 `116508` 认定为原装绿金迪，必须微距核验绿漆光泽、红圈字体与指针中轴',
      '全金表带克重与节数极值钱，收表必须逐节清点表带节数并检查表耳与表扣打磨变形情况'
    ]
  },
  {
    id: '126506-0002',
    ref: '126506-0002',
    category: 'daytona',
    series: '宇宙计型迪通拿 · 950 铂金冰蓝迪',
    tag: '尾位 6 = 950 铂金',
    subtitle: '2023 新款透底冰蓝迪：尾位 6 全品牌专指 950 铂金，-0002 区分梯形方钻时标与普通条钉盘',
    image: '/images/general/materials/platinum/rolex-daytona-116506-ice-blue.jpg',
    segments: [
      {
        kind: 'family',
        code: '1265',
        label: '① 系列代际段',
        meaning: '`1265xx` 为 2023 新款 `Cal. 4131` 世代（铂金款首次升级蓝宝石透底 + 18K 金摆陀）'
      },
      {
        kind: 'bezelPos',
        code: '0',
        label: '② 壳圈隐藏位',
        meaning: '迪通拿 `0` = 全金属蚝式链带结构（铂金蚝式带）'
      },
      {
        kind: 'material',
        code: '6',
        label: '③ 尾位材质码',
        meaning: '全品牌铁律 `6` = 950 铂金（Platinum）表壳与表带，冰蓝盘为其专属色'
      },
      {
        kind: 'suffix',
        code: '(无)',
        label: '④ 法语后缀',
        meaning: '栗棕色 Cerachrom 陶瓷圈在官方主型号中未附加额外字母后缀（习惯仍统称 `126506`）',
        isEmpty: true
      },
      {
        kind: 'config',
        code: '-0002',
        label: '⑤ 配置尾码',
        meaning: '对应冰蓝盘配「梯形长方形钻石（Baguette）时标」（`-0001` 为普通夜光条钉时标）'
      }
    ],
    decodable: [
      '100% 锁定为 2023 新款 `Cal. 4131` 950 铂金冰蓝迪（区别于老款密底 `116506`）',
      '尾位 `6` 全品牌零例外代表 950 铂金，整表沉重压手感极强，底盖带 `Pt950` 贵金属印记',
      '目录尾码 `-0002` 明确区分梯方钻时标高配版与 `-0001` 条钉版'
    ],
    redLines: [
      '保卡正面同样只印 `126506`，不区分 `-0001` 条钉盘与 `-0002` 梯方钻盘！',
      '严防普通条钉冰蓝迪后改梯方钻盘面，必须通过放大镜核验铂金底座镶嵌工艺与钻石切工',
      '注意 `126506` 标志性的栗棕色陶瓷圈已带铂金包边，若无金属包边则可能是老款 `116506` 混充或换圈'
    ]
  },
  {
    id: '116595rbow-0001',
    ref: '116595RBOW-0001',
    category: 'daytona',
    series: '宇宙计型迪通拿 · 原厂彩虹迪',
    tag: '隐藏位 9 + RBOW',
    subtitle: '隐藏位 9 专指原厂高级宝石镶嵌外圈，尾位 5 为永恒玫瑰金，RBOW 锁定原厂彩虹渐变蓝宝石',
    image: '/images/general/craftsmanship/gem-setting/rainbow-daytona-baguette.jpg',
    segments: [
      {
        kind: 'family',
        code: '1165',
        label: '① 系列代际段',
        meaning: '`1165xx` 为 `Cal. 4130` 世代迪通拿架构'
      },
      {
        kind: 'bezelPos',
        code: '9',
        label: '② 壳圈隐藏位',
        meaning: '迪通拿铁律 `9` = 原厂高级宝石镶嵌外圈殿堂款（区别于素圈 `0` 与胶带 `1`）'
      },
      {
        kind: 'material',
        code: '5',
        label: '③ 尾位材质码',
        meaning: '全品牌铁律 `5` = 18K 永恒玫瑰金（Everose Gold）表壳与蚝式链带'
      },
      {
        kind: 'suffix',
        code: 'RBOW',
        label: '④ 法语/宝石后缀',
        meaning: '*Rainbow*，代表原厂 36 颗长方形切割彩虹渐变蓝宝石外圈'
      },
      {
        kind: 'config',
        code: '-0001',
        label: '⑤ 配置尾码',
        meaning: '对应原厂标准彩虹宝石时标黑盘及表耳护肩镶钻配置'
      }
    ],
    decodable: [
      '100% 锁定为原厂宝石镶嵌殿堂版迪通拿（倒数第 2 位 `9` + `RBOW` 后缀双重印证）',
      '表壳与链带为 18K 永恒玫瑰金（尾位 `5`），搭载 `Cal. 4130` 机芯',
      '可一秒排除拿普通 `116505`（玫瑰金素圈）后改副厂彩虹圈的“假彩虹”——真品型号第 5 位必为 `9` 且带 `RBOW`'
    ],
    redLines: [
      '百万/数百万级高危鉴真对象！除了核对保卡 `116595RBOW`，必须由专业宝石鉴定师微距核验渐变蓝宝石色阶连续性、槽镶金边与表耳/护肩钻石原厂镶爪',
      '盘面存在黑盘、全铺钻盘（Pavé）等极稀缺配置差异，须核对 White Tag 与劳服档案',
      '严禁在未核验机芯号与保卡 NFC 芯片信息前直接打款收表'
    ]
  },
  {
    id: '228238-0004',
    ref: '228238-0004',
    category: 'classic',
    series: '星期日历型 40 · 元首型链带',
    tag: '2 开头 40mm 旗舰',
    subtitle: '2282xx 锁定 40mm 现代 DD，倒数第 2 位 3 为三角坑纹狗牙圈，尾位 8 为 18K 黄金',
    image: '/images/general/materials/rolex-day-date-yellow-gold.jpg',
    segments: [
      {
        kind: 'family',
        code: '2282',
        label: '① 系列代际段',
        meaning: '`2` 开头 `2282xx` = 现代 40 mm 星期日历型（`1282xx` 为 36 mm 款）'
      },
      {
        kind: 'bezelPos',
        code: '3',
        label: '② 壳圈隐藏位',
        meaning: 'DD 外圈铁律 `3` = 标志性三角坑纹外圈（狗牙圈），区别于圆钻圈 `xx834x` 与方钻圈 `xx839x`'
      },
      {
        kind: 'material',
        code: '8',
        label: '③ 尾位材质码',
        meaning: '全品牌铁律 `8` = 18K 黄金表壳与元首型（President）半环形三格链带'
      },
      {
        kind: 'suffix',
        code: '(无)',
        label: '④ 法语后缀',
        meaning: '贵金属三角坑纹圈无字母后缀',
        isEmpty: true
      },
      {
        kind: 'config',
        code: '-0004',
        label: '⑤ 配置尾码',
        meaning: '对应特定盘面与时标组合（如香槟金/斜纹罗马字或条钉盘面配置）'
      }
    ],
    decodable: [
      '100% 锁定为 40 mm 星期日历型（Day-Date 40），搭载 `Cal. 3255` 机芯，标配元首型表带',
      '倒数第 2 位 `3` 确认为原厂三角坑纹外圈（若实物为后改钻圈，对照保卡 `228238` 即可当场拆穿）',
      '尾位 `8` 锁定 18K 黄金材质（DD 全系仅产贵金属，无钢款）'
    ],
    redLines: [
      '保卡只印 `228238`，不体现盘面颜色（绿盘、烟熏绿、黑盘、香槟盘、陨石盘、镶钻刻度等价格差异极大）',
      '元首型 18K 黄金链带极软且易拉长松弛，收表必须检查表带垂坠松垮度与节数完整性',
      '注意区分 `228238`（40 mm）与 `128238`（36 mm）及老款 `218238`（DD II 41 mm，现已停产）'
    ]
  },
  {
    id: '126334-0028',
    ref: '126334-0028',
    category: 'classic',
    series: '日志型 41 · 白色黄金钢',
    tag: '尾位 4 防错重点',
    subtitle: '全品牌最易读错材质码：尾位 4 不是全白金！而是钢壳钢带 + 18K 白金三角坑纹外圈',
    image: '/images/general/craftsmanship/overview/rolex-datejust-116334-fluted-bezel.jpg',
    segments: [
      {
        kind: 'family',
        code: '1263',
        label: '① 系列代际段',
        meaning: '`1263xx` = 41 mm 现代日志型（`1262xx` 为 36 mm 款）'
      },
      {
        kind: 'bezelPos',
        code: '3',
        label: '② 壳圈隐藏位',
        meaning: '日志型 `3` = 三角坑纹外圈（狗牙圈）；若为光圈则为 `0`（如 `126300`）'
      },
      {
        kind: 'material',
        code: '4',
        label: '③ 尾位材质码',
        meaning: '铁律防错 `4` = 白色黄金钢（蚝式钢表壳与表带 + 18K 白金外圈，非全白金 `9`！）'
      },
      {
        kind: 'suffix',
        code: '(无)',
        label: '④ 法语后缀',
        meaning: '金属外圈无字母后缀',
        isEmpty: true
      },
      {
        kind: 'config',
        code: '-0028',
        label: '⑤ 配置尾码',
        meaning: '精确锁定「薄荷绿太阳纹盘 / 纪念型五珠带」或对应盘面+表带组合'
      }
    ],
    decodable: [
      '100% 锁定为 41 mm 现代日志型（Datejust 41），搭载 `Cal. 3235` 机芯',
      '倒数第 2 位 `3` 锁定 18K 白金三角坑纹外圈（区别于光圈 `126300`）',
      '尾位 `4` 锁定为「蚝式钢壳 + 蚝式钢带 + 18K 白金狗牙圈」的白色黄金钢组合，绝非全白金'
    ],
    redLines: [
      '同款 `126334` 既可配纪念型五珠带（Jubilee），也可配蚝式三格板带（Oyster），且薄荷绿、温布尔登绿萝、蓝盘、黑盘行情差异巨大，保卡均只印 `126334`',
      '新入行极易将五珠带钢款与贵金属混淆，或将 `4` 误报价为 18K 全白金（全白金尾位应为 `9`）',
      '须检查狗牙圈棱角是否因过度抛光变圆钝，以及五珠带隐藏/皇冠扣节数'
    ]
  },
  {
    id: '126610lv-0002',
    ref: '126610LV-0002',
    category: 'sport',
    series: '潜航者型 41 · 绿水鬼',
    tag: 'LV 法语绿圈',
    subtitle: '41mm 有历潜航者 + LV（Lunette Verte 绿圈）：-0002 对应 2023 年 MK II 嫩绿微调陶瓷圈',
    image: '/images/general/materials/steel/rolex-submariner-126610ln-steel.jpg',
    segments: [
      {
        kind: 'family',
        code: '1266',
        label: '① 系列代际段',
        meaning: '`12661x` = 41 mm 现代有历潜航者型（老款 40 mm 为 `11661x`；无历为 `124060`）'
      },
      {
        kind: 'bezelPos',
        code: '1',
        label: '② 壳圈隐藏位',
        meaning: '潜航者有历家族固定位 `1` = 60 分钟单向旋转潜水外圈 + 3 点位日历窗'
      },
      {
        kind: 'material',
        code: '0',
        label: '③ 尾位材质码',
        meaning: '全品牌铁律 `0` = 蚝式钢表壳与蚝式表带'
      },
      {
        kind: 'suffix',
        code: 'LV',
        label: '④ 法语后缀',
        meaning: '*Lunette Verte*（绿色外圈），锁定绿色 Cerachrom 陶瓷旋转外圈'
      },
      {
        kind: 'config',
        code: '-0002',
        label: '⑤ 配置尾码',
        meaning: '黑盘配 41 mm 蚝式钢带（`-0002` 对应 MK II 调亮黄绿色圈版本，`-0001` 为早期深绿 MK I）'
      }
    ],
    decodable: [
      '100% 锁定为 41 mm 现代有历绿水鬼（搭载 `Cal. 3235` 机芯，区别于老款 40 mm 绿盘绿圈 `116610LV`）',
      '尾位 `0` 确认为蚝式钢壳带，后缀 `LV` 确认为原厂绿色陶瓷圈',
      '与黑水鬼 `126610LN` 仅差最后一位字母后缀（`LV` 绿 vs `LN` 黑）'
    ],
    redLines: [
      '严防拿普通黑水鬼 `126610LN` 私自更换副厂或原厂绿色陶瓷圈冒充绿水鬼！保卡 NFC 芯片与卡面型号必须核实为 `126610LV`',
      'MK I（偏深冷绿）与 MK II（2023 年后偏黄亮绿）在保卡上均只写 `126610LV`，需看保卡日期与陶瓷圈实色',
      '41 mm 潜航者配备 Glidelock 延展表扣，收表必检弹簧延展滑轨是否顺滑卡滞'
    ]
  },
  {
    id: '126720vtnr-0001',
    ref: '126720VTNR-0001',
    category: 'sport',
    series: '格林尼治型 II · 左手雪碧圈',
    tag: '隐藏位 2 = 左撇子',
    subtitle: '倒数第 2 位破例变为 2！专指表冠与日历窗移至左侧 9 点位，VTNR 为绿黑双色陶瓷圈',
    image: '/images/general/functions/dual-time/rolex-gmt-master-ii-blro.jpg',
    segments: [
      {
        kind: 'family',
        code: '1267',
        label: '① 系列代际段',
        meaning: '`1267xx` = 现代 40 mm 格林尼治型 II（`Cal. 3285` 双时区机芯）'
      },
      {
        kind: 'bezelPos',
        code: '2',
        label: '② 壳圈隐藏位',
        meaning: 'GMT-II 专属隐藏位 `2` = 左撇子构型（表冠与小窗凸透镜日历移至左侧 9 点位，常规款为 `1`）'
      },
      {
        kind: 'material',
        code: '0',
        label: '③ 尾位材质码',
        meaning: '全品牌铁律 `0` = 蚝式钢表壳与表带'
      },
      {
        kind: 'suffix',
        code: 'VTNR',
        label: '④ 法语后缀',
        meaning: '*Vert / Noir*（绿 / 黑），代表上半圈绿色、下半圈黑色双色 Cerachrom 陶瓷圈'
      },
      {
        kind: 'config',
        code: '-0001',
        label: '⑤ 配置尾码',
        meaning: '对应「蚝式三格板带」配置（`-0002` 为纪念型五珠带配置）'
      }
    ],
    decodable: [
      '100% 锁定为“左手雪碧圈”格林尼治型 II：倒数第 2 位 `2` 明确区分于右手款 `126710`',
      '尾位 `0` 锁定蚝式钢材质，`VTNR` 锁定绿黑双色 24 小时旋转陶瓷圈',
      '尾码 `-0001` 对应蚝式板带（`-0002` 对应五珠带）'
    ],
    redLines: [
      '保卡正面只写 `126720VTNR`，不写配五珠带还是蚝式板带！两种表带二级市场行情有差价',
      '部分买家习惯将表带拆换，收表需确认当前配带类型是否影响整表原装配置与节数',
      '双色一体成型陶瓷圈的绿黑交界处（6 点与 18 点刻度位）须微距检查过渡自然度，防后换拼色圈'
    ]
  },
  {
    id: '126655-0002',
    ref: '126655-0002',
    category: 'sport',
    series: '游艇名仕型 40 · 玫瑰金胶带',
    tag: '哑光黑陶 + Oysterflex',
    subtitle: '游艇 40mm 运动贵金属主力：12665x 锁定玫瑰金胶带架构，尾位 5 为 18K 永恒玫瑰金',
    image: '/images/brands/rolex/overview/rolex-yacht-master-126655.jpg',
    segments: [
      {
        kind: 'family',
        code: '1266',
        label: '① 系列代际段',
        meaning: '`1266xx` 家族平台（游艇 `126655` 40mm / `226659` 42mm / `126622` 铂金钢）'
      },
      {
        kind: 'bezelPos',
        code: '5',
        label: '② 壳圈隐藏位',
        meaning: '游艇专属位 `5` = 哑光黑色 Cerachrom 陶瓷立体数字外圈 + Oysterflex 橡胶带架构'
      },
      {
        kind: 'material',
        code: '5',
        label: '③ 尾位材质码',
        meaning: '全品牌铁律 `5` = 18K 永恒玫瑰金（Everose Gold）表壳与表扣'
      },
      {
        kind: 'suffix',
        code: '(无)',
        label: '④ 法语后缀',
        meaning: '哑光黑陶数字圈在游艇型号中不另加 `LN` 字母后缀',
        isEmpty: true
      },
      {
        kind: 'config',
        code: '-0002',
        label: '⑤ 配置尾码',
        meaning: '对应黑盘（哑光黑盘或亮黑盘配置；镶钻满天星盘另有专属尾码）'
      }
    ],
    decodable: [
      '100% 锁定为 40 mm 游艇名仕型（`Cal. 3235` 机芯，区别于老款 `116655` 与 42 mm 白金款 `226659`）',
      '尾位 `5` 锁定 18K 永恒玫瑰金表壳及玫瑰金保险扣，出厂标配哑光黑陶瓷双向旋转圈与 Oysterflex 胶带'
    ],
    redLines: [
      'Oysterflex 橡胶带两端尺码字母（`C–H`）无法从型号读出，收表必须现场核对两端内侧尺码与表扣延展槽位置',
      '老款 `116655`（`Cal. 3135` 动储 48h，6 点位无小皇冠）与新款 `126655`（`Cal. 3235` 动储 70h，6 点位带小皇冠）外观极似，必须看准第 1 位 `1` vs `2`（第二位 `1` vs `2`：`116655` vs `126655`）',
      '存在原厂满天星密镶钻盘版本，保卡同样仅印 `126655`，务必防后镶钻！'
    ]
  }
]

const categoryOptions: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: '全部 (10)' },
  { key: 'daytona', label: '迪通拿 (5)' },
  { key: 'classic', label: '日志 & DD (2)' },
  { key: 'sport', label: '运动热门款 (3)' }
]

const selectedCategory = ref<CategoryKey>('all')
const searchQuery = ref('')
const selectedId = ref<string>(referenceCases[0].id)

const filteredCases = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return referenceCases.filter((item) => {
    const matchCat = selectedCategory.value === 'all' || item.category === selectedCategory.value
    if (!matchCat) return false
    if (!q) return true
    const haystack = `${item.ref} ${item.series} ${item.tag} ${item.subtitle}`.toLowerCase()
    return haystack.includes(q)
  })
})

const currentCase = computed(() => {
  const foundInFiltered = filteredCases.value.find((item) => item.id === selectedId.value)
  if (foundInFiltered) return foundInFiltered
  if (filteredCases.value.length > 0) return filteredCases.value[0]
  return referenceCases.find((item) => item.id === selectedId.value) ?? referenceCases[0]
})

// 即时语法快解：当用户输入任意型号（即便不在预设列表）时，尝试解析尾位材质码与法语外圈后缀
const materialMap: Record<string, string> = {
  '0': '蚝式钢（Oystersteel）',
  '1': '永恒玫瑰金钢（钢 + 18K 玫瑰金）',
  '2': '铂金钢（Rolesium：钢壳 + 950 铂金圈）',
  '3': '黄金钢（钢 + 18K 黄金）',
  '4': '白色黄金钢（钢壳钢带 + 18K 白金圈，非全白金！）',
  '5': '18K 永恒玫瑰金',
  '6': '950 铂金',
  '7': '14K 金（历史停用编码）',
  '8': '18K 黄金',
  '9': '18K 白色黄金'
}

const bezelSuffixMap: Record<string, string> = {
  LN: 'Lunette Noire（黑色外圈）',
  LV: 'Lunette Verte（绿色外圈）',
  LB: 'Lunette Bleue（蓝色外圈）',
  BLRO: 'Bleu / Rouge（红蓝双色“百事圈”）',
  BLNR: 'Bleu / Noir（蓝黑双色“国米圈”）',
  GRNR: 'Gris / Noir（灰黑双色“皮蛋圈”）',
  CHNR: 'Chocolat / Noir（棕黑双色“沙士圈”）',
  VTNR: 'Vert / Noir（绿黑双色“雪碧圈”）',
  RBOW: 'Rainbow（原厂彩虹渐变蓝宝石圈）',
  RBR: '原厂圆钻外圈',
  TBR: '原厂梯形方钻外圈'
}

const liveQuickDecode = computed(() => {
  const raw = searchQuery.value.trim().toUpperCase()
  if (!raw || raw.length < 5) return null
  const match = raw.match(/^(\d{5,6})([A-Z]{2,4})?(-\d{4})?$/)
  if (!match) return null
  const baseDigits = match[1]
  const suffix = match[2] || ''
  const lastDigit = baseDigits[baseDigits.length - 1]
  const matText = materialMap[lastDigit]
  const suffixText = suffix ? bezelSuffixMap[suffix] || `法语/宝石后缀 ${suffix}` : '无外圈字母后缀'
  return {
    baseDigits,
    lastDigit,
    matText,
    suffix,
    suffixText
  }
})

function selectCase(id: string) {
  selectedId.value = id
}

function parseInlineCode(text: string): Array<{ text: string; isCode: boolean }> {
  return text
    .split(/(`[^`]+`)/g)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return { text: part.slice(1, -1), isCode: true }
      }
      return { text: part, isCode: false }
    })
}
</script>

<template>
  <div class="rlx-ref-card">
    <div class="rlx-ref-header">
      <div class="rlx-ref-title-wrap">
        <span class="rlx-ref-badge">2D 交互式型号拆解台</span>
        <h4 class="rlx-ref-heading">10 个热门劳力士完整型号分段解剖</h4>
      </div>
      <p class="rlx-ref-note">
        支持按系列筛选或输入任意 6 位型号即时解码尾位材质与法语后缀。点击任一案例，查看五段拆解与「100% 锁定结论」vs「收表核验红线」。
      </p>
    </div>

    <!-- 筛选与快速匹配栏 -->
    <div class="rlx-toolbar">
      <div class="rlx-cat-pills" role="group" aria-label="按系列筛选型号">
        <button
          v-for="cat in categoryOptions"
          :key="cat.key"
          type="button"
          class="rlx-cat-pill"
          :class="{ active: selectedCategory === cat.key }"
          @click="selectedCategory = cat.key"
        >
          {{ cat.label }}
        </button>
      </div>
      <div class="rlx-search-wrap">
        <input
          v-model="searchQuery"
          type="text"
          class="rlx-search-input"
          placeholder="输入型号/关键词匹配（如 126500、VTNR、126710BLRO）"
          aria-label="搜索或输入劳力士型号"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="rlx-search-clear"
          aria-label="清空搜索"
          @click="searchQuery = ''"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- 自定义输入即时语法快解提示 -->
    <div v-if="liveQuickDecode" class="rlx-live-decode">
      <span class="rlx-live-tag">即时语法快解</span>
      <span class="rlx-live-text">
        <code>{{ liveQuickDecode.baseDigits }}</code> 尾位
        <code>{{ liveQuickDecode.lastDigit }}</code> →
        <strong>{{ liveQuickDecode.matText }}</strong>；外圈后缀：
        <strong>{{ liveQuickDecode.suffixText }}</strong>
      </span>
    </div>

    <!-- 型号选择网格 -->
    <div v-if="filteredCases.length > 0" class="rlx-ref-selector" role="tablist" aria-label="选择劳力士真实型号">
      <button
        v-for="item in filteredCases"
        :key="item.id"
        type="button"
        role="tab"
        :aria-selected="currentCase.id === item.id"
        class="rlx-ref-btn"
        :class="{ active: currentCase.id === item.id }"
        @click="selectCase(item.id)"
      >
        <span class="rlx-ref-btn-code">{{ item.ref }}</span>
        <span class="rlx-ref-btn-tag">{{ item.tag }}</span>
      </button>
    </div>
    <div v-else class="rlx-empty-hint">
      未在 10 个预设热门案例中匹配到 “{{ searchQuery }}”。你可以清空搜索，或参考上方的「即时语法快解」先读出尾位材质与外圈含义。
    </div>

    <!-- 主拆解舞台 -->
    <div class="rlx-ref-stage">
      <div class="rlx-ref-meta">
        <div class="rlx-ref-meta-left">
          <span class="rlx-ref-series">{{ currentCase.series }}</span>
          <span class="rlx-ref-fullcode">{{ currentCase.ref }}</span>
          <p class="rlx-ref-subtitle">{{ currentCase.subtitle }}</p>
        </div>
        <div v-if="currentCase.image" class="rlx-ref-thumb">
          <img :src="withBase(currentCase.image)" :alt="currentCase.ref" loading="lazy" />
        </div>
      </div>

      <!-- 五段公式彩色拆解 -->
      <div class="rlx-seg-grid">
        <div
          v-for="seg in currentCase.segments"
          :key="seg.label"
          class="rlx-seg-box"
          :class="[`is-${seg.kind}`, { 'is-empty': seg.isEmpty }]"
        >
          <div class="rlx-seg-label">{{ seg.label }}</div>
          <div class="rlx-seg-code">{{ seg.code }}</div>
          <div class="rlx-seg-meaning">
            <template v-for="(tok, tIdx) in parseInlineCode(seg.meaning)" :key="tIdx">
              <code v-if="tok.isCode" class="rlx-inline-code">{{ tok.text }}</code>
              <template v-else>{{ tok.text }}</template>
            </template>
          </div>
        </div>
      </div>

      <!-- 双栏结论与红线提示 -->
      <div class="rlx-boundary-grid">
        <div class="rlx-boundary-box is-ok">
          <div class="rlx-boundary-title">✓ 100% 锁定结论（型号可靠读出）</div>
          <ul class="rlx-boundary-list">
            <li v-for="(line, idx) in currentCase.decodable" :key="idx">
              <template v-for="(tok, tIdx) in parseInlineCode(line)" :key="tIdx">
                <code v-if="tok.isCode" class="rlx-inline-code">{{ tok.text }}</code>
                <template v-else>{{ tok.text }}</template>
              </template>
            </li>
          </ul>
        </div>

        <div class="rlx-boundary-box is-warn">
          <div class="rlx-boundary-title">⚠ 收表核验红线提示（绝不可单凭保卡盲信）</div>
          <ul class="rlx-boundary-list">
            <li v-for="(line, idx) in currentCase.redLines" :key="idx">
              <template v-for="(tok, tIdx) in parseInlineCode(line)" :key="tIdx">
                <code v-if="tok.isCode" class="rlx-inline-code">{{ tok.text }}</code>
                <template v-else>{{ tok.text }}</template>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 底部衔接引导 -->
    <div class="rlx-footer-cta">
      <span class="rlx-footer-text">读懂型号后，下一步需现场核验蚝式/五珠/元首表带、Oysterflex 胶带尺码与表扣编码：</span>
      <a :href="withBase('/brands/rolex/bracelets')" class="rlx-next-link">
        前往《劳力士表带、表扣与配件鉴别》 →
      </a>
    </div>
  </div>
</template>

<style scoped>
.rlx-ref-card {
  margin: 22px 0;
  padding: 18px;
  border-radius: 14px;
  background: linear-gradient(180deg, #0b1914 0%, #0f172a 100%);
  border: 1px solid #1e3a2f;
  color: #e2e8f0;
  box-shadow: 0 12px 32px rgba(2, 6, 23, 0.38);
}

.rlx-ref-header {
  margin-bottom: 14px;
}

.rlx-ref-title-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.rlx-ref-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.48);
  color: #6ee7b7;
}

.rlx-ref-heading {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.rlx-ref-note {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #94a3b8;
}

.rlx-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.rlx-cat-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.rlx-cat-pill {
  appearance: none;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid #334155;
  background: #0b1220;
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.rlx-cat-pill:hover {
  border-color: #64748b;
  color: #f8fafc;
}

.rlx-cat-pill.active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.18);
  color: #6ee7b7;
}

.rlx-search-wrap {
  position: relative;
  flex: 1 1 240px;
  max-width: 340px;
}

.rlx-search-input {
  width: 100%;
  padding: 6px 28px 6px 10px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #09111e;
  color: #f8fafc;
  font-size: 12.5px;
  outline: none;
  transition: border-color 0.15s ease;
}

.rlx-search-input::placeholder {
  color: #64748b;
}

.rlx-search-input:focus {
  border-color: #10b981;
}

.rlx-search-clear {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  appearance: none;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 4px;
}

.rlx-live-decode {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.4);
  font-size: 12.5px;
  color: #d1fae5;
}

.rlx-live-tag {
  padding: 2px 7px;
  border-radius: 4px;
  background: #059669;
  color: #ecfdf5;
  font-size: 11px;
  font-weight: 700;
}

.rlx-live-text code {
  font-family: var(--vp-font-family-mono);
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(15, 23, 42, 0.7);
  color: #fde68a;
}

.rlx-ref-selector {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}

.rlx-ref-btn {
  appearance: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  padding: 8px 9px;
  border-radius: 10px;
  border: 1px solid #2a394a;
  background: #0b1220;
  color: #cbd5e1;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 0;
}

.rlx-ref-btn:hover {
  border-color: #64748b;
  background: #131c31;
}

.rlx-ref-btn.active {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.14);
  box-shadow: 0 0 0 1px rgba(212, 175, 55, 0.28);
}

.rlx-ref-btn-code {
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  font-weight: 700;
  color: #f8fafc;
  overflow-wrap: anywhere;
}

.rlx-ref-btn.active .rlx-ref-btn-code {
  color: #fde68a;
}

.rlx-ref-btn-tag {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.3;
}

.rlx-ref-btn.active .rlx-ref-btn-tag {
  color: #fcd34d;
}

.rlx-empty-hint {
  padding: 12px;
  margin-bottom: 14px;
  border-radius: 10px;
  border: 1px dashed #475569;
  background: rgba(15, 23, 42, 0.6);
  font-size: 12.5px;
  color: #94a3b8;
}

.rlx-ref-stage {
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid #1e293b;
}

.rlx-ref-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.rlx-ref-meta-left {
  flex: 1 1 280px;
  min-width: 0;
}

.rlx-ref-series {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6ee7b7;
  letter-spacing: 0.02em;
  margin-bottom: 2px;
}

.rlx-ref-fullcode {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 20px;
  font-weight: 800;
  color: #fde68a;
  letter-spacing: 0.02em;
  overflow-wrap: anywhere;
  margin-bottom: 4px;
}

.rlx-ref-subtitle {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #cbd5e1;
}

.rlx-ref-thumb {
  width: 78px;
  height: 78px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #334155;
  background: #020617;
  flex-shrink: 0;
}

.rlx-ref-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.rlx-seg-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 9px;
  margin-bottom: 14px;
}

.rlx-seg-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 9px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #0b1220;
  min-width: 0;
}

.rlx-seg-box.is-family {
  border-color: rgba(59, 130, 246, 0.55);
  background: rgba(30, 58, 138, 0.18);
}

.rlx-seg-box.is-bezelPos {
  border-color: rgba(168, 85, 247, 0.55);
  background: rgba(88, 28, 135, 0.18);
}

.rlx-seg-box.is-material {
  border-color: rgba(245, 158, 11, 0.55);
  background: rgba(146, 64, 14, 0.18);
}

.rlx-seg-box.is-suffix {
  border-color: rgba(16, 185, 129, 0.55);
  background: rgba(6, 78, 59, 0.2);
}

.rlx-seg-box.is-config {
  border-color: rgba(236, 72, 153, 0.55);
  background: rgba(131, 24, 67, 0.18);
}

.rlx-seg-box.is-empty {
  border-style: dashed;
  border-color: rgba(148, 163, 184, 0.4);
  background: rgba(30, 41, 59, 0.35);
}

.rlx-seg-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
}

.rlx-seg-code {
  font-family: var(--vp-font-family-mono);
  font-size: 18px;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.rlx-seg-box.is-empty .rlx-seg-code {
  font-size: 13.5px;
  color: #cbd5e1;
}

.rlx-seg-meaning {
  font-size: 11.5px;
  line-height: 1.5;
  color: #cbd5e1;
}

.rlx-boundary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.rlx-boundary-box {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #334155;
  min-width: 0;
}

.rlx-boundary-box.is-ok {
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(20, 83, 45, 0.18);
}

.rlx-boundary-box.is-warn {
  border-color: rgba(239, 68, 68, 0.45);
  background: rgba(127, 29, 29, 0.2);
}

.rlx-boundary-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
}

.rlx-boundary-box.is-ok .rlx-boundary-title {
  color: #86efac;
}

.rlx-boundary-box.is-warn .rlx-boundary-title {
  color: #fca5a5;
}

.rlx-boundary-list {
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.rlx-boundary-list li {
  font-size: 12.5px;
  line-height: 1.55;
  color: #e2e8f0;
  margin: 0;
}

.rlx-inline-code {
  display: inline-block;
  padding: 1px 5px;
  margin: 0 1px;
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
  font-weight: 600;
  color: #fde68a;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.rlx-footer-cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 12.5px;
}

.rlx-footer-text {
  color: #94a3b8;
}

.rlx-next-link {
  color: #6ee7b7;
  font-weight: 700;
  text-decoration: none;
}

.rlx-next-link:hover {
  text-decoration: underline;
  color: #a7f3d0;
}

@media (max-width: 960px) {
  .rlx-ref-selector {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .rlx-seg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .rlx-boundary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .rlx-ref-card {
    padding: 14px 12px;
  }

  .rlx-ref-stage {
    padding: 12px;
  }

  .rlx-search-wrap {
    max-width: 100%;
  }

  .rlx-seg-grid {
    grid-template-columns: 1fr;
  }
}
</style>
