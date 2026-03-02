const video = document.getElementById("video");
const playBtn = document.getElementById("play");
const stopBtn = document.getElementById("stop");
const progress = document.getElementById("progress");
const timestamp = document.getElementById("timestamp");

// functions
const toggerPlayStatus = () => {
  video.paused ? video.play() : video.pause();
  updatePlayIcon();
};
const updatePlayIcon = () => {
  playBtn.innerHTML = video.paused
    ? '<i class="fa fa-play fa-2x"></i>'
    : '<i class="fa fa-pause fa-2x"></i>';
};
const timeUpdate = () => {
  progress.value = (video.currentTime / video.duration) * 100;
  let minutes = Math.floor(video.currentTime / 60);
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let seconds = Math.floor(video.currentTime % 60);
  seconds = seconds < 10 ? "0" + seconds : seconds;
  timestamp.innerText = `${minutes}:${seconds}`;
};
const setProgress = () => {
  video.currentTime = (video.duration * +progress.value) / 100;
};
const stopVideo = () => {
  video.currentTime = 0;
  video.pause();
};

// event listeners
video.addEventListener("click", toggerPlayStatus);
video.addEventListener("play", updatePlayIcon);
video.addEventListener("pause", updatePlayIcon);
video.addEventListener("timeupdate", timeUpdate);

playBtn.addEventListener("click", toggerPlayStatus);
stopBtn.addEventListener("click", stopVideo);

progress.addEventListener("change", setProgress);
