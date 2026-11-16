<template>
  <div class="mc-card">
    <div class="mc-header">
      <div class="mc-title-group">
        <span class="mc-badge">2D 材质交互对比台</span>
        <h4 class="mc-title">六大腕表材质多维性能与心理对比</h4>
      </div>

      <div class="mc-view-switch" role="tablist" aria-label="对比视角切换">
        <button
          type="button"
          class="mc-view-btn"
          :class="{ active: activeView === 'ranking' }"
          @click="activeView = 'ranking'"
        >
          单维度横向 PK
        </button>
        <button
          type="button"
          class="mc-view-btn"
          :class="{ active: activeView === 'duel' }"
          @click="activeView = 'duel'"
        >
          双材质正面对决 (A vs B)
        </button>
      </div>
    </div>

    <!-- 视角一：单维度全材质横向 PK 排行 -->
    <div v-if="activeView === 'ranking'" class="mc-panel">
      <div class="mc-dim-tabs" role="tablist" aria-label="物理化学维度选择">
        <button
          v-for="dim in dimensions"
          :key="dim.id"
          type="button"
          class="mc-dim-btn"
          :class="{ active: activeDimId === dim.id }"
          @click="activeDimId = dim.id"
        >
          {{ dim.label }}
        </button>
      </div>

      <div class="mc-dim-summary">
        <span class="mc-dim-summary-title">{{ currentDim.title }}</span>
        <span class="mc-dim-summary-desc">{{ currentDim.desc }}</span>
      </div>

      <div class="mc-rank-list">
        <div
          v-for="(item, idx) in rankedMaterials"
          :key="item.id"
          class="mc-rank-row"
        >
          <div class="mc-rank-top">
            <div class="mc-rank-name-wrap">
              <span class="mc-rank-index" :class="{ 'is-top': idx === 0 }">
                {{ idx + 1 }}
              </span>
              <span
                class="mc-swatch"
                :style="{ background: item.swatch }"
                aria-hidden="true"
              />
              <span class="mc-rank-name">{{ item.name }}</span>
              <span class="mc-rank-code">{{ item.hallmarkShort }}</span>
            </div>
            <span class="mc-rank-val">{{ item.dimValue }}</span>
          </div>

          <div class="mc-bar-track" aria-hidden="true">
            <div
              class="mc-bar-fill"
              :style="{
                width: `${item.dimScore}%`,
                background: item.barGradient
              }"
            />
          </div>

          <p class="mc-rank-note">{{ item.dimNote }}</p>
        </div>
      </div>
    </div>

    <!-- 视角二：双材质正面对决 (A vs B) -->
    <div v-else class="mc-panel">
      <div class="mc-presets">
        <span class="mc-preset-label">高频易混对比：</span>
        <button
          v-for="preset in presets"
          :key="preset.label"
          type="button"
          class="mc-preset-btn"
          :class="{
            active: duelAId === preset.a && duelBId === preset.b
          }"
          @click="applyPreset(preset.a, preset.b)"
        >
          {{ preset.label }}
        </button>
      </div>

      <div class="mc-selectors">
        <label class="mc-select-box is-a">
          <span class="mc-select-tag">材质 A</span>
          <select v-model="duelAId" class="mc-select" aria-label="选择对比材质 A">
            <option
              v-for="mat in materials"
              :key="mat.id"
              :value="mat.id"
              :disabled="mat.id === duelBId"
            >
              {{ mat.name }}（{{ mat.hallmarkShort }}）
            </option>
          </select>
        </label>

        <div class="mc-vs-badge" aria-hidden="true">VS</div>

        <label class="mc-select-box is-b">
          <span class="mc-select-tag">材质 B</span>
          <select v-model="duelBId" class="mc-select" aria-label="选择对比材质 B">
            <option
              v-for="mat in materials"
              :key="mat.id"
              :value="mat.id"
              :disabled="mat.id === duelAId"
            >
              {{ mat.name }}（{{ mat.hallmarkShort }}）
            </option>
          </select>
        </label>
      </div>

      <!-- SVG 五维雷达图 -->
      <div class="mc-radar-wrap">
        <svg
          viewBox="0 0 380 260"
          class="mc-radar-svg"
          role="img"
          :aria-label="`${matA.name}与${matB.name}五维性能对比雷达图`"
        >
          <defs>
            <radialGradient id="mc-radar-bg" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stop-color="#1e293b" stop-opacity="0.5" />
              <stop offset="100%" stop-color="#090d16" stop-opacity="0.9" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="380" height="260" rx="10" fill="url(#mc-radar-bg)" />

          <!-- 同心五边形网格 -->
          <g transform="translate(190, 132)">
            <polygon
              v-for="ring in [0.25, 0.5, 0.75, 1]"
              :key="ring"
              :points="getRingPoints(ring)"
              fill="none"
              stroke="#334155"
              :stroke-width="ring === 1 ? 1.2 : 0.8"
              :stroke-dasharray="ring === 1 ? 'none' : '3 3'"
            />

            <!-- 轴线 -->
            <line
              v-for="(axis, idx) in radarAxes"
              :key="axis.id"
              x1="0"
              y1="0"
              :x2="axis.x"
              :y2="axis.y"
              stroke="#334155"
              stroke-width="1"
            />

            <!-- 材质 A 多边形 -->
            <polygon
              :points="getMaterialPolygon(matA)"
              fill="rgba(56, 189, 248, 0.22)"
              stroke="#38bdf8"
              stroke-width="2.2"
              stroke-linejoin="round"
            />
            <circle
              v-for="(pt, idx) in getMaterialPoints(matA)"
              :key="`a-${idx}`"
              :cx="pt.x"
              :cy="pt.y"
              r="3.2"
              fill="#38bdf8"
              stroke="#0f172a"
              stroke-width="1"
            />

            <!-- 材质 B 多边形 -->
            <polygon
              :points="getMaterialPolygon(matB)"
              fill="rgba(245, 158, 11, 0.22)"
              stroke="#f59e0b"
              stroke-width="2.2"
              stroke-linejoin="round"
            />
            <circle
              v-for="(pt, idx) in getMaterialPoints(matB)"
              :key="`b-${idx}`"
              :cx="pt.x"
              :cy="pt.y"
              r="3.2"
              fill="#f59e0b"
              stroke="#0f172a"
              stroke-width="1"
            />

            <!-- 轴标签 -->
            <text
              v-for="axis in radarAxes"
              :key="`lbl-${axis.id}`"
              :x="axis.lx"
              :y="axis.ly"
              :text-anchor="axis.anchor"
              dominant-baseline="central"
              class="mc-radar-label"
            >
              {{ axis.shortLabel }}
            </text>
          </g>
        </svg>

        <div class="mc-radar-legend">
          <div class="mc-legend-item">
            <span class="mc-legend-dot is-a" />
            <span>{{ matA.name }}</span>
          </div>
          <div class="mc-legend-item">
            <span class="mc-legend-dot is-b" />
            <span>{{ matB.name }}</span>
          </div>
        </div>
      </div>

      <!-- 并列参数与消费心理对决卡 -->
      <div class="mc-duel-grid">
        <div
          v-for="row in duelRows"
          :key="row.label"
          class="mc-duel-row"
        >
          <div class="mc-duel-row-label">{{ row.label }}</div>
          <div class="mc-duel-cols">
            <div class="mc-duel-cell is-a">
              <span class="mc-cell-head">{{ matA.name }}</span>
              <span class="mc-cell-val">{{ row.valA }}</span>
            </div>
            <div class="mc-duel-cell is-b">
              <span class="mc-cell-head">{{ matB.name }}</span>
              <span class="mc-cell-val">{{ row.valB }}</span>
            </div>
          </div>
        </div>

        <!-- 核心消费心理标签并列 -->
        <div class="mc-duel-row">
          <div class="mc-duel-row-label">核心消费心理标签</div>
          <div class="mc-duel-cols">
            <div class="mc-duel-cell is-a">
              <span class="mc-cell-head">{{ matA.name }}</span>
              <div class="mc-tags">
                <span v-for="tag in matA.psychTags" :key="tag" class="mc-tag is-a">
                  {{ tag }}
                </span>
              </div>
              <p class="mc-psych-desc">{{ matA.psychSummary }}</p>
            </div>
            <div class="mc-duel-cell is-b">
              <span class="mc-cell-head">{{ matB.name }}</span>
              <div class="mc-tags">
                <span v-for="tag in matB.psychTags" :key="tag" class="mc-tag is-b">
                  {{ tag }}
                </span>
              </div>
              <p class="mc-psych-desc">{{ matB.psychSummary }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type DimensionId = 'density' | 'hardness' | 'toughness' | 'corrosion' | 'warmth'
type MaterialId = 'steel' | 'ceramic' | 'yellow-gold' | 'rose-gold' | 'white-gold' | 'platinum'

interface DimensionDef {
  id: DimensionId
  label: string
  shortLabel: string
  title: string
  desc: string
}

interface MaterialDef {
  id: MaterialId
  name: string
  hallmarkShort: string
  hallmarks: string
  swatch: string
  barGradient: string
  scores: Record<DimensionId, number>
  values: Record<DimensionId, string>
  notes: Record<DimensionId, string>
  chemicalDetail: string
  psychTags: string[]
  psychSummary: string
}

const dimensions: DimensionDef[] = [
  {
    id: 'density',
    label: '密度与压手感',
    shortLabel: '压手密度',
    title: '密度与上手压手感排行（由重到轻）',
    desc: '决定腕表戴在手腕上的“坠手感”与贵金属存在感。'
  },
  {
    id: 'hardness',
    label: '维氏抗刮硬度',
    shortLabel: '抗刮硬度',
    title: '维氏抗刮硬度排行（日常防划痕能力）',
    desc: '决定表壳与表圈抵抗袖口摩擦、桌面蹭划及发丝纹的能力。'
  },
  {
    id: 'toughness',
    label: '抗摔冲击韧性',
    shortLabel: '抗摔韧性',
    title: '抗摔冲击韧性排行（受撞击后的受损后果）',
    desc: '决定意外磕碰或跌落时是“凹个坑还能修”还是“直接崩裂换件”。'
  },
  {
    id: 'corrosion',
    label: '耐腐蚀抗氧化',
    shortLabel: '耐蚀稳定',
    title: '耐腐蚀与抗氧化变色排行',
    desc: '决定长期接触汗水、潮湿空气或泳池氯水后是否变色、氧化或致敏。'
  },
  {
    id: 'warmth',
    label: '贴肤温润度（低导热）',
    shortLabel: '贴肤温润',
    title: '贴肤温润度排行（低导热系数 = 冬日不冰手腕）',
    desc: '导热率越低，冬日清晨刚戴上时越不冰凉，触感越温润如玉。'
  }
]

const materials: MaterialDef[] = [
  {
    id: 'steel',
    name: '精钢',
    hallmarkShort: '316L / 904L',
    hallmarks: '无贵金属印记，常见 STAINLESS STEEL / ACIER 或品牌钢号（PP 后缀 A）',
    swatch: 'linear-gradient(135deg, #e2e8f0, #64748b)',
    barGradient: 'linear-gradient(90deg, #64748b, #cbd5e1)',
    scores: {
      density: 38,
      hardness: 42,
      toughness: 95,
      corrosion: 76,
      warmth: 52
    },
    values: {
      density: '~7.9–8.0 g/cm³',
      hardness: '~180–240 HV',
      toughness: '极高（宁弯不折）',
      corrosion: '良好（钝化膜防锈）',
      warmth: '中等（~15 W/m·K）'
    },
    notes: {
      density: '中等扎实分量，既能感受金属存在感，长时间佩戴也不累手腕。',
      hardness: '高于传统 18K 金，但抛光表圈与表扣仍会随日常桌面摩擦出现发丝划痕。',
      toughness: '极其抗摔耐造，硬磕多为凹坑或划痕，可通过专业补焊、拉丝与抛光修复。',
      corrosion: '日常防锈可靠，但长期积汗盐分未清洗时，表带缝隙仍有轻微点蚀风险。',
      warmth: '导热比贵金属慢，冬日初戴微凉，贴肤几分钟后随体温回暖。'
    },
    chemicalDetail: '靠表面富铬钝化膜防锈；极少数镍过敏体质佩戴 316L 需注意清洁',
    psychTags: ['原教旨运动信仰', '日常耐造无负担', '热门钢王硬通货'],
    psychSummary: '预算最友好却往往最难买到热门款，承载“纯粹机械与运动实用主义”心态。'
  },
  {
    id: 'ceramic',
    name: '陶瓷',
    hallmarkShort: '精密氧化锆',
    hallmarks: '常见 CERAMIC / ZrO₂ 标示或品牌专有命名（如劳力士 Cerachrom）',
    swatch: 'linear-gradient(135deg, #334155, #0f172a)',
    barGradient: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
    scores: {
      density: 22,
      hardness: 98,
      toughness: 22,
      corrosion: 98,
      warmth: 95
    },
    values: {
      density: '~3.8–6.0 g/cm³',
      hardness: '1200–1500+ HV',
      toughness: '较低（高硬脆性）',
      corrosion: '极佳（化学惰性）',
      warmth: '极温润（~2.5 W/m·K）'
    },
    notes: {
      density: '全材质最轻盈，大幅减轻大尺寸运动表的手腕负担。',
      hardness: '维氏硬度碾压金属，钥匙、袖口或日常金属摩擦几乎零划痕。',
      toughness: '“宁折不弯”——跌落硬地或猛烈撞击易崩角断裂，无法局部抛光只能换件。',
      corrosion: '终生不氧化、不褪色、不惧汗水与泳池氯水，100% 亲肤低致敏。',
      warmth: '导热率极低，冬日贴肤温润如玉，完全没有金属的冰冷刺骨感。'
    },
    chemicalDetail: '化学惰性极强，终生不变色、抗紫外线、100% 低致敏',
    psychTags: ['前卫撞色科技感', '戴五年零划痕强迫症治愈', '怕摔隐忧'],
    psychSummary: '极度治愈划痕强迫症，色彩鲜明前卫，但佩戴时心里总会多一分“别摔地上”的谨慎。'
  },
  {
    id: 'yellow-gold',
    name: '黄金',
    hallmarkShort: '18K Au750',
    hallmarks: 'Au750 / 750 + 天平或圣伯纳犬头官方印记（PP 后缀 J）',
    swatch: 'linear-gradient(135deg, #fde047, #ca8a04)',
    barGradient: 'linear-gradient(90deg, #ca8a04, #facc15)',
    scores: {
      density: 75,
      hardness: 28,
      toughness: 78,
      corrosion: 82,
      warmth: 25
    },
    values: {
      density: '~15.0–15.6 g/cm³',
      hardness: '~130–160 HV',
      toughness: '较高（延展性好）',
      corrosion: '优良（偶有包浆斑）',
      warmth: '偏凉快导热（高导热）'
    },
    notes: {
      density: '标准贵金属压手感，全金表带款上手沉稳有力，分量感十足。',
      hardness: '质地偏软，高频摩擦处易产生细密划痕，需注意保护表圈镜面。',
      toughness: '韧性与延展性好，受撞击会产生凹坑而非碎裂，可专业补金翻新。',
      corrosion: '金本位稳定，但长期闲置表壳缝隙偶现红褐色铜银氧化斑（专业轻拭可除）。',
      warmth: '导热极快，刚戴上偏凉，但很快与手腕体温同步。'
    },
    chemicalDetail: '75% 纯金极稳定；25% 银铜配比长期静置可能生成红褐色表面氧化斑',
    psychTags: ['最直白经典实力图腾', '复古贵族回潮', '高辨识度气场'],
    psychSummary: '毫无掩饰的传统贵气与“大金表”图腾，近年在复古审美回潮下重回潮流中心。'
  },
  {
    id: 'rose-gold',
    name: '玫瑰金',
    hallmarkShort: '18K Au750',
    hallmarks: 'Au750 / 750 + 圣伯纳犬头印记（PP 后缀 R）',
    swatch: 'linear-gradient(135deg, #fdba74, #c2410c)',
    barGradient: 'linear-gradient(90deg, #c2410c, #fb923c)',
    scores: {
      density: 74,
      hardness: 32,
      toughness: 78,
      corrosion: 72,
      warmth: 28
    },
    values: {
      density: '~15.0–15.5 g/cm³',
      hardness: '~140–175 HV',
      toughness: '较高（可补金修复）',
      corrosion: '良好（忌长期氯水）',
      warmth: '偏凉快导热（视觉温暖）'
    },
    notes: {
      density: '与黄金同梯队的沉实坠手感，贵金属分量分毫不少。',
      hardness: '提高铜比例后硬度略高于传统黄金，但仍属于需爱惜防刮的贵金属。',
      toughness: '韧性良好，受磕碰留凹坑后可由专业工匠激光补金与重塑倒角。',
      corrosion: '传统高铜玫瑰金忌长期接触泳池氯水与强汗液，久戴颜色可能略微变深偏红。',
      warmth: '物理导热仍快，但粉铜色调在视觉上最有暖意。'
    },
    chemicalDetail: '含铜量较高，传统配方长期接触氯水或强汗易微变深红（永恒玫瑰金除外）',
    psychTags: ['温暖衬亚洲肤色', '显贵不暴发的儒雅平衡', '正装休闲通吃'],
    psychSummary: '“一眼看得出是金表却不显张扬”，极度契合亚洲肤色与儒雅社交场景。'
  },
  {
    id: 'white-gold',
    name: '白金',
    hallmarkShort: '18K Au750',
    hallmarks: 'Au750 / 750 + 圣伯纳犬头印记（PP 后缀 G）',
    swatch: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
    barGradient: 'linear-gradient(90deg, #94a3b8, #f8fafc)',
    scores: {
      density: 78,
      hardness: 35,
      toughness: 80,
      corrosion: 84,
      warmth: 28
    },
    values: {
      density: '~15.5–16.5 g/cm³',
      hardness: '~145–190 HV',
      toughness: '较高（重抛需重镀铑）',
      corrosion: '优良（镀铑磨损微露暖底）',
      warmth: '偏凉快导热（高导热）'
    },
    notes: {
      density: '远重于精钢，外表看似低调银白，上手瞬间却沉甸甸压手。',
      hardness: '与 18K 黄金接近，日常摩擦易留下细微划痕。',
      toughness: '延展性好不易碎裂，但深度抛光打磨后通常需重新镀铑以恢复冷白亮度。',
      corrosion: '抗腐蚀强，但表层极薄镀铑经多年磨损后，可能隐约透出底层淡淡暖白微黄底色。',
      warmth: '导热快，初触皮肤带有明显贵金属的冷冽感。'
    },
    chemicalDetail: '18K 黄金+钯/银/镍，表面多镀铑；多年磨损或重抛后微露底层暖白微黄',
    psychTags: ['隐形富豪 Stealth Wealth', '外表像钢上手沉甸甸', '闷骚悦己'],
    psychSummary: '把百万级实力藏在看似精钢的低调外表下，“只有自己和懂行的人才知道”。'
  },
  {
    id: 'platinum',
    name: '铂金',
    hallmarkShort: 'Pt950',
    hallmarks: 'Pt950 / 950 + 圣伯纳犬头印记（PP 后缀 P + 6点位小钻）',
    swatch: 'linear-gradient(135deg, #e0f2fe, #64748b)',
    barGradient: 'linear-gradient(90deg, #0284c7, #7dd3fc)',
    scores: {
      density: 100,
      hardness: 30,
      toughness: 88,
      corrosion: 99,
      warmth: 40
    },
    values: {
      density: '~21.4 g/cm³',
      hardness: '~120–160 HV（位移纹）',
      toughness: '极佳（塑性强难脆断）',
      corrosion: '顶级（终生不氧化褪色）',
      warmth: '导热低于黄金（~71 W/m·K）'
    },
    notes: {
      density: '六大材质之巅！上手沉坠感比 18K 白金还明显一截，拿在手里就能掂出来。',
      hardness: '摩擦后主要产生“金属位移式”细微发丝纹，金属自身几乎不损耗重量。',
      toughness: '极高韧性与延展性，受撞击只会变形位移不会脆裂；熔点高，翻新抛光最考验工匠。',
      corrosion: '天然银白永不氧化、无需镀铑、100% 亲肤低致敏，戴几十年依然纯净冷冽。',
      warmth: '导热率低于 18K 金但高于精钢，高密度使初戴瞬间具有厚重的冰凉仪式感。'
    },
    chemicalDetail: '纯度 95% 天然银白贵金属，不镀铑、永不氧化发黄、100% 亲肤低致敏',
    psychTags: ['一步到位封顶毕业感', '顶层圈内默契认同', '冰蓝盘 / 6点小钻暗语'],
    psychSummary: '收藏级终极材料，“买到顶配不再折腾”的毕业感，靠细节暗记完成圈内默契共鸣。'
  }
]

const presets: { label: string; a: MaterialId; b: MaterialId }[] = [
  { label: '白金 Au750 vs 铂金 Pt950', a: 'white-gold', b: 'platinum' },
  { label: '精钢 vs 陶瓷', a: 'steel', b: 'ceramic' },
  { label: '黄金 vs 玫瑰金', a: 'yellow-gold', b: 'rose-gold' },
  { label: '精钢 vs 白金', a: 'steel', b: 'white-gold' }
]

const activeView = ref<'ranking' | 'duel'>('ranking')
const activeDimId = ref<DimensionId>('density')
const duelAId = ref<MaterialId>('white-gold')
const duelBId = ref<MaterialId>('platinum')

const currentDim = computed(
  () => dimensions.find((d) => d.id === activeDimId.value) ?? dimensions[0]
)

const rankedMaterials = computed(() => {
  const dim = activeDimId.value
  return [...materials]
    .sort((a, b) => b.scores[dim] - a.scores[dim])
    .map((m) => ({
      ...m,
      dimScore: m.scores[dim],
      dimValue: m.values[dim],
      dimNote: m.notes[dim]
    }))
})

const matA = computed(
  () => materials.find((m) => m.id === duelAId.value) ?? materials[4]
)
const matB = computed(
  () => materials.find((m) => m.id === duelBId.value) ?? materials[5]
)

function applyPreset(a: MaterialId, b: MaterialId) {
  duelAId.value = a
  duelBId.value = b
}

// 雷达图几何计算（半径 82，中心 (0,0)）
const RADAR_RADIUS = 82
const radarAxes = computed(() => {
  const count = dimensions.length
  return dimensions.map((dim, idx) => {
    const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / count
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const labelRadius = RADAR_RADIUS + 20
    let anchor: 'middle' | 'start' | 'end' = 'middle'
    if (cos > 0.25) anchor = 'start'
    else if (cos < -0.25) anchor = 'end'
    return {
      ...dim,
      angle,
      x: +(RADAR_RADIUS * cos).toFixed(1),
      y: +(RADAR_RADIUS * sin).toFixed(1),
      lx: +(labelRadius * cos).toFixed(1),
      ly: +(labelRadius * sin).toFixed(1),
      anchor
    }
  })
})

function getRingPoints(scale: number): string {
  return radarAxes.value
    .map(
      (ax) =>
        `${(ax.x * scale).toFixed(1)},${(ax.y * scale).toFixed(1)}`
    )
    .join(' ')
}

function getMaterialPoints(mat: MaterialDef): { x: number; y: number }[] {
  return radarAxes.value.map((ax) => {
    const ratio = mat.scores[ax.id] / 100
    return {
      x: +(ax.x * ratio).toFixed(1),
      y: +(ax.y * ratio).toFixed(1)
    }
  })
}

function getMaterialPolygon(mat: MaterialDef): string {
  return getMaterialPoints(mat)
    .map((p) => `${p.x},${p.y}`)
    .join(' ')
}

const duelRows = computed(() => [
  {
    label: '密度与压手感',
    valA: matA.value.values.density,
    valB: matB.value.values.density
  },
  {
    label: '维氏抗刮硬度',
    valA: matA.value.values.hardness,
    valB: matB.value.values.hardness
  },
  {
    label: '抗摔冲击韧性',
    valA: matA.value.values.toughness,
    valB: matB.value.values.toughness
  },
  {
    label: '化学稳定与养护',
    valA: matA.value.chemicalDetail,
    valB: matB.value.chemicalDetail
  },
  {
    label: '常见贵金属印记 / 标识',
    valA: matA.value.hallmarks,
    valB: matB.value.hallmarks
  }
])
</script>

<style scoped>
.mc-card {
  margin: 20px 0 28px;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(155deg, #0b1120 0%, #111827 55%, #090d16 100%);
  border: 1px solid #1e293b;
  box-shadow: 0 12px 30px rgba(2, 6, 23, 0.45);
  color: #e2e8f0;
  font-family: var(--vp-font-family-base);
}

.mc-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #1e293b;
}

.mc-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mc-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.28);
}

.mc-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
}

.mc-view-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mc-view-btn {
  appearance: none;
  border: 1px solid #334155;
  background: #1e293b;
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mc-view-btn:hover {
  background: #334155;
  color: #ffffff;
}

.mc-view-btn.active {
  background: #0284c7;
  border-color: #38bdf8;
  color: #ffffff;
  font-weight: 600;
}

/* 单维度横向 PK */
.mc-dim-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.mc-dim-btn {
  appearance: none;
  border: 1px solid #334155;
  background: #0f172a;
  color: #94a3b8;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mc-dim-btn:hover {
  color: #f8fafc;
  border-color: #475569;
}

.mc-dim-btn.active {
  background: rgba(245, 158, 11, 0.16);
  border-color: #f59e0b;
  color: #fcd34d;
  font-weight: 600;
}

.mc-dim-summary {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-radius: 10px;
  background: #0f172a;
  border: 1px solid #1e293b;
}

.mc-dim-summary-title {
  font-size: 13px;
  font-weight: 600;
  color: #f8fafc;
}

.mc-dim-summary-desc {
  font-size: 12px;
  color: #94a3b8;
}

.mc-rank-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mc-rank-row {
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #1e293b;
}

.mc-rank-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.mc-rank-name-wrap {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.mc-rank-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  background: #1e293b;
  color: #94a3b8;
  flex-shrink: 0;
}

.mc-rank-index.is-top {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.mc-swatch {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
}

.mc-rank-name {
  font-size: 14px;
  font-weight: 600;
  color: #f8fafc;
}

.mc-rank-code {
  font-size: 11px;
  color: #94a3b8;
  font-family: var(--vp-font-family-mono);
}

.mc-rank-val {
  font-size: 12px;
  font-weight: 600;
  color: #38bdf8;
  font-family: var(--vp-font-family-mono);
  text-align: right;
}

.mc-bar-track {
  height: 7px;
  border-radius: 999px;
  background: #1e293b;
  overflow: hidden;
  margin-bottom: 6px;
}

.mc-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.mc-rank-note {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #cbd5e1;
}

/* 双材质正面对决 */
.mc-presets {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.mc-preset-label {
  font-size: 12px;
  color: #94a3b8;
}

.mc-preset-btn {
  appearance: none;
  border: 1px solid #334155;
  background: #0f172a;
  color: #cbd5e1;
  font-size: 11.5px;
  padding: 4px 9px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.mc-preset-btn:hover {
  border-color: #475569;
  color: #ffffff;
}

.mc-preset-btn.active {
  background: #1e3a5f;
  border-color: #38bdf8;
  color: #7dd3fc;
  font-weight: 600;
}

.mc-selectors {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.mc-select-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 10px;
  background: #0f172a;
  border: 1px solid #1e293b;
}

.mc-select-box.is-a {
  border-top: 2px solid #38bdf8;
}

.mc-select-box.is-b {
  border-top: 2px solid #f59e0b;
}

.mc-select-tag {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
}

.mc-select {
  width: 100%;
  background: #1e293b;
  color: #f8fafc;
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.mc-vs-badge {
  font-size: 12px;
  font-weight: 800;
  color: #94a3b8;
  padding: 4px 7px;
  border-radius: 999px;
  background: #1e293b;
  border: 1px solid #334155;
}

.mc-radar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 14px;
}

.mc-radar-svg {
  width: 100%;
  max-width: 380px;
  height: auto;
  display: block;
}

.mc-radar-label {
  font-size: 11px;
  font-weight: 600;
  fill: #cbd5e1;
}

.mc-radar-legend {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 8px;
}

.mc-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: #f8fafc;
}

.mc-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.mc-legend-dot.is-a {
  background: #38bdf8;
}

.mc-legend-dot.is-b {
  background: #f59e0b;
}

.mc-duel-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mc-duel-row {
  padding: 10px 12px;
  border-radius: 10px;
  background: #0f172a;
  border: 1px solid #1e293b;
}

.mc-duel-row-label {
  font-size: 11.5px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 6px;
}

.mc-duel-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.mc-duel-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(30, 41, 59, 0.55);
  border-left: 3px solid transparent;
}

.mc-duel-cell.is-a {
  border-left-color: #38bdf8;
}

.mc-duel-cell.is-b {
  border-left-color: #f59e0b;
}

.mc-cell-head {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
}

.mc-cell-val {
  font-size: 12.5px;
  line-height: 1.45;
  color: #f1f5f9;
}

.mc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.mc-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
}

.mc-tag.is-a {
  background: rgba(56, 189, 248, 0.14);
  color: #7dd3fc;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.mc-tag.is-b {
  background: rgba(245, 158, 11, 0.14);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.mc-psych-desc {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #cbd5e1;
}

@media (max-width: 520px) {
  .mc-card {
    padding: 12px;
  }

  .mc-title {
    font-size: 14.5px;
  }

  .mc-view-btn,
  .mc-dim-btn {
    padding: 5px 8px;
    font-size: 11.5px;
  }

  .mc-rank-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }

  .mc-rank-val {
    text-align: left;
    padding-left: 27px;
  }

  .mc-selectors {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .mc-vs-badge {
    justify-self: center;
  }

  .mc-duel-cols {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
