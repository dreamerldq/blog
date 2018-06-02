#  使用字体图标

> 推荐使用[阿里巴巴矢量图标库](http://www.iconfont.cn/ "Markdown") iconfont  



进入首页后，选择自己喜欢的图标，将其添加到购物车。在购物车中，将所选中的图标添加到现有项目中，如果没有，新创建一个项目。

然后我们使用Font Class的方法来使用图标字体。 将网站提供的外链，引入到自己的前端项目中。
```
	 <link  type="text/css" rel="stylesheet" href="//at.alicdn.com/t/font_691030_31hsf9p8pp3c8fr.css"/>
```

```
	 <i className="iconfont icon-naicha"></i>
	 <i className="iconfont  icon-hongjiu"></i>
```
在需要用到图标的地方，只需要使用一些可以显示文字的元素，添加类名就好。由于是文字图标，所以受font family的控制。