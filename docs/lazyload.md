### lazy-load实现
+ html5懒加载实现
+ 微信小程序懒加载实现

## 微信小程序懒加载
监听页面的scroll事件,判读元素距离页面的top值是否是小于等于页面的可视高度
```
showImg(){
	let group = this.data.group
	let height = this.data.height  // 页面的可视高度
	
	wx.createSelectorQuery().selectAll('.item').boundingClientRect((ret) => {
	 ret.forEach((item, index) => {
	   if (item.top <= height) { 判断是否在显示范围内
	     group[index].show = true // 根据下标改变状态
	   }
	 })
	 this.setData({
	   group
	 })
	}).exec()

}
onPageScroll(){ // 滚动事件
	this.showImg()
}

onload(){
     wx.getSystemInfo({  // 获取页面可视区域的高度
      success: (res) =>{
        this.setData({
          height: res.screenHeight
        })
}
```
通过`getSystemInfo`可以获取到设备的信息，在这里我们主要用到设备的屏幕尺寸信息。
使用`createSelectorQuery().selectAll()`函数可以获取到指定的节点，并通过`boundingClientRect`来获取节点的信息
在每次滚动页面的时候，调用showimg函数，遍历判断每一个节点距离屏幕顶部的高度是否小于屏幕的高度（以此来判断节点是否进入了屏幕可视范围中），然后将对应的ing显示出来。

### 实现方式2
在微信api中其实提供了一些页面元素交叉的api
```
Page({
  onLoad: function(){
    wx.createIntersectionObserver().relativeToViewport().observe('.target-class', (res) => {
      res.id // 目标节点 id
      res.dataset // 目标节点 dataset
      res.intersectionRatio // 相交区域占目标节点的布局区域的比例
      res.intersectionRect // 相交区域
      res.intersectionRect.left // 相交区域的左边界坐标
      res.intersectionRect.top // 相交区域的上边界坐标
      res.intersectionRect.width // 相交区域的宽度
      res.intersectionRect.height // 相交区域的高度
    })
  }
})
```
`relativeToViewport` 交叉区域的参照元素就是屏幕的可视区域。 `observe用来设置被监听的元素， 回调函数中的参数对象提供了一些基本信息` ，一旦被监听的元素进入了可是区域，就可以实现是否显示图片的判断。

## HTML5中的实现
浏览器中也提供了类似的api 	`Intersection Observer API ` 使用方式和小程序中的`createIntersectionObserver` 类似