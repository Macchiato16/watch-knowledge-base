import { defineConfig } from 'vitepress'

export default defineConfig({
  base: process.env.VITEPRESS_BASE || '/',
  lang: 'zh-CN',
  title: '腕表业务知识库',
  description: '面向全员的二手腕表业务系统学习与日常查阅知识库',
  lastUpdated: true,
  cleanUrls: true,

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
          text: '百达翡丽 · 基础必修',
          collapsed: false,
          items: [
            { text: '品牌导览与系列全览', link: '/brands/patek-philippe/' },
            { text: '品牌材质', link: '/brands/patek-philippe/materials' },
            { text: '品牌工艺', link: '/brands/patek-philippe/craftsmanship' },
            { text: '型号解读', link: '/brands/patek-philippe/reference-guide' }
          ]
        },
        {
          text: '百达翡丽 · Nautilus（鹦鹉螺）',
          collapsed: false,
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
          text: '百达翡丽 · Cubitus（方形鹦鹉螺）',
          collapsed: false,
          items: [
            { text: '5821 · 45mm 方形大三针', link: '/brands/patek-philippe/cubitus/5821' },
            { text: '5822 · 45mm 瞬跳大日历月相', link: '/brands/patek-philippe/cubitus/5822' },
            { text: '7128 · 40mm 中号/女款', link: '/brands/patek-philippe/cubitus/7128' }
          ]
        },
        {
          text: '百达翡丽 · 男款手雷（Aquanaut）',
          collapsed: false,
          items: [
            { text: '5167 · 40.8mm 经典大三针', link: '/brands/patek-philippe/aquanaut/5167' },
            { text: '5168 · 42.2mm 白金 Jumbo', link: '/brands/patek-philippe/aquanaut/5168' },
            { text: '5164 · Travel Time 双时区', link: '/brands/patek-philippe/aquanaut/5164' },
            { text: '5261 · 39.9mm 年历月相', link: '/brands/patek-philippe/aquanaut/5261' },
            { text: '5968 · 42.2mm 飞返计时', link: '/brands/patek-philippe/aquanaut/5968' }
          ]
        },
        {
          text: '百达翡丽 · 女款手雷（Aquanaut Luce）',
          collapsed: false,
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
          text: '百达翡丽 · 关联型号与对比记忆',
          collapsed: false,
          items: [
            { text: '看图识表总纲（24款定位器）', link: '/brands/patek-philippe/comparisons/' },
            { text: '鹦鹉螺与方形基础五强对比', link: '/brands/patek-philippe/comparisons/nautilus-three-hand' },
            { text: '鹦鹉螺与方形六大复杂款对比', link: '/brands/patek-philippe/comparisons/nautilus-complications' },
            { text: '男款手雷五虎特征锚点对比', link: '/brands/patek-philippe/comparisons/aquanaut-men-lineup' },
            { text: '女款鹦鹉螺与女手雷防错价对比', link: '/brands/patek-philippe/comparisons/ladies-nautilus-aquanaut' }
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
              // 提取英文、数字型号及带连字符/斜杠的编号（如 5711/1a、rm055、3d）
              const asciiMatches = normalized.match(/[a-z0-9]+(?:[/-][a-z0-9]+)*/g)
              if (asciiMatches) {
                for (const m of asciiMatches) {
                  tokens.push(m)
                  if (m.includes('/') || m.includes('-')) {
                    tokens.push(...m.split(/[/-]/).filter(Boolean))
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
