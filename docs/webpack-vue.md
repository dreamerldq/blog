# webpack4配置vue开发环境
`因为之前已经写了一篇webpack+react+ts的配置的详细介绍，所以这里只是简单的展示一些vue配置中用到的配置。`
````
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const {
    VueLoaderPlugin
} = require('vue-loader')
module.exports = {
    entry: {
        path: './src/index.js'
    },
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.less$/,
                use: [{
                    loader: 'vue-style-loader'
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'less-loader'
                }]
            },
            {
                test: /\.js$/,
                use: ['babel-loader']
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './src/index.html'
        }),
        new VueLoaderPlugin()
    ]
}
````
`<style src="./index.less" lang="less"> 通过这样的方式在vue文件中引入less文件`


````
"dependencies": {
    "vue": "^2.5.16",
    "vue-style-loader": "^4.1.0",
    "webpack": "^4.13.0",
    "webpack-cli": "^3.0.8"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.4",
    "babel-plugin-istanbul": "^4.1.6",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-polyfill": "^6.26.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-2": "^6.24.1",
    "babel-register": "^6.26.0",
    "css-loader": "^0.28.11",
    "file-loader": "^1.1.11",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "less": "^3.0.4",
    "less-loader": "^4.1.0",
    "style-loader": "^0.21.0",
    "vue-loader": "^15.2.4",
    "vue-template-compiler": "^2.5.16",
    "webpack-dev-server": "^3.1.4"
  }
````
``