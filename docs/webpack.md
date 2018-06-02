# webpack 配置
> webpack typescript + react + less 配置详解

***



需要用到的包有

+ babel-loader
+ babel-preset-env 
+ babel-preset-react 
+ css-loader 
+ style-loader 
+ less-loader 
+ less 
+ ts-loader 
+ html-webpack-plugin 
+ typescript 
+ @types/react 
+ @types/react-dom 
+ react-router-dom 

***

```
    entry: path.join(__dirname, "src/index.tsx")
	output: {
			path: path.join(__dirname, 'dist'),
			filename: 'index_bundle.js',
			publicPath: '/'
	}
```

entry 指定打包文件的入口，从这个入口文件开始递归遍历所有的依赖包，形成一个依赖树

output 

path 指定打包后文件存放的位置

filename 指定构建完成后文件的名称

publikPath 指定公共资源文件的位置

```
	plugins: [htmlWebpackPlugin]
	
	const HtmlWebpackPlugin = require("html-webpack-plugin");
	const htmlWebpackPlugin = new HtmlWebpackPlugin({
	    template: path.join(__dirname, "public/index.html"),
	    filename: "index.html"
	});
```

引入HtmlWebpackPlugin这个插件。这个插件可以自动帮你在打包生成的文件目录下创建一个html文件，免去了自己手动创建html文件引入打包后JS文件的过程

template 指定一个html的模板，这样在自动生成的html文件中，都会引入模板中拥有的css、js、等文件

filename 指定自动生成的html文件的名称
```
	module: {
	    rules: [
	        {
	            test: /\.(js|jsx)$/,
	            use: [
	                {loader: 'babel-loader'}
	            ],
	            exclude: /node_modules/
	        }
	    ]
	}
```

loader是webpack中的关键，所有的代码转译的过程都是通过它来实现

上面这段代码简单的配置了babel。

babel是一个js的编译器，能够将一些ES6+ 的语法，通过babel转换成低版本的JS语法，能够让更多的浏览器支持。

babel在转译的过程中，会先出在项目中查找一个叫做 .babelrc的文件，这个文件用配置bebel规则
```
	{
	"presets": [
	    "env",
	    "react"
	],
	"plugins": [
	  "transform-class-properties",
	  ["import", { "libraryName": "antd", "style": "css" }]
	]
	}
```
presets 用来指定需要转译的语言。 env 是指 ES5+ 的所有的JS语言版本

plugins 可以用这个对象来配置一些插件

transform-class-properties  这个插件可以以这样的方式在ES6 Class中的声明方法，而不需要去使用bind绑定。
```
	changeType = (type: string) => () => {
	this.props.changeType(type)
	}
```
因为Class默认不绑定this
```
	componentDidMount() {
		if (this.props.match.path === '/todo') {
				this.props.fetchNews()
			}
		}

	changeType(type: string) {
		return () => this.props.changeType(type)
	}

 ["import", { "libraryName": "antd", "style": "css" }] 是一个按需加载的插件，能够让antd UI组件 按需加载。
```
转译typescript文件
```
	{
		test: /\.(ts|tsx)$/,
		use: [
			{ loader: 'babel-loader' },
			{ loader: 'ts-loader' }
		],
		exclude: /node_modules/
	}
```
test用来匹配需要转译的文件，用正则表达式来完成匹配
use 是一个数组，用来指定转译时需要用到的loader。 
exclude 用来指定不需要检测转译的文件


less配置
```
	{
		test: /\.less$/,
		use: [
			{ loader: 'style-loader'},
			{loader: 'typings-for-css-modules-loader',
			options: {
				modules: true,
				namedExport: true,
				camelCase: true,
				minimize: true,
				importLoaders: 1,
				localIdentName: "[local]_[hash:base64:5]"
			}
			},
			{ loader: 'less-loader'}
		],
		exclude: /node_modules/
    }
```
resolve 配置
```
	resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", "less", "css"]
    }
```
这样在用import引用其他模块的时候，在不输入文件后缀的情况下，webpack会按照上面extensions中的顺序遍历，直到找到第一个匹配到的文件停止	
webpack-dev-server 配置
```
	devServer: {
        port: 7000,
        historyApiFallback: true,
    }
```
port指定端口号
historyApiFallback
