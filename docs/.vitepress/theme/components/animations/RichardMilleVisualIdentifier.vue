<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

type ScrewCountId = 'all' | '8-screws' | '12-screws'
type SidePusherId =
  | 'all'
  | 'no-pusher'
  | 'right-4'
  | 'left-7-right-2'
  | 'right-2-chrono'
  | 'right-2-left-9-gmt'
  | 'five-pushers'
type DialLayoutId =
  | 'all'
  | 'two-hand'
  | 'three-hand-no-date'
  | 'annual-flyback'
  | 'rm-72-01-flyback'
  | 'rm-65-01-rattrapante'

interface FilterOption<T extends string> {
  id: T
  label: string
}

interface WatchAnchorCard {
  ref: string
  title: string
  series: string
  screws: Exclude<ScrewCountId, 'all'>[]
  sidePusher: Exclude<SidePusherId, 'all'>
  dialLayout: Exclude<DialLayoutId, 'all'>
  anchor: string
  confusion: string
  href: string
}

const screwOptions: FilterOption<ScrewCountId>[] = [
  { id: 'all', label: '全部（14款）' },
  { id: '8-screws', label: '8 颗花键螺丝（小号/超薄/初代镁铝）' },
  { id: '12-screws', label: '12 颗花键螺丝（主流运动与计时）' }
]

const pusherOptions: FilterOption<SidePusherId>[] = [
  { id: 'all', label: '全部' },
  { id: 'no-pusher', label: '光洁无侧键（仅表冠）' },
  { id: 'right-4', label: '仅右侧单按键（4点位）' },
  { id: 'left-7-right-2', label: '左7点 + 右2点对称双键' },
  { id: 'right-2-chrono', label: '右侧双计时键（无左键）' },
  { id: 'right-2-left-9-gmt', label: '右侧双计时键 + 左9点单GMT键' },
  { id: 'five-pushers', label: '右双键 + 左8点快速上链与10点追针（共5侧键）' }
]

const dialOptions: FilterOption<DialLayoutId>[] = [
  { id: 'all', label: '全部' },
  { id: 'two-hand', label: '极简双针（无秒针）' },
  { id: 'three-hand-no-date', label: '纯粹大三针无日历' },
  { id: 'annual-flyback', label: '12点双窗大日历 + 年历飞返三眼' },
  { id: 'rm-72-01-flyback', label: '3-8-11数字 + 蓝橙绿不对称飞返' },
  { id: 'rm-65-01-rattrapante', label: '11点垂直日历 + 多色编码双秒追针' }
]

const watchCatalog: WatchAnchorCard[] = [
  // 07 系列（2款）
  {
    ref: 'RM 07-01',
    title: '现代女装核心霸主（自动镂空）',
    series: '07 女装主力',
    screws: ['8-screws'],
    sidePusher: 'no-pusher',
    dialLayout: 'two-hand',
    anchor:
      '修长小酒桶正面 8 颗花键螺丝，壳侧光洁无侧键；极简双针无秒针无日历，盘面中央必带宝石/碳纤维/陶瓷中心实心饰片（CRMA2 机芯）。',
    confusion:
      '易混 RM 07-04（正面 12 颗花键螺丝、4 点位撞色按键、全镂空无中心饰片）及 RM 67-01（宽大超薄男款、有 5 点日历）。',
    href: '/brands/richard-mille/07/rm-07-01'
  },
  {
    ref: 'RM 07-04',
    title: '36 克女性超轻运动自动腕表',
    series: '07 女性运动',
    screws: ['12-screws'],
    sidePusher: 'right-4',
    dialLayout: 'two-hand',
    anchor:
      '修长小酒桶却配正面 12 颗花键螺丝，右侧 4 点位独有撞色 Quartz TPT® 功能按键，对应 5–6 点垂直 H / N / W 档位指示，全盘镂空无中心饰片。',
    confusion:
      '易混 RM 07-01（8 颗螺丝、无 4 点按键、中央有饰片）与 RM 67-02（宽酒桶 8 颗螺丝、无按键、弹性舒适带）。',
    href: '/brands/richard-mille/07/rm-07-04'
  },

  // 11 系列（3款）
  {
    ref: 'RM 011',
    title: '初代大号飞返计时年历开山款',
    series: '11 大号飞返',
    screws: ['12-screws'],
    sidePusher: 'right-2-chrono',
    dialLayout: 'annual-flyback',
    anchor:
      '12 颗花键螺丝大号圆润酒桶（宽约 40mm），中壳两侧平滑无纵向凹槽；右侧为斜切扁平双计时键 + 圆滑表冠，盘面 12 点双窗大日历 + 4–5 点月份窗 + 三眼飞返。',
    confusion:
      '易混 RM 11-03（中壳有立体空气动力学凹槽、赛车踏板竖纹按键与轮毂表冠）及 RM 11-05（左侧多出 9 点 GMT 键）。',
    href: '/brands/richard-mille/11/rm-011'
  },
  {
    ref: 'RM 11-03',
    title: '空气动力学棱角飞返年历主力',
    series: '11 大号飞返',
    screws: ['12-screws'],
    sidePusher: 'right-2-chrono',
    dialLayout: 'annual-flyback',
    anchor:
      '44.50mm 宽体大酒桶配 12 颗花键螺丝，中层表壳两侧带立体纵向凹槽立柱；仅右侧配 F1 踏板竖纹双计时键与轮毂造型大表冠，12 点双窗大日历 + 年历三眼。',
    confusion:
      '易混 RM 011（无中壳凹槽、圆润按键）与 RM 11-05（左 9 点多一枚 GMT 快调键）；更勿混入无大日历的 RM 72-01。',
    href: '/brands/richard-mille/11/rm-11-03'
  },
  {
    ref: 'RM 11-05',
    title: 'Cermet 金属陶瓷 GMT 飞返年历',
    series: '11 大号飞返',
    screws: ['12-screws'],
    sidePusher: 'right-2-left-9-gmt',
    dialLayout: 'annual-flyback',
    anchor:
      '正面 12 颗花键螺丝 + 独家哑光深灰 Cermet 金属陶瓷表圈（无 11-03 侧面深凹槽），右侧双计时键 + 左侧 9 点位独有 GMT 快调键，12 点双窗大日历 + 中置第二时区针。',
    confusion:
      '11 家族唯一在左侧 9 点位带 GMT 按键的现行主力（区别于无左键的 RM 011 / RM 11-03）；注意核对 Cermet 表圈防崩角。',
    href: '/brands/richard-mille/11/rm-11-05'
  },

  // 35 系列（4款）
  {
    ref: 'RM 035',
    title: '初代镁铝手动“小牛”与美洲陶瓷限量',
    series: '35 纳达尔手动',
    screws: ['8-screws', '12-screws'],
    sidePusher: 'no-pusher',
    dialLayout: 'three-hand-no-date',
    anchor:
      '标准镁铝合金版为正面 8 颗花键螺丝 + 哑光深灰黑无云纹壳 + 实心密底（9 点红标 RM035）；Americas / Black Toro 陶瓷限量版则升级为 12 颗螺丝 + 透底。全壳无侧键、纯大三针无日历。',
    confusion:
      '高危防坑：标准 RM 035 为不可抛光的镁铝氧化密底（防磕碰露白），而 RM 35-01 为 12 颗螺丝 Carbon TPT® 波浪纹；美洲限量版虽是 12 颗螺丝但仍属 RM 035。',
    href: '/brands/richard-mille/35/rm-035'
  },
  {
    ref: 'RM 35-01',
    title: 'Carbon TPT® 手动上链纳达尔',
    series: '35 纳达尔手动',
    screws: ['12-screws'],
    sidePusher: 'no-pusher',
    dialLayout: 'three-hand-no-date',
    anchor:
      '正面 12 颗花键螺丝 + Carbon TPT® 波浪云纹表壳（侧翼带双凹槽护肩），光洁无侧键，纯大三针无日历；9 点位黄标 RM35-01 RAFA，配 RMUL3 手动机芯与实心 Carbon TPT® 密底盖。',
    confusion:
      '正面极易与自动款 RM 35-02 撞脸！切分铁律：翻看背面，实心 Carbon TPT® 密底（手动）是 RM 35-01，蓝宝石透底带可变几何自动摆陀是 RM 35-02（透底无摆陀则是 RM 055）。',
    href: '/brands/richard-mille/35/rm-35-01'
  },
  {
    ref: 'RM 35-02',
    title: '首款自动上链纳达尔（红魔等）',
    series: '35 纳达尔自动',
    screws: ['12-screws'],
    sidePusher: 'no-pusher',
    dialLayout: 'three-hand-no-date',
    anchor:
      '正面 12 颗花键螺丝（常见红白 Quartz TPT®“红魔”或黑碳壳），光洁无侧键，纯大三针无日历；9 点位黄底 RM35-02 RAFA，背面透底可见 RMAL1 自动摆陀。',
    confusion:
      '碳纤维版易混手动 RM 35-01（看背透是否有自动陀）及全镂空无数字的 RM 055；红色款勿混入左7右2双侧键的 RM 35-03。',
    href: '/brands/richard-mille/35/rm-35-02'
  },
  {
    ref: 'RM 35-03',
    title: '专利蝶形摆陀自动纳达尔旗舰',
    series: '35 纳达尔自动',
    screws: ['12-screws'],
    sidePusher: 'left-7-right-2',
    dialLayout: 'three-hand-no-date',
    anchor:
      '正面 12 颗花键螺丝 + 纯大三针无日历，壳侧独有“左 7 点 SPORT 键 + 右 2 点 SELECTOR 键”对称双键；盘面 6 点带蝶形摆陀 ON/OFF 窗，2 点带 W/N/H 指示。',
    confusion:
      '35 家族唯一带双侧功能键的型号，一眼区隔光洁无侧键的 RM 035 / 35-01 / 35-02；背面可看专利双扇蝶形摆陀。',
    href: '/brands/richard-mille/35/rm-35-03'
  },

  // 55 系列（1款）
  {
    ref: 'RM 055',
    title: '巴巴·沃森 ATZ 白陶瓷手动硬通货',
    series: '55 巴巴·沃森',
    screws: ['12-screws'],
    sidePusher: 'no-pusher',
    dialLayout: 'three-hand-no-date',
    anchor:
      '正面 12 颗花键螺丝（经典为高压 ATZ 纯白喷砂陶瓷圈 + 白胶包覆钛中壳），无任何侧键；盘面全镂空无数字时标，仅保留外圈黑环夜光点与红尖秒针，RMUL2 手动极简透底。',
    confusion:
      '与 35-01/35-02 同为无侧键纯大三针，但 RM 055 盘面无阿拉伯数字且无 9 点 RAFA 铭牌，桥板呈极致对称工字通透骨架。',
    href: '/brands/richard-mille/55/rm-055'
  },

  // 65 系列（1款）
  {
    ref: 'RM 65-01',
    title: '5Hz 高振频自动双秒追针旗舰',
    series: '65 追针旗舰',
    screws: ['12-screws'],
    sidePusher: 'five-pushers',
    dialLayout: 'rm-65-01-rattrapante',
    anchor:
      '正面 12 颗花键螺丝 + 壳侧多达 5 枚按键（右侧计时双键+表冠同轴 SELECT 键，左侧 10 点追针键 + 8 点独创橙/红快速上链键）；盘面 11 点绿色垂直日历 + 多色编码高振频三眼。',
    confusion:
      '常与 11-03、72-01 并列计时三旗舰，但 RM 65-01 是唯一具备左 8 点快速上链键（共 5 侧键）与 11 点垂直日历的超级追针表。',
    href: '/brands/richard-mille/65/rm-65-01'
  },

  // 67 系列（2款）
  {
    ref: 'RM 67-01',
    title: '7.75 mm 都市超薄自动正装酒桶',
    series: '67 超薄双生花',
    screws: ['8-screws'],
    sidePusher: 'no-pusher',
    dialLayout: 'two-hand',
    anchor:
      '38.70×47.52×7.75mm 超薄金属（钛/红金/白金）宽酒桶，正面 8 颗花键螺丝，无侧键；极简双针但保留 1–12 立体金属数字时标、5 点垂直日历窗与 1–2 点 W/D/H 指示。',
    confusion:
      '同壳型 RM 67-02 彻底取消了 5 点日历窗与 1–2 点 W/D/H 指示，且 RM 67-02 必为 TPT 复合材质配弹性舒适带。',
    href: '/brands/richard-mille/67/rm-67-01'
  },
  {
    ref: 'RM 67-02',
    title: '32 克极致超轻 TPT 运动神作',
    series: '67 超薄双生花',
    screws: ['8-screws'],
    sidePusher: 'no-pusher',
    dialLayout: 'two-hand',
    anchor:
      '正面 8 颗花键螺丝 + 7.80mm 超薄彩色 Quartz/Carbon TPT® 宽酒桶，无侧键；极简双针且取消日历与 W/D/H，桥板手绘运动员国旗色，配不可裁剪的无缝弹性舒适带。',
    confusion:
      '易混 RM 67-01（金属壳、有 5 点日历与 W/D/H）及 RM 07-04（窄酒桶、12 颗螺丝、有 4 点按键与 H/N/W）。',
    href: '/brands/richard-mille/67/rm-67-02'
  },

  // 72 系列（1款）
  {
    ref: 'RM 72-01',
    title: '全自产摆动齿轮双离合飞返计时',
    series: '72 自产飞返',
    screws: ['12-screws'],
    sidePusher: 'right-2-chrono',
    dialLayout: 'rm-72-01-flyback',
    anchor:
      '紧凑中性酒桶（厚 11.68mm）配 12 颗花键螺丝，仅右侧双计时键无左键；盘面仅留 3 / 8 / 11 超大立体数字 + 蓝(9点)/橙(2点)/绿(5点)三色不对称副盘 + 7 点垂直日历。',
    confusion:
      '切勿与 11-03 / 65-01 混淆：RM 72-01 更轻薄紧凑，无 12 点双窗大日历（11-03），也无左侧追针/上链键（65-01）。',
    href: '/brands/richard-mille/72/rm-72-01'
  }
]

const selectedScrew = ref<ScrewCountId>('all')
const selectedPusher = ref<SidePusherId>('all')
const selectedDial = ref<DialLayoutId>('all')

const filteredWatches = computed(() =>
  watchCatalog.filter((watch) => {
    const screwMatch =
      selectedScrew.value === 'all' || watch.screws.includes(selectedScrew.value)
    const pusherMatch =
      selectedPusher.value === 'all' || watch.sidePusher === selectedPusher.value
    const dialMatch =
      selectedDial.value === 'all' || watch.dialLayout === selectedDial.value
    return screwMatch && pusherMatch && dialMatch
  })
)

const hasActiveFilter = computed(
  () =>
    selectedScrew.value !== 'all' ||
    selectedPusher.value !== 'all' ||
    selectedDial.value !== 'all'
)

function resetFilters() {
  selectedScrew.value = 'all'
  selectedPusher.value = 'all'
  selectedDial.value = 'all'
}
</script>

<template>
  <div class="rm-vi-shell">
    <div class="rm-vi-header">
      <div class="rm-vi-header-main">
        <div class="rm-vi-badge-row">
          <span class="rm-vi-badge">看图识表 · 视觉锚点定位器</span>
          <span class="rm-vi-count">当前匹配 {{ filteredWatches.length }} / {{ watchCatalog.length }} 款</span>
        </div>
        <h3 class="rm-vi-title">理查米尔 14 款核心型号三步视觉漏斗</h3>
        <p class="rm-vi-subtitle">
          收到无型号腕表照片时，按「正面花键螺丝颗数 → 壳侧按键分布 → 盘面功能与镂空形态」依次点选，3 秒锁定目标型号与防错价警示。
        </p>
      </div>
      <button
        type="button"
        class="rm-vi-reset"
        :disabled="!hasActiveFilter"
        @click="resetFilters"
      >
        重置筛选
      </button>
    </div>

    <div class="rm-vi-steps">
      <section class="rm-vi-step">
        <div class="rm-vi-step-head">
          <span class="rm-vi-step-num">第 1 步</span>
          <span class="rm-vi-step-name">正面表圈花键螺丝颗数</span>
        </div>
        <div class="rm-vi-chips">
          <button
            v-for="opt in screwOptions"
            :key="opt.id"
            type="button"
            class="rm-vi-chip"
            :class="{ active: selectedScrew === opt.id }"
            @click="selectedScrew = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>

      <section class="rm-vi-step">
        <div class="rm-vi-step-head">
          <span class="rm-vi-step-num">第 2 步</span>
          <span class="rm-vi-step-name">壳侧功能按键分布</span>
        </div>
        <div class="rm-vi-chips">
          <button
            v-for="opt in pusherOptions"
            :key="opt.id"
            type="button"
            class="rm-vi-chip"
            :class="{ active: selectedPusher === opt.id }"
            @click="selectedPusher = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>

      <section class="rm-vi-step">
        <div class="rm-vi-step-head">
          <span class="rm-vi-step-num">第 3 步</span>
          <span class="rm-vi-step-name">盘面核心功能与镂空形态</span>
        </div>
        <div class="rm-vi-chips">
          <button
            v-for="opt in dialOptions"
            :key="opt.id"
            type="button"
            class="rm-vi-chip"
            :class="{ active: selectedDial === opt.id }"
            @click="selectedDial = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>
    </div>

    <div v-if="filteredWatches.length > 0" class="rm-vi-grid">
      <article
        v-for="item in filteredWatches"
        :key="item.ref"
        class="rm-vi-card"
      >
        <div class="rm-vi-card-top">
          <span class="rm-vi-card-ref">{{ item.ref }}</span>
          <span class="rm-vi-card-series">{{ item.series }}</span>
        </div>
        <h4 class="rm-vi-card-title">{{ item.title }}</h4>
        <div class="rm-vi-card-block">
          <span class="rm-vi-label">一句话必杀视觉锚点</span>
          <p class="rm-vi-text">{{ item.anchor }}</p>
        </div>
        <div class="rm-vi-card-block is-warn">
          <span class="rm-vi-label is-warn">高危易混 / 防错价警示</span>
          <p class="rm-vi-text">{{ item.confusion }}</p>
        </div>
        <div class="rm-vi-card-foot">
          <a :href="withBase(item.href)" class="rm-vi-link">进入单表专章 →</a>
        </div>
      </article>
    </div>

    <div v-else class="rm-vi-empty">
      <p class="rm-vi-empty-title">当前特征组合在理查米尔 14 款核心型号中无匹配</p>
      <p class="rm-vi-empty-desc">
        请检查是否误选了跨阵营特征（如 8 颗花键螺丝与飞返计时按键组合），或点击下方按钮恢复全部 14 款。
      </p>
      <button type="button" class="rm-vi-empty-btn" @click="resetFilters">
        查看全部 14 款型号
      </button>
    </div>
  </div>
</template>

<style scoped>
.rm-vi-shell {
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

.rm-vi-shell *,
.rm-vi-shell *::before,
.rm-vi-shell *::after {
  box-sizing: border-box;
}

.rm-vi-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #1e293b;
}

.rm-vi-header-main {
  flex: 1 1 240px;
  min-width: 0;
}

.rm-vi-badge-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.rm-vi-badge {
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

.rm-vi-count {
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

.rm-vi-title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.rm-vi-subtitle {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #94a3b8;
}

.rm-vi-reset {
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

.rm-vi-reset:hover:not(:disabled) {
  border-color: #f59e0b;
  color: #fde68a;
  background: rgba(245, 158, 11, 0.12);
}

.rm-vi-reset:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.rm-vi-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}

.rm-vi-step {
  padding: 12px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid #1e293b;
}

.rm-vi-step-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
}

.rm-vi-step-num {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(148, 163, 184, 0.16);
  color: #cbd5e1;
}

.rm-vi-step-name {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
}

.rm-vi-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.rm-vi-chip {
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

.rm-vi-chip:hover {
  border-color: #64748b;
  background: #131c31;
}

.rm-vi-chip.active {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.16);
  color: #fde68a;
  font-weight: 600;
  box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.22);
}

.rm-vi-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.rm-vi-card {
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

.rm-vi-card:hover {
  border-color: #334155;
}

.rm-vi-card-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.rm-vi-card-ref {
  font-family: var(--vp-font-family-mono);
  font-size: 15px;
  font-weight: 800;
  color: #fde68a;
}

.rm-vi-card-series {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.14);
  border: 1px solid rgba(59, 130, 246, 0.35);
  color: #93c5fd;
}

.rm-vi-card-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.rm-vi-card-block {
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #1e293b;
}

.rm-vi-card-block.is-warn {
  background: rgba(245, 158, 11, 0.06);
  border-color: rgba(245, 158, 11, 0.25);
}

.rm-vi-label {
  display: block;
  margin-bottom: 3px;
  font-size: 11px;
  font-weight: 700;
  color: #38bdf8;
}

.rm-vi-label.is-warn {
  color: #fbbf24;
}

.rm-vi-text {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: #cbd5e1;
  overflow-wrap: anywhere;
}

.rm-vi-card-foot {
  margin-top: auto;
  padding-top: 4px;
  display: flex;
  justify-content: flex-end;
}

.rm-vi-link {
  display: inline-flex;
  align-items: center;
  font-size: 12.5px;
  font-weight: 700;
  color: #fcd34d;
  text-decoration: none;
}

.rm-vi-link:hover {
  text-decoration: underline;
  color: #fde68a;
}

.rm-vi-empty {
  padding: 24px 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px dashed #334155;
  text-align: center;
}

.rm-vi-empty-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

.rm-vi-empty-desc {
  margin: 0 0 14px;
  font-size: 12.5px;
  color: #94a3b8;
  line-height: 1.5;
}

.rm-vi-empty-btn {
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
  .rm-vi-shell {
    padding: 14px 12px;
    border-radius: 12px;
  }

  .rm-vi-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .rm-vi-chip {
    font-size: 11.5px;
    padding: 6px 9px;
  }
}
</style>
