<script setup lang="ts">
import { computed, ref } from 'vue'

type SegmentKind = 'prefix' | 'family' | 'generation' | 'suffix'

interface ReferenceSegment {
  kind: SegmentKind
  code: string
  label: string
  meaning: string
  isEmpty?: boolean
}

interface RmReferenceCase {
  id: string
  ref: string
  series: string
  tag: string
  subtitle: string
  segments: ReferenceSegment[]
  decodable: string[]
  requiresLookup: string[]
}

const referenceCases: RmReferenceCase[] = [
  {
    id: 'rm-055',
    ref: 'RM 055',
    series: '55 系列 · Bubba Watson',
    tag: '第一代单段三位数',
    subtitle: '早期单段三位数编码标杆：RM 后空格加前导零 055，绝不写作 RM 55 或 RM 055-01',
    segments: [
      {
        kind: 'prefix',
        code: 'RM',
        label: '① 品牌前缀',
        meaning: 'Richard Mille 官方前缀，与数字间固定保留一个半角空格'
      },
      {
        kind: 'family',
        code: '055',
        label: '② 单段主编号',
        meaning: '第一代三位数编码，必须保留前导零 `055`，对应 Bubba Watson 手动镂空平台'
      },
      {
        kind: 'generation',
        code: '(无连字符)',
        label: '③ 代际细分段',
        meaning: '单段体系无 `-01` / `-02` 后缀，停产标杆仍沿用初代单段写法',
        isEmpty: true
      },
      {
        kind: 'suffix',
        code: '(保卡附加标注)',
        label: '④ 材质/功能码',
        meaning: '基础型号本身不带后缀，常见 ATZ 白陶或 NTPT 碳壳需看保卡材质标注',
        isEmpty: true
      }
    ],
    decodable: [
      '属于第一代单段三位数体系，官方写法固定为 `RM 055`（不可省略前导零或补 `-01`）',
      '锁定 Bubba Watson 主题手动上链镂空酒桶壳型平台（55 教学分组）',
      '无自动上链 `AO` 标识与 `-xx` 代际号，属于已停产经典单段型号结构',
      '若保卡印成 `RM 55` 或 `RM 055-01`，可直接触发异常假卡警报'
    ],
    requiresLookup: [
      '具体表壳材质：同为 `RM 055`，包含 ATZ 白陶瓷前圈配白色橡胶包覆五级钛中壳与底盖、Carbon TPT® 全黑碳纤维（Asia Edition 等）及 18K 玫瑰金等多版本',
      '是否限量版或地区特别版（如亚洲版、美洲版或原厂镶钻版本）',
      '机芯细节（Cal. RMUL2 手动镂空抗震机芯）与实际生产激活年份（须核对原厂保卡）',
      '原装表带配色及表扣材质搭配'
    ]
  },
  {
    id: 'rm-07-01-atz-rg',
    ref: 'RM 07-01 ATZ-RG',
    series: '07 系列 · 女装核心主力',
    tag: '双材质三明治连写',
    subtitle: '现代双段体系 + 三明治双材质连写：ATZ 白陶瓷上下圈配 18K 红金中壳',
    segments: [
      {
        kind: 'prefix',
        code: 'RM',
        label: '① 品牌前缀',
        meaning: 'Richard Mille 官方前缀，保卡与表背铭文标准起始标识'
      },
      {
        kind: 'family',
        code: '07',
        label: '② 家族编号',
        meaning: '两位前导零 `07` 家族（绝不写作 `007`），代表现代女装酒桶核心平台'
      },
      {
        kind: 'generation',
        code: '-01',
        label: '③ 代际细分段',
        meaning: '07 家族初代经典优雅自动女表平台（区别于蓝宝石 `-02` 与运动 `-04`）'
      },
      {
        kind: 'suffix',
        code: 'ATZ-RG',
        label: '④ 材质/功能码',
        meaning: '`ATZ`（高压增韧白陶瓷前圈与底盖）+ `RG`（18K 红金中壳）三明治连写'
      }
    ],
    decodable: [
      '属于第二代双段体系，家族号固定为两位 `07`，细分定位为 `-01` 经典自动女表',
      '前表圈与底盖材质 100% 锁定为 `ATZ` 高压增韧白陶瓷',
      '中层表壳（Middle Case）材质 100% 锁定为 `RG`（18K 红金/玫瑰金）',
      '若实物为全红金或全黑陶瓷，但保卡写 `ATZ-RG`，即可识破换壳拼装风险'
    ],
    requiresLookup: [
      '是否原厂镶钻及镶嵌规格（表盘中心铺钻、雪花镶嵌表圈或素圈版本在口头常混称，必须核对保卡原厂镶钻标注防后钻）',
      '表盘中心装饰材质（黑玛瑙、珍珠母贝、红碧玉或满钻盘面）',
      '搭载机芯 Cal. CRMA2 自动可变几何摆陀机芯的年份批次',
      '原厂激活年份与随附表带/金链带配置（如红金或碳纤维链带）'
    ]
  },
  {
    id: 'rm-11-03-rg-ti',
    ref: 'RM 11-03 RG-TI',
    series: '11 系列 · 大号飞返计时年历',
    tag: '经典金钛双材质 + 联名盲区',
    subtitle: '11 家族棱角空气动力学进化主力：18K 红金前后圈 + 五级钛凹槽中壳（RG-TI）',
    segments: [
      {
        kind: 'prefix',
        code: 'RM',
        label: '① 品牌前缀',
        meaning: 'Richard Mille 官方前缀'
      },
      {
        kind: 'family',
        code: '11',
        label: '② 家族编号',
        meaning: '大号三明治酒桶飞返计时 + 12 点大日历 + 4–5 点月份窗年历家族'
      },
      {
        kind: 'generation',
        code: '-03',
        label: '③ 代际细分段',
        meaning: '换装 RMAC3 机芯，升级纵向凹槽空气动力学表壳与 F1 轮毂造型表冠（区别于流线壳 RM 011 与 GMT 款 11-02）'
      },
      {
        kind: 'suffix',
        code: 'RG-TI',
        label: '④ 材质/功能码',
        meaning: '`RG`（18K 红金前圈与底盖）+ `TI`（五级钛合金纵向凹槽中壳）三明治混搭'
      }
    ],
    decodable: [
      '锁定 11 飞返计时年历家族第三代棱角进化壳型（`RM 11-03`，非初代单段 `RM 011`）',
      '前表圈与底盖为 18K 红金（`RG`），中层凹槽壳体为五级钛合金（`TI`），区别于全红金 `RG`、全钛 `TI` 或碳壳 `CA`',
      '具备 12 点位大日历 + 4–5 点位月份显示（实用年历）与三眼飞返计时功能',
      '若实物中壳也被换成红金或后改碳纤维圈，对照保卡 `RG-TI` 即可当场识破拼装'
    ],
    requiresLookup: [
      '是否为天价联名款：如 `RM 11-03 McLaren`（橙色 Quartz TPT® 与 Carbon TPT® 交错壳体，限量 500 枚）或 Jean Todt 蓝石英限量版，必须核对保卡具体联名编码与限量号',
      '是否原厂镶钻（`11-03` 红金/白金壳存在原厂圆钻与方钻版，市场后镶钻泛滥，必须核对保卡镶嵌记录）',
      '搭载 Cal. RMAC3 自动可变几何摆陀机芯的保养历史与胶圈老化状态',
      '具体出厂激活年份（2016 年发布，现已停产由 `RM 72-01` / `RM 65-01` 接棒）'
    ]
  },
  {
    id: 'rm-35-02-fq',
    ref: 'RM 35-02 FQ',
    series: '35 系列 · Rafael Nadal',
    tag: '法语缩写 FQ 石英纤维',
    subtitle: '首款自动纳达尔 + 保卡高频法语缩写 FQ（Fibres de Quartz，Quartz TPT®）',
    segments: [
      {
        kind: 'prefix',
        code: 'RM',
        label: '① 品牌前缀',
        meaning: 'Richard Mille 官方前缀'
      },
      {
        kind: 'family',
        code: '35',
        label: '② 家族编号',
        meaning: '纳达尔“小牛”运动表家族（不含陀飞轮的轻量高抗震自动/手动阵营）'
      },
      {
        kind: 'generation',
        code: '-02',
        label: '③ 代际细分段',
        meaning: '35 家族第二代，首次由手动升级为自动上链的纳达尔表款（RMAL1）'
      },
      {
        kind: 'suffix',
        code: 'FQ',
        label: '④ 材质/功能码',
        meaning: '法语 *Fibres de Quartz* 缩写，锁定 Quartz TPT® 石英纤维表壳'
      }
    ],
    decodable: [
      '属于 35 纳达尔家族第二代 `-02` 自动上链款式（区别于手动 `-01` 与蝶形摆陀 `-03`）',
      '表壳材质 100% 确定为 Quartz TPT® 石英纤维（`FQ`），非 Carbon TPT®（`CA`）',
      '从一代的密底手动进化为透底自动上链设计，带有品牌标志性层压波浪纹理',
      '结合 `FQ` 后缀可排除早期碳壳 `RM 35-01` 的材质混淆'
    ],
    requiresLookup: [
      'Quartz TPT® 的具体颜色：同写 `FQ`，`RM 35-02 FQ` 最经典的是高饱和红白纹款（亦存在黑灰碳纤维 `CA` 或特定配色版本）',
      '是否带有原厂表带配色（如亮黄色、红色或黑色魔术贴/胶带）',
      '是否曾因剧烈佩戴或磕碰更换过石英纤维中壳或表圈',
      '具体出厂激活年份（2016 年首发，跨度多年）'
    ]
  },
  {
    id: 'rm-35-03-ca-fq',
    ref: 'RM 35-03 CA-FQ',
    series: '35 系列 · Rafael Nadal',
    tag: '蝶形摆陀 + 复合材质',
    subtitle: '35 家族三代升级：7 点位按键控制专利蝶形摆陀 + Carbon/Quartz TPT® 复合壳',
    segments: [
      {
        kind: 'prefix',
        code: 'RM',
        label: '① 品牌前缀',
        meaning: 'Richard Mille 官方前缀'
      },
      {
        kind: 'family',
        code: '35',
        label: '② 家族编号',
        meaning: '纳达尔“小牛”极限抗震运动家族'
      },
      {
        kind: 'generation',
        code: '-03',
        label: '③ 代际细分段',
        meaning: '35 家族第三代，搭载专利“蝶形摆陀”与 7 点位运动模式切换按键'
      },
      {
        kind: 'suffix',
        code: 'CA-FQ',
        label: '④ 材质/功能码',
        meaning: '`CA`（Carbon TPT® 碳纤维）与 `FQ`（Quartz TPT® 石英纤维）复合表壳结构'
      }
    ],
    decodable: [
      '属于 35 家族第三代 `-03`（区别于 `-01` 手动与 `-02` 普通自动），具备蝶形摆陀机构',
      '表壳为 Carbon TPT®（`CA`）与 Quartz TPT®（`FQ`）复合三明治结构',
      '2 点位功能选择按键与 7 点位蝶形摆陀展开按键为该代际专属结构特征',
      '通过 `CA-FQ` 双材质码可与纯蓝石英或纯白石英全 `FQ` 版本区分'
    ],
    requiresLookup: [
      '具体配色方案（例如蓝白 Quartz TPT®、全白 Quartz TPT® 配碳纤维中壳或黑碳配白石英中壳）',
      '搭载 Cal. RMAL2 机芯的技术细节与 6 点位上链状态指示器颜色',
      '具体出厂激活年份（2021 年发布至今）与保卡销售地信息',
      '表壳层压纹理是否为原厂独一无二纹路与原配胶带/织物表带规格'
    ]
  },
  {
    id: 'rm-65-01-ca',
    ref: 'RM 65-01 CA',
    series: '65 系列 · 自动双秒追针',
    tag: '常规最复杂旗舰',
    subtitle: '品牌常规量产最复杂自动机芯（RMAC4）：5 Hz 高频双秒追针 + CA 碳纤维壳',
    segments: [
      {
        kind: 'prefix',
        code: 'RM',
        label: '① 品牌前缀',
        meaning: 'Richard Mille 官方前缀'
      },
      {
        kind: 'family',
        code: '65',
        label: '② 家族编号',
        meaning: '自动双秒追针计时（Split-Seconds Chronograph）顶级复杂运动平台'
      },
      {
        kind: 'generation',
        code: '-01',
        label: '③ 代际细分段',
        meaning: '65 家族首发正代主力规格（约 600 余枚零件，8 点位带快速上链按键）'
      },
      {
        kind: 'suffix',
        code: 'CA',
        label: '④ 材质/功能码',
        meaning: '`CA` = Carbon TPT® 碳纤维表壳（全黑层压大马士革纹理）'
      }
    ],
    decodable: [
      '锁定 65 家族 `-01` 自动双秒追针计时旗舰平台（非单纯数字排序决定，复杂度远高于 `RM 67-01`）',
      '表壳主体材质 100% 确定为 Carbon TPT® 碳纤维（`CA`），区别于钛合金 `TI`、红金 `RG` 或混合壳 `RG-CA`',
      '具备双秒追针（Rattrapante）与品牌标志性快速上链按钮架构',
      '若保卡写 `CA` 但实物表圈为红金（`RG-CA`），可直接判断货不对版'
    ],
    requiresLookup: [
      '具体版本配色：同为 `CA` 碳壳，既有常规黄/橙/绿刻度版，也有特定彩色 Quartz TPT® 或 McLaren W1 等特别合作款',
      '随附表带颜色与材质（黑色/彩色橡胶带）',
      '5 Hz（36,000 vph）高频 Cal. RMAC4 机芯细节与 60 小时动力储存规格',
      '准确出厂激活年份（2020 年末发布，不同年份市场行情差异显著）'
    ]
  },
  {
    id: 'rm-67-01-ao-ti',
    ref: 'RM 67-01 AO TI',
    series: '67 系列 · 都市超薄',
    tag: 'AO 自动 + TI 五级钛',
    subtitle: '7.75 mm 超薄酒桶标杆：保卡常见 AO（自动上链）与 TI（五级钛合金）连写',
    segments: [
      {
        kind: 'prefix',
        code: 'RM',
        label: '① 品牌前缀',
        meaning: 'Richard Mille 官方前缀'
      },
      {
        kind: 'family',
        code: '67',
        label: '② 家族编号',
        meaning: '品牌超薄自动酒桶（Extra Flat Automatic）家族平台'
      },
      {
        kind: 'generation',
        code: '-01',
        label: '③ 代际细分段',
        meaning: '7.75 mm 都市正装超薄款（带 5 点位日历窗与 2 点位 W-D-H 功能指示）'
      },
      {
        kind: 'suffix',
        code: 'AO TI',
        label: '④ 材质/功能码',
        meaning: '`AO`（Automatic Winding 自动上链）+ `TI`（Grade 5 Titanium 五级钛合金表壳）'
      }
    ],
    decodable: [
      '属于 67 超薄家族第一代 `-01`（带日历与功能指示，区别于无日历极限减重运动款 `-02`）',
      '`AO` 明确标识为自动上链机芯（*Automatic Winding*，保卡高频法英混用代码）',
      '`TI` 100% 锁定表壳为五级钛合金，非 18K 红金（`RG`）或白金（`WG`）',
      '印证“数字大于 `027` / `035` 并不等于更贵或更复杂”的编号铁律'
    ],
    requiresLookup: [
      '是否原厂镶钻（`RM 67-01` 钛壳或白金壳均存在原厂镶钻版本，必须看保卡是否有镶钻明细）',
      '表盘数字夜光与内圈细节点缀配色（常规款与特定地区限量配色差异）',
      '整表厚度 7.75 mm 与 Cal. CRMA6 机芯铂金微型/镂空摆陀参数',
      '具体出厂激活年份（2016 年推出，跨度近十年，早期与晚期配件及行情有别）'
    ]
  },
  {
    id: 'rm-67-02-ca-fq',
    ref: 'RM 67-02 CA-FQ',
    series: '67 系列 · 极限运动联名',
    tag: '同编码跨多配色巨坑',
    subtitle: '重大收售避坑：约 32 克极限超薄，但同编码对应多位运动员联名配色，价差巨大！',
    segments: [
      {
        kind: 'prefix',
        code: 'RM',
        label: '① 品牌前缀',
        meaning: 'Richard Mille 官方前缀'
      },
      {
        kind: 'family',
        code: '67',
        label: '② 家族编号',
        meaning: '超薄自动酒桶家族平台（与 `67-01` 同源）'
      },
      {
        kind: 'generation',
        code: '-02',
        label: '③ 代际细分段',
        meaning: '取消日历与功能指示、进一步镂空减重至约 32 克的运动款（Cal. CRMA7）'
      },
      {
        kind: 'suffix',
        code: 'CA-FQ',
        label: '④ 材质/功能码',
        meaning: 'Carbon TPT®（`CA`）与 Quartz TPT®（`FQ`）超轻复合材料三明治表壳'
      }
    ],
    decodable: [
      '属于 67 家族 `-02` 极限减重运动超薄款（无日历窗，区别于都市款 `67-01`）',
      '表壳采用 Carbon TPT®（`CA`）与 Quartz TPT®（`FQ`）复合材料组合（部分联名采用全 `FQ` 或 `CA-FQ`）',
      '表桥以五级钛合金打造并带有与表壳呼应的彩绘工艺，整表含弹性表带约 32 克',
      '可排除全金属 `TI` 或 `RG` 表壳的 `67-01` 混淆'
    ],
    requiresLookup: [
      '【高危项】具体运动员/国家特别版配色：同样简称 `RM 67-02 CA-FQ` 或 `FQ`，涵盖巴尔希姆紫红（Qatar）、勒克莱尔白红（Monaco）、奥吉尔蓝（France）、兹维列夫红黑、范尼凯克绿黄、意大利三色等十余种配色，二级市场价差可达数十万元！',
      'Quartz TPT® 的实际色调与底盖/表桥彩绘细节是否与保卡一致',
      '随附无缝一体式弹性舒适表带（Comfort Strap）尺码与配色',
      '具体出厂激活年份与限量/非限量发行批次'
    ]
  },
  {
    id: 'rm-72-01-rg',
    ref: 'RM 72-01 RG',
    series: '72 系列 · 自产飞返计时',
    tag: 'CRMC1 自产飞返 + 红金',
    subtitle: '品牌首款全自产摆动齿轮飞返计时（Cal. CRMC1），RG 锁定 18K 红金前后表壳',
    segments: [
      {
        kind: 'prefix',
        code: 'RM',
        label: '① 品牌前缀',
        meaning: 'Richard Mille 官方前缀'
      },
      {
        kind: 'family',
        code: '72',
        label: '② 家族编号',
        meaning: '品牌首个完全自主研发专利摆动小齿轮双离合飞返计时平台'
      },
      {
        kind: 'generation',
        code: '-01',
        label: '③ 代际细分段',
        meaning: '72 家族首发正代主力规格（3、8、11 点位“三体”非对称计时盘布局）'
      },
      {
        kind: 'suffix',
        code: 'RG',
        label: '④ 材质/功能码',
        meaning: '`RG` = 18K 红金/玫瑰金（Rose Gold）表壳'
      }
    ],
    decodable: [
      '锁定 72 家族 `-01` 全自产飞返计时（Flyback Chronograph）平台',
      '表壳主体材质 100% 确定为 18K 红金（`RG`），可清晰区分于五级钛 `TI`、黑陶 `TZP-N` 或白陶 `ATZ` 版',
      '搭载 Cal. CRMC1 专利摆动小齿轮飞返计时架构，并带有 W-D-H 功能选择器',
      '男女皆宜的中性尺寸（38.40 × 47.34 mm）属于该型号家族固有规格'
    ],
    requiresLookup: [
      '是否原厂镶钻（`RM 72-01 RG` 同样存在素圈与原厂镶钻高珠版，必须核对保卡原厂镶钻说明）',
      '表壳内圈、计时小盘指针及表冠垫圈的具体配色',
      '具体出厂激活年份（2020 年发布至今，不同年份保卡行情差异明显）',
      '中壳拉丝工艺与贵金属印记（Au750 狗头/圣伯纳犬等贵金属印记）实物核验'
    ]
  }
]

const selectedId = ref<string>(referenceCases[0].id)

const currentCase = computed(() => {
  return referenceCases.find((item) => item.id === selectedId.value) ?? referenceCases[0]
})

function parseInlineCode(text: string): Array<{ isCode: boolean; text: string }> {
  return text
    .split(/(`[^`]+`)/g)
    .filter((part) => part.length > 0)
    .map((part) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return { isCode: true, text: part.slice(1, -1) }
      }
      return { isCode: false, text: part }
    })
}
</script>

<template>
  <div class="rm-ref-card">
    <div class="rm-ref-header">
      <div class="rm-ref-title-wrap">
        <span class="rm-ref-badge">真实型号分段拆解台</span>
        <h4 class="rm-ref-heading">9 个代表性理查米尔型号编码实战剖析</h4>
      </div>
      <p class="rm-ref-note">
        覆盖七大教学分组（07 / 11 / 35 / 55 / 65 / 67 / 72）与两代语法演进。点击切换真实型号，对比「单凭编码可读」与「必须核对保卡/实物」的严格边界。
      </p>
    </div>

    <div class="rm-ref-selector" role="tablist" aria-label="选择理查米尔真实型号">
      <button
        v-for="item in referenceCases"
        :key="item.id"
        type="button"
        role="tab"
        :aria-selected="selectedId === item.id"
        class="rm-ref-btn"
        :class="{ active: selectedId === item.id }"
        @click="selectedId = item.id"
      >
        <span class="rm-ref-btn-code">{{ item.ref }}</span>
        <span class="rm-ref-btn-tag">{{ item.tag }}</span>
      </button>
    </div>

    <div class="rm-ref-stage">
      <div class="rm-ref-meta">
        <span class="rm-ref-series">{{ currentCase.series }}</span>
        <span class="rm-ref-fullcode">{{ currentCase.ref }}</span>
      </div>
      <p class="rm-ref-subtitle">{{ currentCase.subtitle }}</p>

      <!-- 四段公式拆解色块 -->
      <div class="rm-seg-grid">
        <div
          v-for="seg in currentCase.segments"
          :key="seg.label"
          class="rm-seg-box"
          :class="[`is-${seg.kind}`, { 'is-empty': seg.isEmpty }]"
        >
          <div class="rm-seg-label">{{ seg.label }}</div>
          <div class="rm-seg-code">{{ seg.code }}</div>
          <div class="rm-seg-meaning">
            <template v-for="(tok, tIdx) in parseInlineCode(seg.meaning)" :key="tIdx">
              <code v-if="tok.isCode" class="rm-inline-code">{{ tok.text }}</code>
              <template v-else>{{ tok.text }}</template>
            </template>
          </div>
        </div>
      </div>

      <!-- 双栏边界结论 -->
      <div class="rm-boundary-grid">
        <div class="rm-boundary-box is-ok">
          <div class="rm-boundary-title">✓ 编码可直接确认项</div>
          <ul class="rm-boundary-list">
            <li v-for="(line, idx) in currentCase.decodable" :key="idx">
              <template v-for="(tok, tIdx) in parseInlineCode(line)" :key="tIdx">
                <code v-if="tok.isCode" class="rm-inline-code">{{ tok.text }}</code>
                <template v-else>{{ tok.text }}</template>
              </template>
            </li>
          </ul>
        </div>

        <div class="rm-boundary-box is-warn">
          <div class="rm-boundary-title">⚠ 必须核对保卡 / 实物确认项</div>
          <ul class="rm-boundary-list">
            <li v-for="(line, idx) in currentCase.requiresLookup" :key="idx">
              <template v-for="(tok, tIdx) in parseInlineCode(line)" :key="tIdx">
                <code v-if="tok.isCode" class="rm-inline-code">{{ tok.text }}</code>
                <template v-else>{{ tok.text }}</template>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rm-ref-card {
  margin: 22px 0;
  padding: 18px;
  border-radius: 14px;
  background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
  border: 1px solid #1e293b;
  color: #e2e8f0;
  box-shadow: 0 12px 32px rgba(2, 6, 23, 0.35);
}

.rm-ref-header {
  margin-bottom: 14px;
}

.rm-ref-title-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.rm-ref-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  background: rgba(245, 158, 11, 0.16);
  border: 1px solid rgba(245, 158, 11, 0.45);
  color: #fcd34d;
}

.rm-ref-heading {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.rm-ref-note {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #94a3b8;
}

.rm-ref-selector {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.rm-ref-btn {
  appearance: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  padding: 9px 10px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #0b1220;
  color: #cbd5e1;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 0;
}

.rm-ref-btn:hover {
  border-color: #64748b;
  background: #131c31;
}

.rm-ref-btn.active {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.14);
  box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.25);
}

.rm-ref-btn-code {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  font-weight: 700;
  color: #f8fafc;
  overflow-wrap: anywhere;
}

.rm-ref-btn.active .rm-ref-btn-code {
  color: #fde68a;
}

.rm-ref-btn-tag {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.3;
}

.rm-ref-btn.active .rm-ref-btn-tag {
  color: #fcd34d;
}

.rm-ref-stage {
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #1e293b;
}

.rm-ref-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.rm-ref-series {
  font-size: 12px;
  font-weight: 600;
  color: #93c5fd;
  letter-spacing: 0.02em;
}

.rm-ref-fullcode {
  font-family: var(--vp-font-family-mono);
  font-size: 18px;
  font-weight: 800;
  color: #fde68a;
  letter-spacing: 0.02em;
  overflow-wrap: anywhere;
}

.rm-ref-subtitle {
  margin: 0 0 14px;
  font-size: 13.5px;
  line-height: 1.55;
  color: #cbd5e1;
}

.rm-seg-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.rm-seg-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 11px 10px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #0b1220;
  min-width: 0;
}

.rm-seg-box.is-prefix {
  border-color: rgba(148, 163, 184, 0.45);
  background: rgba(30, 41, 59, 0.35);
}

.rm-seg-box.is-family {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(30, 58, 138, 0.16);
}

.rm-seg-box.is-generation {
  border-color: rgba(245, 158, 11, 0.5);
  background: rgba(146, 64, 14, 0.16);
}

.rm-seg-box.is-suffix {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(6, 78, 59, 0.18);
}

.rm-seg-box.is-empty {
  border-style: dashed;
  border-color: rgba(148, 163, 184, 0.45);
  background: rgba(30, 41, 59, 0.35);
}

.rm-seg-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
}

.rm-seg-code {
  font-family: var(--vp-font-family-mono);
  font-size: 18px;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.rm-seg-box.is-empty .rm-seg-code {
  font-size: 14px;
  color: #cbd5e1;
}

.rm-seg-meaning {
  font-size: 12px;
  line-height: 1.5;
  color: #cbd5e1;
}

.rm-boundary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.rm-boundary-box {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #334155;
  min-width: 0;
}

.rm-boundary-box.is-ok {
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(20, 83, 45, 0.18);
}

.rm-boundary-box.is-warn {
  border-color: rgba(245, 158, 11, 0.4);
  background: rgba(120, 53, 15, 0.18);
}

.rm-boundary-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
}

.rm-boundary-box.is-ok .rm-boundary-title {
  color: #86efac;
}

.rm-boundary-box.is-warn .rm-boundary-title {
  color: #fcd34d;
}

.rm-boundary-list {
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.rm-boundary-list li {
  font-size: 12.5px;
  line-height: 1.55;
  color: #e2e8f0;
  margin: 0;
}

.rm-inline-code {
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

@media (max-width: 820px) {
  .rm-ref-selector {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .rm-seg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .rm-boundary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .rm-ref-card {
    padding: 14px 12px;
  }

  .rm-ref-stage {
    padding: 12px;
  }

  .rm-ref-selector {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }

  .rm-ref-btn {
    padding: 8px;
  }

  .rm-ref-btn-code {
    font-size: 12px;
  }

  .rm-seg-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
