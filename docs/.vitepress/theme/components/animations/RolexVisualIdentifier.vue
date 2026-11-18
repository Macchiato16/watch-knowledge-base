<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

type BezelTypeId =
  | 'all'
  | 'ceramic-tachy'
  | 'metal-tachy'
  | 'rainbow-gem'
  | 'fluted-gold'
  | 'diver-60m'
  | 'gmt-24h'
  | 'ym-relief'

type DialFunctionId =
  | 'all'
  | 'chrono-3-subdials'
  | 'day-date-12-3'
  | 'date-3-only'
  | 'gmt-right-crown'
  | 'gmt-left-crown'

type BraceletGenId =
  | 'all'
  | 'oyster-old-1165'
  | 'oyster-new-1265'
  | 'oysterflex-old-1165'
  | 'oysterflex-new-1265-ym'
  | 'president-bracelet'
  | 'jubilee-bracelet'
  | 'oyster-sport-32xx'

interface FilterOption<T extends string> {
  id: T
  label: string
}

interface RolexAnchorCard {
  ref: string
  title: string
  series: string
  bezel: Exclude<BezelTypeId, 'all'>
  dial: Exclude<DialFunctionId, 'all'>
  bracelets: Exclude<BraceletGenId, 'all'>[]
  anchor: string
  confusion: string
  href: string
}

const bezelOptions: FilterOption<BezelTypeId>[] = [
  { id: 'all', label: '全部（24款）' },
  { id: 'ceramic-tachy', label: '陶瓷测速计外圈（黑陶/栗陶）' },
  { id: 'metal-tachy', label: '18K金镌刻测速计外圈' },
  { id: 'rainbow-gem', label: '36颗渐变蓝宝石彩虹圈 + 钻耳' },
  { id: 'fluted-gold', label: '18K金三角坑纹“狗牙圈”' },
  { id: 'diver-60m', label: '单向60分钟凹刻陶瓷圈 + 12点夜光珠' },
  { id: 'gmt-24h', label: '双向24小时双色凹刻陶瓷圈（无夜光珠）' },
  { id: 'ym-relief', label: '双向哑光黑陶 + 立体抛光浮雕数字圈' }
]

const dialOptions: FilterOption<DialFunctionId>[] = [
  { id: 'all', label: '全部' },
  { id: 'chrono-3-subdials', label: '2/4点旋入计时键 + 3/6/9三眼副盘' },
  { id: 'day-date-12-3', label: '12点弧形全拼星期窗 + 3点凸透镜日历' },
  { id: 'date-3-only', label: '大三针 + 仅3点水泡眼日历（无星期/无GMT针）' },
  { id: 'gmt-right-crown', label: '独立三角形24h第四针 + 右侧3点表冠日历' },
  { id: 'gmt-left-crown', label: '独立三角形24h第四针 + 左9点表冠与左日历' }
]

const braceletOptions: FilterOption<BraceletGenId>[] = [
  { id: 'all', label: '全部' },
  { id: 'oyster-old-1165', label: '三格蚝式链带 · 老代1165xx（一体圈/6点无皇冠）' },
  { id: 'oyster-new-1265', label: '三格蚝式链带 · 新代1265xx（包边圈/6点小皇冠/透底）' },
  { id: 'oysterflex-old-1165', label: 'Oysterflex胶带 · 老代一体全外露黑陶圈' },
  { id: 'oysterflex-new-1265-ym', label: 'Oysterflex胶带 · 新代金包边迪通拿 / 金游艇' },
  { id: 'president-bracelet', label: '三排半圆元首型表带（总统带 + 隐形皇冠扣）' },
  { id: 'jubilee-bracelet', label: '五排纪念型表带（五珠带）' },
  { id: 'oyster-sport-32xx', label: '三格蚝式运动链带 · 现行32xx系' }
]

const watchCatalog: RolexAnchorCard[] = [
  // 宇宙计型迪通拿（12款）
  {
    ref: '116500LN',
    title: '老款钢壳黑陶圈迪通拿（初代陶瓷熊猫/黑钢迪）',
    series: '迪通拿 · 蚝式钢',
    bezel: 'ceramic-tachy',
    dial: 'chrono-3-subdials',
    bracelets: ['oyster-old-1165'],
    anchor:
      '904L 蚝式钢壳带 + 一体全外露黑色 Cerachrom 陶瓷圈（无金属外框包边）+ 较宽厚三眼子盘环 + 6 点位 SWISS MADE 无小皇冠（Cal. 4130）。',
    confusion:
      '易混 2023 新款 126500LN（陶瓷圈外缘多一圈钢包边、细子盘环、6 点带小皇冠）；严防老款改装假包边圈冒充新款。',
    href: '/brands/rolex/daytona/116500ln'
  },
  {
    ref: '126500LN',
    title: '新款金属包边陶瓷圈钢迪（新熊猫迪 / 新黑钢迪）',
    series: '迪通拿 · 蚝式钢',
    bezel: 'ceramic-tachy',
    dial: 'chrono-3-subdials',
    bracelets: ['oyster-new-1265'],
    anchor:
      '904L 蚝式钢壳带 + 蚝式钢金属外框包边黑陶圈 + 纤细子盘外环与窄条钉 + 对称宽体表耳 + 6 点位 SWISS [小皇冠] MADE（Cal. 4131）。',
    confusion:
      '与老款 116500LN 存在明显代际价差；验表必看钢外框与陶瓷镶拼严密度、6 点小皇冠及对称表耳线条。',
    href: '/brands/rolex/daytona/126500ln'
  },
  {
    ref: '116515LN',
    title: '老款 18K 永恒玫瑰金 Oysterflex 胶带迪',
    series: '迪通拿 · 胶带贵金属',
    bezel: 'ceramic-tachy',
    dial: 'chrono-3-subdials',
    bracelets: ['oysterflex-old-1165'],
    anchor:
      '温润粉铜色 18K 永恒玫瑰金壳（一体金属头粒）+ 一体全外露黑陶圈 + Oysterflex 橡胶带配 5mm Easylink 扣 + 6 点无小皇冠（热门 -0059 粉盘黑眼 / -0055 陨石盘）。',
    confusion:
      '勿与 18K 黄金款 116518LN 混淆色温；陨石盘 -0055 与普通粉盘价差极大，NFC 保卡不印尾码需严验天然维斯台登纹。',
    href: '/brands/rolex/daytona/116515ln'
  },
  {
    ref: '116518LN',
    title: '老款 18K 黄金胶带迪（初代“余文乐”家族）',
    series: '迪通拿 · 胶带贵金属',
    bezel: 'ceramic-tachy',
    dial: 'chrono-3-subdials',
    bracelets: ['oysterflex-old-1165'],
    anchor:
      '明艳 18K 黄金壳 + 一体全外露无包边黑陶圈 + Oysterflex 胶带（5mm Easylink 扣）+ 6 点无小皇冠；王牌 -0048 香槟金盘黑眼红字即初代“余文乐”。',
    confusion:
      '区分新款 126518LN（黄金包边陶瓷圈 + Glidelock 滑动微调扣 + 6 点小皇冠）；严防普通黑/白盘换代用余文乐盘或假陨石盘。',
    href: '/brands/rolex/daytona/116518ln'
  },
  {
    ref: '126518LN',
    title: '新款 18K 黄金包边胶带迪（新余文乐 / 绿松石 / 陨石）',
    series: '迪通拿 · 胶带贵金属',
    bezel: 'ceramic-tachy',
    dial: 'chrono-3-subdials',
    bracelets: ['oysterflex-new-1265-ym'],
    anchor:
      '18K 黄金外框包边黑陶圈 + 6 点带小皇冠 + Oysterflex 表扣全面升级 Glidelock 六格滑动微调（涵盖 -0012 新余文乐、-0014 绿松石蓝漆盘、-0016 陨石盘）。',
    confusion:
      '2025 绿松石蓝漆盘 -0014 与陨石盘 -0016 二级市场溢价极高，务必核对 White Tag 尾码与原厂漆面/陨石工艺。',
    href: '/brands/rolex/daytona/126518ln'
  },
  {
    ref: '116505',
    title: '老款全 18K 永恒玫瑰金链带迪通拿',
    series: '迪通拿 · 全金链带',
    bezel: 'metal-tachy',
    dial: 'chrono-3-subdials',
    bracelets: ['oyster-old-1165'],
    anchor:
      '18K 永恒玫瑰金直接镌刻测速外圈 + 全玫瑰金三格蚝式链带 + 较宽子盘外环 + 6 点无小皇冠（代表作 -0016 粉红盘黑眼 / -0014 停产铁陨石盘）。',
    confusion:
      '区分新款 126505（6 点带小皇冠、纤细条钉与子盘环、Cal. 4131）；全玫瑰金金属外圈最忌磕碰与抛光磨糊刻度。',
    href: '/brands/rolex/daytona/116505'
  },
  {
    ref: '116508',
    title: '老款全 18K 黄金链带迪（初代 John Mayer 绿金迪家族）',
    series: '迪通拿 · 全金链带',
    bezel: 'metal-tachy',
    dial: 'chrono-3-subdials',
    bracelets: ['oyster-old-1165'],
    anchor:
      '18K 黄金镌刻测速圈 + 全黄金蚝式链带 + 6 点无小皇冠；传奇 -0013“绿金迪”采用翠绿放射纹主盘配同色全绿子盘。',
    confusion:
      '区分 2025 新绿金迪 126508-0008（亮绿漆盘配亮金色实心子盘 + 6 点小皇冠）；最高危雷区为普通金盘 116508 换后改假绿盘套利数十万！',
    href: '/brands/rolex/daytona/116508'
  },
  {
    ref: '126505',
    title: '新款全 18K 永恒玫瑰金链带迪通拿',
    series: '迪通拿 · 全金链带',
    bezel: 'metal-tachy',
    dial: 'chrono-3-subdials',
    bracelets: ['oyster-new-1265'],
    anchor:
      '18K 永恒玫瑰金镌刻测速圈 + 全金蚝式链带 + 纤细子盘环 + 6 点 SWISS [小皇冠] MADE + Cal. 4131（主流 -0003 粉金黑眼条钉 / -0002 黑盘粉金眼 8 钻）。',
    confusion:
      '区分老款 116505（6 点无小皇冠、子盘环粗）；收售清点全金链带满节数，少一节 18K 金带节扣款数千元。',
    href: '/brands/rolex/daytona/126505'
  },
  {
    ref: '126508',
    title: '新款全 18K 黄金链带迪（新绿金迪 2.0 / 金带余文乐同面）',
    series: '迪通拿 · 全金链带',
    bezel: 'metal-tachy',
    dial: 'chrono-3-subdials',
    bracelets: ['oyster-new-1265'],
    anchor:
      '18K 黄金镌刻测速圈 + 全黄金链带 + 6 点带小皇冠 + Cal. 4131；2025 新款 -0008 采用亮绿漆面配金色实心三眼子盘，一眼区隔老绿金迪。',
    confusion:
      '同一 126508 壳体下白盘 -0001 与绿盘 -0008 价差悬殊，NFC 保卡无尾码，务必严审白吊牌与原厂绿漆金眼盘面工艺。',
    href: '/brands/rolex/daytona/126508'
  },
  {
    ref: '126506',
    title: '新款 950 铂金透底“冰蓝迪”旗舰',
    series: '迪通拿 · 950铂金',
    bezel: 'ceramic-tachy',
    dial: 'chrono-3-subdials',
    bracelets: ['oyster-new-1265'],
    anchor:
      '尾码 6 锁定 950 铂金（绝非白金！）+ 铂金外框包边栗棕色陶瓷圈 + 专属冰蓝色表盘 + 迪通拿唯一蓝宝石透明表背（露 18K 金镂空摆陀）。',
    confusion:
      '区分老款 116506（无包边一体栗陶圈 + 实心铂金密底）；内部细分 -0001（夜光条钉）与更高公价的 -0002（11 颗冰糖长阶梯方钻）。',
    href: '/brands/rolex/daytona/126506'
  },
  {
    ref: '116595RBOW',
    title: '18K 永恒玫瑰金老款原厂“彩虹迪”',
    series: '迪通拿 · 原厂高珠',
    bezel: 'rainbow-gem',
    dial: 'chrono-3-subdials',
    bracelets: ['oyster-old-1165'],
    anchor:
      '18K 永恒玫瑰金 + 36 颗梯方渐变蓝宝石外圈 + 表耳/护肩 56 颗圆钻 + 粉红金晶子表盘 + 6 点无小皇冠（含黑漆 -0001/-0003、满钻中节钻带顶配 -0002、满钻素带 -0004）。',
    confusion:
      '千万级生死红线：保卡与壳号第 5 位必为 9 且带 RBOW 后缀！凡保卡写 116505 者 100% 为后打孔副厂假彩虹迪，价差数百万。',
    href: '/brands/rolex/daytona/116595rbow'
  },
  {
    ref: '126599RBOW',
    title: '2024 新款 18K 白色黄金原厂“彩虹迪”',
    series: '迪通拿 · 原厂高珠',
    bezel: 'rainbow-gem',
    dial: 'chrono-3-subdials',
    bracelets: ['oyster-new-1265'],
    anchor:
      '18K 白色黄金壳带（尾位 9）+ 36 颗梯方渐变蓝宝石圈 + 56 颗表耳护肩圆钻 + 银白金晶子表盘 + 6 点带 SWISS [小皇冠] MADE（Cal. 4131）。',
    confusion:
      '区分 2012 初代白金彩虹 116599RBOW（8 颗圆钻时标、无 6 点皇冠）及普通白金迪 116509 / 126509 后镶假彩虹。',
    href: '/brands/rolex/daytona/126599rbow'
  },

  // 星期日历型（2款）
  {
    ref: '128238',
    title: '36mm 18K 黄金三角坑纹“元首表”',
    series: '星期日历型 · 36mm',
    bezel: 'fluted-gold',
    dial: 'day-date-12-3',
    bracelets: ['president-bracelet'],
    anchor:
      '首数字 1 锁定 36mm 经典尺寸（表耳宽 20mm）+ 12 点全拼星期窗 + 18K 黄金狗牙圈 + 三排半圆元首带（常规钻刻多为“8 圆钻 + 6/9 梯钻”，独占绿松石镶钻罗马 -0071 与满钻彩虹方宝 -0051）。',
    confusion:
      '区分 40mm 228238（冰糖款标配 10 颗全长阶梯方钻、多数带微缩罗马字分钟外轨）；严防低价盘换装假绿松石/后镶满钻盘。',
    href: '/brands/rolex/day-date/128238'
  },
  {
    ref: '228238',
    title: '40mm 18K 黄金三角坑纹“元首表”旗舰',
    series: '星期日历型 · 40mm',
    bezel: 'fluted-gold',
    dial: 'day-date-12-3',
    bracelets: ['president-bracelet'],
    anchor:
      '首数字 2 锁定 40mm 现代旗舰尺寸（表耳宽 21mm）+ 12 点全拼星期窗 + 元首带隐形皇冠扣；冰糖钻全系为 10 颗长阶梯方钻，独占翠绿漆面罗马 -0061（Money Green）与天然黑缟玛瑙 -0059。',
    confusion:
      'DD 全系 100% 纯贵金属，绝无精钢或间金！NFC 保卡仅印 228238，必查白吊牌与原厂矿石/漆面/6-9 红宝石（-0030）镶工。',
    href: '/brands/rolex/day-date/228238'
  },

  // 日志型（1款）
  {
    ref: '126334',
    title: '41mm 白色黄金钢狗牙圈日志型爆款家族',
    series: '日志型 · 41mm',
    bezel: 'fluted-gold',
    dial: 'date-3-only',
    bracelets: ['jubilee-bracelet', 'oyster-sport-32xx'],
    anchor:
      '无 12 点星期窗 + 18K 白金三角坑纹狗牙圈 + 904L 蚝式钢壳带（尾位 4 白色黄金钢）+ 五珠纪念型表带配长方形蚝式折扣（涵盖 -0028 薄荷绿、-0022 温布尔登绿萝、-0034 渐变烟熏绿、-0018 亮黑）。',
    confusion:
      '勿与白金 DD 混淆（DJ 无 12 点星期窗且配长方扣）；严防全钢光圈 126300 后换假白金狗牙圈，以及普通盘换假薄荷绿/假绿萝盘。',
    href: '/brands/rolex/datejust/126334'
  },

  // 潜航者型（2款）
  {
    ref: '126610LN',
    title: '41mm 有历“黑水鬼”潜航者日历型',
    series: '潜航者型 · 300m潜水',
    bezel: 'diver-60m',
    dial: 'date-3-only',
    bracelets: ['oyster-sport-32xx'],
    anchor:
      '单向逆时针旋转黑色 60 分钟凹刻陶瓷圈 + 12 点凸起夜光珠 + 黑色亮漆盘大三针 + 3 点水泡眼日历 + 6 点小皇冠 + 20mm Glidelock 延展扣（Cal. 3235）。',
    confusion:
      '区分无历黑水鬼 124060（无日历放大镜）、老款 40mm 116610LN（宽方表耳、6 点无皇冠）；严防黑水鬼换假绿圈冒充 126610LV（核对保卡 LN/LV 后缀）。',
    href: '/brands/rolex/submariner/126610ln'
  },
  {
    ref: '126610LV',
    title: '41mm 有历“星巴克”绿圈黑盘绿水鬼',
    series: '潜航者型 · 300m潜水',
    bezel: 'diver-60m',
    dial: 'date-3-only',
    bracelets: ['oyster-sport-32xx'],
    anchor:
      '单向旋转绿色 Cerachrom 60 分钟陶瓷圈（2023 起 -0002 MK2 升级亮草绿色调）+ 醇黑表盘（非前代绿巨人绿盘！）+ 12 点夜光珠 + 6 点小皇冠 + 全拉丝蚝式带。',
    confusion:
      '区分前代 40mm“绿巨人”116610LV（绿圈配翠绿放射纹盘、6 点无皇冠）；收表必核保卡型号 126610LV 防黑水鬼改圈，并区分 MK1 森林绿与 MK2 亮草绿。',
    href: '/brands/rolex/submariner/126610lv'
  },

  // 格林尼治型 II（6款）
  {
    ref: '126710BLRO',
    title: '蚝式钢红蓝“百事圈”格林尼治型 II',
    series: '格林尼治 II · 蚝式钢',
    bezel: 'gmt-24h',
    dial: 'gmt-right-crown',
    bracelets: ['jubilee-bracelet', 'oyster-sport-32xx'],
    anchor:
      '双向旋转红蓝双色 24 小时凹刻陶瓷圈（无 12 点夜光珠）+ 红色三角形 24h GMT 指针 + 右侧 3 点表冠日历 + 904L 蚝式钢（-0001 配五珠带）。',
    confusion:
      '钢款 GMT 溢价王！严防国米/皮蛋换副厂红蓝圈（必核保卡 BLRO 后缀 + 365nm 紫光灯测一体红色荧光），同时勿混白金蓝面/陨石面 126719BLRO。',
    href: '/brands/rolex/gmt-master-ii/126710blro'
  },
  {
    ref: '126710BLNR',
    title: '蚝式钢蓝黑“国米圈 / 蝙蝠侠”格林尼治型 II',
    series: '格林尼治 II · 蚝式钢',
    bezel: 'gmt-24h',
    dial: 'gmt-right-crown',
    bracelets: ['jubilee-bracelet', 'oyster-sport-32xx'],
    anchor:
      '双向旋转黑蓝双色 24 小时陶瓷圈 + 蓝色三角形 24h GMT 指针 + 白色盘面 GMT-MASTER II 字样（-0002 配五珠带称“国米”，配蚝式带称“蝙蝠侠”）。',
    confusion:
      '区分老款 116710BLNR（6 点无小皇冠、仅蚝式带、Cal. 3186）；收售注意五珠带与蚝式板带在二级市场的溢价差。',
    href: '/brands/rolex/gmt-master-ii/126710blnr'
  },
  {
    ref: '126710GRNR',
    title: '蚝式钢灰黑“皮蛋圈”格林尼治型 II',
    series: '格林尼治 II · 蚝式钢',
    bezel: 'gmt-24h',
    dial: 'gmt-right-crown',
    bracelets: ['jubilee-bracelet', 'oyster-sport-32xx'],
    anchor:
      '2024 新增蚝式钢款：双向灰黑双色 24 小时陶瓷圈 + 亮绿色三角形 24h GMT 指针 + 绿色 GMT-MASTER II 盘面字样（-0003 配五珠带）。',
    confusion:
      '勿与黄金间金灰黑圈 126713GRNR 混淆（126710GRNR 全钢银白配绿针绿字，间金款为金针金字）；亦不同于停产全黑圈绿针 116710LN。',
    href: '/brands/rolex/gmt-master-ii/126710grnr'
  },
  {
    ref: '126711CHNR',
    title: '永恒玫瑰金钢间金“沙士圈”格林尼治型 II',
    series: '格林尼治 II · 玫瑰金钢',
    bezel: 'gmt-24h',
    dial: 'gmt-right-crown',
    bracelets: ['oyster-sport-32xx'],
    anchor:
      '末位 1 锁定永恒玫瑰金钢间金：棕黑双色 24 小时陶瓷圈 + 表耳与链带两侧外排为银白 904L 蚝式钢拉丝，仅外圈、表冠与链带中节为 18K 永恒玫瑰金。',
    confusion:
      '最高危防错价：暖黄灯光照片下极易与全玫瑰金 126715CHNR 混淆！认准表耳与外侧链节是否为银白精钢色（两者行价相差一倍以上）。',
    href: '/brands/rolex/gmt-master-ii/126711chnr'
  },
  {
    ref: '126715CHNR',
    title: '全 18K 永恒玫瑰金“全金沙士圈”格林尼治型 II',
    series: '格林尼治 II · 全玫瑰金',
    bezel: 'gmt-24h',
    dial: 'gmt-right-crown',
    bracelets: ['oyster-sport-32xx'],
    anchor:
      '末位 5 锁定全 18K 永恒玫瑰金：棕黑双色陶瓷圈 + 整表壳耳与三排实心蚝式链带 100% 纯永恒玫瑰金（底盖四角镌刻贵金属狗头/750印记）。',
    confusion:
      '切忌误判成间金 126711CHNR 报低价；收表必验四角贵金属印记、整表沉甸金重与全金带节完整度。',
    href: '/brands/rolex/gmt-master-ii/126715chnr'
  },
  {
    ref: '126720VTNR',
    title: '左冠左日历绿黑“雪碧圈”格林尼治型 II',
    series: '格林尼治 II · 左冠蚝式钢',
    bezel: 'gmt-24h',
    dial: 'gmt-left-crown',
    bracelets: ['oyster-sport-32xx', 'jubilee-bracelet'],
    anchor:
      '第 5 位变 2 锁定左撇子异形结构：旋入式表冠、护肩与水泡眼日历全部移至左侧 9 点位！配绿黑双色 24h 陶瓷圈 + 亮绿 GMT 针（-0001 配蚝式带）。',
    confusion:
      '劳力士现行全系唯一左 9 点表冠 + 左 9 点日历款，一秒与所有右冠水鬼/GMT 彻底剥离；注意区分蚝式带 -0001 与五珠带 -0002。',
    href: '/brands/rolex/gmt-master-ii/126720vtnr'
  },

  // 游艇名仕型（1款）
  {
    ref: '126655',
    title: '40mm 18K 永恒玫瑰金哑光黑陶胶带游艇名仕型',
    series: '游艇名仕型 · 40mm',
    bezel: 'ym-relief',
    dial: 'date-3-only',
    bracelets: ['oysterflex-new-1265-ym'],
    anchor:
      '双向旋转哑光喷砂黑陶圈 + 立体凸起镜面抛光浮雕数字（区别于水鬼/GMT 平滑凹刻圈！）+ 18K 永恒玫瑰金圆润流线表壳 + Oysterflex 胶带配 Glidelock 微调扣。',
    confusion:
      '区分 37mm 中号款 268655 与 42mm 白金/黄金游艇 226659 / 226658；重点检查立体抛光陶瓷数字有无崩角及两端胶带尺码匹配。',
    href: '/brands/rolex/yacht-master/126655'
  }
]

const selectedBezel = ref<BezelTypeId>('all')
const selectedDial = ref<DialFunctionId>('all')
const selectedBracelet = ref<BraceletGenId>('all')

const filteredWatches = computed(() =>
  watchCatalog.filter((watch) => {
    const bezelMatch =
      selectedBezel.value === 'all' || watch.bezel === selectedBezel.value
    const dialMatch =
      selectedDial.value === 'all' || watch.dial === selectedDial.value
    const braceletMatch =
      selectedBracelet.value === 'all' ||
      watch.bracelets.includes(selectedBracelet.value)
    return bezelMatch && dialMatch && braceletMatch
  })
)

const hasActiveFilter = computed(
  () =>
    selectedBezel.value !== 'all' ||
    selectedDial.value !== 'all' ||
    selectedBracelet.value !== 'all'
)

function resetFilters() {
  selectedBezel.value = 'all'
  selectedDial.value = 'all'
  selectedBracelet.value = 'all'
}
</script>

<template>
  <div class="rlx-vi-shell">
    <div class="rlx-vi-header">
      <div class="rlx-vi-header-main">
        <div class="rlx-vi-badge-row">
          <span class="rlx-vi-badge">看图识表 · 视觉锚点定位器</span>
          <span class="rlx-vi-count">当前匹配 {{ filteredWatches.length }} / {{ watchCatalog.length }} 款</span>
        </div>
        <h3 class="rlx-vi-title">劳力士 24 款热门基础型号三步视觉漏斗</h3>
        <p class="rlx-vi-subtitle">
          收到无型号腕表照片时，按「外圈结构与刻度形态 → 盘面功能与窗口按键 → 表带基因与新老断代」依次点选，3 秒锁定基础型号与收售防坑红线。
        </p>
      </div>
      <button
        type="button"
        class="rlx-vi-reset"
        :disabled="!hasActiveFilter"
        @click="resetFilters"
      >
        重置筛选
      </button>
    </div>

    <div class="rlx-vi-steps">
      <section class="rlx-vi-step">
        <div class="rlx-vi-step-head">
          <span class="rlx-vi-step-num">第 1 步</span>
          <span class="rlx-vi-step-name">外圈结构与刻度形态（先切分七大阵营）</span>
        </div>
        <div class="rlx-vi-chips">
          <button
            v-for="opt in bezelOptions"
            :key="opt.id"
            type="button"
            class="rlx-vi-chip"
            :class="{ active: selectedBezel === opt.id }"
            @click="selectedBezel = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>

      <section class="rlx-vi-step">
        <div class="rlx-vi-step-head">
          <span class="rlx-vi-step-num">第 2 步</span>
          <span class="rlx-vi-step-name">盘面功能、窗口与表冠位置</span>
        </div>
        <div class="rlx-vi-chips">
          <button
            v-for="opt in dialOptions"
            :key="opt.id"
            type="button"
            class="rlx-vi-chip"
            :class="{ active: selectedDial === opt.id }"
            @click="selectedDial = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>

      <section class="rlx-vi-step">
        <div class="rlx-vi-step-head">
          <span class="rlx-vi-step-num">第 3 步</span>
          <span class="rlx-vi-step-name">表带形态与新老断代细节（包边圈 / 6点小皇冠）</span>
        </div>
        <div class="rlx-vi-chips">
          <button
            v-for="opt in braceletOptions"
            :key="opt.id"
            type="button"
            class="rlx-vi-chip"
            :class="{ active: selectedBracelet === opt.id }"
            @click="selectedBracelet = opt.id"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>
    </div>

    <div v-if="filteredWatches.length > 0" class="rlx-vi-grid">
      <article
        v-for="item in filteredWatches"
        :key="item.ref"
        class="rlx-vi-card"
      >
        <div class="rlx-vi-card-top">
          <span class="rlx-vi-card-ref">Ref. {{ item.ref }}</span>
          <span class="rlx-vi-card-series">{{ item.series }}</span>
        </div>
        <h4 class="rlx-vi-card-title">{{ item.title }}</h4>
        <div class="rlx-vi-card-block">
          <span class="rlx-vi-label">一句话必杀视觉锚点</span>
          <p class="rlx-vi-text">{{ item.anchor }}</p>
        </div>
        <div class="rlx-vi-card-block is-warn">
          <span class="rlx-vi-label is-warn">高危易混 / 二手防坑红线</span>
          <p class="rlx-vi-text">{{ item.confusion }}</p>
        </div>
        <div class="rlx-vi-card-foot">
          <a :href="withBase(item.href)" class="rlx-vi-link">进入单表专章 →</a>
        </div>
      </article>
    </div>

    <div v-else class="rlx-vi-empty">
      <p class="rlx-vi-empty-title">当前特征组合在劳力士 24 款核心型号中无匹配</p>
      <p class="rlx-vi-empty-desc">
        请检查是否误选了跨系列特征组合（例如“狗牙圈”配“三眼计时副盘”，或“元首带”配“水鬼潜水圈”），点击下方按钮即可恢复全部 24 款。
      </p>
      <button type="button" class="rlx-vi-empty-btn" @click="resetFilters">
        查看全部 24 款型号
      </button>
    </div>
  </div>
</template>

<style scoped>
.rlx-vi-shell {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  margin: 20px 0;
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(160deg, #071712 0%, #0b1922 55%, #0f172a 100%);
  border: 1px solid #1e3a34;
  color: #e2e8f0;
  overflow-x: hidden;
}

.rlx-vi-shell *,
.rlx-vi-shell *::before,
.rlx-vi-shell *::after {
  box-sizing: border-box;
}

.rlx-vi-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid #1e3a34;
}

.rlx-vi-header-main {
  flex: 1 1 240px;
  min-width: 0;
}

.rlx-vi-badge-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.rlx-vi-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.45);
  color: #6ee7b7;
}

.rlx-vi-count {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(245, 158, 11, 0.14);
  border: 1px solid rgba(245, 158, 11, 0.38);
  color: #fde68a;
}

.rlx-vi-title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.rlx-vi-subtitle {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #94a3b8;
}

.rlx-vi-reset {
  appearance: none;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #102320;
  color: #e2e8f0;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.rlx-vi-reset:hover:not(:disabled) {
  border-color: #10b981;
  color: #a7f3d0;
  background: rgba(16, 185, 129, 0.14);
}

.rlx-vi-reset:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.rlx-vi-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}

.rlx-vi-step {
  padding: 12px;
  border-radius: 12px;
  background: rgba(11, 25, 34, 0.76);
  border: 1px solid #1e293b;
}

.rlx-vi-step-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 9px;
}

.rlx-vi-step-num {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.18);
  color: #6ee7b7;
}

.rlx-vi-step-name {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
}

.rlx-vi-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.rlx-vi-chip {
  appearance: none;
  max-width: 100%;
  padding: 6px 11px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #0b141e;
  color: #cbd5e1;
  font-size: 12px;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
  overflow-wrap: anywhere;
}

.rlx-vi-chip:hover {
  border-color: #64748b;
  background: #132330;
}

.rlx-vi-chip.active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.18);
  color: #a7f3d0;
  font-weight: 600;
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.25);
}

.rlx-vi-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.rlx-vi-card {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
  padding: 14px;
  border-radius: 12px;
  background: rgba(9, 18, 28, 0.92);
  border: 1px solid #1e293b;
  transition: border-color 0.15s ease;
}

.rlx-vi-card:hover {
  border-color: #10b981;
}

.rlx-vi-card-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.rlx-vi-card-ref {
  font-family: var(--vp-font-family-mono);
  font-size: 15px;
  font-weight: 800;
  color: #fde68a;
}

.rlx-vi-card-series {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #6ee7b7;
}

.rlx-vi-card-title {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.35;
}

.rlx-vi-card-block {
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid #1e293b;
}

.rlx-vi-card-block.is-warn {
  background: rgba(245, 158, 11, 0.07);
  border-color: rgba(245, 158, 11, 0.26);
}

.rlx-vi-label {
  display: block;
  margin-bottom: 3px;
  font-size: 11px;
  font-weight: 700;
  color: #34d399;
}

.rlx-vi-label.is-warn {
  color: #fbbf24;
}

.rlx-vi-text {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: #cbd5e1;
  overflow-wrap: anywhere;
}

.rlx-vi-card-foot {
  margin-top: auto;
  padding-top: 4px;
  display: flex;
  justify-content: flex-end;
}

.rlx-vi-link {
  display: inline-flex;
  align-items: center;
  font-size: 12.5px;
  font-weight: 700;
  color: #6ee7b7;
  text-decoration: none;
}

.rlx-vi-link:hover {
  text-decoration: underline;
  color: #a7f3d0;
}

.rlx-vi-empty {
  padding: 24px 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px dashed #334155;
  text-align: center;
}

.rlx-vi-empty-title {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

.rlx-vi-empty-desc {
  margin: 0 0 14px;
  font-size: 12.5px;
  color: #94a3b8;
  line-height: 1.5;
}

.rlx-vi-empty-btn {
  appearance: none;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid #10b981;
  background: rgba(16, 185, 129, 0.16);
  color: #a7f3d0;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 720px) {
  .rlx-vi-shell {
    padding: 14px 12px;
    border-radius: 12px;
  }

  .rlx-vi-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .rlx-vi-chip {
    font-size: 11.5px;
    padding: 6px 9px;
  }
}
</style>
