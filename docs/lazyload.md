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