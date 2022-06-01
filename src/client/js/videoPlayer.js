const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.querySelector("#mute");
const muteBtnIcon = muteBtn.querySelector("i");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const volumeRange = document.querySelector("#volume");
const timeline = document.querySelector("#timeline");
const fullScreenBtn = document.querySelector("#fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.querySelector("#videoContainer");
const videoControls = document.querySelector("#videoControls");

let controlLeaveTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleSpaceabarPress = (event) => {
  if (event.code === "Space") {
    handlePlayClick();
  }
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
  volumeValue = value;
  video.volume = value;
  if (video.volume === 0) {
    muteBtnIcon.classList = "fas fa-volume-mute";
    volumeValue = 0.5;
    video.volume = volumeValue;
    video.muted = true;
  }
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleVideoEnded = () => {
  const id = videoContainer.dataset.videoid;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreenClick = () => {
  const isFullScreen = document.fullscreenElement;
  if (isFullScreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlLeaveTimeout) {
    clearTimeout(controlLeaveTimeout);
    controlLeaveTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlLeaveTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
video.addEventListener("click", handlePlayClick);
document.addEventListener("keyup", handleSpaceabarPress);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleVideoEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreenClick);

// if (video.readyState == 4) {
//   handleLoadedMetadata();
// }
