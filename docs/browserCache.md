
基本的网络请求就是三个步骤：请求，处理，响应。
后端缓存主要集中于“处理”步骤，通过保留数据库连接，存储处理结果等方式缩短处理时间，尽快进入“响应”步骤。
而前端缓存则可以在剩下的两步：“请求”和“响应”中进行。在“请求”步骤中，浏览器也可以通过存储结果的方式直接使用资源，直接省去了发送请求；而“响应”步骤需要浏览器和服务器共同配合，通过减少响应内容来缩短传输时间。这些都会在下面进行讨论。

![图片](https://uploader.shimo.im/f/DLNwpyaHjCs9ks7a.png!thumbnail)
我们可以在 Chrome 的开发者工具中，Network -> Size 一列看到一个请求最终的处理方式：如果是大小 (多少 K， 多少 M 等) 就表示是网络请求，否则会列出 from memory cache, from disk cache 和 from ServiceWorker。

它们的优先级是：(由上到下寻找，找到即返回；找不到则继续)
Service Worker -> Memory Cache ->  Disk Cache ->    网络请求
# 缓存位置

### 1.Service Worker
Service Worker 是运行在浏览器背后的独立线程，一般可以用来实现缓存功能。使用 Service Worker的话，传输协议必须为 HTTPS。因为 Service Worker 中涉及到请求拦截，所以必须使用 HTTPS 协议来保障安全。**Service Worker 的缓存与浏览器其他内建的缓存机制不同，它可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的**。
Service Worker 实现缓存功能一般分为三个步骤：首先需要先注册 Service Worker，然后监听到 install 事件以后就可以缓存需要的文件，那么在下次用户访问的时候就可以通过拦截请求的方式查询是否存在缓存，存在缓存的话就可以直接读取缓存文件，否则就去请求数据。
当 Service Worker 没有命中缓存的时候，我们需要去调用 fetch 函数获取数据。也就是说，如果我们没有在 Service Worker 命中缓存的话，会根据缓存查找优先级去查找数据。但是不管我们是从 Memory Cache 中还是从网络请求中获取的数据，浏览器都会显示我们是从 Service Worker 中获取的内容。
[ https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers](http:// https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API/Using_Service_Workers)(本文是关于使用 service workers 的教程，包括讲解 service worker 的基本架构、怎么注册一个 service worker、一个新  service worker 的 install 及 activation 过程、怎么更新 service worker 还有它的缓存控制和自定义响应，这一切都在一个简单的离线的应用程序中)

PWA(Progressive Web App) [https://lavas.baidu.com/pwa/README](https://lavas.baidu.com/pwa/README)

### 2.Memory Cache
Memory Cache 也就是内存中的缓存，几乎所有的网络请求资源都会被浏览器自动加入到 memory cache 中。主要包含的是当前中页面中已经抓取到的资源,例如页面上已经下载的样式、脚本、图片等。读取内存中的数据肯定比磁盘快,内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。 **一旦我们关闭 Tab 页面，内存中的缓存也就被释放了**。
**那么既然内存缓存这么高效，我们是不是能让数据都存放在内存中呢？**
这是不可能的。计算机中的内存一定比硬盘容量小得多，操作系统需要精打细算内存的使用，所以能让我们使用的内存必然不多。
当我们访问过页面以后，再次刷新页面，可以发现很多数据都来自于内存缓存
![图片](https://uploader.shimo.im/f/KAxLI1jGva0F8KAp.png!thumbnail)
image
内存缓存中有一块重要的缓存资源是preloader相关指令（例如<link rel="prefetch">）
[https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content)
下载的资源。总所周知preloader的相关指令已经是页面优化的常见手段之一，它可以一边解析js/css文件，一边网络请求下一个资源。
需要注意的事情是，在从 memory cache 获取缓存内容时，浏览器会忽视例如 max-age=0, no-cache 等头部配置。例如页面上存在几个相同 src 的图片，即便它们可能被设置为不缓存，但依然会从 memory cache 中读取。这是因为 memory cache 只是短期使用，大部分情况生命周期只有一次浏览而已。而 max-age=0 在语义上普遍被解读为“不要在下次浏览时使用”，所以和 memory cache 并不冲突。
但如果站长是真心不想让一个资源进入缓存，就连短期也不行，那就需要使用 no-store。存在这个头部配置的话，即便是 memory cache 也不会存储，自然也不会从中读取了。(后面的第二个示例有关于这点的体现)

### 3.Disk Cache
Disk Cache 也就是存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，**比之 Memory Cache 胜在容量和存储时效性上**。
在所有浏览器缓存中，Disk Cache 覆盖面基本是最大的。它会根据 HTTP Herder 中的字段判断哪些资源需要缓存，哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求。并且即使在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据。绝大部分的缓存都来自 Disk Cache，关于 HTTP 的协议头中的缓存字段，我们会在下文进行详细介绍。
**浏览器会把哪些文件丢进内存中？哪些丢进硬盘中？**
* 对于大文件来说，大概率是不存储在内存中的，反之优先
* 当前系统内存使用率高的话，文件优先存储进硬盘

如果以上四种缓存都没有命中的话，那么只能发起请求来获取资源了。
那么为了性能上的考虑，大部分的接口都应该选择好缓存策略，**通常浏览器缓存策略分为两种：强缓存和协商缓存，并且缓存策略都是通过设置 HTTP Header 来实现的**。


# 缓存过程分析

浏览器与服务器通信的方式为应答模式，即是：浏览器发起HTTP请求 – 服务器响应该请求，**那么浏览器怎么确定一个资源该不该缓存，如何去缓存呢**？浏览器第一次向服务器发起该请求后拿到请求结果后，将请求结果和缓存标识存入浏览器缓存，**浏览器对于缓存的处理是根据第一次请求资源时返回的响应头来确定的**。具体过程如下图：

![图片](https://uploader.shimo.im/f/o9yndJK2SwwA7heM.png!thumbnail)

由上图我们可以知道：
* 浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识
* 浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存中

这里我们根据是否需要向服务器重新发起HTTP请求将缓存过程分为两个部分，分别是强缓存和协商缓存。



# 强缓存
**强缓存：不会向服务****器发送****请求，直接从缓存中读取资源****，在ch****rome控制台的Network选项中可以看到该请求返回****20****0的状态码，并且S****iz****e显示fr****om di****sk c****ach****e或fr****om**** memor****y**** cach****e****。强缓存可以通过设置****两种**** HTTP Header 实现：Expi****res ****和 Cache-Co****n****trol。**
### 1.Expires
**缓存过期****时间，用来指定资源到期****的时间，是服务器端的具体****的时间点**。Expires是Web服务器响应消息头字段，在响应http请求时告诉浏览器在过期时间前浏览器可以直接从浏览器缓存取数据，而无需再次请求。
**Expires 是 HTTP/1 的产物，受****限于本地时间，如果修改了本地****时间，可能会造成缓存失效**。Expires: Wed, 22 Oct 2018 08:41:00 GMT表示资源会在 Wed, 22 Oct 2018 08:41:00 GMT 后过期，需要再次请求。

![图片](https://uploader.shimo.im/f/D1gInmRG2wkHRF0I.png!thumbnail)

![图片](https://uploader.shimo.im/f/s5nTiJOsBec5f6qk.png!thumbnail)



```

app.get('/', (req, res) => {
    const cssContent = path.join(__dirname, './html/index.html');
    fs.readFile(cssContent, function(err, data) {
          res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
        res.end(data);
    })
});
```


### 2.Cache-Control
在HTTP/1.1中，Cache-Control是最重要的规则，主要用于控制网页缓存。比如当Cache-Control:max-age=300时，则代表在这个请求正确返回时间（浏览器也会记录下来）的5分钟内再次加载资源，就会命中强缓存。
Cache-Control 可以在请求头或者响应头中设置，并且可以组合使用多种指令：
![图片](https://uploader.shimo.im/f/vESWW9Ns1GciRwQf.png!thumbnail)

**no-cache**：客户端缓存内容，是否使用缓存则需要经过协商缓存来验证决定。表示不使用 Cache-Control的缓存控制方式做前置验证，而是使用 Etag 或者Last-Modified字段来控制缓存。**需要注意的是，no-cache这个名字有一点误导。设置了no-cache之后，并不是说浏览器就不再缓存数据，只是浏览器在使用缓存数据时，需要先确认一下数据是否还跟服务器保持一致。**
**no-store**：所有内容都不会被缓存，即不使用强制缓存，也不使用协商缓存
**max-age**：max-age=xxx (xxx is numeric)表示缓存内容将在xxx秒后失效

一般，我们会设置Cache-Control的值为“public, max-age=xxx”，表示在xxx秒内再次访问该资源，均使用本地的缓存，不再向服务器发起请求。
![图片](https://uploader.shimo.im/f/qY57PGZT4bklCBCH.png!thumbnail)

```
app.get('/', (req, res) => {
    const cssContent = path.join(__dirname, './html/index.html');
    fs.readFile(cssContent, function(err, data) {
        res.setHeader("Cache-Control", "max-age=0");
        res.end(data);
    })
});
```

### 3.Expires和Cache-Control两者对比
Cache-Control是http1.1的产物，**两者同时存在的话，Cache-Control优先级高于Expires**；
在某些不支持HTTP1.1的环境下，Expires就会发挥用处。所以Expires其实是过时的产物，现阶段它的存在只是一种兼容性的写法。
Expires是一个具体的服务器时间，这就导致一个问题，如果客户端时间和服务器时间相差较大，缓存命中与否就不是开发者所期望的。Cache-Control是一个时间段，控制就比较容易。
强缓存判断是否缓存的依据来自于是否超出某个时间或者某个时间段，而不关心服务器端文件是否已经更新，这可能会导致加载文件不是服务器端最新的内容，**那我们如何获知服务器端内容是否已经发生了更新呢**？此时我们需要用到协商缓存策略。


# 协商缓存
**协商缓存就是强制缓存失效后，浏览器携带缓存标识向服务器发起请求，由服务器根据缓存标识决定是否使用缓存的过程，主要有以下两种情况**：
* 协商缓存生效，返回304和Not Modified

![图片](https://uploader.shimo.im/f/AyqfRwSnqkEz69BD.png!thumbnail)

* 协商缓存失效，返回200和请求结果

![图片](https://uploader.shimo.im/f/EkEbpHURQQIVvn8v.png!thumbnail)
 
协商缓存可以通过设置两种 HTTP Header 实现：Last-Modified 和 ETag 

Last-Modified和If-Modified-Since：Last-Modified是该资源文件最后一次更改时间，服务器会在response header里返回，同时浏览器会将这个值保存起来，在下一次发送请求时，放到request header里的If-Modified-Since里，服务器在接收到后也会做比对，如果相同则命中协商缓存。
![图片](https://uploader.shimo.im/f/k1tYUJrnKwIEKa91.png!thumbnail)


![图片](https://uploader.shimo.im/f/R8VtbO9PorQHENIW.png!thumbnail)

Last-Modified： 表示为为实体头部部分，response返回，表示为资源的最后更新时间 
 If-Modified-Since：通过比较两次的时间判断，资源在请求期间是否有修改，假如没有修改，则命中协商缓存，浏览器从缓存中读取资源，如果没有命中，资源有过修改，返回新的Last-Modified时间和服务器资源
```
    app.get('/', (req, res) => {
    const cssContent = path.join(__dirname, './html/index.html')
    fs.stat(cssContent, (err, start) => {
        if (req.headers['if-modified-since'] === start.mtime.toUTCString()) {
            res.writeHead(304, 'Not Modified');
            res.end();
        } else {
            fs.readFile(cssContent, function (err, data) {
                let lastModified = start.mtime.toUTCString();
                res.setHeader('Last-Modified', lastModified);
                res.writeHead(200, 'OK');
                res.end(data);
            })
        }
    })


});
```

 
**Etag是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)，只要资源有变化，Etag就会重新生成**。浏览器在下一次加载资源向服务器发送请求时，会将上一次返回的Etag值放到request header里的If-None-Match里，服务器只需要比较客户端传来的If-None-Match跟自己服务器上该资源的ETag是否一致，就能很好地判断资源相对客户端而言是否被修改过了。如果服务器发现ETag匹配不上，那么直接以常规GET 200回包形式将新的资源（当然也包括了新的ETag）发给客户端；如果ETag是一致的，则直接返回304知会客户端直接使用本地缓存即可
 
![图片](https://uploader.shimo.im/f/HVGBYLeNHgMUp6wZ.png!thumbnail)
```
app.get('/home', (req, res) => {
    const cssContent = path.join(__dirname, './html/index.html')
    fs.stat(cssContent, (err, start) => {
        let etag = md5(cssContent);
        if (req.headers['if-none-match'] === etag) {
            res.writeHead(304, 'Not Modified');
            res.end();
        } else {
            fs.readFile(cssContent, function (err, data) {
                res.setHeader('Etag', etag);
                res.writeHead(200, 'OK');
                res.end(data);
            })
        }
    })
});

```


不推荐使用 Expires 首部，它指定的是实际的过期日期而不是秒数。HTTP 设计者 后来认为，由于很多服务器的时钟都不同步，或者不正确，所以最好还是用剩余秒 数，而不是绝对时间来表示过期时间。
 
ETag解决了Last-Modified使用时可能出现的资源的时间戳变了但内容没变及如果再一秒钟以内资源变化但Last-Modified没变的问题，感觉ETag更加稳妥。

在此模式下 ，你也可以将ETag（你选择的版本ID）或者Last-modified日期添加到响应首部中。客户端下次获取资源时，他会分别通过If-None-Match（与ETage对应）和If-Modified-Since（与Last-Mofied对应）两个请求首部将值发送给服务器。如果服务器发现两次值都是对等的，就是返回一个HTTP 304。

# 缓存机制
**强制缓存优先于协商缓存进行，若强制缓存(Expires和Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存(Last-Modified / If-Modified-Since和Etag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，返回200，重新返回资源和缓存标识，再存入浏览器缓存中；生效则返回304，继续使用缓存**。具体流程图如下：
![图片](https://uploader.shimo.im/f/0Po9VpGlPkoqxLum.png!thumbnail)


### 频繁变动的资源
Cache-Control: no-cache

对于频繁变动的资源，首先需要使用Cache-Control: no-cache 使浏览器每次都请求服务器，然后配合 ETag 或者 Last-Modified 来验证资源是否有效。这样的做法虽然不能节省请求数量，但是能显著减少响应数据大小。

### 不常变化的资源
Cache-Control: max-age=31536000

通常在处理这类资源时，给它们的 Cache-Control 配置一个很大的 max-age=31536000 (一年)，这样浏览器之后请求相同的 URL 会命中强制缓存。而为了解决更新的问题，就需要在文件名(或者路径)中添加 hash， 版本号等动态字符，之后更改动态字符，从而达到更改引用 URL 的目的，让之前的强制缓存失效 (其实并未立即失效，只是不再使用了而已)。
```
output:{
    path:path.join(__dirname,'./dist'),
    publicPath: '/dist/',
    filname: 'bundle.[chunkhash].js'
}
```
* HTML：使用协商缓存。
* CSS&JS&图片：使用强缓存，文件命名带上hash值。


