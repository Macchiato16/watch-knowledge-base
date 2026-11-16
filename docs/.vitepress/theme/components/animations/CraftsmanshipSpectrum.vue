<template>
  <div class="cs-card">
    <div class="cs-header">
      <div class="cs-title-group">
        <span class="cs-badge">2D 工艺流派交互对照台</span>
        <h4 class="cs-title">三大制表工艺流派与四大部位对照台</h4>
        <p class="cs-subtitle">
          点击切换三大制表流派，对比表壳、表盘、机芯、镶嵌与二手验表红线；点击下方微距肌理样本，查看不同表面工艺的光学反射特征。
        </p>
      </div>
    </div>

    <!-- 流派切换 Tab -->
    <div class="cs-school-tabs" role="tablist" aria-label="三大制表工艺流派切换">
      <button
        v-for="school in schools"
        :key="school.id"
        type="button"
        role="tab"
        :aria-selected="activeSchoolId === school.id"
        class="cs-school-tab"
        :class="{ active: activeSchoolId === school.id }"
        :style="
          activeSchoolId === school.id
            ? {
                borderColor: school.accent,
                background: school.accentSoft
              }
            : undefined
        "
        @click="selectSchool(school.id)"
      >
        <span class="cs-school-tag" :style="{ color: school.accent }">
          {{ school.eraTag }}
        </span>
        <span class="cs-school-name">{{ school.name }}</span>
        <span class="cs-school-rep">代表：{{ school.representatives }}</span>
      </button>
    </div>

    <!-- 当前流派核心价值锚点横幅 -->
    <div
      class="cs-anchor-banner"
      :style="{ borderLeftColor: currentSchool.accent }"
    >
      <div class="cs-anchor-top">
        <span class="cs-anchor-pill" :style="{ color: currentSchool.accent, borderColor: currentSchool.accentBorder }">
          核心价值锚点
        </span>
        <span class="cs-anchor-origin">{{ currentSchool.origin }}</span>
      </div>
      <p class="cs-anchor-quote">“{{ currentSchool.valueAnchor }}”</p>
      <p class="cs-anchor-summary">{{ currentSchool.summary }}</p>
    </div>

    <!-- SVG 表面肌理微距对比示意区 -->
    <div class="cs-texture-section">
      <div class="cs-section-head">
        <div>
          <h5 class="cs-section-title">表面肌理微距光学对比（5 大典型工艺）</h5>
          <p class="cs-section-desc">
            光线打在表壳与夹板上的反射逻辑，决定了腕表的第一眼高级感。点击任意肌理卡片查看微距原理与验表线索。
          </p>
        </div>
      </div>

      <div class="cs-texture-grid" role="list">
        <button
          v-for="tex in textures"
          :key="tex.id"
          type="button"
          class="cs-texture-item"
          :class="{
            active: activeTextureId === tex.id,
            'is-featured': currentSchool.featuredTextures.includes(tex.id)
          }"
          @click="activeTextureId = tex.id"
        >
          <div class="cs-texture-svg-wrap">
            <svg
              class="cs-texture-svg"
              viewBox="0 0 160 88"
              width="160"
              height="88"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="cs-satin-base" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#334155" />
                  <stop offset="48%" stop-color="#94a3b8" />
                  <stop offset="52%" stop-color="#cbd5e1" />
                  <stop offset="100%" stop-color="#1e293b" />
                </linearGradient>
                <linearGradient id="cs-chamfer-face" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#1e293b" />
                  <stop offset="100%" stop-color="#0f172a" />
                </linearGradient>
                <linearGradient id="cs-chamfer-edge" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#f8fafc" />
                  <stop offset="35%" stop-color="#fde68a" />
                  <stop offset="65%" stop-color="#ffffff" />
                  <stop offset="100%" stop-color="#64748b" />
                </linearGradient>
                <linearGradient id="cs-geneva-band" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#334155" />
                  <stop offset="50%" stop-color="#cbd5e1" />
                  <stop offset="100%" stop-color="#1e293b" />
                </linearGradient>
                <linearGradient id="cs-ti-matte" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#27303f" />
                  <stop offset="100%" stop-color="#18202c" />
                </linearGradient>
                <linearGradient id="cs-tpt-bg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#0f172a" />
                  <stop offset="100%" stop-color="#1e293b" />
                </linearGradient>
                <clipPath :id="`clip-${tex.id}`">
                  <rect x="4" y="4" width="152" height="80" rx="8" />
                </clipPath>
              </defs>

              <!-- 1. 单向缎面拉丝 -->
              <g v-if="tex.id === 'satin'" :clip-path="`url(#clip-${tex.id})`">
                <rect x="4" y="4" width="152" height="80" fill="url(#cs-satin-base)" />
                <g stroke="#e2e8f0" stroke-opacity="0.26" stroke-width="0.8">
                  <line x1="4" y1="10" x2="156" y2="10" />
                  <line x1="4" y1="14" x2="156" y2="14" />
                  <line x1="4" y1="18" x2="156" y2="18" />
                  <line x1="4" y1="22" x2="156" y2="22" />
                  <line x1="4" y1="26" x2="156" y2="26" />
                  <line x1="4" y1="30" x2="156" y2="30" />
                  <line x1="4" y1="34" x2="156" y2="34" />
                  <line x1="4" y1="38" x2="156" y2="38" />
                  <line x1="4" y1="42" x2="156" y2="42" />
                  <line x1="4" y1="46" x2="156" y2="46" />
                  <line x1="4" y1="50" x2="156" y2="50" />
                  <line x1="4" y1="54" x2="156" y2="54" />
                  <line x1="4" y1="58" x2="156" y2="58" />
                  <line x1="4" y1="62" x2="156" y2="62" />
                  <line x1="4" y1="66" x2="156" y2="66" />
                  <line x1="4" y1="70" x2="156" y2="70" />
                  <line x1="4" y1="74" x2="156" y2="74" />
                  <line x1="4" y1="78" x2="156" y2="78" />
                </g>
                <polygon points="56,4 96,4 70,84 30,84" fill="#ffffff" fill-opacity="0.16" />
              </g>

              <!-- 2. 45° 刀锋镜面倒角 -->
              <g v-else-if="tex.id === 'chamfer'" :clip-path="`url(#clip-${tex.id})`">
                <rect x="4" y="4" width="152" height="80" fill="url(#cs-chamfer-face)" />
                <!-- 顶面拉丝区 -->
                <rect x="4" y="4" width="152" height="34" fill="#334155" />
                <g stroke="#cbd5e1" stroke-opacity="0.22" stroke-width="0.7">
                  <line x1="4" y1="10" x2="156" y2="10" />
                  <line x1="4" y1="16" x2="156" y2="16" />
                  <line x1="4" y1="22" x2="156" y2="22" />
                  <line x1="4" y1="28" x2="156" y2="28" />
                  <line x1="4" y1="34" x2="156" y2="34" />
                </g>
                <!-- 45° 高亮镜面倒角带 -->
                <polygon points="4,38 156,38 156,54 4,54" fill="url(#cs-chamfer-edge)" />
                <!-- 棱线刀锋高光 -->
                <line x1="4" y1="38" x2="156" y2="38" stroke="#ffffff" stroke-width="1.3" />
                <line x1="4" y1="54" x2="156" y2="54" stroke="#94a3b8" stroke-width="0.9" />
                <!-- 侧面阴影 -->
                <rect x="4" y="54" width="152" height="30" fill="#0f172a" />
                <text x="12" y="25" fill="#cbd5e1" font-size="8" font-weight="600">拉丝平面</text>
                <text x="108" y="49" fill="#0f172a" font-size="8" font-weight="700">45° 镜面</text>
              </g>

              <!-- 3. 日内瓦条纹 -->
              <g v-else-if="tex.id === 'geneva'" :clip-path="`url(#clip-${tex.id})`">
                <rect x="4" y="4" width="152" height="80" fill="#1e293b" />
                <g opacity="0.92">
                  <rect x="4" y="4" width="30" height="80" fill="url(#cs-geneva-band)" />
                  <rect x="34" y="4" width="30" height="80" fill="url(#cs-geneva-band)" />
                  <rect x="64" y="4" width="30" height="80" fill="url(#cs-geneva-band)" />
                  <rect x="94" y="4" width="30" height="80" fill="url(#cs-geneva-band)" />
                  <rect x="124" y="4" width="32" height="80" fill="url(#cs-geneva-band)" />
                </g>
                <g stroke="#e2e8f0" stroke-opacity="0.2" stroke-width="0.7" fill="none">
                  <path d="M4,18 Q19,8 34,18 T64,18 T94,18 T124,18 T156,18" />
                  <path d="M4,34 Q19,24 34,34 T64,34 T94,34 T124,34 T156,34" />
                  <path d="M4,50 Q19,40 34,50 T64,50 T94,50 T124,50 T156,50" />
                  <path d="M4,66 Q19,56 34,66 T64,66 T94,66 T124,66 T156,66" />
                </g>
                <line x1="34" y1="4" x2="34" y2="84" stroke="#0f172a" stroke-opacity="0.45" stroke-width="1" />
                <line x1="64" y1="4" x2="64" y2="84" stroke="#0f172a" stroke-opacity="0.45" stroke-width="1" />
                <line x1="94" y1="4" x2="94" y2="84" stroke="#0f172a" stroke-opacity="0.45" stroke-width="1" />
                <line x1="124" y1="4" x2="124" y2="84" stroke="#0f172a" stroke-opacity="0.45" stroke-width="1" />
              </g>

              <!-- 4. 微喷砂哑光钛配亮边倒角 -->
              <g v-else-if="tex.id === 'microblast'" :clip-path="`url(#clip-${tex.id})`">
                <rect x="4" y="4" width="152" height="80" fill="url(#cs-ti-matte)" />
                <!-- 哑光微粒噪点示意 -->
                <g fill="#94a3b8" fill-opacity="0.35">
                  <circle cx="18" cy="14" r="0.8" />
                  <circle cx="32" cy="22" r="0.7" />
                  <circle cx="48" cy="12" r="0.8" />
                  <circle cx="66" cy="26" r="0.6" />
                  <circle cx="88" cy="16" r="0.8" />
                  <circle cx="110" cy="24" r="0.7" />
                  <circle cx="132" cy="14" r="0.8" />
                  <circle cx="24" cy="34" r="0.7" />
                  <circle cx="54" cy="36" r="0.8" />
                  <circle cx="78" cy="32" r="0.6" />
                  <circle cx="102" cy="38" r="0.7" />
                  <circle cx="140" cy="30" r="0.8" />
                  <circle cx="22" cy="64" r="0.7" />
                  <circle cx="46" cy="72" r="0.8" />
                  <circle cx="72" cy="66" r="0.6" />
                  <circle cx="98" cy="74" r="0.8" />
                  <circle cx="122" cy="68" r="0.7" />
                  <circle cx="144" cy="76" r="0.8" />
                </g>
                <!-- 镂空桁架斜梁 + 亮边倒角 -->
                <polygon points="18,46 142,46 132,56 28,56" fill="#0f172a" stroke="#e2e8f0" stroke-width="1.4" />
                <line x1="20" y1="45.5" x2="140" y2="45.5" stroke="#ffffff" stroke-width="0.9" />
                <text x="48" y="30" fill="#94a3b8" font-size="8" font-weight="600">微喷砂漫反射</text>
                <text x="50" y="74" fill="#e2e8f0" font-size="8" font-weight="600">亮边 CNC 倒角</text>
              </g>

              <!-- 5. TPT 45° 波浪层压纹 -->
              <g v-else-if="tex.id === 'tpt'" :clip-path="`url(#clip-${tex.id})`">
                <rect x="4" y="4" width="152" height="80" fill="url(#cs-tpt-bg)" />
                <g fill="none" stroke-width="2.2" stroke-linecap="round">
                  <path d="M-10,28 Q26,10 62,24 T134,18 T172,14" stroke="#64748b" stroke-opacity="0.75" />
                  <path d="M-10,38 Q28,20 64,34 T136,28 T172,24" stroke="#38bdf8" stroke-opacity="0.55" />
                  <path d="M-10,48 Q30,30 66,44 T138,38 T172,34" stroke="#94a3b8" stroke-opacity="0.78" />
                  <path d="M-10,58 Q32,40 68,54 T140,48 T172,44" stroke="#38bdf8" stroke-opacity="0.48" />
                  <path d="M-10,68 Q34,50 70,64 T142,58 T172,54" stroke="#cbd5e1" stroke-opacity="0.7" />
                  <path d="M-10,78 Q36,60 72,74 T144,68 T172,64" stroke="#475569" stroke-opacity="0.85" />
                  <path d="M-10,18 Q24,2 60,14 T132,8 T172,4" stroke="#475569" stroke-opacity="0.8" />
                </g>
              </g>

              <rect
                x="4"
                y="4"
                width="152"
                height="80"
                rx="8"
                fill="none"
                stroke="#334155"
                stroke-width="1"
              />
            </svg>
            <span
              v-if="currentSchool.featuredTextures.includes(tex.id)"
              class="cs-texture-match-dot"
              :style="{ background: currentSchool.accent }"
              title="当前流派标志性肌理"
            />
          </div>

          <span class="cs-texture-name">{{ tex.name }}</span>
          <span class="cs-texture-en">{{ tex.en }}</span>
        </button>
      </div>

      <!-- 选中肌理的微距解读卡 -->
      <div class="cs-texture-detail">
        <div class="cs-texture-detail-head">
          <span class="cs-texture-detail-title">{{ currentTexture.name }}</span>
          <span class="cs-texture-detail-schools">
            典型归属：{{ currentTexture.schools }}
          </span>
        </div>
        <div class="cs-texture-detail-grid">
          <div class="cs-texture-detail-cell">
            <span class="cs-detail-k">光学反射特征</span>
            <p class="cs-detail-v">{{ currentTexture.optics }}</p>
          </div>
          <div class="cs-texture-detail-cell">
            <span class="cs-detail-k">二手验表线索</span>
            <p class="cs-detail-v">{{ currentTexture.inspection }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 四大部位对照卡片 (2x2) -->
    <div class="cs-parts-section">
      <div class="cs-section-head">
        <h5 class="cs-section-title">
          四大核心部位工艺解构（{{ currentSchool.shortName }}）
        </h5>
      </div>

      <div class="cs-parts-grid">
        <article
          v-for="part in currentSchool.parts"
          :key="part.id"
          class="cs-part-card"
        >
          <div class="cs-part-head">
            <span
              class="cs-part-num"
              :style="{
                color: currentSchool.accent,
                borderColor: currentSchool.accentBorder,
                background: currentSchool.accentSoft
              }"
            >
              {{ part.num }}
            </span>
            <h6 class="cs-part-title">{{ part.title }}</h6>
          </div>
          <p class="cs-part-highlight">{{ part.highlight }}</p>
          <p class="cs-part-desc">{{ part.desc }}</p>
          <div class="cs-part-tags">
            <span v-for="tag in part.tags" :key="tag" class="cs-part-tag">
              {{ tag }}
            </span>
          </div>
        </article>
      </div>
    </div>

    <!-- ⑤ 二手验表核心红线 -->
    <div class="cs-redline-box">
      <div class="cs-redline-head">
        <span class="cs-redline-badge">⑤ 二手验表核心红线</span>
        <span class="cs-redline-school">{{ currentSchool.shortName }}</span>
      </div>
      <ul class="cs-redline-list">
        <li v-for="line in currentSchool.redlines" :key="line" class="cs-redline-item">
          {{ line }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type SchoolId = 'traditional' | 'industrial' | 'avantgarde'
type TextureId = 'satin' | 'chamfer' | 'geneva' | 'microblast' | 'tpt'

interface PartItem {
  id: string
  num: string
  title: string
  highlight: string
  desc: string
  tags: string[]
}

interface SchoolItem {
  id: SchoolId
  name: string
  shortName: string
  eraTag: string
  representatives: string
  origin: string
  valueAnchor: string
  summary: string
  accent: string
  accentSoft: string
  accentBorder: string
  featuredTextures: TextureId[]
  defaultTexture: TextureId
  parts: PartItem[]
  redlines: string[]
}

interface TextureItem {
  id: TextureId
  name: string
  en: string
  schools: string
  optics: string
  inspection: string
}

const schools: SchoolItem[] = [
  {
    id: 'traditional',
    name: '传统手工修饰流派',
    shortName: '传统手工修饰流派（PP / AP）',
    eraTag: '19 世纪传统',
    representatives: '百达翡丽 PP · 爱彼 AP',
    origin: '日内瓦 / 汝山谷金匠与艺术微绘传统',
    valueAnchor: '不可量产的匠人工时、手工内角与艺术釉面',
    summary:
      '将金属视作可被手工驯服的艺术载体。价值不在于机器有多快，而在于锐利棱线与夹板内角必须由资深制表师用木棒与钻石膏逐小时推磨完成。',
    accent: '#f59e0b',
    accentSoft: 'rgba(245, 158, 11, 0.14)',
    accentBorder: 'rgba(245, 158, 11, 0.42)',
    featuredTextures: ['satin', 'chamfer', 'geneva'],
    defaultTexture: 'chamfer',
    parts: [
      {
        id: 'case',
        num: '①',
        title: '表壳与外装',
        highlight: '拉丝与镜面的零过渡刀锋分界',
        desc: '以皇家橡树八角圈、Nautilus 护耳为代表：同一表壳上密集交错单向缎面拉丝与 45° 刀锋镜面倒角，手工修整棱线，转角必须清晰刮手、绝不圆润。',
        tags: ['单向缎面拉丝', '45° 刀锋倒角', '棱线锐利度']
      },
      {
        id: 'dial',
        num: '②',
        title: '表盘与视觉结构',
        highlight: '古典机镂、大明火珐琅与艺术微绘',
        desc: '追求温润立体的传统视觉纵深：百年玫瑰引擎车床雕琢的玑镂纹、800°C 烧制的大明火珐琅、掐丝珐琅以及 AP 标志性手工雕花 Tapisserie 格纹盘。',
        tags: ['大明火珐琅', '玑镂 Guilloché', 'Tapisserie 格纹']
      },
      {
        id: 'movement',
        num: '③',
        title: '机芯表面修饰',
        highlight: '手工内角（Interior Angles）与黄金套筒',
        desc: '日内瓦波纹、鱼鳞纹、镜面黑抛（Black Polish）与 18K 黄金自动陀。其中“夹板尖锐内角”机器铣刀无法加工，是检验顶奢手工含金量的最高试金石。',
        tags: ['手工内角', '日内瓦波纹', '黑抛镜面']
      },
      {
        id: 'gem',
        num: '④',
        title: '宝石镶嵌逻辑',
        highlight: '贵金属手工起钉与严苛净度匹配',
        desc: '高珠款与复杂款常见隐形镶嵌、雪花镶嵌与长阶梯形切割（Tapered Baguette）表圈，强调贵金属底座微雕起钉与宝石切面无缝贴合。',
        tags: ['长阶梯方钻', '雪花镶嵌', '金属微雕起钉']
      }
    ],
    redlines: [
      '非原厂“粗暴抛光”：把八角圈或表耳的 45° 刀锋倒角抛成圆弧“大馒头”，原厂锐利棱线一旦磨圆几乎不可逆，估值直接腰斩。',
      '盘面与指针氧化/翻新痕迹：古董或老款大明火珐琅微裂、Tapisserie 格纹盘后补漆，会彻底破坏原装收藏价值。',
      '机芯螺丝拧痕与夹板划伤：黄金表壳与细腻日内瓦条纹极软，非专用批头拆修会留下明显毛刺或划痕。'
    ]
  },
  {
    id: 'industrial',
    name: '现代精密工业流派',
    shortName: '现代精密工业流派（Rolex）',
    eraTag: '精密工业标杆',
    representatives: '劳力士 Rolex',
    origin: '极端一致性、耐操度与精密自动化工程',
    valueAnchor: '百万枚如一的严苛公差、三角坑纹锐利切工与 PVD 陶瓷圈全天候耐用',
    summary:
      '把“工业化的一致性”推向人类极限。不迷信炫技式手工雕花，而是通过自建铸造厂、全自动高精 CNC 与 PVD/Cerachrom 专利材料，让每一只出厂腕表都拥有教科书级的锐利与稳定。',
    accent: '#10b981',
    accentSoft: 'rgba(16, 185, 129, 0.14)',
    accentBorder: 'rgba(16, 185, 129, 0.42)',
    featuredTextures: ['satin', 'chamfer'],
    defaultTexture: 'satin',
    parts: [
      {
        id: 'case',
        num: '①',
        title: '表壳与外装',
        highlight: '蚝式一体防撞结构与钻石切工三角坑纹',
        desc: '904L 蚝式钢与 18K 金由自家铸造，表耳拉丝纹理笔直均匀；标志性三角坑纹（狗牙圈）采用高精度金刚石刀具一次切削成型，每个切面都能精准折射光线。',
        tags: ['904L 蚝式钢', '三角坑纹切工', 'Cerachrom 陶瓷圈']
      },
      {
        id: 'dial',
        num: '②',
        title: '表盘与视觉结构',
        highlight: '放射太阳纹、Chromalight 夜光与 PVD 覆膜',
        desc: '盘面追求极高辨识度与十年不变色：细腻放射太阳纹、漆面盘、PVD 真空镀膜金属色盘，以及 18K 金底座手工填涂的持久蓝光 Chromalight 夜光时标。',
        tags: ['放射太阳纹', 'PVD 金属盘', 'Chromalight 夜光']
      },
      {
        id: 'movement',
        num: '③',
        title: '机芯表面修饰',
        highlight: '实用主义干净打磨与无卡度稳定结构',
        desc: '绝大多数为密底防水设计，机芯打磨服务于“清洁防尘与高耐用度”：工整的放射纹、太阳纹与倒角，搭配红轮、蓝游丝与 Paraflex 缓震装置。',
        tags: ['放射打磨', '防尘耐磨', '密底实用主义']
      },
      {
        id: 'gem',
        num: '④',
        title: '宝石镶嵌逻辑',
        highlight: '高规格统一分级与工厂级精准孔位',
        desc: '如彩虹迪、冰蓝迪等镶钻款，对钻石色泽渐变与净度建立近乎苛刻的工业级配对标准，每颗宝石槽位由 CNC 精密预留再由工匠手工压钉锁定。',
        tags: ['渐变彩色蓝宝石', 'CNC 精密槽位', '工厂级一致性']
      }
    ],
    redlines: [
      '牙圈（三角坑纹）过度抛光：狗牙圈棱角一旦被抛钝失去“一格一闪”的锐利折射，必须换圈，不可修复。',
      '素壳私改“第三方后镶钻”：在原厂无钻钢壳/金壳上擅自打孔后镶，破坏表壳密封与原厂结构，官方售后直接拒保且二级市场大幅折价。',
      '陶瓷圈刻字 PVD 镀层磨损或崩角：Cerachrom 陶瓷圈虽防刮但怕磕碰崩边，更换原厂字圈成本极高。'
    ]
  },
  {
    id: 'avantgarde',
    name: '先锋微机械工程流派',
    shortName: '先锋微机械工程流派（Richard Mille）',
    eraTag: '航空 F1 工程',
    representatives: '理查米尔 Richard Mille',
    origin: 'F1 赛车与航空航天超精密微机械加工',
    valueAnchor: '五轴 CNC 多曲面难加工壳体、TPT 层压复合材料、电浆钛桥板与抗 5000g+ 冲击桁架镂空',
    summary:
      '彻底跳出 19 世纪传统钟表美学，以 F1 赛车底盘与航天器标准造表：没有传统日内瓦条纹，却把极难加工的弧形酒桶壳、微喷砂五级钛桥板与极限抗冲击结构做到天价门槛。',
    accent: '#38bdf8',
    accentSoft: 'rgba(56, 189, 248, 0.14)',
    accentBorder: 'rgba(56, 189, 248, 0.42)',
    featuredTextures: ['microblast', 'tpt'],
    defaultTexture: 'tpt',
    parts: [
      {
        id: 'case',
        num: '①',
        title: '表壳与外装',
        highlight: '五轴 CNC 三明治弧面与 TPT 波浪纹理',
        desc: '标志性酒桶型三明治表壳在 X/Y/Z 轴上呈复杂双曲面贴腕弧度，仅单只表壳加工与废品率成本极高；Carbon TPT / Quartz TPT 经 45° 交错层压后铣削出独一无二的波浪木纹肌理。',
        tags: ['五轴 CNC 曲面', 'Carbon/Quartz TPT', '五花键防拆螺丝']
      },
      {
        id: 'dial',
        num: '②',
        title: '表盘与视觉结构',
        highlight: '“无盘面”全镂空建筑感与蓝宝石悬浮刻度',
        desc: '摒弃传统整片金属表盘，将机芯桥板直接变成视觉主角；时标与刻度直接印制或悬吊于透明蓝宝石玻璃及金属法兰内圈之上，呈现极强的机械立体透视感。',
        tags: ['全镂空架构', '蓝宝石悬浮盘', '高饱和撞色法兰']
      },
      {
        id: 'movement',
        num: '③',
        title: '机芯表面修饰',
        highlight: '微喷砂电浆钛桥板与 PVD 镀层亮边倒角',
        desc: '底板与桥板采用高强度五级钛合金或电浆处理钛，表面施以微喷砂（Microblasting）消除多余反光，并在镂空桁架边缘拉出极窄而锐利的亮边倒角，能承受 5000g+ 冲击。',
        tags: ['微喷砂钛桥板', 'PVD/电浆处理', '5000g+ 抗冲击桁架']
      },
      {
        id: 'gem',
        num: '④',
        title: '宝石镶嵌逻辑',
        highlight: '在陶瓷与 TPT 碳纤维上直接钻孔镶嵌',
        desc: '突破贵金属软质限制，使用金刚石钻头直接在硬度极高的 TZP 陶瓷或层压 TPT 复合材料上高精度开孔，嵌入钛金属或贵金属爪座，实现硬核科技材质与钻石的结合。',
        tags: ['TPT/陶瓷开孔镶嵌', '金属嵌爪座', '高难度异质结合']
      }
    ],
    redlines: [
      '五花键螺丝（Spline Screws）拧花崩口：RM 表壳与机芯采用专有花键螺丝，若用非原厂工具强行拆表，螺丝槽口必留不可逆翻边拧痕，一眼露馅。',
      'TPT 复合材料边角磕碰分层：Carbon/Quartz TPT 虽轻韧，但受尖锐硬物猛击可能出现纤维丝起毛或分层，几乎无法通过传统抛光修复。',
      '微喷砂钛桥板二次乱擦或非原厂补漆：机芯桥板 PVD/电浆涂层一旦因拆修被划伤，极易暴露底层金属色差。'
    ]
  }
]

const textures: TextureItem[] = [
  {
    id: 'satin',
    name: '单向缎面拉丝',
    en: 'Satin Brushing',
    schools: '传统手工流派 / 现代工业流派',
    optics:
      '无数平行排列的微米级细纹将强光打散为柔和连续的线性丝绸光泽，避免刺眼反光，同时能凸显表壳平面走势。',
    inspection:
      '真表原厂拉丝笔直均匀、颗粒感统一；若出现方向歪斜、发亮发贼或纹理粗细不一，多为第三方翻新拉丝。'
  },
  {
    id: 'chamfer',
    name: '45° 刀锋镜面倒角',
    en: 'Mirror Chamfer / Anglage',
    schools: '传统手工流派核心灵魂 / 工业流派棱线',
    optics:
      '在拉丝平面与侧面之间切削出约 45° 的窄斜坡并抛至镜面，转动手腕时会沿表壳轮廓流动出一道极锐利的高光金线。',
    inspection:
      '二手估值的生死线！非原厂反复抛光会把 45° 棱线磨成圆弧，高光从“锐利细线”变成“模糊宽带”。'
  },
  {
    id: 'geneva',
    name: '日内瓦条纹',
    en: 'Côtes de Genève',
    schools: '传统手工修饰流派（PP / AP）',
    optics:
      '由旋转磨头沿夹板规律推进留下的弧形波浪纹，每条波纹边缘清晰、明暗交替极具节奏感，是传统机芯的标志性光影语言。',
    inspection:
      '重点看条纹衔接是否连贯自然、边缘有无拆修留下的滑脱划痕，以及螺丝孔周边是否保持平整无变形。'
  },
  {
    id: 'microblast',
    name: '微喷砂哑光钛 + 亮边倒角',
    en: 'Microblasted Ti + Bright Bevel',
    schools: '先锋微机械工程流派（Richard Mille）',
    optics:
      '微喷砂带来深邃内敛的哑光漫反射背景，让机芯齿轮与镂空桁架边缘的极细亮边倒角形成强烈明暗反差，机械立体感极强。',
    inspection:
      '注意检查微喷砂表面颗粒是否均匀、有无二次擦伤留下的亮斑或 PVD 镀层脱落。'
  },
  {
    id: 'tpt',
    name: 'TPT 45° 波浪层压纹',
    en: 'TPT 45° Layered Wave',
    schools: '先锋微机械工程流派（Richard Mille）',
    optics:
      '数百层约 30 微米厚的碳纤维或石英纤维以 45° 交错叠压，经五轴 CNC 立体铣削后，每只表壳都会露出独一无二的等高线木纹光影。',
    inspection:
      '原厂 TPT 纹理连贯且表面呈细腻哑光触感，表耳边缘无起毛、无胶层剥离，五花键螺丝与孔位严丝合缝。'
  }
]

const activeSchoolId = ref<SchoolId>('traditional')
const activeTextureId = ref<TextureId>('chamfer')

const currentSchool = computed<SchoolItem>(
  () => schools.find((s) => s.id === activeSchoolId.value) ?? schools[0]
)

const currentTexture = computed<TextureItem>(
  () => textures.find((t) => t.id === activeTextureId.value) ?? textures[0]
)

function selectSchool(id: SchoolId) {
  activeSchoolId.value = id
  const found = schools.find((s) => s.id === id)
  if (found) {
    activeTextureId.value = found.defaultTexture
  }
}
</script>

<style scoped>
.cs-card {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  background: linear-gradient(180deg, #0b1120 0%, #0f172a 100%);
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  color: #e2e8f0;
  box-shadow: 0 18px 40px -24px rgba(2, 6, 23, 0.85);
}

.cs-card *,
.cs-card *::before,
.cs-card *::after {
  box-sizing: border-box;
}

.cs-header {
  margin-bottom: 16px;
}

.cs-title-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cs-badge {
  align-self: flex-start;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #fcd34d;
  background: rgba(245, 158, 11, 0.14);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 999px;
  padding: 3px 10px;
}

.cs-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.cs-subtitle {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.55;
}

/* 三大流派切换 Tab */
.cs-school-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.cs-school-tab {
  appearance: none;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #263244;
  background: rgba(15, 23, 42, 0.85);
  color: #cbd5e1;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.15s ease;
  min-width: 0;
}

.cs-school-tab:hover {
  border-color: #475569;
  background: rgba(30, 41, 59, 0.72);
}

.cs-school-tab.active {
  color: #f8fafc;
}

.cs-school-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.cs-school-name {
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.3;
}

.cs-school-rep {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.35;
}

/* 核心价值锚点 */
.cs-anchor-banner {
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid #1e293b;
  border-left-width: 4px;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 18px;
}

.cs-anchor-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.cs-anchor-pill {
  font-size: 11px;
  font-weight: 700;
  border: 1px solid;
  border-radius: 999px;
  padding: 2px 8px;
}

.cs-anchor-origin {
  font-size: 12px;
  color: #94a3b8;
}

.cs-anchor-quote {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.45;
}

.cs-anchor-summary {
  margin: 0;
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.6;
}

/* 表面肌理微距对比 */
.cs-texture-section {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 18px;
}

.cs-section-head {
  margin-bottom: 10px;
}

.cs-section-title {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

.cs-section-desc {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}

.cs-texture-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.cs-texture-item {
  appearance: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #263244;
  background: #0b1220;
  color: #cbd5e1;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  min-width: 0;
}

.cs-texture-item:hover {
  border-color: #475569;
}

.cs-texture-item.is-featured {
  border-color: rgba(148, 163, 184, 0.45);
}

.cs-texture-item.active {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.cs-texture-svg-wrap {
  position: relative;
  width: 100%;
}

.cs-texture-svg {
  display: block;
  width: 100%;
  height: auto;
}

.cs-texture-match-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  box-shadow: 0 0 0 2px #0b1220;
}

.cs-texture-name {
  font-size: 12px;
  font-weight: 600;
  color: #f8fafc;
  line-height: 1.3;
}

.cs-texture-en {
  font-size: 10px;
  color: #64748b;
  line-height: 1.2;
}

.cs-texture-detail {
  background: #0b1220;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 12px;
}

.cs-texture-detail-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.cs-texture-detail-title {
  font-size: 13px;
  font-weight: 700;
  color: #fcd34d;
}

.cs-texture-detail-schools {
  font-size: 11px;
  color: #94a3b8;
}

.cs-texture-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.cs-texture-detail-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cs-detail-k {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
}

.cs-detail-v {
  margin: 0;
  font-size: 12px;
  color: #e2e8f0;
  line-height: 1.55;
}

/* 四大部位卡片 */
.cs-parts-section {
  margin-bottom: 16px;
}

.cs-parts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.cs-part-card {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.cs-part-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cs-part-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  border: 1px solid;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.cs-part-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

.cs-part-highlight {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #fde68a;
  line-height: 1.4;
}

.cs-part-desc {
  margin: 0;
  font-size: 12.5px;
  color: #cbd5e1;
  line-height: 1.6;
  flex: 1;
}

.cs-part-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cs-part-tag {
  font-size: 11px;
  color: #94a3b8;
  background: #1e293b;
  border-radius: 6px;
  padding: 2px 8px;
}

/* 二手验表核心红线 */
.cs-redline-box {
  background: rgba(127, 29, 29, 0.18);
  border: 1px solid rgba(248, 113, 113, 0.38);
  border-radius: 12px;
  padding: 14px 16px;
}

.cs-redline-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.cs-redline-badge {
  font-size: 12px;
  font-weight: 700;
  color: #fca5a5;
}

.cs-redline-school {
  font-size: 12px;
  color: #fecaca;
  opacity: 0.85;
}

.cs-redline-list {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cs-redline-item {
  font-size: 12.5px;
  color: #fee2e2;
  line-height: 1.55;
}

/* 响应式：平板与手机端（含 375px） */
@media (max-width: 820px) {
  .cs-texture-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .cs-card {
    padding: 14px;
    border-radius: 12px;
  }

  .cs-school-tabs {
    grid-template-columns: 1fr;
  }

  .cs-parts-grid {
    grid-template-columns: 1fr;
  }

  .cs-texture-detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
