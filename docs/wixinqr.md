# 微信小程序生成指定页面跳转二维码流程

微信小程序可以通过请求微信的一些接口，然后返回指定页面的小程序的二维码。
首先得通过一个接口获取到token

````
https请求方式: GET
https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
````
appid 和 secrer 都可以在微信小程序的设置里面找到。

然后通过这个接口获取二维码
````
https请求方式: POST
https://api.weixin.qq.com/wxa/getwxacode?access_token=ACCESS_TOKEN
````
POST 参数说明

参数
path  "pages/index?query=1"  // 指定页面，并且可以传递参数 

width

auto_color	Bool

line_color	Object	{"r":"0","g":"0","b":"0"}"b":"xxx"}

is_hyaline	Bool	false	是否需要透明底色

# `这个接口会返回二维码的图片`