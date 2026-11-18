<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

type SegmentKind = 'model' | 'caseMat' | 'bezel' | 'strap' | 'iteration'
type CategoryKey = 'all' | 'ro-core' | 'ro-special' | 'offshore-ladies'

interface ReferenceSegment {
  kind: SegmentKind
  code: string
  label: string
  meaning: string
}

interface ApReferenceCase {
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

const categoryTabs: { id: CategoryKey; label: string }[] = [
  { id: 'all', label: '全部典型案例（8款）' },
  { id: 'ro-core', label: '皇家橡树主力（钢/玫瑰金）' },
  { id: 'ro-special', label: '先锋材质与高定工艺（XT/CD/GG）' },
  { id: 'offshore-ladies', label: '离岸型与中小号防混（CA/ZZ/67系）' }
]

const referenceCases: ApReferenceCase[] = [
  {
    id: '15510st-01',
    ref: '15510ST.OO.1320ST.01',
    category: 'ro-core',
    series: '皇家橡树 41mm 自动上链 · 50周年纪念款',
    tag: '2022 50th 蓝盘',
    subtitle: '15510 锁定 2022 换代薄化壳带，ST 精钢，1320 新链带，.01 锁定 2022 专属 50 YEARS 镂空摆陀蓝盘',
    image: '/images/brands/audemars-piguet/craftsmanship/ap-50th-anniversary-rotor-caseback.jpg',
    segments: [
      {
        kind: 'model',
        code: '15510',
        label: '① 5位表款码',
        meaning: '2022 皇家橡树 50 周年换代 41mm 自动大三针（搭载 Cal. 4302，取代前代 15500）'
      },
      {
        kind: 'caseMat',
        code: 'ST',
        label: '② 表壳材质',
        meaning: 'ST = 精钢（Stainless Steel），正面八角圈配 8 颗 18K 白金六角螺栓'
      },
      {
        kind: 'bezel',
        code: '.OO.',
        label: '③ 表圈工艺',
        meaning: 'OO = 标准无宝石八角表圈（纵向缎面拉丝配宽大镜面抛光倒角）'
      },
      {
        kind: 'strap',
        code: '1320ST',
        label: '④ 表带结构与材质',
        meaning: '1320 = 2022 升级款递减薄化一体式链带（前代为 1220）+ ST 精钢'
      },
      {
        kind: 'iteration',
        code: '.01',
        label: '⑤ 盘面与批次尾码',
        meaning: '锁定 2022 周年限定版“夜色蓝，云 50”格纹盘（配专属 50 YEARS 镂空摆陀；2023+ 常规摆陀同盘色顺延为 .06）'
      }
    ],
    decodable: [
      '100% 锁定为 41mm 自动上链皇家橡树（Cal. 4302 机芯，70 小时动储）',
      '1320ST 证明配备 2022 年起改良的更纤薄贴腕新一代一体式精钢链带',
      '尾码 .01 精确锁定为 2022 年产出的 50 周年“夜色蓝”版本，背透必带镂空 50 YEARS 纪念摆陀'
    ],
    redLines: [
      '表背底盖不镌刻 .01 / .06 尾码！严防普通黑/灰盘换装代用蓝盘，须通过电子保卡激活记录核对完整四段码',
      '50 周年 .01 与 2023 年后常规摆陀 .06 二级市场存在独立收藏价差，收表必翻看背透摆陀造型与保卡年份'
    ]
  },
  {
    id: '16202xt-01',
    ref: '16202XT.OO.1240XT.01',
    category: 'ro-special',
    series: '皇家橡树 39mm “Jumbo” 超薄旗舰',
    tag: 'XT = 钛 + BMG金属玻璃',
    subtitle: '16202 锁定新一代 Cal. 7121 超薄 Jumbo，XT 揭秘五级钛与钯基块状金属玻璃跨界组合',
    image: '/images/brands/audemars-piguet/materials/ap-16202xt-titanium-bmg.jpg',
    segments: [
      {
        kind: 'model',
        code: '16202',
        label: '① 5位表款码',
        meaning: '2022 换代 39mm “Jumbo” 超薄双针日历旗舰（升级 Cal. 7121 快调日历超薄机芯）'
      },
      {
        kind: 'caseMat',
        code: 'XT',
        label: '② 表壳材质',
        meaning: 'XT = 五级钛金属中壳 + 钯基块状金属玻璃（BMG, Bulk Metallic Glass）镜面八角表圈与底盖框'
      },
      {
        kind: 'bezel',
        code: '.OO.',
        label: '③ 表圈工艺',
        meaning: 'OO = 无宝石表圈（此处 BMG 表圈采用全镜面高光抛光，与拉丝钛中壳形成强烈反差）'
      },
      {
        kind: 'strap',
        code: '1240XT',
        label: '④ 表带结构与材质',
        meaning: '1240 = Jumbo 专属超薄一体链带；XT = 拉丝钛金属主链节 + 镜面抛光 BMG 连接粒（Studs）'
      },
      {
        kind: 'iteration',
        code: '.01',
        label: '⑤ 盘面与批次尾码',
        meaning: '锁定无格纹烟熏酒红色（Smoked Burgundy）太阳放射纹渐变表盘与玫瑰金指针时标'
      }
    ],
    decodable: [
      '一眼识别无中央秒针的 39mm 正统 Jumbo 血统（8.1mm 极致纤薄）',
      'XT 双材质代码锁定表背必有 BMG 与 Pd500（钯含量超 50% 贵金属合金）官方印记',
      '整表拿在手中远轻于精钢与铂金款，而表圈与连接粒却呈现如液态铂金般的超高抗刮镜面光泽'
    ],
    redLines: [
      '切忌因银灰外观误判为普通精钢款！16202XT 属于顶级藏家配额款，二级市场行价远超常规钢款',
      'BMG 非晶态金属玻璃工艺极特殊，严禁交由非官方普通抛光坊打磨表圈或连接粒'
    ]
  },
  {
    id: '15550ba-gg-01',
    ref: '15550BA.GG.1356BA.01',
    category: 'ro-special',
    series: '皇家橡树 37mm 霜金自动上链腕表',
    tag: '.GG. = 佛罗伦萨霜金',
    subtitle: '第 2 段由 OO 变为 GG，代表表壳与链带历经万次金刚石微锤击，无一颗钻石却璀璨如星尘',
    image: '/images/brands/audemars-piguet/craftsmanship/ap-15550ba-frosted-gold.jpg',
    segments: [
      {
        kind: 'model',
        code: '15550',
        label: '① 5位表款码',
        meaning: '现行 37mm 自动上链皇家橡树（尾位偶数 0 代表表圈无镶嵌宝石，搭载 Cal. 5900）'
      },
      {
        kind: 'caseMat',
        code: 'BA',
        label: '② 表壳材质',
        meaning: 'BA = 18K 黄金（法语 Or Jaune 传统贵金属代码，区别于玫瑰金 OR 与白金 BC）'
      },
      {
        kind: 'bezel',
        code: '.GG.',
        label: '③ 表圈工艺',
        meaning: 'GG = 原厂佛罗伦萨霜金工艺（Frosted Gold），金刚石微锤击出星尘漫反射肌理，侧面保留镜面倒角'
      },
      {
        kind: 'strap',
        code: '1356BA',
        label: '④ 表带结构与材质',
        meaning: '1356 = 37mm 新一代一体式递减链带 + BA 18K 黄金（链节正面同步施以霜金锤击）'
      },
      {
        kind: 'iteration',
        code: '.01',
        label: '⑤ 盘面与批次尾码',
        meaning: '锁定烟熏黄金色（Smoked Yellow-Gold）太阳放射纹渐变表盘（无格纹设计突出霜金火彩）'
      }
    ],
    decodable: [
      'BA + .GG. 100% 锁定原厂 18K 黄金霜金工艺，绝非后期喷砂改装',
      '尾数 0（15550）配合 .GG. 证明其闪耀效果来自贵金属微锤击而非镶嵌钻石（镶钻款为 15551 + .ZZ.）'
    ],
    redLines: [
      '霜金生死铁律：锤击微凹面一旦遭遇深磕碰或被外行上布轮抛光，星尘质感永久毁灭且本地无法修复！',
      '收售全金链带必数清总链节数，少一节原厂霜金 18K 金节补配周期极长且价值高昂'
    ]
  },
  {
    id: '15551or-zz-05',
    ref: '15551OR.ZZ.1356OR.05',
    category: 'offshore-ladies',
    series: '皇家橡树 37mm 原厂镶钻自动腕表',
    tag: '尾奇 1 + .ZZ. = 原厂钻圈',
    subtitle: '第 5 位由 0 变 1 且第 2 段标 .ZZ.，双重锁死原厂 50 颗圆钻八角表圈，彻底杜绝后镶钻骗局',
    segments: [
      {
        kind: 'model',
        code: '15551',
        label: '① 5位表款码',
        meaning: '37mm 自动上链原厂镶钻表圈分支（注意第 5 位奇数 1 专属于镶钻圈款，素圈款为 15550）'
      },
      {
        kind: 'caseMat',
        code: 'OR',
        label: '② 表壳材质',
        meaning: 'OR = 18K 玫瑰金（Or Rose），呈现温润浓郁的粉铜金光泽'
      },
      {
        kind: 'bezel',
        code: '.ZZ.',
        label: '③ 表圈工艺',
        meaning: 'ZZ = 原厂明亮式切割圆钻表圈（37mm 款精密镶嵌 50 颗顶级净度圆钻，总重约 1.04 克拉）'
      },
      {
        kind: 'strap',
        code: '1356OR',
        label: '④ 表带结构与材质',
        meaning: '1356 = 37mm 新一代一体式递减链带 + OR 全 18K 玫瑰金'
      },
      {
        kind: 'iteration',
        code: '.05',
        label: '⑤ 盘面与批次尾码',
        meaning: '锁定经典“夜色蓝，云 50” Grande Tapisserie 大型格纹表盘（.04 为银白盘，.06 为卡其绿盘）'
      }
    ],
    decodable: [
      '15551（奇数尾位）+ .ZZ. 双重锁定原厂钻石表圈身份',
      'OR 壳配 1356OR 链带确认为全 18K 玫瑰金重金链带配置（区别于鳄鱼皮或胶带款）'
    ],
    redLines: [
      '二级市场头号雷区：拿无钻款 15550OR.OO 或 15550ST.OO 在外坊打孔后镶钻石冒充 15551.ZZ！',
      '核验电子保卡激活型号必须是 15551 + .ZZ.；但凡系统显示 15550.OO 而实物带钻，100% 判定为后镶钻（爱彼官方售后直接拒保）'
    ]
  },
  {
    id: '15416cd-01',
    ref: '15416CD.OO.1225CD.01',
    category: 'ro-special',
    series: '皇家橡树 41mm 双摆轮镂空全陶瓷旗舰',
    tag: 'CD = 2025 夜色蓝陶瓷',
    subtitle: '15416 锁定全陶瓷壳双摆轮家族，2025 全新代码 CD 代表“夜色蓝，云 50”高定彩色氧化锆陶瓷',
    image: '/images/brands/audemars-piguet/materials/ap-15416ce-black-ceramic-openworked.jpg',
    segments: [
      {
        kind: 'model',
        code: '15416',
        label: '① 5位表款码',
        meaning: '41mm 专利同轴双摆轮镂空（Cal. 3132）的高科技陶瓷表壳专属编号（金属壳族为 15407）'
      },
      {
        kind: 'caseMat',
        code: 'CD',
        label: '② 表壳材质',
        meaning: 'CD = 2025 全新“夜色蓝，云 50”（Bleu Nuit, Nuage 50）深蓝陶瓷（区别于黑陶 CE 与白陶 CB）'
      },
      {
        kind: 'bezel',
        code: '.OO.',
        label: '③ 表圈工艺',
        meaning: 'OO = 无宝石陶瓷八角圈，手工钻石砂轮拉丝配镜面抛光斜面'
      },
      {
        kind: 'strap',
        code: '1225CD',
        label: '④ 表带结构与材质',
        meaning: '1225 = 41mm 全陶瓷一体式链带（配钛金属折叠扣芯防断裂）+ CD 夜色蓝陶瓷'
      },
      {
        kind: 'iteration',
        code: '.01',
        label: '⑤ 盘面与批次尾码',
        meaning: '锁定银灰铑色调镂空桥板、深蓝内影圈配玫瑰金指针时标与正反可见的金色同轴双摆轮夹板'
      }
    ],
    decodable: [
      '一眼区分爱彼三大彩色陶瓷代码：CE 黑陶瓷、CB 白陶瓷、CD 夜色蓝陶瓷',
      '搭载 Cal. 3132 专利同轴双摆轮镂空机芯，8 点位正反面清晰可见上下双游丝同频呼吸'
    ],
    redLines: [
      '全陶瓷壳带虽极耐日常划痕，但抗冲击韧性不及金属——收表必用 10 倍放大镜逐一排查八角折棱与每一节陶瓷链带边角有无微崩口！',
      '上图示意 15416 黑陶双摆轮同构机芯布局，CD 款通体呈深邃午夜蓝色调'
    ]
  },
  {
    id: '26240or-cr-02',
    ref: '26240OR.OO.D315CR.02',
    category: 'ro-core',
    series: '皇家橡树 41mm 自产飞返计时腕表',
    tag: '26系计时 + DxxxCR鳄鱼皮',
    subtitle: '26 开头锁定计时家族，26240 为 Cal. 4401 透底一体飞返现行主力，D315CR 锁定蓝色鳄鱼皮带',
    image: '/images/brands/audemars-piguet/overview/ap-royal-oak-26240st-blue.jpg',
    segments: [
      {
        kind: 'model',
        code: '26240',
        label: '① 5位表款码',
        meaning: '2022 换代 41mm 皇家橡树自动上链飞返计时（搭载自产一体式导柱轮飞返 Cal. 4401，蓝宝石透底）'
      },
      {
        kind: 'caseMat',
        code: 'OR',
        label: '② 表壳材质',
        meaning: 'OR = 18K 玫瑰金表壳与旋入式计时按把/表冠'
      },
      {
        kind: 'bezel',
        code: '.OO.',
        label: '③ 表圈工艺',
        meaning: 'OO = 标准 18K 玫瑰金拉丝抛光八角表圈'
      },
      {
        kind: 'strap',
        code: 'D315CR',
        label: '④ 表带结构与材质',
        meaning: 'D315 = 深蓝色表带色号 + CR = 方形大竹节鳄鱼皮表带（Crocodile，配 18K 玫瑰金 AP 字样折叠扣；D002CR 则为黑色鳄鱼皮）'
      },
      {
        kind: 'iteration',
        code: '.02',
        label: '⑤ 盘面与批次尾码',
        meaning: '2023+ 常规摆陀批次“夜色蓝” Grande Tapisserie 格纹盘（.01 为 2022 50 周年纪念摆陀版）'
      }
    ],
    decodable: [
      '厘清 41mm 皇橡计时三代演进：26331（密底非飞返 Cal. 2385）→ 26239（2021 过渡透底飞返）→ 26240（现行主力透底飞返）',
      '第 3 段字母代码 CR 明确出厂原配为鳄鱼皮带而非全金链带（全金链带款为 1320OR，两者公价与金重相差十余万元！）'
    ],
    redLines: [
      '严防将原配皮带款 26240OR.OO.D315CR 后配副厂代用金带冒充原装全金链带款 26240OR.OO.1320OR！',
      '实测飞返（Flyback）功能：计时运行中直接按下 4 点归零键，秒针应瞬间归零并立即重新起跑，手感清脆无卡滞'
    ]
  },
  {
    id: '15720st-ca-01',
    ref: '15720ST.OO.A052CA.01',
    category: 'offshore-ladies',
    series: '皇家橡树离岸型 42mm 专业潜水表（Diver）',
    tag: 'AxxxCA = 一键快拆橡胶带',
    subtitle: '15720 锁定 300m 离岸潜水表（10点内影圈旋冠 + Cal. 4308），A052CA 代表卡其绿一键快拆橡胶带',
    image: '/images/brands/audemars-piguet/overview/ap-royal-oak-offshore-15720st-khaki.jpg',
    segments: [
      {
        kind: 'model',
        code: '15720',
        label: '① 5位表款码',
        meaning: '2021 换代 42mm 皇家橡树离岸型专业潜水表（搭载 Cal. 4308 透底机芯 + 专利一键快拆表带系统，取代前代 15710）'
      },
      {
        kind: 'caseMat',
        code: 'ST',
        label: '② 表壳材质',
        meaning: 'ST = 精钢表壳，3 点与 10 点位均配备黑色陶瓷旋入式表冠（更高抗刮耐蚀）'
      },
      {
        kind: 'bezel',
        code: '.OO.',
        label: '③ 表圈工艺',
        meaning: 'OO = 精钢拉丝八角表圈，下方可见离岸型标志性的外露黑色厚橡胶防水垫圈'
      },
      {
        kind: 'strap',
        code: 'A052CA',
        label: '④ 表带结构与材质',
        meaning: 'A052 = 卡其绿色一键快拆接口规格 + CA = 橡胶表带（Caoutchouc，全套随表附赠第二条黑色快拆橡胶带）'
      },
      {
        kind: 'iteration',
        code: '.01',
        label: '⑤ 盘面与批次尾码',
        meaning: '锁定卡其绿 Méga Tapisserie 特大格纹盘配玫瑰金立体 AP 标志与米黑双色旋转潜水内圈'
      }
    ],
    decodable: [
      '一眼区分皇家橡树与离岸型潜水表：外露厚黑橡胶圈 + Méga 特大格纹 + 10 点位独立旋入式潜水内圈调节冠',
      'AxxxCA（A 字头）在现代离岸型中代表支持无需工具按压生耳卡扣秒换表带的快拆系统'
    ],
    redLines: [
      '清点大全套附件时：15720ST 原厂出厂标配附赠第二条替换黑色快拆橡胶带，收表务必核对副带与快拆针扣是否齐全',
      '重点检查 3 点与 10 点位两颗黑色陶瓷表冠棱角有无跌落崩裂，以及 10 点位旋转内影圈啮合齿是否顺畅无滑牙'
    ]
  },
  {
    id: '67650or-01',
    ref: '67650OR.OO.1261OR.01',
    category: 'offshore-ladies',
    series: '皇家橡树 33mm 女装石英腕表',
    tag: '67系 = 石英 vs 77系 = 自动',
    subtitle: '中小号女装皇家橡树最关键的防错价密码：67xxx 开头必为密底无秒针石英机芯，77xxx 开头才是自动机械！',
    segments: [
      {
        kind: 'model',
        code: '67650',
        label: '① 5位表款码',
        meaning: '爱彼铁律 67xxx 开头 = 33mm 皇家橡树石英腕表（搭载 Cal. 2713 石英机芯，双针无秒针，实心密底）'
      },
      {
        kind: 'caseMat',
        code: 'OR',
        label: '② 表壳材质',
        meaning: 'OR = 18K 玫瑰金表壳（另有精钢款 67650ST 与钻圈款 67651ST.ZZ / 67651OR.ZZ）'
      },
      {
        kind: 'bezel',
        code: '.OO.',
        label: '③ 表圈工艺',
        meaning: 'OO = 无钻拉丝抛光 18K 玫瑰金八角表圈（若带 40 颗原厂钻圈则型号变为 67651OR.ZZ）'
      },
      {
        kind: 'strap',
        code: '1261OR',
        label: '④ 表带结构与材质',
        meaning: '1261 = 33mm 纤薄一体式金属链带 + OR 18K 玫瑰金'
      },
      {
        kind: 'iteration',
        code: '.01',
        label: '⑤ 盘面与批次尾码',
        meaning: '银白色 Grande Tapisserie 格纹表盘（3 点日历，盘面无 AUTOMATIC 字样）'
      }
    ],
    decodable: [
      '一秒切分中小号女表机芯：67650 / 67651（33mm 双针无 AUTOMATIC 字样 + 密底）= 石英；77350 / 77450 / 77451（34mm 大三针扫秒 + 透底 Cal. 5800）= 自动机械！'
    ],
    redLines: [
      '高危错价防线：看照片时极易将 33mm 石英 67650 / 67651 误看成 34mm 自动机械 77350 / 77451 报高价！认准盘面有无中央大秒针及 67 vs 77 首两位编码',
      '石英款收表务必开盖（或由技师核查）电池仓有无旧电池漏液腐蚀电路板隐患'
    ]
  }
]

const selectedCategory = ref<CategoryKey>('all')
const selectedId = ref<string>(referenceCases[0].id)

const visibleCases = computed(() =>
  selectedCategory.value === 'all'
    ? referenceCases
    : referenceCases.filter((c) => c.category === selectedCategory.value)
)

const activeCase = computed(
  () =>
    visibleCases.value.find((c) => c.id === selectedId.value) ??
    visibleCases.value[0]
)

function selectCategory(cat: CategoryKey) {
  selectedCategory.value = cat
  if (!visibleCases.value.some((c) => c.id === selectedId.value)) {
    selectedId.value = visibleCases.value[0].id
  }
}
</script>

<template>
  <div class="ap-ref-card">
    <div class="ap-ref-header">
      <div class="ap-ref-badge-row">
        <span class="ap-ref-badge">交互式四段解码器</span>
        <span class="ap-ref-formula">XXXXXYY . ZZ . WWWWYY . NN</span>
      </div>
      <h3 class="ap-ref-title">爱彼官方四段参考编号实战拆解台</h3>
      <p class="ap-ref-desc">
        点击下方典型业务型号，逐段查看「5位家族码 + 表壳材质 + 表圈工艺 + 表带规格 + 批次盘面序号」的精确含义与收表防坑盲区：
      </p>
    </div>

    <div class="ap-cat-tabs">
      <button
        v-for="tab in categoryTabs"
        :key="tab.id"
        type="button"
        class="ap-cat-btn"
        :class="{ active: selectedCategory === tab.id }"
        @click="selectCategory(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="ap-ref-selector">
      <button
        v-for="item in visibleCases"
        :key="item.id"
        type="button"
        class="ap-case-pill"
        :class="{ active: activeCase.id === item.id }"
        @click="selectedId = item.id"
      >
        <span class="ap-pill-code">{{ item.ref }}</span>
        <span class="ap-pill-tag">{{ item.tag }}</span>
      </button>
    </div>

    <div v-if="activeCase" class="ap-ref-stage">
      <div class="ap-stage-top">
        <div class="ap-stage-info">
          <span class="ap-stage-series">{{ activeCase.series }}</span>
          <div class="ap-stage-ref">{{ activeCase.ref }}</div>
          <p class="ap-stage-sub">{{ activeCase.subtitle }}</p>
        </div>
        <div v-if="activeCase.image" class="ap-stage-thumb">
          <img :src="withBase(activeCase.image)" :alt="activeCase.ref" loading="lazy" />
        </div>
      </div>

      <div class="ap-seg-grid">
        <div
          v-for="seg in activeCase.segments"
          :key="seg.label"
          class="ap-seg-box"
          :class="`is-${seg.kind}`"
        >
          <span class="ap-seg-label">{{ seg.label }}</span>
          <span class="ap-seg-code">{{ seg.code }}</span>
          <span class="ap-seg-meaning">{{ seg.meaning }}</span>
        </div>
      </div>

      <div class="ap-boundary-grid">
        <div class="ap-boundary-box is-ok">
          <div class="ap-boundary-title">单凭完整编号可 100% 锁定的硬指标</div>
          <ul class="ap-boundary-list">
            <li v-for="line in activeCase.decodable" :key="line">{{ line }}</li>
          </ul>
        </div>
        <div class="ap-boundary-box is-warn">
          <div class="ap-boundary-title">二手核验盲区与高危防坑红线</div>
          <ul class="ap-boundary-list">
            <li v-for="line in activeCase.redLines" :key="line">{{ line }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ap-ref-card {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  margin: 20px 0;
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(155deg, #0b1324 0%, #101d35 55%, #0f172a 100%);
  border: 1px solid #23385d;
  color: #e2e8f0;
  overflow-x: hidden;
}

.ap-ref-card *,
.ap-ref-card *::before,
.ap-ref-card *::after {
  box-sizing: border-box;
}

.ap-ref-header {
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.ap-ref-badge-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ap-ref-badge {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(56, 189, 248, 0.16);
  border: 1px solid rgba(56, 189, 248, 0.45);
  color: #7dd3fc;
}

.ap-ref-formula {
  padding: 3px 10px;
  border-radius: 999px;
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  font-weight: 700;
  background: rgba(245, 158, 11, 0.14);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fde68a;
}

.ap-ref-title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
  color: #f8fafc;
}

.ap-ref-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #94a3b8;
}

.ap-cat-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 12px;
}

.ap-cat-btn {
  appearance: none;
  padding: 6px 11px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #0b1220;
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ap-cat-btn:hover {
  border-color: #64748b;
}

.ap-cat-btn.active {
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.18);
  color: #bae6fd;
}

.ap-ref-selector {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 14px;
}

.ap-case-pill {
  appearance: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #293b56;
  background: rgba(11, 18, 32, 0.85);
  color: #e2e8f0;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 0;
}

.ap-case-pill:hover {
  border-color: #475569;
  background: #132038;
}

.ap-case-pill.active {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.15);
  box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.25);
}

.ap-pill-code {
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  font-weight: 700;
  color: #f8fafc;
  overflow-wrap: anywhere;
}

.ap-pill-tag {
  font-size: 11px;
  color: #93c5fd;
}

.ap-case-pill.active .ap-pill-tag {
  color: #fde68a;
}

.ap-ref-stage {
  padding: 14px;
  border-radius: 12px;
  background: rgba(9, 15, 28, 0.88);
  border: 1px solid #1e293b;
}

.ap-stage-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.ap-stage-info {
  flex: 1 1 260px;
  min-width: 0;
}

.ap-stage-series {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #7dd3fc;
  margin-bottom: 4px;
}

.ap-stage-ref {
  font-family: var(--vp-font-family-mono);
  font-size: 20px;
  font-weight: 800;
  color: #fde68a;
  letter-spacing: 0.02em;
  margin-bottom: 5px;
  overflow-wrap: anywhere;
}

.ap-stage-sub {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: #cbd5e1;
}

.ap-stage-thumb {
  flex: 0 0 92px;
  width: 92px;
  height: 92px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #334155;
  background: #ffffff;
}

.ap-stage-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ap-seg-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 9px;
  margin-bottom: 14px;
}

.ap-seg-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px 9px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #0b1220;
  min-width: 0;
}

.ap-seg-box.is-model {
  border-color: rgba(59, 130, 246, 0.55);
  background: rgba(30, 58, 138, 0.2);
}

.ap-seg-box.is-caseMat {
  border-color: rgba(245, 158, 11, 0.55);
  background: rgba(146, 64, 14, 0.2);
}

.ap-seg-box.is-bezel {
  border-color: rgba(168, 85, 247, 0.55);
  background: rgba(88, 28, 135, 0.2);
}

.ap-seg-box.is-strap {
  border-color: rgba(16, 185, 129, 0.55);
  background: rgba(6, 78, 59, 0.22);
}

.ap-seg-box.is-iteration {
  border-color: rgba(236, 72, 153, 0.55);
  background: rgba(131, 24, 67, 0.2);
}

.ap-seg-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
}

.ap-seg-code {
  font-family: var(--vp-font-family-mono);
  font-size: 17px;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.ap-seg-meaning {
  font-size: 11.5px;
  line-height: 1.5;
  color: #cbd5e1;
}

.ap-boundary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ap-boundary-box {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #334155;
  min-width: 0;
}

.ap-boundary-box.is-ok {
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(20, 83, 45, 0.18);
}

.ap-boundary-box.is-warn {
  border-color: rgba(239, 68, 68, 0.45);
  background: rgba(127, 29, 29, 0.2);
}

.ap-boundary-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
}

.ap-boundary-box.is-ok .ap-boundary-title {
  color: #86efac;
}

.ap-boundary-box.is-warn .ap-boundary-title {
  color: #fca5a5;
}

.ap-boundary-list {
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ap-boundary-list li {
  font-size: 12.5px;
  line-height: 1.55;
  color: #e2e8f0;
  margin: 0;
}

@media (max-width: 960px) {
  .ap-ref-selector {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ap-seg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ap-boundary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .ap-ref-card {
    padding: 14px 12px;
  }

  .ap-ref-selector,
  .ap-seg-grid {
    grid-template-columns: 1fr;
  }
}
</style>
