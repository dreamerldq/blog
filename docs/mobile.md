### mobile web ui适配解决方案

````
(function() {
        var d = window,
            a = document.documentElement, // 获取根元素节点对象
            e;
        c();
        a.setAttribute("data-dpr", d.devicePixelRatio);
        d.addEventListener("resize", b, false); // 监听
        d.addEventListener("pageshow", function(f) {
            f.persisted && b()
        }, false);

        function b() {
            clearTimeout(e);
            e = setTimeout(c, 300)
        }

        function c() {
            var f = a.getBoundingClientRect().width; //获取html元素的宽度
            if (f <= 750) {
                d.rem = a.getBoundingClientRect().width / 10 
                设置根节点的字体大小，也就是rem， 如果html的宽度小于750（750是设计稿的大小）
                则rem = 根元素的宽度/10 ， 那么10rem就等于设计稿的最大宽度750px。当对一元素设置css的时候，比如设计稿中给出的宽度是750，则等于 (750/75) = 10rem   这个函数可以公式可以使用sass写一个。
            } else {
                d.rem = 75;
                如果大于750px，则将rem设置为75， 这样页面在大于750px，也只显示750像素大小
            }
            a.style.fontSize = d.rem + "px"
        }
    })();
````


### react native ui 适配解决方案

虽然各个设备的屏幕大小不同，但是设计元素所占的比例是相同的
````
import { Dimensions } from 'react-native';

// 设备宽度，单位 dp
const deviceWidthDp = Dimensions.get('window').width;

// 设计稿宽度（这里为640px），单位 px
const uiWidthPx = 640;

// px 转 dp（设计稿中的 px 转 rn 中的 dp）
export const pTd = (uiElePx) => {
  return uiElePx * deviceWidthDp / uiWidthPx;
}
````