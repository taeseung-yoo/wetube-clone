const startBtn = document.querySelector("#startBtn");
const preview = document.querySelector("#preview");

let stream, recorder, video;

const handleClickDownload = () => {
  const a = document.createElement("a");
  a.href = video;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click();
};

const handleClickStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleClickStop);
  startBtn.addEventListener("click", handleClickDownload);
  recorder.stop();
};

const handleClickStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleClickStart);
  startBtn.addEventListener("click", handleClickStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    video = URL.createObjectURL(event.data);
    preview.srcObject = null;
    preview.src = video;
    preview.loop = true;
    preview.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  preview.srcObject = stream;
  preview.play();
};

init();

startBtn.addEventListener("click", handleClickStart);
