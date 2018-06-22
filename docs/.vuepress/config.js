module.exports = {
    title: '李丹秋技术博客',
    description: '李丹秋技术博客，内容多以工作学习中的实践经验为主，主要侧重于前端方向',
    themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Webpack', link: '/webpack' },
          { text: 'Github', link: 'https://github.com/dreamerldq' },
        ],
        sidebar: [
            '/',
            ['/webpack', 'webpack配置'],
            ['/githubpage', 'github page 部署'],
            ['/iconfont', '文字图标的使用'],
            ['/miniPrograme', '小程序开发总结'],
            ['/redux', 'Redux源码解析'],
            ['/wixinqr', '微信小程序二维码生成']
          ]
      },

  }