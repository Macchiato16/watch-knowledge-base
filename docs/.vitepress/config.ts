import { defineConfig } from 'vitepress'

export default defineConfig({
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
            { text: '品牌导览（待补充）', link: '/brands/' }
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
            { text: '认识腕表结构', link: '/general/structure/' }
          ]
        }
      ]
    },

    outline: {
      level: [2, 3],
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
