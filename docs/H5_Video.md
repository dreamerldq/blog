### 利用H5新的API创建视频录制功能
```
var recorder, mediaStream;

// 用于存放录制后的音频文件对象和录制结束回调
var recorderFile, stopRecordCallback;

// 用于存放是否开启了视频录制
var videoEnabled = false;

const  getUserMedia = function (videoEnable, audioEnable, callback) { // 处理兼容性的问题
  // 这个函数主要是用来处理兼容性的问题。 提供了3个参数，第一个参数：是否开启视频权限 第二个参数： 是否开启录音权限 第三个参数： 获取到媒体流后// 的回调处理函数
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
      || navigator.msGetUserMedia || window.getUserMedia;
  var constraints = {video: videoEnable, audio: audioEnable};
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        // navigadtor.mediaDevices.getUserMedia返回一个promise对象
          callback(false, stream);
      })['catch'](function(err) {
          callback(err);
      });
  } else if (navigator.getUserMedia) {
      navigator.getUserMedia(constraints, function (stream) {
          callback(false, stream);
      }, function (err) {
          callback(err);
      });
  } else {
      callback(new Error('Not support userMedia'));
  }
}
const closeStream =  function (stream) {
  if (typeof stream.stop === 'function') {
      stream.stop()
      // 关闭媒体流
  }
  else {
      let trackList = [stream.getAudioTracks(), stream.getVideoTracks()];

      for (let i = 0; i < trackList.length; i++) {
          let tracks = trackList[i];
          if (tracks && tracks.length > 0) {
              for (let j = 0; j < tracks.length; j++) {
                  let track = tracks[j];
                  if (typeof track.stop === 'function') {
                      track.stop();
                  }
              }
          }
      }
  }
}
function startRecord(enableVideo) { // 开始录制函数
  videoEnabled = enableVideo;
  getUserMedia(enableVideo, videoEnabled, function (err, stream) {
      if (err) {
          throw err;
      } else {
        console.log("获取到视频流", stream)
          // 通过 MediaRecorder 记录获取到的媒体流
          recorder = new MediaRecorder(stream);
          mediaStream = stream;
          var chunks = [], startTime = 0;
          recorder.ondataavailable = function(e) {
              chunks.push(e.data);
              // 当录制事件结束后调用，返回Blob对象
          };
          recorder.onstop = function (e) {
            // 录制事件结束回调函数， 保存录制文件
              recorderFile = new Blob(chunks, { 'type' : recorder.mimeType });
              chunks = [];
              if (null != stopRecordCallback) {
                  stopRecordCallback();
              }
          };
          recorder.start();
      }
  });
}

// 停止录制
const stopRecord =  function (callback) {
  stopRecordCallback = callback;
  // 终止录制器
  recorder.stop();
  // 关闭媒体流
  closeStream(mediaStream);
}

// 播放录制的音频
const playRecord =  function playRecord() {
  var url = URL.createObjectURL(recorderFile);
  // 创建一个URL string，函数中的参数必须是一个File对象或者是一个 Blob对象
  console.log("URL STRING", url)
  var dom = document.createElement(videoEnabled ? 'video' : 'audio');
  // 如果开启了视频权限，则创建一个视频的元素， 如果没有则创建一个audio元素
  dom.autoplay = true;
  dom.src = url;
  if (videoEnabled) {
      dom.width = 640;
      dom.height = 480;
      dom.style.zIndex = '9999999';
      dom.style.position = 'fixed';
      dom.style.left = '0';
      dom.style.right = '0';
      dom.style.top = '0';
      dom.style.bottom = '0';
      dom.style.margin = 'auto';
      document.body.appendChild(dom);
  }
}
startRecord(true);
// 5秒后结束录制并播放
setTimeout(function(){
    // 结束
    stopRecord(function() {
        // 播放
        playRecord();
    });
}, 5000);
```