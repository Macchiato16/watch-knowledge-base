<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

type BezelCaseId =
  | 'all'
  | 'ro-smooth'
  | 'ro-diamond'
  | 'ro-ceramic'
  | 'roo-diver'
  | 'roo-chrono-42'
  | 'roo-diamond-37'

type DialLayoutId =
  | 'all'
  | 'two-hand'
  | 'three-hand'
  | 'openworked-db'
  | 'chrono-369'
  | 'chrono-1296'

type GenerationId =
  | 'all'
  | 'jumbo-ap6'
  | 'legacy-ap12'
  | 'new-galvanic'
  | 'cal3132-db'
  | 'ceramic-rg-screw'
  | 'roo-quick'

interface FilterOption<T extends string> {
  id: T
  label: string
}

interface ApAnchorCard {
  ref: string
  title: string
  series: string
  bezels: Exclude<BezelCaseId, 'all'>[]
  dials: Exclude<DialLayoutId, 'all'>[]
  generations: Exclude<GenerationId, 'all'>[]
  anchor: string
  confusion: string
  href: string
}

const bezelOptions: FilterOption<BezelCaseId>[] = [
  { id: 'all', label: '全部（17款）' },
  {
    id: 'ro-smooth',
    label: '皇家橡树 · 纤薄八角无钻圈（精钢/贵金属/霜金/钛BMG）'
  },
  {
    id: 'ro-diamond',
    label: '皇家橡树 · 原厂 40 颗美钻表圈（.ZZ. 每边5颗）'
  },
  {
    id: 'ro-ceramic',
    label: '皇家橡树 · 全高科技陶瓷一体壳带（CE黑/CD夜色蓝/CB白）'
  },
  {
    id: 'roo-diver',
    label: '离岸型 · 外露厚胶圈 + 10点位旋入式内影潜水冠（42mm）'
  },
  {
    id: 'roo-chrono-42',
    label: '离岸型 · 外露厚胶圈 + 42mm 大护桥计时（金属/全陶瓷）'
  },
  {
    id: 'roo-diamond-37',
    label: '离岸型 · 外露胶圈 + 原厂 32 颗大钻圈（.ZZ. 每边4颗）+ 胶带'
  }
]

const dialOptions: FilterOption<DialLayoutId>[] = [
  { id: 'all', label: '全部' },
  { id: 'two-hand', label: '极简双针（无中央秒针）+ 3点日历' },
  { id: 'three-hand', label: '中央大三针 + 3点日历' },
  { id: 'openworked-db', label: '无表盘全镂空 + 7–8点位同轴双摆轮横跨桥板' },
  { id: 'chrono-369', label: '3/6/9 横向三眼计时 + 4:30 斜向日历' },
  { id: 'chrono-1296', label: '12/9/6 纵向“左三眼”计时 + 3点位日历' }
]

const generationOptions: FilterOption<GenerationId>[] = [
  { id: 'all', label: '全部' },
  {
    id: 'jumbo-ap6',
    label: '6点位立体 AP 标 · 39×8.1mm 超薄背透（Jumbo 血统）'
  },
  {
    id: 'legacy-ap12',
    label: '12点位带 AP 标或长字框 · 前代链带 / 密底传统款'
  },
  {
    id: 'new-galvanic',
    label: '12点位无 AP 标仅 24K 电铸金连体英文 · 2022新世代薄链带'
  },
  { id: 'cal3132-db', label: '正反同轴反相双游丝 Cal. 3132 背透' },
  {
    id: 'ceramic-rg-screw',
    label: '全陶瓷壳带配 8 颗 18K 玫瑰金六角螺丝（34mm）'
  },
  {
    id: 'roo-quick',
    label: '离岸型一键快拆表带系统（胶带/全金/全陶瓷）'
  }
]

const watchCatalog: ApAnchorCard[] = [
  // 皇家橡树（14款）
  {
    ref: '15202',
    title: '39mm“Jumbo”超薄初代复兴经典款',
    series: '皇家橡树 · 39mm Jumbo',
    bezels: ['ro-smooth'],
    dials: ['two-hand'],
    generations: ['jumbo-ap6'],
    anchor:
      '39×8.1mm 极致超薄 + 极简双针（无秒针）+ 6 点位立体 AP 标 + 12 点仅有英文无 AP 标 + 窄细老款平头分针，背透搭载 Cal. 2121 整圈环轨镂空摆陀（无瞬跳慢调日历）。',
    confusion:
      '极易与 2022 换代 16202 混淆（同为双针 6 点 AP 标），区分看背透 Cal. 2121 轨环摆陀与表冠慢跳日历；950 铂金绿面 15202PT 与玫瑰金款需严查绿卡尾码防后改盘。',
    href: '/brands/audemars-piguet/royal-oak/15202'
  },
  {
    ref: '16202',
    title: '39mm“Jumbo”50周年换代超薄旗舰（含 XT 钛金属玻璃）',
    series: '皇家橡树 · 39mm Jumbo',
    bezels: ['ro-smooth'],
    dials: ['two-hand'],
    generations: ['jumbo-ap6'],
    anchor:
      '39×8.1mm 超薄双针 + 6 点位立体 AP 标 + 升级 Cal. 7121 快调日历机芯与 1240 超薄递减链带；2022 产 .01 批次背透独享 50 YEARS 镂空摆陀（含 16202XT 钛壳配 BMG 镜面表圈）。',
    confusion:
      '50 周年 .01 纪念摆陀版与 2023+ 常规摆陀 .02/.03 存在独立收藏溢价，绿卡不印四段尾码，收表必翻看背透摆陀与保卡年份；16202XT 勿误当普通钢款低报。',
    href: '/brands/audemars-piguet/royal-oak/16202'
  },
  {
    ref: '15500',
    title: '41mm 上代经典自动大三针（1220 链带）',
    series: '皇家橡树 · 41mm 自动',
    bezels: ['ro-smooth'],
    dials: ['three-hand'],
    generations: ['legacy-ap12'],
    anchor:
      '41×10.5mm + 大三针 + 3 点日历无右侧小短钉 + 12 点位带“立体 AP 标 + 短体英文”+ 较厚实 1220 一体链带（Cal. 4302 透底）。',
    confusion:
      '与现行 15510 仅差一代但行价有别！一眼辨别：15500 的 12 点位有立体 AP 金属标；严防老款 15500 蓝盘与黑盘换装、及八角棱线过度抛光磨圆天条。',
    href: '/brands/audemars-piguet/royal-oak/15500'
  },
  {
    ref: '15510',
    title: '41mm 2022 50周年换代自动大三针（1320 薄链带）',
    series: '皇家橡树 · 41mm 自动',
    bezels: ['ro-smooth'],
    dials: ['three-hand'],
    generations: ['new-galvanic'],
    anchor:
      '41×10.5mm 削薄倒角壳 + 12 点位彻底取消 AP 金属标，改为 24K 电铸金连体“AUDEMARS PIGUET”英文 + 更贴腕递减薄化 1320 链带（2022 .01 批次带 50 YEARS 摆陀）。',
    confusion:
      '必核 2022 年 .01 50 周年镂空摆陀与 2023+ 常规摆陀 .06/.07/.08 的价差；电子保卡仅凭手机扫码核验四段码，严防黑/灰盘换装副厂夜色蓝盘。',
    href: '/brands/audemars-piguet/royal-oak/15510'
  },
  {
    ref: '15407',
    title: '41mm 金属壳双摆轮全镂空皇家橡树',
    series: '皇家橡树 · 双摆轮镂空',
    bezels: ['ro-smooth'],
    dials: ['openworked-db'],
    generations: ['cal3132-db'],
    anchor:
      '无表盘全镂空架构 + 7–8 点位横跨式金桥板固定专利同轴反相双摆轮（正反面均清晰可见上下双游丝共振）+ 精钢 / 玫瑰金 / 黄金及 18K 白金霜金（BC.GG）一体壳带（Cal. 3132）。',
    confusion:
      '高仿重灾区！真品同轴双游丝由上下两枚对称摆轮共轴反向呼吸，绝非单摆轮假夹板；贵金属款与霜金款（严禁抛光）及精钢款必查八角棱线锐度。',
    href: '/brands/audemars-piguet/royal-oak/15407'
  },
  {
    ref: '15416',
    title: '41mm 全高科技陶瓷双摆轮全镂空旗舰（CE/CD/CB）',
    series: '皇家橡树 · 陶瓷双摆轮',
    bezels: ['ro-ceramic'],
    dials: ['openworked-db'],
    generations: ['cal3132-db'],
    anchor:
      '15416 专属全高科技陶瓷一体壳带（CE 黑陶 / CD 2025 夜色蓝陶 / CB 纯白陶配蓝色砂金石内圈）+ 7–8 点位同轴双摆轮镂空 Cal. 3132 + 钛金属底盖框与扣芯。',
    confusion:
      '陶瓷表壳与链带极耐刮却怕硬磕暗裂！收表必用 10 倍放大镜逐一排查八角棱边与每节陶瓷链带边角有无微崩口；区分 CE 黑陶、CD 夜色蓝陶与 CB 纯白陶。',
    href: '/brands/audemars-piguet/royal-oak/15416'
  },
  {
    ref: '26331',
    title: '41mm 上代密底“熊猫眼”经典计时',
    series: '皇家橡树 · 41mm 计时',
    bezels: ['ro-smooth'],
    dials: ['chrono-369'],
    generations: ['legacy-ap12'],
    anchor:
      '3/6/9 横向撞色三眼（3/9 点计时盘大于 6 点小秒盘）+ 4:30 斜向日历 + 12 点带 AP 标 + 实心金属密底（Cal. 2385 非飞返计时机芯）。',
    confusion:
      '与 26239 / 26240 盘面极像，但 26331 为全系唯一实心密底且不支持飞返计时！收表勿错报透底新款行情，八角圈与拉丝面严忌抛圆。',
    href: '/brands/audemars-piguet/royal-oak/26331'
  },
  {
    ref: '26239',
    title: '41mm 2021 过渡代透底飞返计时',
    series: '皇家橡树 · 41mm 计时',
    bezels: ['ro-smooth'],
    dials: ['chrono-369'],
    generations: ['legacy-ap12'],
    anchor:
      '首搭自产 Cal. 4401 一体导柱轮飞返计时 + 蓝宝石透底，但盘面仍保留 12 点位“立体 AP 标 + 长体英文”及前代 1220 厚链带（2021 仅产一年即停产过渡）。',
    confusion:
      '极具迷惑性的“混血过渡代”：背面看像 26240（透底 Cal. 4401），正面看像 26331（12 点带 AP 标）！勿将 26239 误当 26331 低收或当 26240 高报。',
    href: '/brands/audemars-piguet/royal-oak/26239'
  },
  {
    ref: '26240',
    title: '41mm 2022 现行主力自产飞返计时（含 CE 全黑陶）',
    series: '皇家橡树 · 41mm 计时',
    bezels: ['ro-smooth', 'ro-ceramic'],
    dials: ['chrono-369'],
    generations: ['new-galvanic'],
    anchor:
      '3/6/9 等大匀称三眼 + 4:30 日历 + 12 点无 AP 标仅 24K 电铸金连体英文 + Cal. 4401 透底飞返 + 1320 薄链带（覆盖精钢、玫瑰金及 26240CE 全黑陶）。',
    confusion:
      '三大红线：① 核验 2022 .01 50 周年镂空摆陀；② 严防原配鳄鱼皮带款（DxxxCR）后加副厂金带冒充全金链带款（1320OR）；③ 26240CE 全黑陶严查棱边暗裂。',
    href: '/brands/audemars-piguet/royal-oak/26240'
  },
  {
    ref: '15550',
    title: '37mm 现行无钻自动上链大三针（含 BA 霜金）',
    series: '皇家橡树 · 37mm 中号',
    bezels: ['ro-smooth'],
    dials: ['three-hand'],
    generations: ['new-galvanic'],
    anchor:
      '37×9mm 黄金中性尺寸 + 素净无钻八角表圈（含 15550BA.GG 佛罗伦萨锤击霜金）+ 12 点无 AP 标仅 24K 电铸金英文 + Cal. 5900 透底大三针。',
    confusion:
      '奇偶尾位防坑生死线：末位偶数 0 代表原厂无钻圈！严防拿 15550ST.OO / 15550OR.OO 在外坊打孔后镶假钻石冒充原厂钻圈 15551.ZZ（官方拒保）。',
    href: '/brands/audemars-piguet/royal-oak/15550'
  },
  {
    ref: '15551',
    title: '37mm 现行原厂 40 颗美钻表圈自动大三针（.ZZ.）',
    series: '皇家橡树 · 37mm 钻圈',
    bezels: ['ro-diamond'],
    dials: ['three-hand'],
    generations: ['new-galvanic'],
    anchor:
      '第 5 位奇数 1 + 第 2 段 .ZZ. 双重锁死原厂 40 颗明亮式圆钻表圈（八角每边精确 5 颗）+ 12 点无 AP 标 24K 电铸金英文 + Cal. 5900 透底大三针。',
    confusion:
      '收表必扫码核验电子保卡激活型号必须是 15551 + .ZZ.！凡系统显示 15550.OO 而实物带钻者 100% 为后加钻；同时核查每边 5 颗原厂镶爪对称度。',
    href: '/brands/audemars-piguet/royal-oak/15551'
  },
  {
    ref: '77350',
    title: '34mm 全陶瓷壳带配玫瑰金螺丝自动款（CE/CB）',
    series: '皇家橡树 · 34mm 陶瓷',
    bezels: ['ro-ceramic'],
    dials: ['three-hand'],
    generations: ['ceramic-rg-screw'],
    anchor:
      '34×8.8mm 娇小全高科技陶瓷一体壳带（77350CE 黑陶 / 77350CB 白陶）+ 独树一帜的 8 颗 18K 玫瑰金六角螺丝 + 中央大三针（Cal. 5800 透底）。',
    confusion:
      '切忌与 33mm 石英 67650 混淆（77 开头为自动大三针透底）；陶瓷材质最怕跌落暗裂，验表必用放大镜排查表耳与陶瓷链节边角微崩口。',
    href: '/brands/audemars-piguet/royal-oak/77350'
  },
  {
    ref: '77451',
    title: '34mm 原厂 40 颗美钻表圈自动大三针（.ZZ.）',
    series: '皇家橡树 · 34mm 钻圈',
    bezels: ['ro-diamond'],
    dials: ['three-hand'],
    generations: ['new-galvanic'],
    anchor:
      '34mm 77 系自动大三针透底（Cal. 5800）+ 末位奇数 1 配 .ZZ. 原厂 40 颗明亮式美钻圈（每边 5 颗）+ 12 点无 AP 标 24K 电铸金连体英文。',
    confusion:
      '高危防坑双线：① 防无钻 77450.OO 后镶假钻冒充 77451.ZZ；② 勿把 34mm 自动大三针 77451 误报成 33mm 石英双针钻圈 67651（两者机芯与行价差距悬殊）。',
    href: '/brands/audemars-piguet/royal-oak/77451'
  },
  {
    ref: '67650',
    title: '33mm 女装石英极简双针密底经典款',
    series: '皇家橡树 · 33mm 石英',
    bezels: ['ro-smooth'],
    dials: ['two-hand'],
    generations: ['legacy-ap12'],
    anchor:
      '67xxx 首两位铁律锁定石英机芯（Cal. 2713）+ 33×7mm 纤薄实心密底 + 极简双针（无中央秒针，盘面无 AUTOMATIC 字样）+ 12 点带 AP 标。',
    confusion:
      '二手看图极易错价重灾区！常被新人错看成 34mm 自动机械 77350 / 77450 报高价；收表必查盘面无秒针且为实心密底，并开盖核查电池仓有无漏液腐蚀。',
    href: '/brands/audemars-piguet/royal-oak/67650'
  },

  // 皇家橡树离岸型（3款）
  {
    ref: '15720',
    title: '42mm 离岸型 300m 专业潜水表（Diver）',
    series: '离岸型 · 42mm 潜水',
    bezels: ['roo-diver'],
    dials: ['three-hand'],
    generations: ['roo-quick'],
    anchor:
      '外露黑色厚橡胶防水圈 + 10 点位独立旋入式黑色陶瓷潜水内圈表冠 + Méga Tapisserie 特大格纹大三针 + 一键快拆橡胶带（Cal. 4308 透底）。',
    confusion:
      '全套出厂标配附赠第二条黑色快拆替换胶带，收表少一条即需扣价；重点查 3/10 点两颗黑陶表冠棱角有无崩裂及 10 点旋转内影圈啮合顺滑度。',
    href: '/brands/audemars-piguet/royal-oak-offshore/15720'
  },
  {
    ref: '26238',
    title: '42mm 离岸型大护桥“左三眼”自产飞返计时',
    series: '离岸型 · 42mm 计时',
    bezels: ['roo-chrono-42'],
    dials: ['chrono-1296'],
    generations: ['roo-quick'],
    anchor:
      '42mm 外露厚胶圈 + 右侧大块护肩计时按把 + 标志性 12/9/6 纵向“左三眼”布局 + 3 点日历 + 一键快拆表带（含 26238OR 大金砖、26238CD 夜色蓝全陶瓷及 26238BA ALYX 无刻度金盘联名款）。',
    confusion:
      '一秒区分皇家橡树计时（3/6/9 横三眼）与离岸型 42mm 计时（12/9/6 左三眼）；区分老款密底 26470 与现行透底飞返 Cal. 4404 的 26238，全陶款严查暗裂。',
    href: '/brands/audemars-piguet/royal-oak-offshore/26238'
  },
  {
    ref: '26231',
    title: '37mm 女装离岸型 32 颗大钻圈胶带计时',
    series: '离岸型 · 37mm 钻圈',
    bezels: ['roo-diamond-37'],
    dials: ['chrono-369'],
    generations: ['legacy-ap12', 'roo-quick'],
    anchor:
      '37mm 离岸型外露橡胶圈 + 原厂 32 颗大颗粒明亮式圆钻表圈（八角每边 4 颗，区别于 RO 37/34mm 的每边 5 颗）+ 3/6/9 三眼计时 + 4:30 日历 + 12 点带 AP 标 + 快拆胶带。',
    confusion:
      '高危辨伪点：每边 4 颗大钻（共 32 颗）+ 外露橡胶圈才是 26231！严防普通无钻小离岸后打孔镶钻冒充原厂 .ZZ. 钻圈，必核电子保卡尾段与原厂镶工。',
    href: '/brands/audemars-piguet/royal-oak-offshore/26231'
  }
]

const selectedBezel = ref<BezelCaseId>('all')
const selectedDial = ref<DialLayoutId>('all')
const selectedGeneration = ref<GenerationId>('all')

const filteredWatches = computed(() =>
  watchCatalog.filter((watch) => {
    const bezelMatch =
      selectedBezel.value === 'all' || watch.bezels.includes(selectedBezel.value)
    const dialMatch =
      selectedDial.value === 'all' || watch.dials.includes(selectedDial.value)
    const genMatch =
      selectedGeneration.value === 'all' ||
      watch.generations.includes(selectedGeneration.value)
    return bezelMatch && dialMatch && genMatch
  })
)

const hasActiveFilter = computed(
  () =>
    selectedBezel.value !== 'all' ||
    selectedDial.value !== 'all' ||
    selectedGeneration.value !== 'all'
)

function resetFilters() {
  selectedBezel.value = 'all'
  selectedDial.value = 'all'
  selectedGeneration.value = 'all'
}
</script>

<template>
  <div class="ap-vi-shell">
    <div class="ap-vi-header">
      <div class="ap-vi-header-main">
        <div class="ap-vi-badge-row">
          <span class="ap-vi-badge">看图识表 · 视觉锚点定位器</span>
          <span class="ap-vi-count">
            当前匹配 {{ filteredWatches.length }} / {{ watchCatalog.length }} 款
          </span>
        </div>
        <h3 class="ap-vi-title">爱彼 17 款热门基础型号三步视觉漏斗</h3>
        <p class="ap-vi-subtitle">
          收到无型号腕表照片时，按「壳型体量与表圈形态 → 盘面针数与计时布局 →
          12点/6点标与新老断代生死线」依次点选，3 秒锁定基础型号与收售防坑红线。
        </p>
      </div>
      <button
        type="button"
        class="ap-vi-reset"
        :disabled="!hasActiveFilter"
        @click="resetFilters"
      >
        重置筛选
      </button>
    </div>

    <div class="ap-vi-steps">
      <section class="ap-vi-step">
        <div class="ap-vi-step-head">
          <span class="ap-vi-step-num">第 1 步</span>
          <span class="ap-vi-step-name">壳型体量与表圈形态（先切分 RO 与离岸型阵营）</span>
        </div>
        <div class="ap-vi-chips">
          <button
            v-for="opt in bezelOptions"
            :key="opt.id"
            type="button"
            class="ap-vi-chip"
            :class="{ active: selectedBezel === opt.id }"
            @click="selectedBezel = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>

      <section class="ap-vi-step">
        <div class="ap-vi-step-head">
          <span class="ap-vi-step-num">第 2 步</span>
          <span class="ap-vi-step-name">盘面针数、镂空与计时布局</span>
        </div>
        <div class="ap-vi-chips">
          <button
            v-for="opt in dialOptions"
            :key="opt.id"
            type="button"
            class="ap-vi-chip"
            :class="{ active: selectedDial === opt.id }"
            @click="selectedDial = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>

      <section class="ap-vi-step">
        <div class="ap-vi-step-head">
          <span class="ap-vi-step-num">第 3 步</span>
          <span class="ap-vi-step-name">12点/6点标、底盖与新老断代生死线</span>
        </div>
        <div class="ap-vi-chips">
          <button
            v-for="opt in generationOptions"
            :key="opt.id"
            type="button"
            class="ap-vi-chip"
            :class="{ active: selectedGeneration === opt.id }"
            @click="selectedGeneration = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>
    </div>

    <div v-if="filteredWatches.length > 0" class="ap-vi-grid">
      <article
        v-for="item in filteredWatches"
        :key="item.ref"
        class="ap-vi-card"
      >
        <div class="ap-vi-card-top">
          <span class="ap-vi-card-ref">Ref. {{ item.ref }}</span>
          <span class="ap-vi-card-series">{{ item.series }}</span>
        </div>
        <h4 class="ap-vi-card-title">{{ item.title }}</h4>
        <div class="ap-vi-card-block">
          <span class="ap-vi-label">一句话必杀视觉锚点</span>
          <p class="ap-vi-text">{{ item.anchor }}</p>
        </div>
        <div class="ap-vi-card-block is-warn">
          <span class="ap-vi-label is-warn">高危易混 / 二手防坑红线</span>
          <p class="ap-vi-text">{{ item.confusion }}</p>
        </div>
        <div class="ap-vi-card-foot">
          <a :href="withBase(item.href)" class="ap-vi-link">进入单表专章 →</a>
        </div>
      </article>
    </div>

    <div v-else class="ap-vi-empty">
      <p class="ap-vi-empty-title">当前特征组合在爱彼 17 款核心型号中无匹配</p>
      <p class="ap-vi-empty-desc">
        请检查是否误选了跨系列特征组合（例如“离岸型外露胶圈”配“6点位 AP 标超薄
        Jumbo”，或“极简双针”配“2022 电铸金新世代”），点击下方按钮即可恢复全部 17 款。
      </p>
      <button type="button" class="ap-vi-empty-btn" @click="resetFilters">
        查看全部 17 款型号
      </button>
    </div>
  </div>
</template>

<style scoped>
.ap-vi-shell {
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

.ap-vi-shell *,
.ap-vi-shell *::before,
.ap-vi-shell *::after {
  box-sizing: border-box;
}

.ap-vi-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.22);
}

.ap-vi-header-main {
  flex: 1 1 240px;
  min-width: 0;
}

.ap-vi-badge-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ap-vi-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  background: rgba(56, 189, 248, 0.16);
  border: 1px solid rgba(56, 189, 248, 0.45);
  color: #7dd3fc;
}

.ap-vi-count {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(232, 168, 124, 0.16);
  border: 1px solid rgba(232, 168, 124, 0.45);
  color: #f3c4a3;
}

.ap-vi-title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.ap-vi-subtitle {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #94a3b8;
}

.ap-vi-reset {
  appearance: none;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #0d172c;
  color: #e2e8f0;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.ap-vi-reset:hover:not(:disabled) {
  border-color: #e8a87c;
  color: #fde6d2;
  background: rgba(232, 168, 124, 0.16);
}

.ap-vi-reset:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.ap-vi-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}

.ap-vi-step {
  padding: 12px;
  border-radius: 12px;
  background: rgba(11, 19, 36, 0.78);
  border: 1px solid #1e2d4a;
}

.ap-vi-step-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
}

.ap-vi-step-num {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(232, 168, 124, 0.18);
  border: 1px solid rgba(232, 168, 124, 0.35);
  color: #f3c4a3;
}

.ap-vi-step-name {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
}

.ap-vi-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.ap-vi-chip {
  appearance: none;
  max-width: 100%;
  padding: 6px 11px;
  border-radius: 8px;
  border: 1px solid #2b3d5f;
  background: #0b1220;
  color: #cbd5e1;
  font-size: 12px;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  overflow-wrap: anywhere;
}

.ap-vi-chip:hover {
  border-color: #64748b;
  background: #132038;
}

.ap-vi-chip.active {
  border-color: #e8a87c;
  background: rgba(232, 168, 124, 0.18);
  color: #fde6d2;
  font-weight: 600;
  box-shadow: 0 0 0 1px rgba(232, 168, 124, 0.25);
}

.ap-vi-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.ap-vi-card {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
  padding: 14px;
  border-radius: 12px;
  background: rgba(9, 15, 28, 0.92);
  border: 1px solid #1e2d4a;
  transition: border-color 0.15s ease;
}

.ap-vi-card:hover {
  border-color: #e8a87c;
}

.ap-vi-card-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.ap-vi-card-ref {
  font-family: var(--vp-font-family-mono);
  font-size: 15px;
  font-weight: 800;
  color: #f3c4a3;
}

.ap-vi-card-series {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(56, 189, 248, 0.14);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #7dd3fc;
}

.ap-vi-card-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.ap-vi-card-block {
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #1e293b;
}

.ap-vi-card-block.is-warn {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.28);
}

.ap-vi-label {
  display: block;
  margin-bottom: 3px;
  font-size: 11px;
  font-weight: 700;
  color: #7dd3fc;
}

.ap-vi-label.is-warn {
  color: #fbbf24;
}

.ap-vi-text {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: #cbd5e1;
  overflow-wrap: anywhere;
}

.ap-vi-card-foot {
  margin-top: auto;
  padding-top: 4px;
  display: flex;
  justify-content: flex-end;
}

.ap-vi-link {
  display: inline-flex;
  align-items: center;
  font-size: 12.5px;
  font-weight: 700;
  color: #f3c4a3;
  text-decoration: none;
}

.ap-vi-link:hover {
  text-decoration: underline;
  color: #fde6d2;
}

.ap-vi-empty {
  padding: 24px 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px dashed #334155;
  text-align: center;
}

.ap-vi-empty-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

.ap-vi-empty-desc {
  margin: 0 0 14px;
  font-size: 12.5px;
  color: #94a3b8;
  line-height: 1.5;
}

.ap-vi-empty-btn {
  appearance: none;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid #e8a87c;
  background: rgba(232, 168, 124, 0.16);
  color: #fde6d2;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 720px) {
  .ap-vi-shell {
    padding: 14px 12px;
    border-radius: 12px;
  }

  .ap-vi-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .ap-vi-chip {
    font-size: 11.5px;
    padding: 6px 9px;
  }
}
</style>
