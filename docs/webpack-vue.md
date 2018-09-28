# webpack 搭建vue环境
### package.json
```
  "devDependencies": {
    "@babel/cli": "^7.1.0",
    "@babel/core": "^7.1.0",
    "@babel/preset-env": "^7.1.0",
    "@commitlint/cli": "^7.1.2",
    "@commitlint/config-conventional": "^7.1.2",
    "autoprefixer": "^9.1.5",
    "babel-loader": "^8.0.2",
    "babel-plugin-component": "^1.1.1",
    "clean-webpack-plugin": "^0.1.19",
    "copy-webpack-plugin": "^4.5.2",
    "css-loader": "^1.0.0",
    "eslint": "^5.6.0",
    "eslint-config-airbnb-base": "^13.1.0",
    "eslint-plugin-import": "^2.14.0",
    "eslint-plugin-vue": "^5.0.0-beta.3",
    "file-loader": "^2.0.0",
    "html-webpack-plugin": "^3.2.0",
    "husky": "^0.14.3",
    "mini-css-extract-plugin": "^0.4.3",
    "node-sass": "^4.9.3",
    "postcss-loader": "^3.0.0",
    "sass": "^1.13.4",
    "sass-loader": "^7.1.0",
    "style-loader": "^0.23.0",
    "url-loader": "^1.1.1",
    "vue-loader": "^15.4.2",
    "vue-template-compiler": "^2.5.17",
    "webpack": "^4.19.1",
    "webpack-cli": "^3.1.0",
    "webpack-dev-server": "^3.1.8",
    "webpack-merge": "^4.1.4"
  },
  "dependencies": {
    "axios": "^0.18.0",
    "element-ui": "^2.4.7",
    "vue": "^2.5.17"
  }
```
### .babelrc
```
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      },
      "useBuiltIns": "usage" // 为每个文件添加 polyfill
    }]
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui", // 按需引入element-ui  例如：Vue.use(Button)
        "styleLibraryName": "theme-chalk" // 引入css  需要在webpack中使用url-loader配置字体和图片的处理
      }
    ]
  ]
}
```

### .eslintrc
```
{
  "extends": [
    "eslint-config-airbnb-base",
    "plugin:vue/base"
  ],
  "rules": {
    "no-console": "off",
    "no-unused-vars": [0],
    "no-underscore-dangle": [0],
    "no-param-reassign": [0],
    "camelcase": [0],
    "no-useless-constructor": [0],
    "class-methods-use-this": [0],
    "import/no-extraneous-dependencies": [0],
    "react/prop-types": [0],
    "max-len": [0],
    "react/no-unescaped-entities": [0],
    "no-new": [0],
    "import/no-unresolved": [0]
  }
}
```

### commitlint.config.js
```
module.exports = {
  extends: ['@commitlint/config-conventional'], // Conventional Commits 规范
};

```

### webpack.common.js
```
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const basic_path = path.resolve();
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const pages = fs.readdirSync(path.resolve(__dirname, 'src/pages')); // 获取所有页面的名称

let entry = {
};

const output = {
  filename: 'js/[name].bundle.js', // 指定输出文件的名字
  path: path.join(basic_path, 'build'), // 指定输出文件的地址
  // publicPath: ''  // 静态资源线上存储路径
};

const plugins = [
  new VueLoaderPlugin(), // 解析Vue文件必须使用的plugin
  new CleanWebpackPlugin(['build']), // 再每次build的时候清空之前生成的build文件
  // new CopyWebpackPlugin([   // 图片备用处理方案，不使用dns情况下
  //   {from:'images',to:'images'} // 将指定的文件夹移动到输出的build文件夹下指定的路径
  // ]),
];
pages.forEach((key) => {
  // 遍历所有的页面，将其添加到entry中
  entry = Object.assign({}, entry, { [key]: `${basic_path}/src/pages/${key}/index.js` });
  plugins.push(new HtmlWebpackPlugin({
    title: `页面${key}`, // 为html提供模板能力 htmlWebpackPlugin.options.title 改变title
    filename: `html/${key}.html`, // 输出的html文件的名称
    template: path.join(__dirname, 'src', 'index.html'), // 渲染模板
    chunks: [key], // 多页面应用中通过chunks区分不同的生成不同的页面
    inject: true, // 将所有html中相关联的js添加到body的末尾  将css通过link添加到head中
  }));
});
const common_config = {
  entry,
  output,
  optimization: {
    splitChunks: { // 拆分vue第三方包为独立的模块
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          test: /vue/,
          name: 'vue',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 图片小于指定大小，会将文件转换成DataURL， 大于则类似file-loader处理
              name: '[name].[ext]',
              outputPath: '/images', // 设置成绝对路径， dev => /images   prod => ../images
              // publicPath: '' //静态资源路径
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(js)$/,
        use: [
          { loader: 'babel-loader' }, // 使用babel对每一个指定的js文件做转换。将所有高版本的语法转换成大多数浏览器支持的语法
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 50000,
          name: '[name].[ext]',
          outputPath: '/fonts',
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: loader => [
                autoprefixer(), // 针对各个浏览器对css支持的不同，自动添加前缀
              ],
            },
          },
        ],
      },

    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js', // 天坑...  不添加这个Vue无法正常获取el
      images: path.join(__dirname, 'images'),
      components: path.join(__dirname, 'src', 'components'),
      services: path.join(__dirname, 'src', 'services'),
    },
    extensions: ['.js', '.vue', '.json'],
  },
  plugins,
  devServer: {
    noInfo: true,
    stats: 'errors-only',
  },
};

module.exports = common_config;

```

### webpack.dev.js
```
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map', // 在开发环境中使用source-map，如果代码出现了错误，可以追踪到源码，而不是转译后的代码
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {

              minimize: true,

            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
});

```
### webpack.prod.js
```
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            },
          },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',

    }),
  ],
});

```