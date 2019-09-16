Flutter是谷歌的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。同时也将是[Google Fuchsia](https://zh.wikipedia.org/wiki/Google_Fuchsia)下开发应用的主要工具

一、基本Widget介绍
Flutter有一套丰富、强大的基础widget，其中以下是很常用的：
[Text](https://docs.flutter.io/flutter/widgets/Text-class.html)：该 widget 可让创建一个带格式的文本。

* [Row](https://docs.flutter.io/flutter/widgets/Row-class.html)、 [Column](https://docs.flutter.io/flutter/widgets/Column-class.html)： 这些具有弹性空间的布局类Widget可让您在水平（Row）和垂直（Column）方向上创建灵活的布局。其设计是基于web开发中的Flexbox布局模型。
* [Stack](https://docs.flutter.io/flutter/widgets/Stack-class.html)：[Stack](https://docs.flutter.io/flutter/widgets/Stack-class.html)允许子 widget 堆叠， 你可以使用 [Positioned](https://docs.flutter.io/flutter/widgets/Positioned-class.html) 来定位他们相对于Stack的上下左右四条边的位置。Stacks是基于Web开发中的绝度定位（absolute positioning )布局模型设计的。
* [Container](https://docs.flutter.io/flutter/widgets/Container-class.html)： [Container](https://docs.flutter.io/flutter/widgets/Container-class.html) 可让您创建矩形视觉元素。container 可以装饰为一个[BoxDecoration](https://docs.flutter.io/flutter/painting/BoxDecoration-class.html), 如 background、一个边框、或者一个阴影。 [Container](https://docs.flutter.io/flutter/widgets/Container-class.html) 也可以具有边距（margins）、填充(padding)和应用于其大小的约束(constraints)。另外， [Container](https://docs.flutter.io/flutter/widgets/Container-class.html)可以使用矩阵在三维空间中对其进行变换。

二、手势处理
```
class MyButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new GestureDetector(
      onTap: () {
        print('MyButton was tapped!');
      },
      child: new Container(
        height: 36.0,
        padding: const EdgeInsets.all(8.0),
        margin: const EdgeInsets.symmetric(horizontal: 8.0),
        decoration: new BoxDecoration(
          borderRadius: new BorderRadius.circular(5.0),
          color: Colors.lightGreen[500],
        ),
        child: new Center(
          child: new Text('Engage'),
        ),
      ),
    );
  }
}
```
三、状态组件
```
class Counter extends StatefulWidget {
   @override
  _CounterState createState() => new _CounterState();
}

class _CounterState extends State<Counter> {
  int _counter = 0;

  void _increment() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return new Row(
      children: <Widget>[
        new RaisedButton(
          onPressed: _increment,
          child: new Text('Increment'),
        ),
        new Text('Count: $_counter'),
      ],
    );
  }
}
```

在Flutter中，事件流是“向上”传递的，而状态流是“向下”传递的，这类似于React/Vue中父子组件通信的方式：子widget到父widget是通过事件通信，而父到子是通过状态

```
class CounterDisplay extends StatelessWidget {
  CounterDisplay({this.count});

  final int count;

  @override
  Widget build(BuildContext context) {
    return new Text('Count: $count');
  }
}

class CounterIncrementor extends StatelessWidget {
  CounterIncrementor({this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return new RaisedButton(
      onPressed: onPressed,
      child: new Text('Increment'),
    );
  }
}

class Counter extends StatefulWidget {
  @override
  _CounterState createState() => new _CounterState();
}

class _CounterState extends State<Counter> {
  int _counter = 0;

  void _increment() {
    setState(() {
      ++_counter;
    });
  }

  @override
  Widget build(BuildContext context) {
    return new Row(children: <Widget>[
      new CounterIncrementor(onPressed: _increment),
      new CounterDisplay(count: _counter),
    ]);
  }
}
```
四、异步调用
```
runUsingFuture() {
  //...
  findEntrypoint().then((entrypoint) {
    return runExecutable(entrypoint, args);
  }).then(flushThenExit);
}

runUsingAsyncAwait() async {
  //...
  var entrypoint = await findEntrypoint();
  var exitCode = await runExecutable(entrypoint, args);
  await flushThenExit(exitCode);
}

```


五、JSON解析
[https://zhuanlan.zhihu.com/p/79084171](https://zhuanlan.zhihu.com/p/79084171)

人工手动解析
```
class HomeDao{
  static Future<HomeModel> fetch() async{
    final response = await http.get(HOME_URL);
    if(response.statusCode == 200){
        Utf8Decoder utf8Decoder = Utf8Decoder(); // fix 中文乱码
      var result = json.decode(utf8Decoder.convert(response.bodyBytes));
      return HomeModel.fromJson(result);
    }else{
      throw Exception('请求首页接口失败');
    }
  }
}



class CommonModel{
  final String icon;
  final String title;
  final String url;
  final bool hideAppBar;
  final String statusBarColor;


  CommonModel({this.icon, this.title, this.url, this.hideAppBar, this.statusBarColor});
  factory CommonModel.fromJson(Map<String, dynamic> json){
    return CommonModel(
      icon: json['icon'],
      title: json['title'],
      url: json['url'],
      hideAppBar: json['hideAppBar'],
      statusBarColor: json['statusBarColor']
    );
  }
}

```
六、第三方库下载
![图片](https://uploader.shimo.im/f/wTPQfJ5NLAgCEQZM.png!thumbnail)
pubspec.yaml文件，作用类似于node packagejson


七、携程网首页demo  [git地址](https://github.com/dreamerldq/flutter_xiecheng)
