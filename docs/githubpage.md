# Github Page 结合 Vuepress

首先按照官网的教程创建vuepress项目，完成一些基本的博客框架还是很简单，只需要创建markdown文件，然后配置.vuepress/config 文件就行

### 生成静态文件
```
	npm run docs:build
```
### 进入生成的文件夹
```
	cd docs/.vuepress/dist 
	
	git init
	
	git add -A
	
	git commit -m 'deploy'

	git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
```

> 上述的所有过程都可以通过配置deploy.sh文件来自定执行 [链接](https://vuepress.vuejs.org/zh/guide/deploy.html#github-pages/ "Markdown")
> 在windows环境下，执行 .\deploy.sh 命令完成一键部署
### github page

创建一个github仓库，以 【name】.github.io格式来命名

在仓库的setting中找到 custom domain， 设置要指向的域名，点击save



### 域名解析

记录类型:CNAME

主机记录：三级域名

记录值： github仓库名



完成上述操作就能够完成一个blog的部署