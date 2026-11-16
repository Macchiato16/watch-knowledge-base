<script setup lang="ts">
import { computed, ref } from 'vue'

type SegmentKind = 'base' | 'slash' | 'material' | 'suffix'

interface ReferenceSegment {
  kind: SegmentKind
  code: string
  label: string
  meaning: string
  isEmptySlash?: boolean
}

interface PatekReferenceCase {
  id: string
  ref: string
  series: string
  tag: string
  subtitle: string
  segments: ReferenceSegment[]
  decodable: string[]
  requiresLookup: string[]
}

const referenceCases: PatekReferenceCase[] = [
  {
    id: '5711-1a-010',
    ref: '5711/1A-010',
    series: 'Nautilus 鹦鹉螺',
    tag: '经典钢带运动款',
    subtitle: '现代百达翡丽最标准的四段式精钢链带编码样本',
    segments: [
      {
        kind: 'base',
        code: '5711',
        label: '① 基础型号',
        meaning: 'Nautilus 三针日历表壳与机芯平台（5xxx 现代男表主力）'
      },
      {
        kind: 'slash',
        code: '/1',
        label: '② 结构/镶嵌码',
        meaning: '原厂出厂标配一体式金属表链（此处为精钢链带）'
      },
      {
        kind: 'material',
        code: 'A',
        label: '③ 表壳材质',
        meaning: 'Acier 精钢表壳与链带'
      },
      {
        kind: 'suffix',
        code: '-010',
        label: '④ 配置尾码',
        meaning: '该型号下的特定盘面版本（此处对应渐变蓝黑横纹盘）'
      }
    ],
    decodable: [
      '属于现代四段式编码（`5xxx` 常规男表/中性表定位）',
      '原厂出厂标配一体式金属表链（含 `/1`）',
      '表壳与链带主体材质为精钢（`A` = Acier）',
      '原厂素圈无镶钻（无 `/200`、`/300` 等宝石附加码）'
    ],
    requiresLookup: [
      '具体盘面颜色：`-010` 仅在本款对应渐变蓝黑盘，不可跨款推导',
      '是否联名双标：多数早期 Tiffany & Co. 双标盘在型号上仍同为 `5711/1A-010`（唯有 170 周年纪念版拥有独立尾码 `5711/1A-018`）',
      '具体出厂/销售年份：须核对原产地证书（出生纸）或申请后补档案',
      '具体机芯版本（早期 Cal. 315/324 vs 后期 Cal. 26-330 S C）与防水深度'
    ]
  },
  {
    id: '5726a-001',
    ref: '5726A-001',
    series: 'Nautilus 鹦鹉螺',
    tag: '无斜杠 · 皮带款',
    subtitle: '无斜杠代表原厂非金属表链——电话报价一秒区分皮带与钢带',
    segments: [
      {
        kind: 'base',
        code: '5726',
        label: '① 基础型号',
        meaning: 'Nautilus 年历月相 24 小时显示壳型平台'
      },
      {
        kind: 'slash',
        code: '(无斜杠)',
        label: '② 结构/镶嵌码',
        meaning: '无 `/1` 与宝石码 = 原厂标配非金属表带（鳄鱼皮带）且素圈无钻',
        isEmptySlash: true
      },
      {
        kind: 'material',
        code: 'A',
        label: '③ 表壳材质',
        meaning: 'Acier 精钢表壳（配精钢折叠扣）'
      },
      {
        kind: 'suffix',
        code: '-001',
        label: '④ 配置尾码',
        meaning: '该型号初代配置（此处对应渐变黑灰盘 + 黑色鳄鱼皮带）'
      }
    ],
    decodable: [
      '原厂出厂标配为非金属表带（无 `/1`），非一体式精钢链带',
      '表壳材质为精钢（`A`）',
      '表圈与表壳为原厂素面设计，无原厂宝石镶嵌码',
      '基础壳型平台为 `5726`（同属 `5xxx` 现代主流序列）'
    ],
    requiresLookup: [
      '具体表带材质是鳄鱼皮带还是复合材料橡胶带（本款为鳄鱼皮带，同无斜杠的 `5167A` 则是橡胶带）',
      '具体盘面配色：`-001` 在此为渐变黑灰盘，在 `5726A-010` 则是白盘',
      '实际生产与销售年份（2010 年推出，跨度多年）',
      '机芯型号（Cal. 324 S QA LU 24H/303）与 120 米防水规格'
    ]
  },
  {
    id: '5726-1a-014',
    ref: '5726/1A-014',
    series: 'Nautilus 鹦鹉螺',
    tag: '带 /1 · 钢带蓝盘',
    subtitle: '与 5726A-001 对比：多出 /1 变成钢链款，且 -014 在此是蓝盘而非绿盘',
    segments: [
      {
        kind: 'base',
        code: '5726',
        label: '① 基础型号',
        meaning: 'Nautilus 年历月相壳型平台（与 `5726A` 同源）'
      },
      {
        kind: 'slash',
        code: '/1',
        label: '② 结构/镶嵌码',
        meaning: '原厂标配一体式金属表链（与无斜杠皮带款形成数万元价差）'
      },
      {
        kind: 'material',
        code: 'A',
        label: '③ 表壳材质',
        meaning: 'Acier 精钢表壳与一体式精钢链带'
      },
      {
        kind: 'suffix',
        code: '-014',
        label: '④ 配置尾码',
        meaning: '此处为渐变蓝盘（注意：`5711/1A-014` 却是橄榄绿盘！）'
      }
    ],
    decodable: [
      '原厂出厂标配一体式金属表链（`/1`），可明确区分于皮带款 `5726A`',
      '表壳与链带材质均为精钢（`A`）',
      '原厂无宝石镶嵌（无 `/200`、`/300` 等镶嵌码）',
      '与 `5726A` 共享 `5726` 基础壳型平台'
    ],
    requiresLookup: [
      '具体盘面颜色：同为 `-014`，在 `5726/1A-014` 为渐变蓝盘，在 `5711/1A-014` 为橄榄绿盘，在 `5270P-014` 为绿漆盘',
      '是否曾更换过非原装盘面或表链',
      '具体出厂年份与停产批次（2019 年巴塞尔表展发布）',
      '机芯细节与防水性能（须查官方目录）'
    ]
  },
  {
    id: '5711-1300a-001',
    ref: '5711/1300A-001',
    series: 'Nautilus 鹦鹉螺',
    tag: '/1 + 300 叠加码',
    subtitle: '钢链（/1）叠加原厂长阶梯方钻圈（300），二手防“后镶钻”核心标本',
    segments: [
      {
        kind: 'base',
        code: '5711',
        label: '① 基础型号',
        meaning: 'Nautilus 三针日历基础壳型'
      },
      {
        kind: 'slash',
        code: '/1300',
        label: '② 结构/镶嵌码',
        meaning: '`/1`（金属链带）+ `300`（原厂镶嵌长阶梯形切割方钻表圈）叠加编码'
      },
      {
        kind: 'material',
        code: 'A',
        label: '③ 表壳材质',
        meaning: 'Acier 精钢表壳与精钢链带（罕见的钢壳配原厂方钻组合）'
      },
      {
        kind: 'suffix',
        code: '-001',
        label: '④ 配置尾码',
        meaning: '该独立镶钻型号的唯一官方配置（此处为橄榄绿日辉纹盘）'
      }
    ],
    decodable: [
      '原厂出厂即配备金属表链（百位前导 `1` 来自 `/1` 规则叠加）',
      '原厂镶嵌长阶梯形切割方钻（`300` 系列主石切割大类，共 32 颗梯形定制切割方钻）',
      '表壳与链带材质为精钢（`A`），绝非白金或铂金',
      '若实物带方钻圈但出生纸无 `/1300` 或 `/300`，即可判定为后镶钻'
    ],
    requiresLookup: [
      '具体盘面颜色：此处 `-001` 为橄榄绿盘（与普通绿盘 `5711/1A-014` 尾码完全不同）',
      '具体钻石总克拉数、净度等级（Top Wesselton IF）与镶嵌颗数（32 颗）',
      '发布及生产周期（2021 年随绿盘 5711 作为告别之作推出）',
      '搭载机芯口径（Cal. 26-330 S C）与公价信息'
    ]
  },
  {
    id: '5268-200r-010',
    ref: '5268/200R-010',
    series: 'Aquanaut Luce 手雷',
    tag: '胶带 + /200 圆钻',
    subtitle: '无 /1 的复合材料橡胶表带 + /200 原厂明亮式圆钻表圈 + 18K 玫瑰金',
    segments: [
      {
        kind: 'base',
        code: '5268',
        label: '① 基础型号',
        meaning: 'Aquanaut Luce 自动上链机械款壳型（38.8 mm）'
      },
      {
        kind: 'slash',
        code: '/200',
        label: '② 结构/镶嵌码',
        meaning: '无 `/1`（配非金属橡胶表带）+ `200`（原厂镶嵌明亮式切割圆钻表圈）'
      },
      {
        kind: 'material',
        code: 'R',
        label: '③ 表壳材质',
        meaning: 'Or Rose 18K 玫瑰金表壳'
      },
      {
        kind: 'suffix',
        code: '-010',
        label: '④ 配置尾码',
        meaning: '该型号下的特定盘面与表带配色版本（此处为灰褐色 Taupe）'
      }
    ],
    decodable: [
      '原厂出厂标配非金属表带（`200` 前无 `1`，非 `/1200` 金属链带）',
      '原厂表圈镶嵌明亮式切割圆钻（`/200` 系列圆钻大类）',
      '表壳及表扣贵金属材质为 18K 玫瑰金（`R`）',
      '可与后期镶嵌的后改圆钻款直接通过出生纸编码区分'
    ],
    requiresLookup: [
      '具体盘面与胶带颜色：`-010` 为灰褐色 Taupe，`-001` 则为哑光白色',
      '具体圆钻颗数与总重（48 颗明亮式切割圆钻，约 1.11–1.17 克拉）',
      '表带属于复合材料橡胶带而非鳄鱼皮带',
      '具体发布年份（2021 年）与防水深度说明'
    ]
  },
  {
    id: '5821-1ar-001',
    ref: '5821/1AR-001',
    series: 'Cubitus 方形运动',
    tag: '双字母间金 AR',
    subtitle: '2024 年全新方形运动系列：/1 一体式链带 + AR 精钢玫瑰金双色间金',
    segments: [
      {
        kind: 'base',
        code: '5821',
        label: '① 基础型号',
        meaning: 'Cubitus 大三针日历方形运动壳型（45 mm，5xxx 序列）'
      },
      {
        kind: 'slash',
        code: '/1',
        label: '② 结构/镶嵌码',
        meaning: '原厂标配一体式双色金属表链'
      },
      {
        kind: 'material',
        code: 'AR',
        label: '③ 表壳材质',
        meaning: '双字母材质码：`A`（精钢）+ `R`（18K 玫瑰金）双色间金'
      },
      {
        kind: 'suffix',
        code: '-001',
        label: '④ 配置尾码',
        meaning: '该间金版本的官方首发配置（此处为复古蓝盘）'
      }
    ],
    decodable: [
      '原厂出厂标配一体式金属表链（含 `/1`）',
      '表壳与链带为精钢 + 18K 玫瑰金双色间金结构（`AR` 双字母组合）',
      '原厂素圈无宝石镶嵌（无 `/200`、`/300` 等后缀）',
      '属于 `5xxx` 现代主流腕表编码序列'
    ],
    requiresLookup: [
      '具体间金分布位置（表圈与链带中节为 18K 玫瑰金，表壳主体与外链节为精钢）',
      '具体盘面颜色（`-001` 在此对应太阳纹蓝色横纹盘）',
      '系列归属名称（Cubitus，2024 年 10 月全新发布，需查目录确认）',
      '搭载机芯 Cal. 26-330 S C 及 30 米防水等级'
    ]
  },
  {
    id: '6119g-001',
    ref: '6119G-001',
    series: 'Calatrava 古典正装',
    tag: '6xxx 经典反例',
    subtitle: '重大避坑：6 开头并非都是超复杂表王！这是手动小三针入门正装 Calatrava',
    segments: [
      {
        kind: 'base',
        code: '6119',
        label: '① 基础型号',
        meaning: 'Calatrava 巴黎钉纹表圈手动小三针（`6xxx` 经典反例，非超复杂！）'
      },
      {
        kind: 'slash',
        code: '(无斜杠)',
        label: '② 结构/镶嵌码',
        meaning: '无 `/1` = 原厂标配非金属表带（鳄鱼皮带）且无镶钻',
        isEmptySlash: true
      },
      {
        kind: 'material',
        code: 'G',
        label: '③ 表壳材质',
        meaning: 'Or Gris 18K 白金表壳（配白金针扣）'
      },
      {
        kind: 'suffix',
        code: '-001',
        label: '④ 配置尾码',
        meaning: '白金壳下的首发配置（此处为炭灰色竖拉丝盘 + 亮面黑鳄鱼皮带）'
      }
    ],
    decodable: [
      '原厂出厂标配非金属表带（无 `/1`，正装皮带款）',
      '表壳材质为 18K 白金（`G` = Or Gris）',
      '原厂素表壳，无钻石镶嵌（巴黎钉纹为机雕金属工艺，不触发宝石码）',
      '不可单凭 `6xxx` 首位数字推断为“超级复杂功能表王”'
    ],
    requiresLookup: [
      '功能复杂度与机芯类型：须查目录才能确认是手动双发条盒小三针（Cal. 30-255 PS），而非陀飞轮或三问',
      '具体盘面颜色与时标样式（炭灰竖拉丝盘配白金炮弹形立体时标）',
      '39 mm 表径与巴黎钉纹（Clous de Paris）表圈设计特征',
      '发布年份（2021 年推出，承袭 3919 / 5119）'
    ]
  },
  {
    id: '5270-1r-001',
    ref: '5270/1R-001',
    series: '超级复杂功能时计',
    tag: '全金链带超复杂',
    subtitle: '万年历计时旗舰配 /1 全 18K 玫瑰金一体式“水滴”表链，克重与公价双高',
    segments: [
      {
        kind: 'base',
        code: '5270',
        label: '① 基础型号',
        meaning: '超级复杂功能万年历计时（5970 继任者，仍归入 `5xxx` 序列）'
      },
      {
        kind: 'slash',
        code: '/1',
        label: '② 结构/镶嵌码',
        meaning: '原厂标配一体式全金属表链（此处为五排式玫瑰金“水滴”链带）'
      },
      {
        kind: 'material',
        code: 'R',
        label: '③ 表壳材质',
        meaning: 'Or Rose 18K 玫瑰金表壳与全玫瑰金表链'
      },
      {
        kind: 'suffix',
        code: '-001',
        label: '④ 配置尾码',
        meaning: '该全金链带型号的配置版本（此处为乌木黑日辉纹盘）'
      }
    ],
    decodable: [
      '原厂出厂即标配全金属表链（`/1`），区别于皮带款 `5270R-001`',
      '表壳与整条金属表链主体材质均为 18K 玫瑰金（`R`）',
      '原厂无宝石镶嵌（无 `/200`、`/300` 等镶嵌码）',
      '基础壳型为 `5270`（亦印证 `5xxx` 涵盖大量超级复杂功能）'
    ],
    requiresLookup: [
      '具体盘面颜色：此处 `-001` 为乌木黑盘；而在铂金皮带 `5270P-001` 上 `-001` 则是鲑鱼盘，`5270P-014` 则是绿漆盘',
      '具体链带工艺名称（手工打磨五排“Goutte”水滴型链节）',
      '所搭载机芯（Cal. CH 29-535 PS Q 手动万年历计时）与发布年份（2018 年）',
      '链带完整节数与原厂克重核验（二手高价收售关键）'
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
  <div class="pp-ref-card">
    <div class="pp-ref-header">
      <div class="pp-ref-title-wrap">
        <span class="pp-ref-badge">真实型号分段拆解台</span>
        <h4 class="pp-ref-heading">8 个代表性百达翡丽型号编码实战剖析</h4>
      </div>
      <p class="pp-ref-note">
        点击切换真实官方型号，对比「单凭编码可读」与「必须查目录/出生纸」的严格边界（不提供无依据的自由文本猜测解码）。
      </p>
    </div>

    <div class="pp-ref-selector" role="tablist" aria-label="选择百达翡丽真实型号">
      <button
        v-for="item in referenceCases"
        :key="item.id"
        type="button"
        role="tab"
        :aria-selected="selectedId === item.id"
        class="pp-ref-btn"
        :class="{ active: selectedId === item.id }"
        @click="selectedId = item.id"
      >
        <span class="pp-ref-btn-code">{{ item.ref }}</span>
        <span class="pp-ref-btn-tag">{{ item.tag }}</span>
      </button>
    </div>

    <div class="pp-ref-stage">
      <div class="pp-ref-meta">
        <span class="pp-ref-series">{{ currentCase.series }}</span>
        <span class="pp-ref-fullcode">{{ currentCase.ref }}</span>
      </div>
      <p class="pp-ref-subtitle">{{ currentCase.subtitle }}</p>

      <!-- 四段公式拆解色块 -->
      <div class="pp-seg-grid">
        <div
          v-for="seg in currentCase.segments"
          :key="seg.label"
          class="pp-seg-box"
          :class="[`is-${seg.kind}`, { 'is-empty': seg.isEmptySlash }]"
        >
          <div class="pp-seg-label">{{ seg.label }}</div>
          <div class="pp-seg-code">{{ seg.code }}</div>
          <div class="pp-seg-meaning">
            <template v-for="(tok, tIdx) in parseInlineCode(seg.meaning)" :key="tIdx">
              <code v-if="tok.isCode" class="pp-inline-code">{{ tok.text }}</code>
              <template v-else>{{ tok.text }}</template>
            </template>
          </div>
        </div>
      </div>

      <!-- 双栏边界结论 -->
      <div class="pp-boundary-grid">
        <div class="pp-boundary-box is-ok">
          <div class="pp-boundary-title">✓ 单凭型号编码可直接确认</div>
          <ul class="pp-boundary-list">
            <li v-for="(line, idx) in currentCase.decodable" :key="idx">
              <template v-for="(tok, tIdx) in parseInlineCode(line)" :key="tIdx">
                <code v-if="tok.isCode" class="pp-inline-code">{{ tok.text }}</code>
                <template v-else>{{ tok.text }}</template>
              </template>
            </li>
          </ul>
        </div>

        <div class="pp-boundary-box is-warn">
          <div class="pp-boundary-title">⚠ 编码无法体现 · 须查目录/出生纸</div>
          <ul class="pp-boundary-list">
            <li v-for="(line, idx) in currentCase.requiresLookup" :key="idx">
              <template v-for="(tok, tIdx) in parseInlineCode(line)" :key="tIdx">
                <code v-if="tok.isCode" class="pp-inline-code">{{ tok.text }}</code>
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
.pp-ref-card {
  margin: 22px 0;
  padding: 18px;
  border-radius: 14px;
  background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
  border: 1px solid #1e293b;
  color: #e2e8f0;
  box-shadow: 0 12px 32px rgba(2, 6, 23, 0.35);
}

.pp-ref-header {
  margin-bottom: 14px;
}

.pp-ref-title-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.pp-ref-badge {
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

.pp-ref-heading {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.pp-ref-note {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #94a3b8;
}

.pp-ref-selector {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.pp-ref-btn {
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

.pp-ref-btn:hover {
  border-color: #64748b;
  background: #131c31;
}

.pp-ref-btn.active {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.14);
  box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.25);
}

.pp-ref-btn-code {
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  font-weight: 700;
  color: #f8fafc;
  overflow-wrap: anywhere;
}

.pp-ref-btn.active .pp-ref-btn-code {
  color: #fde68a;
}

.pp-ref-btn-tag {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.3;
}

.pp-ref-btn.active .pp-ref-btn-tag {
  color: #fcd34d;
}

.pp-ref-stage {
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #1e293b;
}

.pp-ref-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.pp-ref-series {
  font-size: 12px;
  font-weight: 600;
  color: #93c5fd;
  letter-spacing: 0.02em;
}

.pp-ref-fullcode {
  font-family: var(--vp-font-family-mono);
  font-size: 18px;
  font-weight: 800;
  color: #fde68a;
  letter-spacing: 0.02em;
}

.pp-ref-subtitle {
  margin: 0 0 14px;
  font-size: 13.5px;
  line-height: 1.55;
  color: #cbd5e1;
}

.pp-seg-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.pp-seg-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 11px 10px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #0b1220;
  min-width: 0;
}

.pp-seg-box.is-base {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(30, 58, 138, 0.16);
}

.pp-seg-box.is-slash {
  border-color: rgba(245, 158, 11, 0.5);
  background: rgba(146, 64, 14, 0.16);
}

.pp-seg-box.is-slash.is-empty {
  border-style: dashed;
  border-color: rgba(148, 163, 184, 0.45);
  background: rgba(30, 41, 59, 0.35);
}

.pp-seg-box.is-material {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(6, 78, 59, 0.18);
}

.pp-seg-box.is-suffix {
  border-color: rgba(168, 85, 247, 0.5);
  background: rgba(88, 28, 135, 0.18);
}

.pp-seg-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
}

.pp-seg-code {
  font-family: var(--vp-font-family-mono);
  font-size: 18px;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.pp-seg-box.is-empty .pp-seg-code {
  font-size: 14px;
  color: #cbd5e1;
}

.pp-seg-meaning {
  font-size: 12px;
  line-height: 1.5;
  color: #cbd5e1;
}

.pp-boundary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.pp-boundary-box {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #334155;
  min-width: 0;
}

.pp-boundary-box.is-ok {
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(20, 83, 45, 0.18);
}

.pp-boundary-box.is-warn {
  border-color: rgba(245, 158, 11, 0.4);
  background: rgba(120, 53, 15, 0.18);
}

.pp-boundary-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
}

.pp-boundary-box.is-ok .pp-boundary-title {
  color: #86efac;
}

.pp-boundary-box.is-warn .pp-boundary-title {
  color: #fcd34d;
}

.pp-boundary-list {
  margin: 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.pp-boundary-list li {
  font-size: 12.5px;
  line-height: 1.55;
  color: #e2e8f0;
  margin: 0;
}

.pp-inline-code {
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
  .pp-ref-selector {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pp-seg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pp-boundary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .pp-ref-card {
    padding: 14px 12px;
  }

  .pp-ref-stage {
    padding: 12px;
  }

  .pp-ref-selector {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }

  .pp-ref-btn {
    padding: 8px;
  }

  .pp-ref-btn-code {
    font-size: 12px;
  }

  .pp-seg-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
