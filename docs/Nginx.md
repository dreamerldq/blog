# Nginx
* 正向代理
	翻墙工具，它就是一个典型的正向代理工具。它会把我们不让访问的服务器的网页请求，代理到一个可以访问该网站的代理服务器上来，一般叫做proxy服务器，再转发给客户
* 反向代理
	反向代理跟代理正好相反（需要说明的是，现在基本所有的大型网站的页面都是用了反向代理），客户端发送的请求，想要访问server服务器上的内容。发送的内容被发送到代理服务器上，这个代理服务器再把请求发送到自己设置好的内部服务器上，而用户真实想获得的内容就在这些设置好的服务器上。

反向代理的主要用途是为多个服务器提供负债均衡、缓存等功能。负载均衡就是一个网站的内容被部署在若干服务器上，可以把这些机子看成一个集群，那Nginx可以将接收到的客户端请求“均匀地”分配到这个集群中所有的服务器上，从而实现服务器压力的平均分配，也叫负载均衡。

server{
        listen 80;
        server_name dreamerldq.com;
        location / {
               proxy_pass https:www.baidu.com;
        }
}
这样我们访问的域名是dreamerldq.com，但是通过nginx的反向代理，指向了百度

### Nginx 启动、停止、重启
启动：nginx
停止：nginx  -s stop
重启： nginx -s reload

重新配置nginx文件后，需要重启才能生效

### error_page 指定错误页面

error_page   500 502 503 504  /50x.html;  
上述所有的错误都用50x.html来处理
error_page 404  /404_error.html;
error_page不止可以指向本地资源，还可以指向外部资源
error_page  404 http://jspang.com;


###  访问控制
location / {
        deny   123.9.51.42;
        allow  45.76.202.231;
    }

 location =/img{
        allow all;
    }
    location =/admin{
        deny all;
    }

“=”是精确匹配，还可以使用正则表达式来匹配
### 设置虚拟主机
* 端口号
server{
        listen 8001;
        server_name localhost;
        root _usr_share_nginx_html/html8001;
        index index.html;
}
* 域名
server{
        listen 80;
        server_name nginx2.jspang.com;
        location / {
                root _usr_share_nginx_html/html8001;
                index index.html index.htm;
        }
}
### Nginx适配PC或移动设备
server{
     listen 80;
     server_name nginx2.jspang.com;
     location / {
      root _usr_share_nginx_pc;
      if ($http_user_agent ~* '(Android|webOS|iPhone|iPod)') {
         root _usr_share_nginx_mobile;
      }
      index index.html;
     }
}

$http_user_agent 可以获取到客户端的UserAgent。

### Nginx的Gzip压缩配置
	Gzip是网页的一种网页压缩技术，经过gzip压缩后，页面大小可以变为原来的30%甚至更小。更小的网页会让用户浏览的体验更好，速度更快。gzip网页压缩的实现需要浏览器和服务器的支持。
gzip是需要服务器和浏览器同事支持的。当浏览器支持gzip压缩时，会在请求		消息中包含Accept-Encoding:gzip,这样Nginx就会向浏览器发送听过gzip后的内容，同时在相应信息头中加入Content-Encoding:gzip，声明这是gzip后的内容，告知浏览器要先解压后才能解析输出。

http {
   .....
    gzip on;
    gzip_types text_plain application_javascript text/css;
   .....
}