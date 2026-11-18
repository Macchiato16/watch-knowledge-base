import { defineConfig } from 'vitepress'
import markdownItCjkFriendly from 'markdown-it-cjk-friendly'

export default defineConfig({
  base: process.env.VITEPRESS_BASE || '/',
  lang: 'zh-CN',
  title: '腕表业务知识库',
  description: '面向全员的二手腕表业务系统学习与日常查阅知识库',
  lastUpdated: true,
  cleanUrls: true,

  markdown: {
    config(md) {
      md.use(markdownItCjkFriendly)
    }
  },

  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }]
  ],

  vite: {
    ssr: {
      noExternal: ['three']
    },
    build: {
      chunkSizeWarningLimit: 800
    }
  },

  themeConfig: {
    nav: [
      {
        text: '通用知识',
        link: '/general/structure/',
        activeMatch: '^/(general/|$)'
      },
      {
        text: '品牌知识',
        link: '/brands/',
        activeMatch: '^/brands/'
      }
    ],

    sidebar: {
      '/brands/': [
        {
          text: '品牌知识',
          items: [
            { text: '品牌知识导览', link: '/brands/' }
          ]
        },
        {
          text: '百达翡丽',
          collapsed: true,
          items: [
            {
              text: '基础必修',
              collapsed: true,
              items: [
                { text: '品牌导览与系列全览', link: '/brands/patek-philippe/' },
                { text: '品牌材质', link: '/brands/patek-philippe/materials' },
                { text: '品牌工艺', link: '/brands/patek-philippe/craftsmanship' },
                { text: '型号解读', link: '/brands/patek-philippe/reference-guide' }
              ]
            },
            {
              text: 'Nautilus（鹦鹉螺）',
              collapsed: true,
              items: [
                { text: '5711 · 经典大三针停产热门', link: '/brands/patek-philippe/nautilus/5711' },
                { text: '5811 · 5711 白金继任款', link: '/brands/patek-philippe/nautilus/5811' },
                { text: '5810 · 50周年纪念款', link: '/brands/patek-philippe/nautilus/5810' },
                { text: '5712 · 月相动力存储', link: '/brands/patek-philippe/nautilus/5712' },
                { text: '5726 · 年历月相款', link: '/brands/patek-philippe/nautilus/5726' },
                { text: '5980 · 飞返计时', link: '/brands/patek-philippe/nautilus/5980' },
                { text: '5990 · 双时区飞返计时', link: '/brands/patek-philippe/nautilus/5990' },
                { text: '5740 · 超薄万年历', link: '/brands/patek-philippe/nautilus/5740' },
                { text: '7010 · 女款石英钻圈', link: '/brands/patek-philippe/nautilus/7010' },
                { text: '7118 · 女款自动机械', link: '/brands/patek-philippe/nautilus/7118' }
              ]
            },
            {
              text: 'Cubitus（方形鹦鹉螺）',
              collapsed: true,
              items: [
                { text: '5821 · 45mm 方形大三针', link: '/brands/patek-philippe/cubitus/5821' },
                { text: '5822 · 45mm 瞬跳大日历月相', link: '/brands/patek-philippe/cubitus/5822' },
                { text: '7128 · 40mm 中号/女款', link: '/brands/patek-philippe/cubitus/7128' }
              ]
            },
            {
              text: '男款手雷（Aquanaut）',
              collapsed: true,
              items: [
                { text: '5167 · 40.8mm 经典大三针', link: '/brands/patek-philippe/aquanaut/5167' },
                { text: '5168 · 42.2mm 白金 Jumbo', link: '/brands/patek-philippe/aquanaut/5168' },
                { text: '5164 · Travel Time 双时区', link: '/brands/patek-philippe/aquanaut/5164' },
                { text: '5261 · 39.9mm 年历月相', link: '/brands/patek-philippe/aquanaut/5261' },
                { text: '5968 · 42.2mm 飞返计时', link: '/brands/patek-philippe/aquanaut/5968' }
              ]
            },
            {
              text: '女款手雷（Aquanaut Luce）',
              collapsed: true,
              items: [
                { text: '5067 · 35.6mm 经典精钢石英', link: '/brands/patek-philippe/aquanaut/5067' },
                { text: '5068 · 35.6mm 玫瑰金机械', link: '/brands/patek-philippe/aquanaut/5068' },
                { text: '5069 · 35.6mm 白金机械', link: '/brands/patek-philippe/aquanaut/5069' },
                { text: '5267 · 38.8mm 现代精钢石英', link: '/brands/patek-philippe/aquanaut/5267' },
                { text: '5268 · 38.8mm 现代贵金属机械', link: '/brands/patek-philippe/aquanaut/5268' },
                { text: '5269 · 38.8mm 无侧键双时区', link: '/brands/patek-philippe/aquanaut/5269' }
              ]
            },
            {
              text: '关联型号与对比记忆',
              collapsed: true,
              items: [
                { text: '看图识表总纲（24款定位器）', link: '/brands/patek-philippe/comparisons/' },
                { text: '5711 vs 5811 vs 5810 · 鹦鹉螺极简三代', link: '/brands/patek-philippe/comparisons/nautilus-5711-5811-5810' },
                { text: '5726 vs 5740 · 年历与万年历月相双雄', link: '/brands/patek-philippe/comparisons/nautilus-5726-5740' },
                { text: '5980 vs 5990 · 鹦鹉螺飞返计时两代', link: '/brands/patek-philippe/comparisons/nautilus-5980-5990' },
                { text: '7010 vs 7118 · 女款鹦鹉螺双姝', link: '/brands/patek-philippe/comparisons/nautilus-ladies-7010-7118' },
                { text: '5821 vs 7128 · 方形大三针大小号', link: '/brands/patek-philippe/comparisons/cubitus-5821-7128' },
                { text: '5167 vs 5168 · 男款大三针手雷双雄', link: '/brands/patek-philippe/comparisons/aquanaut-5167-5168' },
                { text: '5067 vs 5068 vs 5069 · 初代女手雷防错价', link: '/brands/patek-philippe/comparisons/aquanaut-luce-5067-5068-5069' },
                { text: '5267 vs 5268 vs 5269 · 现代女手雷与断代', link: '/brands/patek-philippe/comparisons/aquanaut-luce-5267-5268-5269' }
              ]
            }
          ]
        },
        {
          text: '理查米尔',
          collapsed: true,
          items: [
            {
              text: '基础必修',
              collapsed: true,
              items: [
                { text: '品牌导览与系列全览', link: '/brands/richard-mille/' },
                { text: '品牌材质', link: '/brands/richard-mille/materials' },
                { text: '品牌工艺', link: '/brands/richard-mille/craftsmanship' },
                { text: '型号解读', link: '/brands/richard-mille/reference-guide' }
              ]
            },
            {
              text: '07 系列（女装主力与运动）',
              collapsed: true,
              items: [
                { text: 'RM 07-01 · 现代女装核心霸主', link: '/brands/richard-mille/07/rm-07-01' },
                { text: 'RM 07-04 · 36克女性超轻运动', link: '/brands/richard-mille/07/rm-07-04' }
              ]
            },
            {
              text: '11 系列（大号飞返年历）',
              collapsed: true,
              items: [
                { text: 'RM 011 · 初代飞返年历开山款', link: '/brands/richard-mille/11/rm-011' },
                { text: 'RM 11-03 · 空气动力学棱角主力', link: '/brands/richard-mille/11/rm-11-03' },
                { text: 'RM 11-05 · Cermet 金属陶瓷 GMT', link: '/brands/richard-mille/11/rm-11-05' }
              ]
            },
            {
              text: '35 系列（纳达尔运动线）',
              collapsed: true,
              items: [
                { text: 'RM 035 · 初代镁铝手动小牛', link: '/brands/richard-mille/35/rm-035' },
                { text: 'RM 35-01 · Carbon TPT 手动款', link: '/brands/richard-mille/35/rm-35-01' },
                { text: 'RM 35-02 · 首款自动上链纳达尔', link: '/brands/richard-mille/35/rm-35-02' },
                { text: 'RM 35-03 · 专利蝶形摆陀旗舰', link: '/brands/richard-mille/35/rm-35-03' }
              ]
            },
            {
              text: '55 系列（巴巴·沃森传奇）',
              collapsed: true,
              items: [
                { text: 'RM 055 · ATZ 白陶瓷手动硬通货', link: '/brands/richard-mille/55/rm-055' }
              ]
            },
            {
              text: '65 系列（高振频追针旗舰）',
              collapsed: true,
              items: [
                { text: 'RM 65-01 · 5Hz 自动双秒追针', link: '/brands/richard-mille/65/rm-65-01' }
              ]
            },
            {
              text: '67 系列（超薄酒桶双生花）',
              collapsed: true,
              items: [
                { text: 'RM 67-01 · 7.75mm 都市超薄', link: '/brands/richard-mille/67/rm-67-01' },
                { text: 'RM 67-02 · 32克极致运动超轻', link: '/brands/richard-mille/67/rm-67-02' }
              ]
            },
            {
              text: '72 系列（自产飞返标杆）',
              collapsed: true,
              items: [
                { text: 'RM 72-01 · 全自产摆动齿轮飞返', link: '/brands/richard-mille/72/rm-72-01' }
              ]
            },
            {
              text: '关联型号与对比记忆',
              collapsed: true,
              items: [
                { text: '看图识表总纲（14款定位器）', link: '/brands/richard-mille/comparisons/' },
                { text: '07-01 vs 07-04 · 女装优雅与超轻运动', link: '/brands/richard-mille/comparisons/07-rm-07-01-vs-07-04' },
                { text: '011 vs 11-03 vs 11-05 · 大号飞返三代', link: '/brands/richard-mille/comparisons/11-rm-011-vs-11-03-vs-11-05' },
                { text: '035 vs 35-01 · 手动密底小牛前两代', link: '/brands/richard-mille/comparisons/35-manual-rm-035-vs-35-01' },
                { text: '35-02 vs 35-03 · 自动透底纳达尔双主力', link: '/brands/richard-mille/comparisons/35-auto-rm-35-02-vs-35-03' },
                { text: '67-01 vs 67-02 · 超薄酒桶双生花', link: '/brands/richard-mille/comparisons/67-rm-67-01-vs-67-02' },
                { text: '055 vs 35-01/35-02 · 无侧键镂空三针双王', link: '/brands/richard-mille/comparisons/skeleton-rm-055-vs-35-series' },
                { text: '11-03 vs 72-01 vs 65-01 · 现代计时三旗舰', link: '/brands/richard-mille/comparisons/chrono-rm-11-03-vs-72-01-vs-65-01' }
              ]
            }
          ]
        },
        {
          text: '劳力士',
          collapsed: true,
          items: [
            {
              text: '基础必修',
              collapsed: true,
              items: [
                { text: '品牌导览与系列全览', link: '/brands/rolex/' },
                { text: '品牌材质', link: '/brands/rolex/materials' },
                { text: '品牌工艺', link: '/brands/rolex/craftsmanship' },
                { text: '型号解读', link: '/brands/rolex/reference-guide' },
                { text: '表带类型', link: '/brands/rolex/bracelets' }
              ]
            },
            {
              text: '宇宙计型迪通拿（Daytona）',
              collapsed: true,
              items: [
                { text: '116500LN · 老款钢壳熊猫/黑钢迪', link: '/brands/rolex/daytona/116500ln' },
                { text: '126500LN · 新款金属包边钢迪', link: '/brands/rolex/daytona/126500ln' },
                { text: '116515LN · 老款玫瑰金胶带迪', link: '/brands/rolex/daytona/116515ln' },
                { text: '116518LN · 老款黄金胶带迪（余文乐）', link: '/brands/rolex/daytona/116518ln' },
                { text: '126518LN · 新款黄金包边胶带迪', link: '/brands/rolex/daytona/126518ln' },
                { text: '116505 · 老款全玫瑰金链带迪', link: '/brands/rolex/daytona/116505' },
                { text: '116508 · 老款全黄金迪（绿金迪）', link: '/brands/rolex/daytona/116508' },
                { text: '126505 · 新款全玫瑰金链带迪', link: '/brands/rolex/daytona/126505' },
                { text: '126508 · 新款全黄金链带迪', link: '/brands/rolex/daytona/126508' },
                { text: '126506 · 新款 950 铂金透底冰蓝迪', link: '/brands/rolex/daytona/126506' },
                { text: '116595RBOW · 玫瑰金原厂彩虹迪', link: '/brands/rolex/daytona/116595rbow' },
                { text: '126599RBOW · 新款白金原厂彩虹迪', link: '/brands/rolex/daytona/126599rbow' }
              ]
            },
            {
              text: '星期日历型（Day-Date）',
              collapsed: true,
              items: [
                { text: '128238 · 36mm 黄金狗牙圈元首表', link: '/brands/rolex/day-date/128238' },
                { text: '228238 · 40mm 黄金狗牙圈元首表', link: '/brands/rolex/day-date/228238' }
              ]
            },
            {
              text: '日志型（Datejust）',
              collapsed: true,
              items: [
                { text: '126334 · 41mm 白金钢狗牙圈爆款', link: '/brands/rolex/datejust/126334' }
              ]
            },
            {
              text: '潜航者型（Submariner）',
              collapsed: true,
              items: [
                { text: '126610LN · 41mm 有历黑水鬼', link: '/brands/rolex/submariner/126610ln' },
                { text: '126610LV · 41mm 星巴克绿水鬼', link: '/brands/rolex/submariner/126610lv' }
              ]
            },
            {
              text: '格林尼治型 II（GMT-Master II）',
              collapsed: true,
              items: [
                { text: '126710BLRO · 钢款红蓝百事圈', link: '/brands/rolex/gmt-master-ii/126710blro' },
                { text: '126710BLNR · 钢款蓝黑国米圈', link: '/brands/rolex/gmt-master-ii/126710blnr' },
                { text: '126710GRNR · 钢款灰黑皮蛋圈', link: '/brands/rolex/gmt-master-ii/126710grnr' },
                { text: '126711CHNR · 玫瑰金钢间金沙士圈', link: '/brands/rolex/gmt-master-ii/126711chnr' },
                { text: '126715CHNR · 全玫瑰金沙士圈', link: '/brands/rolex/gmt-master-ii/126715chnr' },
                { text: '126720VTNR · 左冠绿黑雪碧圈', link: '/brands/rolex/gmt-master-ii/126720vtnr' }
              ]
            },
            {
              text: '游艇名仕型（Yacht-Master）',
              collapsed: true,
              items: [
                { text: '126655 · 40mm 玫瑰金哑光陶圈胶带', link: '/brands/rolex/yacht-master/126655' }
              ]
            },
            {
              text: '关联型号与对比记忆',
              collapsed: true,
              items: [
                { text: '看图识表总纲（24款定位器）', link: '/brands/rolex/comparisons/' },
                { text: '116500LN vs 126500LN · 钢迪两代', link: '/brands/rolex/comparisons/daytona-steel-116500ln-vs-126500ln' },
                { text: '116518LN vs 126518LN · 胶带金迪矩阵', link: '/brands/rolex/comparisons/daytona-oysterflex-116515ln-116518ln-vs-126518ln' },
                { text: '全金迪与 126506 铂金透底冰蓝迪', link: '/brands/rolex/comparisons/daytona-precious-116505-116508-vs-126505-126508-126506' },
                { text: '116595RBOW vs 126599RBOW · 原厂彩虹迪', link: '/brands/rolex/comparisons/daytona-rainbow-116595rbow-vs-126599rbow' },
                { text: '128238 vs 228238 · 元首表 36与40对决', link: '/brands/rolex/comparisons/day-date-128238-vs-228238' },
                { text: '126334 vs Day-Date · 狗牙圈正装防混', link: '/brands/rolex/comparisons/fluted-dress-datejust-126334-vs-day-date' },
                { text: '水鬼 vs GMT vs 游艇 · 三大旋转圈切分', link: '/brands/rolex/comparisons/rotating-bezel-submariner-vs-gmt-vs-yacht-master' },
                { text: 'GMT-Master II 六款全矩阵防错价', link: '/brands/rolex/comparisons/gmt-master-ii-six-models-matrix' }
              ]
            }
          ]
        },
        {
          text: '爱彼',
          collapsed: true,
          items: [
            {
              text: '基础必修',
              collapsed: true,
              items: [
                { text: '品牌导览与系列全览', link: '/brands/audemars-piguet/' },
                { text: '品牌材质', link: '/brands/audemars-piguet/materials' },
                { text: '品牌工艺', link: '/brands/audemars-piguet/craftsmanship' },
                { text: '型号解读', link: '/brands/audemars-piguet/reference-guide' }
              ]
            },
            {
              text: '皇家橡树（Royal Oak）',
              collapsed: true,
              items: [
                { text: '15202 · 39mm 初代血统 Jumbo 超薄', link: '/brands/audemars-piguet/royal-oak/15202' },
                { text: '16202 · 39mm 50周年换代 Jumbo 超薄', link: '/brands/audemars-piguet/royal-oak/16202' },
                { text: '15500 · 41mm 上一代自动大三针', link: '/brands/audemars-piguet/royal-oak/15500' },
                { text: '15510 · 41mm 现行自动大三针主力', link: '/brands/audemars-piguet/royal-oak/15510' },
                { text: '15407 · 41mm 金属/霜金双摆轮镂空', link: '/brands/audemars-piguet/royal-oak/15407' },
                { text: '15416 · 41mm 全陶瓷双摆轮镂空', link: '/brands/audemars-piguet/royal-oak/15416' },
                { text: '26331 · 41mm 纤薄密底熊猫计时', link: '/brands/audemars-piguet/royal-oak/26331' },
                { text: '26239 · 41mm 过渡款一体飞返计时', link: '/brands/audemars-piguet/royal-oak/26239' },
                { text: '26240 · 41mm 现行一体飞返计时主力', link: '/brands/audemars-piguet/royal-oak/26240' },
                { text: '15550 · 37mm 男女通吃光圈自动', link: '/brands/audemars-piguet/royal-oak/15550' },
                { text: '15551 · 37mm 原厂 40 钻圈自动', link: '/brands/audemars-piguet/royal-oak/15551' },
                { text: '77350 · 34mm 全陶瓷配玫瑰金螺丝', link: '/brands/audemars-piguet/royal-oak/77350' },
                { text: '77451 · 34mm 原厂 40 钻圈女装自动', link: '/brands/audemars-piguet/royal-oak/77451' },
                { text: '67650 · 33mm 纤薄双针女装石英', link: '/brands/audemars-piguet/royal-oak/67650' }
              ]
            },
            {
              text: '皇家橡树离岸型（Offshore）',
              collapsed: true,
              items: [
                { text: '15720 · 42mm 专业潜水表 Diver', link: '/brands/audemars-piguet/royal-oak-offshore/15720' },
                { text: '26238 · 42mm 纵三眼一体飞返计时', link: '/brands/audemars-piguet/royal-oak-offshore/26238' },
                { text: '26231 · 37mm 原厂 32 大钻圈胶带计时', link: '/brands/audemars-piguet/royal-oak-offshore/26231' }
              ]
            }
          ]
        }
      ],
      '/': [
        {
          text: '开始阅读',
          items: [
            { text: '知识库介绍', link: '/' }
          ]
        },
        {
          text: '通用知识',
          items: [
            { text: '认识腕表结构', link: '/general/structure/' },
            {
              text: '腕表材质',
              collapsed: false,
              items: [
                { text: '材质总览与对比', link: '/general/materials/' },
                { text: '精钢', link: '/general/materials/steel' },
                { text: '陶瓷', link: '/general/materials/ceramic' },
                { text: '黄金', link: '/general/materials/yellow-gold' },
                { text: '玫瑰金', link: '/general/materials/rose-gold' },
                { text: '白金', link: '/general/materials/white-gold' },
                { text: '铂金', link: '/general/materials/platinum' }
              ]
            },
            {
              text: '腕表工艺',
              collapsed: false,
              items: [
                { text: '工艺总览与流派对比', link: '/general/craftsmanship/' },
                { text: '表壳加工与表面打磨', link: '/general/craftsmanship/case-finishing' },
                { text: '表盘制作与艺术装饰', link: '/general/craftsmanship/dial-crafts' },
                { text: '机芯修饰与现代表面工程', link: '/general/craftsmanship/movement-finishing' },
                { text: '宝石镶嵌工艺', link: '/general/craftsmanship/gem-setting' }
              ]
            },
            {
              text: '腕表功能',
              collapsed: false,
              items: [
                {
                  text: '基础功能',
                  collapsed: false,
                  items: [
                    { text: '日期', link: '/general/functions/basic/date' },
                    { text: '动力存储', link: '/general/functions/basic/power-reserve' }
                  ]
                },
                {
                  text: '实用复杂功能',
                  collapsed: false,
                  items: [
                    { text: '双时区', link: '/general/functions/complications/dual-time' },
                    { text: '计时', link: '/general/functions/complications/chronograph' },
                    { text: '飞返计时', link: '/general/functions/complications/flyback-chronograph' },
                    { text: '年历', link: '/general/functions/complications/annual-calendar' }
                  ]
                },
                {
                  text: '超级复杂功能',
                  collapsed: false,
                  items: [
                    { text: '万年历', link: '/general/functions/grand-complications/perpetual-calendar' },
                    { text: '双秒追针计时', link: '/general/functions/grand-complications/split-seconds' },
                    { text: '陀飞轮', link: '/general/functions/grand-complications/tourbillon' },
                    { text: '三问', link: '/general/functions/grand-complications/minute-repeater' },
                    { text: '天文星象', link: '/general/functions/grand-complications/astronomical/' }
                  ]
                }
              ]
            },
            { text: '腕表行业生态', link: '/general/ecosystem/' }
          ]
        }
      ]
    },

    outline: {
      level: [2, 4],
      label: '本页目录'
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Shanghai',
        forceLocale: true
      }
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    sidebarMenuLabel: '知识目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观主题',
    lightModeSwitchTitle: '切换至浅色模式',
    darkModeSwitchTitle: '切换至深色模式',

    notFound: {
      title: '未找到该页面',
      quote: '访问的链接不存在或尚未整理发布，可从左侧目录或首页继续查阅。',
      linkLabel: '返回知识库介绍',
      linkText: '返回知识库介绍'
    },

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (text: string) => {
              const normalized = text.toLowerCase()
              const tokens: string[] = []
              // 提取英文、数字型号及带连字符/斜杠/圆点的编号（如 5711/1a、rm055、15510st.oo.1320st.01）
              const asciiMatches = normalized.match(/[a-z0-9]+(?:[/.-][a-z0-9]+)*/g)
              if (asciiMatches) {
                for (const m of asciiMatches) {
                  tokens.push(m)
                  if (m.includes('/') || m.includes('-') || m.includes('.')) {
                    tokens.push(...m.split(/[/.-]/).filter(Boolean))
                  }
                }
              }
              // 提取中文单字与相邻双字词组，兼顾短词与连续中文语句检索
              const cjkBlocks = normalized.match(/[\u4e00-\u9fff]+/g)
              if (cjkBlocks) {
                for (const block of cjkBlocks) {
                  const chars = Array.from(block)
                  for (let i = 0; i < chars.length; i++) {
                    tokens.push(chars[i])
                    if (i < chars.length - 1) {
                      tokens.push(chars[i] + chars[i + 1])
                    }
                  }
                }
              }
              return tokens
            }
          },
          searchOptions: {
            fuzzy: 0.1,
            prefix: true,
            combineWith: 'AND',
            boost: {
              title: 4,
              titles: 2,
              text: 1
            }
          }
        },
        translations: {
          button: {
            buttonText: '搜索知识库',
            buttonAriaLabel: '搜索知识库'
          },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '清空查询',
            backButtonTitle: '关闭搜索',
            noResultsText: '未找到匹配的知识内容',
            footer: {
              selectText: '进入章节',
              selectKeyAriaLabel: '回车确认',
              navigateText: '上下切换',
              navigateUpKeyAriaLabel: '向上箭头',
              navigateDownKeyAriaLabel: '向下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'Esc 键'
            }
          }
        }
      }
    }
  }
})
