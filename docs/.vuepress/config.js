module.exports = {
    title: 'LDQ个人博客',
    description: '这是LDQ的个人博客网站',
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
          ]
      },

  }