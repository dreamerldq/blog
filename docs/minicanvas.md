# 微信小程序canvas生成图片转base64
``` 需要用到的接口和包
*** wx.canvasPutImageData(OBJECT, this)
*** UPNG.js
*** wx.createCanvasContext(canvasId, this)
## canvas输出信息的获取
wx.canvasPutImageData(OBJECT, this)这个方法需要在建议在draw回调函数中调用
```
 drawBase64(ctx) {  // ctx 是指创建的canvas对象
    const { width, height } = this.data; // width 和 height 指需要生成的图片的尺寸
    const _this = this;
    ctx.draw(true, wx.canvasGetImageData({ // true 保留上次绘制的图形
      canvasId: 'myCanvas',
      x: 0,  // x y 指距离canvas原点的位置
      y: 0,
      width,
      height,
      success(res) {
        const pngData = upng.encode([res.data.buffer], res.width, res.height); 
        //这里需要引入一个第三方的库，来实现将canvas的信息转换成base64
        const bs64 = wx.arrayBufferToBase64(pngData);
      },
    }));
  },
```
## UPNG.JS库的引用
下载
``` npm install upng-js
然后将node_modules 中uping-js 和 pako两个文件移动到微信小程序的utils目录中，确保 UPNG.JS和PAKO.JS两个文件在同一个文件夹下
然后在需要用到upng的地方使用require的方式引入
``` const upng = require('../../utils/upng-js/UPNG.js');
