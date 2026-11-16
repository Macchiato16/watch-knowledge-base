<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

type CaseGroupId = 'all' | 'nautilus-men' | 'nautilus-ladies' | 'cubitus' | 'aquanaut'
type DialFeatureId =
  | 'all'
  | 'two-hand'
  | 'three-hand-3'
  | 'three-hand-6'
  | 'travel-time'
  | 'chronograph'
  | 'calendar-moonphase'
type BezelSideId = 'all' | 'plain-no-pusher' | 'diamond-bezel' | 'side-pushers'

interface FilterOption<T extends string> {
  id: T
  label: string
  hint?: string
}

interface WatchAnchorCard {
  ref: string
  title: string
  series: string
  caseGroup: Exclude<CaseGroupId, 'all'>
  dialFeatures: Exclude<DialFeatureId, 'all'>[]
  bezelSides: Exclude<BezelSideId, 'all'>[]
  anchor: string
  confusion: string
  href: string
}

const caseOptions: FilterOption<CaseGroupId>[] = [
  { id: 'all', label: '全部（24款）' },
  { id: 'nautilus-men', label: '八角双耳 + 水平横纹（男款鹦鹉螺 8款）' },
  { id: 'nautilus-ladies', label: '八角双耳 + 起伏波浪纹（女款鹦鹉螺 2款）' },
  { id: 'cubitus', label: '圆角方形 + 水平横纹（方形鹦鹉螺 Cubitus 3款）' },
  { id: 'aquanaut', label: '八角无左耳 + 棋盘格纹（男女款手雷 11款）' }
]

const dialOptions: FilterOption<DialFeatureId>[] = [
  { id: 'all', label: '全部' },
  { id: 'two-hand', label: '无秒针无日历（纯粹双针）' },
  { id: 'three-hand-3', label: '大三针 + 3点日历窗' },
  { id: 'three-hand-6', label: '大三针 + 6点日历窗' },
  { id: 'travel-time', label: '双时针 + 昼夜窗（两地时）' },
  { id: 'chronograph', label: '带计时副盘（右侧按键）' },
  { id: 'calendar-moonphase', label: '带月相（年历/万年历/大日历/动储）' }
]

const bezelOptions: FilterOption<BezelSideId>[] = [
  { id: 'all', label: '全部' },
  { id: 'plain-no-pusher', label: '素圈无侧键' },
  { id: 'diamond-bezel', label: '原厂钻圈' },
  { id: 'side-pushers', label: '壳侧带凸出计时/快调键' }
]

const watchCatalog: WatchAnchorCard[] = [
  // 1. 男款鹦鹉螺 (8款)
  {
    ref: 'Ref. 5711',
    title: 'Nautilus 经典大三针日历',
    series: '男款鹦鹉螺',
    caseGroup: 'nautilus-men',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['plain-no-pusher', 'diamond-bezel'],
    anchor: '40mm 经典三件式旋入表壳 + 3点日历窗（早期无框、后期带金属框），蝴蝶扣收尾，覆盖精钢/玫瑰金/铂金。',
    confusion: '易混 5811（41mm 仅白金、两件式一体底壳、标配白金立体日历框与新微调扣）与 5810（无秒针无日历）。',
    href: '/brands/patek-philippe/nautilus/5711'
  },
  {
    ref: 'Ref. 5811',
    title: 'Nautilus 新一代 41mm 白金大三针',
    series: '男款鹦鹉螺',
    caseGroup: 'nautilus-men',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['plain-no-pusher'],
    anchor: '41mm 且仅出 18K 白金蓝盘，采用致敬初代的两件式一体表壳（无传统底盖接缝），标配白金立体日历框与拉出式微调表扣。',
    confusion: '易混 5711/1A（40mm 精钢或金款、三件式结构、底壳可见明显接缝）。',
    href: '/brands/patek-philippe/nautilus/5811'
  },
  {
    ref: 'Ref. 5810',
    title: 'Nautilus 50周年超薄双针',
    series: '男款鹦鹉螺',
    caseGroup: 'nautilus-men',
    dialFeatures: ['two-hand'],
    bezelSides: ['plain-no-pusher'],
    anchor: '男款鹦鹉螺唯一“无秒针、无日历窗”的纯粹双针盘面，厚度仅 6.9mm；翻看背透可见 240 珍珠陀刻有“50 1976 - 2026”。',
    confusion: '易混 5711 / 5811（两者均有中置大秒针与 3 点位日历窗）。',
    href: '/brands/patek-philippe/nautilus/5810'
  },
  {
    ref: 'Ref. 5712',
    title: 'Nautilus 动储月相指针日历',
    series: '男款鹦鹉螺',
    caseGroup: 'nautilus-men',
    dialFeatures: ['calendar-moonphase'],
    bezelSides: ['plain-no-pusher'],
    anchor: '圆八角表壳配标志性“不对称三小盘”布局：10点动储扇区、7点月相与指针日历同轴、4点偏心小秒盘。',
    confusion: '鹦鹉螺唯一不对称盘面（一眼区隔对称月相 5726）；重点区分带 /1 链带款与无 /1 皮带款（固定端粒不可互改）。',
    href: '/brands/patek-philippe/nautilus/5712'
  },
  {
    ref: 'Ref. 5726',
    title: 'Nautilus 年历月相 24 小时',
    series: '男款鹦鹉螺',
    caseGroup: 'nautilus-men',
    dialFeatures: ['calendar-moonphase'],
    bezelSides: ['plain-no-pusher'],
    anchor: '盘面完全左右对称：12点并排“星期/月份”双矩形窗 + 6点大日历窗与 24 小时/月相圈，壳侧无凸出按键。',
    confusion: '易混 5740（万年历无 12 点双矩形窗，改为 3/6/9 三圆盘且表壳极薄）与 5712（不对称盘面）。',
    href: '/brands/patek-philippe/nautilus/5726'
  },
  {
    ref: 'Ref. 5980',
    title: 'Nautilus 单体飞返计时',
    series: '男款鹦鹉螺',
    caseGroup: 'nautilus-men',
    dialFeatures: ['chronograph'],
    bezelSides: ['side-pushers'],
    anchor: '仅表壳右侧有两枚计时按键（左耳完整无按键），6点位单个“同轴盘中盘”计时累计器 + 3点位矩形日历窗。',
    confusion: '易混 5990（左耳裂开变成上下两枚按键、共四按键，且 12 点为指针日历、左右有 LOCAL/HOME 窗）。',
    href: '/brands/patek-philippe/nautilus/5980'
  },
  {
    ref: 'Ref. 5990',
    title: 'Nautilus 双时区飞返计时',
    series: '男款鹦鹉螺',
    caseGroup: 'nautilus-men',
    dialFeatures: ['travel-time', 'chronograph'],
    bezelSides: ['side-pushers'],
    anchor: '左耳集成上下两枚时区快调键、右侧两枚计时键（全系唯一四侧键），12点指针日历 + 3/9点 HOME/LOCAL 昼夜窗。',
    confusion: '易混 5980（左耳完好无按键、仅有右侧双计时键、3点位方窗日历）。',
    href: '/brands/patek-philippe/nautilus/5990'
  },
  {
    ref: 'Ref. 5740',
    title: 'Nautilus 超薄万年历',
    series: '男款鹦鹉螺',
    caseGroup: 'nautilus-men',
    dialFeatures: ['calendar-moonphase'],
    bezelSides: ['plain-no-pusher'],
    anchor: '仅出 18K 白金蓝盘，12点无矩形窗而是 3/6/9 三枚对称万年历圆盘，厚度仅 8.42mm（最薄复杂鹦鹉螺）。',
    confusion: '易混 5726（12点有并排星期月份矩形窗、表壳明显更厚达 11.3mm）。',
    href: '/brands/patek-philippe/nautilus/5740'
  },

  // 2. 女款鹦鹉螺 (2款)
  {
    ref: 'Ref. 7010',
    title: 'Nautilus 女款石英钻圈',
    series: '女款鹦鹉螺',
    caseGroup: 'nautilus-ladies',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['diamond-bezel'],
    anchor: '32mm 小表径 + 水平起伏波浪纹，日历窗位于 3 点位，全系标配 46 颗圆钻表圈且均为密底石英跳秒。',
    confusion: '易混 7118（35.2mm、日历窗在 6 点位、背透自动机械扫秒、分素圈与 56 颗钻圈）。',
    href: '/brands/patek-philippe/nautilus/7010'
  },
  {
    ref: 'Ref. 7118',
    title: 'Nautilus 女款自动机械',
    series: '女款鹦鹉螺',
    caseGroup: 'nautilus-ladies',
    dialFeatures: ['three-hand-6'],
    bezelSides: ['plain-no-pusher', 'diamond-bezel'],
    anchor: '35.2mm 表径 + 水平起伏波浪纹，日历窗位于 6 点位，背透自动机械扫秒（分 /1 素圈与 /1200 56颗钻圈）。',
    confusion: '易混 7010（32mm、日历窗在 3 点位、密底石英机芯）。',
    href: '/brands/patek-philippe/nautilus/7118'
  },

  // 3. Cubitus 方形鹦鹉螺 (3款)
  {
    ref: 'Ref. 5821',
    title: 'Cubitus 45mm 方形大三针',
    series: 'Cubitus 方形',
    caseGroup: 'cubitus',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['plain-no-pusher'],
    anchor: '45mm 大号圆角方形 + 横条纹 + 3点日历，材质与盘面完全专属：仅精钢橄榄绿盘（/1A）与间金蓝盘（/1AR）。',
    confusion: '易混 7128（40mm 缩小版，仅全白金蓝灰盘或全玫瑰金棕盘，材质配色与 5821 零重叠）。',
    href: '/brands/patek-philippe/cubitus/5821'
  },
  {
    ref: 'Ref. 5822',
    title: 'Cubitus 铂金瞬跳大日历月相',
    series: 'Cubitus 方形',
    caseGroup: 'cubitus',
    dialFeatures: ['calendar-moonphase'],
    bezelSides: ['plain-no-pusher'],
    anchor: '45mm 铂金方形（6点表圈镶梯钻），12点位并排双窗瞬跳大日历 + 7点星期与月相同轴 + 4点半偏心小秒盘。',
    confusion: 'Cubitus 方形系列目前唯一复杂功能款，一眼区隔同门大三针 5821 / 7128；重点核查 6 点位长方钻铂金暗记。',
    href: '/brands/patek-philippe/cubitus/5822'
  },
  {
    ref: 'Ref. 7128',
    title: 'Cubitus 40mm 中性方形大三针',
    series: 'Cubitus 方形',
    caseGroup: 'cubitus',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['plain-no-pusher'],
    anchor: '40mm 黄金比例圆角方形 + 3点日历，仅出全 18K 白金蓝灰盘（/1G）与全 18K 玫瑰金棕盘（/1R）。',
    confusion: '易混 5821（45mm 尺寸大一圈，且 5821 仅有精钢绿盘与间金蓝盘）。',
    href: '/brands/patek-philippe/cubitus/7128'
  },

  // 4. 男款手雷 Aquanaut (5款)
  {
    ref: 'Ref. 5167',
    title: 'Aquanaut 经典 40.8mm 大三针',
    series: '男款手雷',
    caseGroup: 'aquanaut',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['plain-no-pusher'],
    anchor: '40.8mm 经典手雷比例，仅精钢黑盘（5167A / 5167/1A）与玫瑰金棕盘（5167R），3点日历取代数字 3。',
    confusion: '易混 5168G（42.2mm Jumbo 尺寸更大，且 18K 白金独占午夜蓝或卡其绿盘）。',
    href: '/brands/patek-philippe/aquanaut/5167'
  },
  {
    ref: 'Ref. 5168',
    title: 'Aquanaut 42.2mm 白金 Jumbo',
    series: '男款手雷',
    caseGroup: 'aquanaut',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['plain-no-pusher'],
    anchor: '42.2mm 大号手雷表壳，18K 白金独占材质，盘面与胶带仅见渐变午夜蓝（-001）与卡其绿（-010）。',
    confusion: '易混 5167（40.8mm 精钢黑盘或玫瑰金棕盘，无白金蓝/绿版本）。',
    href: '/brands/patek-philippe/aquanaut/5168'
  },
  {
    ref: 'Ref. 5164',
    title: 'Aquanaut Travel Time 两地时',
    series: '男款手雷',
    caseGroup: 'aquanaut',
    dialFeatures: ['travel-time'],
    bezelSides: ['side-pushers'],
    anchor: '表壳左侧带两枚醒目的弧形时区加减凸键，6点位配有标志性“地球经纬线格纹”指针日历盘 + LOCAL/HOME 昼夜窗。',
    confusion: '易混 5968（计时按键在右侧而非左侧，6点位是八角形计时分盘）与 5269（女款无左侧凸键）。',
    href: '/brands/patek-philippe/aquanaut/5164'
  },
  {
    ref: 'Ref. 5261',
    title: 'Aquanaut 玫瑰金年历月相',
    series: '男款手雷',
    caseGroup: 'aquanaut',
    dialFeatures: ['calendar-moonphase'],
    bezelSides: ['plain-no-pusher'],
    anchor: '手雷系列首款非计时复杂款：18K 玫瑰金配蓝灰棋盘格盘，12点正上方为大型扇形月相窗，对称分布 9点月份+3点星期+6点日历窗。',
    confusion: '易混 5164R（无 12 点月相，左侧有双凸键）与 5968（右侧有双计时按键）。',
    href: '/brands/patek-philippe/aquanaut/5261'
  },
  {
    ref: 'Ref. 5968',
    title: 'Aquanaut 飞返计时',
    series: '男款手雷',
    caseGroup: 'aquanaut',
    dialFeatures: ['chronograph'],
    bezelSides: ['side-pushers'],
    anchor: '42.2mm 壳体右侧带两枚扁平泵式矩形计时按键，6点位为圆角八角形 60 分钟计时盘 + 3点日历窗（精钢橙针/白金蓝绿）。',
    confusion: '易混 5164（双按键在表壳左侧、6点是指针日历圆盘）。',
    href: '/brands/patek-philippe/aquanaut/5968'
  },

  // 5. 女款手雷 Aquanaut Luce (6款)
  {
    ref: 'Ref. 5067',
    title: 'Aquanaut Luce 老代精钢石英钻圈',
    series: '女款手雷（老三代）',
    caseGroup: 'aquanaut',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['diamond-bezel'],
    anchor: '35.6mm 外露传统生耳 + 46 颗钻圈；3点位“无数字 3”直接开日历窗，精钢密底石英跳秒。',
    confusion: '极易混 5069G（同为银白色壳，但 5069G 是 18K 白金背透机械且 3 点左侧保留数字 3，错报差价巨大）与 5267（38.8mm 一体胶带）。',
    href: '/brands/patek-philippe/aquanaut/5067'
  },
  {
    ref: 'Ref. 5068',
    title: 'Aquanaut Luce 老代玫瑰金自动钻圈',
    series: '女款手雷（老三代）',
    caseGroup: 'aquanaut',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['diamond-bezel'],
    anchor: '35.6mm 外露生耳 + 46 颗钻圈 + 18K 玫瑰金，最大特征是“3点日历窗左侧完整保留数字 3”，背透自动机械。',
    confusion: '易混 5268/200R（38.8mm 一体顺滑包覆胶带、48颗钻且 3 点位无数字 3）。',
    href: '/brands/patek-philippe/aquanaut/5068'
  },
  {
    ref: 'Ref. 5069',
    title: 'Aquanaut Luce 老代白金自动钻圈',
    series: '女款手雷（老三代）',
    caseGroup: 'aquanaut',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['diamond-bezel'],
    anchor: '35.6mm 外露生耳 + 46 颗钻圈 + 18K 白金，3点日历窗左侧保留“数字 3”且背透自动机械扫秒，防误报为钢款 5067A。',
    confusion: '生死防错价：5067A 同为银白色但无数字 3、密底石英；5069G 贵金属机械价值悬殊！',
    href: '/brands/patek-philippe/aquanaut/5069'
  },
  {
    ref: 'Ref. 5267',
    title: 'Aquanaut Luce 新代精钢石英钻圈',
    series: '女款手雷（新三代）',
    caseGroup: 'aquanaut',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['diamond-bezel'],
    anchor: '38.8mm 一体顺滑包覆胶带（无外露生耳）+ 48 颗钻圈（/200A），精钢材质配密底石英跳秒，3点日历无数字 3。',
    confusion: '易混 5067A（35.6mm 外露生耳、46颗钻）与 5268/200R（玫瑰金背透机械）。',
    href: '/brands/patek-philippe/aquanaut/5267'
  },
  {
    ref: 'Ref. 5268',
    title: 'Aquanaut Luce 新代玫瑰金自动钻圈',
    series: '女款手雷（新三代）',
    caseGroup: 'aquanaut',
    dialFeatures: ['three-hand-3'],
    bezelSides: ['diamond-bezel'],
    anchor: '38.8mm 一体顺滑胶带 + 48 颗钻圈（/200R）+ 18K 玫瑰金，3点日历无数字 3，背透自动机械扫秒。',
    confusion: '易混 5068R（35.6mm 外露生耳且保留数字 3）与 5269/200R（6点有 HOME 窗且无日历）。',
    href: '/brands/patek-philippe/aquanaut/5268'
  },
  {
    ref: 'Ref. 5269',
    title: 'Aquanaut Luce 新代石英两地时',
    series: '女款手雷（新三代）',
    caseGroup: 'aquanaut',
    dialFeatures: ['travel-time'],
    bezelSides: ['plain-no-pusher', 'diamond-bezel'],
    anchor: '38.8mm 一体胶带玫瑰金，6点位带“HOME”昼夜窗且全盘无日历窗，表壳左侧无凸键（表冠直接调时区），分素圈与 48钻圈 /200R。',
    confusion: '易混 5268/200R（3点有日历、无 HOME 窗、背透机械）与 5164（左侧有两枚突出按键）。',
    href: '/brands/patek-philippe/aquanaut/5269'
  }
]

const selectedCase = ref<CaseGroupId>('all')
const selectedDial = ref<DialFeatureId>('all')
const selectedBezel = ref<BezelSideId>('all')

const filteredWatches = computed(() => {
  return watchCatalog.filter((item) => {
    const matchCase = selectedCase.value === 'all' || item.caseGroup === selectedCase.value
    const matchDial =
      selectedDial.value === 'all' || item.dialFeatures.includes(selectedDial.value)
    const matchBezel =
      selectedBezel.value === 'all' || item.bezelSides.includes(selectedBezel.value)
    return matchCase && matchDial && matchBezel
  })
})

const hasActiveFilter = computed(
  () =>
    selectedCase.value !== 'all' ||
    selectedDial.value !== 'all' ||
    selectedBezel.value !== 'all'
)

function resetFilters() {
  selectedCase.value = 'all'
  selectedDial.value = 'all'
  selectedBezel.value = 'all'
}
</script>

<template>
  <div class="pp-vi-shell">
    <div class="pp-vi-header">
      <div class="pp-vi-header-main">
        <div class="pp-vi-badge-row">
          <span class="pp-vi-badge">看图识表 · 特征锚点定位器</span>
          <span class="pp-vi-count">当前匹配 {{ filteredWatches.length }} / {{ watchCatalog.length }} 款</span>
        </div>
        <h3 class="pp-vi-title">百达翡丽 24 款热门运动表三步视觉漏斗</h3>
        <p class="pp-vi-subtitle">
          收到无型号腕表照片时，按「壳型与盘纹 → 指针/日历/副盘 → 表圈与侧键」依次点选特征，3 秒锁定目标型号与防错价提醒。
        </p>
      </div>
      <button
        type="button"
        class="pp-vi-reset"
        :disabled="!hasActiveFilter"
        @click="resetFilters"
      >
        重置筛选
      </button>
    </div>

    <div class="pp-vi-steps">
      <section class="pp-vi-step">
        <div class="pp-vi-step-head">
          <span class="pp-vi-step-num">第 1 步</span>
          <span class="pp-vi-step-name">表壳轮廓与盘面底纹</span>
        </div>
        <div class="pp-vi-chips">
          <button
            v-for="opt in caseOptions"
            :key="opt.id"
            type="button"
            class="pp-vi-chip"
            :class="{ active: selectedCase === opt.id }"
            @click="selectedCase = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>

      <section class="pp-vi-step">
        <div class="pp-vi-step-head">
          <span class="pp-vi-step-num">第 2 步</span>
          <span class="pp-vi-step-name">盘面指针 / 日历 / 副盘视觉特征</span>
        </div>
        <div class="pp-vi-chips">
          <button
            v-for="opt in dialOptions"
            :key="opt.id"
            type="button"
            class="pp-vi-chip"
            :class="{ active: selectedDial === opt.id }"
            @click="selectedDial = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>

      <section class="pp-vi-step">
        <div class="pp-vi-step-head">
          <span class="pp-vi-step-num">第 3 步</span>
          <span class="pp-vi-step-name">表圈与侧键特征</span>
        </div>
        <div class="pp-vi-chips">
          <button
            v-for="opt in bezelOptions"
            :key="opt.id"
            type="button"
            class="pp-vi-chip"
            :class="{ active: selectedBezel === opt.id }"
            @click="selectedBezel = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>
    </div>

    <div v-if="filteredWatches.length > 0" class="pp-vi-grid">
      <article
        v-for="item in filteredWatches"
        :key="item.ref"
        class="pp-vi-card"
      >
        <div class="pp-vi-card-top">
          <span class="pp-vi-card-ref">{{ item.ref }}</span>
          <span class="pp-vi-card-series">{{ item.series }}</span>
        </div>
        <h4 class="pp-vi-card-title">{{ item.title }}</h4>
        <div class="pp-vi-card-block">
          <span class="pp-vi-label">一眼必杀特征锚点</span>
          <p class="pp-vi-text">{{ item.anchor }}</p>
        </div>
        <div class="pp-vi-card-block is-warn">
          <span class="pp-vi-label is-warn">易混型号提醒</span>
          <p class="pp-vi-text">{{ item.confusion }}</p>
        </div>
        <div class="pp-vi-card-foot">
          <a :href="withBase(item.href)" class="pp-vi-link">进入型号专章 →</a>
        </div>
      </article>
    </div>

    <div v-else class="pp-vi-empty">
      <p class="pp-vi-empty-title">当前特征组合在百达翡丽 24 款主流运动表中无匹配型号</p>
      <p class="pp-vi-empty-desc">
        请检查是否误选了不存在的跨组特征（如女款波浪纹与计时按键组合），或点击下方按钮恢复全部 24 款。
      </p>
      <button type="button" class="pp-vi-empty-btn" @click="resetFilters">
        查看全部 24 款型号
      </button>
    </div>
  </div>
</template>

<style scoped>
.pp-vi-shell {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  margin: 20px 0;
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(160deg, #0b1220 0%, #0f172a 55%, #111827 100%);
  border: 1px solid #1e293b;
  color: #e2e8f0;
  overflow-x: hidden;
}

.pp-vi-shell *,
.pp-vi-shell *::before,
.pp-vi-shell *::after {
  box-sizing: border-box;
}

.pp-vi-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #1e293b;
}

.pp-vi-header-main {
  flex: 1 1 240px;
  min-width: 0;
}

.pp-vi-badge-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.pp-vi-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  background: rgba(245, 158, 11, 0.16);
  border: 1px solid rgba(245, 158, 11, 0.45);
  color: #fcd34d;
}

.pp-vi-count {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.14);
  border: 1px solid rgba(59, 130, 246, 0.38);
  color: #93c5fd;
}

.pp-vi-title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.pp-vi-subtitle {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #94a3b8;
}

.pp-vi-reset {
  appearance: none;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #131c31;
  color: #e2e8f0;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.pp-vi-reset:hover:not(:disabled) {
  border-color: #f59e0b;
  color: #fde68a;
  background: rgba(245, 158, 11, 0.12);
}

.pp-vi-reset:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pp-vi-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}

.pp-vi-step {
  padding: 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid #1e293b;
}

.pp-vi-step-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
}

.pp-vi-step-num {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(148, 163, 184, 0.16);
  color: #cbd5e1;
}

.pp-vi-step-name {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
}

.pp-vi-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.pp-vi-chip {
  appearance: none;
  max-width: 100%;
  padding: 6px 11px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #0b1220;
  color: #cbd5e1;
  font-size: 12px;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  overflow-wrap: anywhere;
}

.pp-vi-chip:hover {
  border-color: #64748b;
  background: #131c31;
}

.pp-vi-chip.active {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.16);
  color: #fde68a;
  font-weight: 600;
  box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.22);
}

.pp-vi-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.pp-vi-card {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
  padding: 14px;
  border-radius: 12px;
  background: rgba(11, 18, 32, 0.92);
  border: 1px solid #1e293b;
  transition: border-color 0.15s ease;
}

.pp-vi-card:hover {
  border-color: #334155;
}

.pp-vi-card-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.pp-vi-card-ref {
  font-family: var(--vp-font-family-mono);
  font-size: 15px;
  font-weight: 800;
  color: #fde68a;
}

.pp-vi-card-series {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.14);
  border: 1px solid rgba(59, 130, 246, 0.35);
  color: #93c5fd;
}

.pp-vi-card-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.pp-vi-card-block {
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #1e293b;
}

.pp-vi-card-block.is-warn {
  background: rgba(245, 158, 11, 0.06);
  border-color: rgba(245, 158, 11, 0.25);
}

.pp-vi-label {
  display: block;
  margin-bottom: 3px;
  font-size: 11px;
  font-weight: 700;
  color: #38bdf8;
}

.pp-vi-label.is-warn {
  color: #fbbf24;
}

.pp-vi-text {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: #cbd5e1;
  overflow-wrap: anywhere;
}

.pp-vi-card-foot {
  margin-top: auto;
  padding-top: 4px;
  display: flex;
  justify-content: flex-end;
}

.pp-vi-link {
  display: inline-flex;
  align-items: center;
  font-size: 12.5px;
  font-weight: 700;
  color: #fcd34d;
  text-decoration: none;
}

.pp-vi-link:hover {
  text-decoration: underline;
  color: #fde68a;
}

.pp-vi-empty {
  padding: 24px 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px dashed #334155;
  text-align: center;
}

.pp-vi-empty-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

.pp-vi-empty-desc {
  margin: 0 0 14px;
  font-size: 12.5px;
  color: #94a3b8;
  line-height: 1.5;
}

.pp-vi-empty-btn {
  appearance: none;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid #f59e0b;
  background: rgba(245, 158, 11, 0.16);
  color: #fde68a;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 720px) {
  .pp-vi-shell {
    padding: 14px 12px;
    border-radius: 12px;
  }

  .pp-vi-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .pp-vi-chip {
    font-size: 11.5px;
    padding: 6px 9px;
  }
}
</style>
