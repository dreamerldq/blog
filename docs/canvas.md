# Canvas的使用

## 绘制柱状图表
````
var data = [ 16, 68, 20, 30, 54 ]; 模拟数据

var canvas = document.getElementById('canvas') 获取当前界面的canvas元素
let c = canvas.getContext('2d'); 使用getContent方法来创建canvas画板
c.fillStyle = 'gray' 为画板填充灰色
c.fillRect(0,0,500,500)设置画板的大小  参数依次是： 左边距、上边距、长、高

在使用fillReact后，一个canvas画板就渲染完成，然后接下来所有的更改都不会影响这个画板的显示（比如： 填充色变化等）

c.fillStyle = "blue"; 
for(var i=0; i<data.length; i++) { 
    var dp = data[i]; 
    // c.fillRect(25 + i*100, 30, 50, dp*5); 以左边距25位起始位置，每个元素之间相隔100，上边距为30，长为50 高度用数值来确定
    c.fillRect(25 + i*100, 500-dp*5 - 30 , 50, dp*5); 
} 
这样5条蓝色的条状图就渲染完成
c.fillStyle = "black"; 
c.lineWidth = 2.0; 设置线的宽度为2
c.beginPath(); 开始绘制线
c.moveTo(30,10); 
c.lineTo(30,460); 
c.lineTo(490,460); 
c.stroke(); 填充路径
c.fillStyle = "black"; 
for(var i=0; i<6; i++) { 
    c.fillText((5-i)*20 + "",4, i*80+60); 填充文字  文字内容为index*20， 左边距是4，上边距是index*80 +60
    c.beginPath(); 
    c.moveTo(25,i*80+60); 绘制刻度线
    c.lineTo(30,i*80+60); 
    c.stroke(); 
} 
var labels = ["JAN","FEB","MAR","APR","MAY"]; 
//draw horiz text 
for(var i=0; i<5; i++) { 
    c.fillText(labels[i], 50+ i*100, 475); 绘制x轴
} 
````

## 绘制饼图
````
<html> 
<body> 
<canvas width="500" height="500" id="canvas"></canvas> 
<script> 
//initialize data set 
var data = [ 100, 68, 20, 30, 100 ]; 
 
var canvas = document.getElementById('canvas'); 
var c = canvas.getContext('2d'); 
//draw background 
c.fillStyle = "white"; 
c.fillRect(0,0,500,500); 
 //a list of colors 
var colors = [ "orange", "green", "blue", "yellow", "teal"]; 
 
 //calculate total of all data 
 var total = 0; 
 for(var i=0; i<data.length; i++) { 
     total += data[i]; 
 } 
 //draw pie data 
var prevAngle = 0; 
for(var i=0; i<data.length; i++) { 
    //fraction that this pieslice represents 
    var fraction = data[i]/total; 
    //calc starting angle 
    var angle = prevAngle + fraction*Math.PI*2; 
     
    //draw the pie slice 
    c.fillStyle = colors[i]; 
     
    //create a path 
    c.beginPath(); 
    c.moveTo(250,250); 
    c.arc(250,250, 100, prevAngle, angle, false); 
    c.lineTo(250,250); 
     
    //fill it 
    c.fill(); 
     
    //stroke it 
    c.strokeStyle = "black"; 
    c.stroke(); 
     
    //update for next time through the loop 
    prevAngle = angle; 
    //draw centered text 
c.fillStyle = "black"; 
c.font = "24pt sans-serif"; 
var text = "Sales Data from 2025"; 
var metrics = c.measureText(text); 
c.fillText(text, 250-metrics.width/2, 400); 
} 
</script> 
</body> 
</html> 
````