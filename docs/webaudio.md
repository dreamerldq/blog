# Web Audio API 

```
window.onload = function(){
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
  const myAudio = document.getElementById('my_audio') // 获取audio资源
  var analyser = audioCtx.createAnalyser(); // 创建一个AnalyserNode 节点

  var source = audioCtx.createMediaElementSource(myAudio); // 关联声源
  
  var gainNode = audioCtx.createGain();
  source.connect(analyser); // 将AnalyserNode节点连接到声源
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination); // 将声音输出到扬声器

  analyser.fftSize = 2048; // AnalyserNode 将在一个特定的频率域里使用Fast Fourier Transform (FFT) )来捕获音频数据，这取决于你给 AnalyserNode.fftSize 属性赋的值（如果没有赋值，默认值为2048）。
  var bufferLength = analyser.fftSize
  var dataArray = new Uint8Array(bufferLength); // 创建一个bufferLength长度的数组， 后续用来存储声音数据
  const canvas = document.getElementById('my_canvas')
  const  canvasCtx = canvas.getContext("2d");
  const WIDTH = canvasCtx.canvas.width;
  const HEIGHT = canvasCtx.canvas.height;
  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  function draw() {
    drawVisual = requestAnimationFrame(draw); // requestAnimationFrame 这是HTML5提供的一个新的api，作用类似于settimeout，不过时间和当前电脑的帧率相关
    analyser.getByteTimeDomainData(dataArray);// getByteTimeDomainData 获取到音频数据，然后传递给指定的数组
      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      canvasCtx.beginPath();
      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;
      for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] / 128.0; //128为基线
        var y = v * HEIGHT/2; // 居中

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }
      canvasCtx.lineTo(WIDTH, HEIGHT/2);
      canvasCtx.stroke();

  }
  draw();
}

function setGainNode(){
  let value = 0
   const timer =  setInterval(()=>{
    value += 0.1
     if(value >=1){
       clearInterval(timer)
     }
    gainNode.gain.value = value
  },1000)
  gainNode.gain.valeu = 1
}
```