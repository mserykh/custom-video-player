/* Elements */
const player = document.querySelector(".video-player");
const video = player.querySelector(".viewer");
const controls = player.querySelector(".video-player__controls");
const progress = player.querySelector(".video-player__progress");
const progressBar = player.querySelector(".video-player__progress--filled");
const toggle = player.querySelector(".toggle");
const timeCodeCurrent = player.querySelector(
  ".video-player__time-code--current"
);
const timeCodeDuration = player.querySelector(
  ".video-player__time-code--duration"
);
const skipButtons = player.querySelectorAll("[data-skip]");
const volumeRange = player.querySelector(".video-player__slider--volume");
const volumeButton = player.querySelector(".video-player__btn--volume");
const volumePercentage = player.querySelector(
  ".video-player__volume-percentage"
);
const ranges = player.querySelectorAll(".video-player__slider");
const speedRate = player.querySelector(".video-player__speed-rate");
const speedRateButton = player.querySelector(".video-player__btn--speed");
const fullscreenButton = player.querySelector(".video-player__btn--fullscreen");

/* Flags and variables*/
let isPlaying = false;
let isMousedown = false;
let isVolumeOn = true;
let lastVolumeValue = ranges[0].value;

/* Functions */
function togglePlay() {
  if (video.paused) {
    video.play();
    updateButton();
    isPlaying = true;
  } else {
    video.pause();
    updateButton();
    isPlaying = false;
  }
}

function updateButton() {
  if (!isPlaying) {
    toggle.style.background = `url('assets/svg/play-small.svg')`;
  } else if (isPlaying) {
    toggle.style.background = `url('assets/svg/paused-small.svg')`;
  }
}

function handleProgress() {
  const duration = video.duration;
  const currentTime = video.currentTime;
  const percent = (currentTime / duration) * 100;
  progressBar.style.width = `${percent}%`;
  displayReadableTime(currentTime);

  if (currentTime === duration) {
    video.pause();
    updateButton();
    isPlaying = false;
  }
}

function skip() {
  if (this.dataset.skip === "25" && video.currentTime >= video.duration - 25) {
    video.currentTime += video.duration - video.currentTime - 0.02;
    handleProgress();
  } else {
    video.currentTime += parseFloat(this.dataset.skip);
  }
}

function handleRangeUpdate() {
  const value = this.value;
  video[this.name] = value;
  if (this.name === "volume") lastVolumeValue = value;
}

function handleRangeProgress() {
  const value = this.value;
  const max = this.max;
  const min = this.min;
  const percent = Math.floor(((value - min) / (max - min)) * 100);
  this.style.background = `linear-gradient(to right, #710707 0%, #710707 ${percent}%, #C4C4C4 ${percent}%)`;

  if (this.name === "volume") showVolumePercentage(percent);
  if (this.name === "playbackRate") showSpeedRate(value);
}

function showVolumePercentage(percent) {
  volumePercentage.innerText = `${percent}%`;
  toggleVolumeIcon(percent);
}

function showSpeedRate(value) {
  speedRate.innerText = `x${value}`;
}

function toggleVolume() {
  if (isVolumeOn) {
    volumeButton.classList.add("muted");
    video.muted = isVolumeOn;
    ranges[0].value = 0;
    ranges[0].style.background = `linear-gradient(to right, #710707 0%, #710707 ${ranges[0].value}%, #C4C4C4 ${ranges[0].value}%)`;
    showVolumePercentage(Math.floor(ranges[0].value * 100));
    isVolumeOn = false;
  } else if (!isVolumeOn) {
    volumeButton.classList.remove("muted");
    video.muted = isVolumeOn;
    video.volume = lastVolumeValue;
    ranges[0].value = lastVolumeValue;
    ranges[0].style.background = `linear-gradient(to right, #710707 0%, #710707 ${
      ranges[0].value * 100
    }%, #C4C4C4 ${ranges[0].value * 100}%)`;
    showVolumePercentage(Math.floor(ranges[0].value * 100));
    isVolumeOn = true;
  }
}

function toggleVolumeIcon(percent) {
  if ((percent < 51) & (percent !== 0)) {
    volumeButton.classList.remove("muted");
    volumeButton.classList.remove("volume-high");
    volumeButton.classList.add("volume-low");
    isVolumeOn = true;
    video.muted = !isVolumeOn;
  } else if (percent >= 51) {
    volumeButton.classList.remove("muted");
    volumeButton.classList.remove("volume-low");
    volumeButton.classList.add("volume-high");
    isVolumeOn = true;
    video.muted = !isVolumeOn;
  } else if (percent === 0) {
    volumeButton.classList.add("muted");
    isVolumeOn = false;
    video.muted = !isVolumeOn;
  }
}

function backToNormalSpeedRate() {
  video.playbackRate = 1;
  ranges[1].value = +video.playbackRate;
  showSpeedRate(+video.playbackRate);
  ranges[1].style.background = `linear-gradient(to right, #710707 0%, #710707 ${
    ((video.playbackRate - 0.5) / 1.5) * 100
  }%, #C4C4C4 ${((video.playbackRate - 0.5) / 1.5) * 100}%)`;
}

function displayReadableTime(currentTime) {
  const hours = Math.floor(currentTime / 3600);
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  timeCodeCurrent.innerHTML = `${formatNumber(hours)}:${formatNumber(
    minutes
  )}:${formatNumber(seconds)}`;
}

function formatNumber(number) {
  return number < 10 ? `0${number}` : number;
}

function getDuration() {
  const duration = video.duration;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  timeCodeDuration.innerHTML = `${formatNumber(hours)}:${formatNumber(
    minutes
  )}:${formatNumber(seconds)}`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    fullscreenButton.style.background = `url('assets/svg/flscreen.svg')`;
  } else if (document.webkitFullscrrenElement) {
    document.webkitExitFullscreen();
    fullscreenButton.style.background = `url('assets/svg/flscreen.svg')`;
  } else if (player.fullscreenElement) {
    player.webkitExitFullscreen();
    fullscreenButton.style.background = `url('assets/svg/flscreen.svg')`;
  } else {
    player.requestFullscreen();
    fullscreenButton.style.background = `url('assets/svg/exit-flscreen.svg')`;
  }
}

function onKeyElementClick(e) {
  e.preventDefault();

  if (e.code === "Space" || e.code === "KeyK") {
    togglePlay();
  }

  if (e.code === "KeyJ") {
    video.currentTime -= 10;
    if (video.paused) {
      togglePlay();
    }
  }

  if (e.code === "KeyL") {
    skip.call(skipButtons[1]);
  }

  if (e.code === "KeyM") {
    toggleVolume();
  }

  if (e.key === ">") {
    if (video.playbackRate >= 2) return;
    video.playbackRate += parseFloat(ranges[1].step);
    ranges[1].value = +video.playbackRate;
    showSpeedRate(+video.playbackRate);
    ranges[1].style.background = `linear-gradient(to right, #710707 0%, #710707 ${
      ((video.playbackRate - 0.5) / 1.5) * 100
    }%, #C4C4C4 ${((video.playbackRate - 0.5) / 1.5) * 100}%)`;
  }

  if (e.key === "<") {
    if (video.playbackRate <= 0.5) return;
    video.playbackRate -= parseFloat(ranges[1].step);
    ranges[1].value = +video.playbackRate;
    showSpeedRate(+video.playbackRate);
    ranges[1].style.background = `linear-gradient(to right, #710707 0%, #710707 ${
      ((video.playbackRate - 0.5) / 1.5) * 100
    }%, #C4C4C4 ${((video.playbackRate - 0.5) / 1.5) * 100}%)`;
  }

  if (e.code === "KeyR") {
    backToNormalSpeedRate();
  }

  if (e.code === "KeyF") {
    toggleFullscreen();
  }

  if (e.code === "Digit0" || e.code === "Numpad0") {
    video.currentTime = 0;
  }

  if (e.code === "Digit1" || e.code === "Numpad1") {
    video.currentTime = video.duration * 0.1;
  }

  if (e.code === "Digit2" || e.code === "Numpad2") {
    video.currentTime = video.duration * 0.2;
  }

  if (e.code === "Digit3" || e.code === "Numpad3") {
    video.currentTime = video.duration * 0.3;
  }

  if (e.code === "Digit4" || e.code === "Numpad4") {
    video.currentTime = video.duration * 0.4;
  }

  if (e.code === "Digit5" || e.code === "Numpad5") {
    video.currentTime = video.duration * 0.5;
  }

  if (e.code === "Digit6" || e.code === "Numpad6") {
    video.currentTime = video.duration * 0.6;
  }

  if (e.code === "Digit7" || e.code === "Numpad7") {
    video.currentTime = video.duration * 0.7;
  }

  if (e.code === "Digit8" || e.code === "Numpad8") {
    video.currentTime = video.duration * 0.8;
  }

  if (e.code === "Digit9" || e.code === "Numpad9") {
    video.currentTime = video.duration * 0.9;
  }
}

/* Event listeners */
document.addEventListener("keydown", onKeyElementClick);

video.addEventListener("timeupdate", handleProgress);
video.addEventListener("click", togglePlay);
video.addEventListener("loadeddata", getDuration);

toggle.addEventListener("click", togglePlay);

volumeButton.addEventListener("click", toggleVolume);

skipButtons.forEach((skipButton) => skipButton.addEventListener("click", skip));

speedRateButton.addEventListener("click", backToNormalSpeedRate);

ranges.forEach((range) => range.addEventListener("input", handleRangeProgress));
ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));
ranges.forEach((range) => range.addEventListener("click", handleRangeUpdate));
ranges.forEach((range) =>
  range.addEventListener("mousemove", () => isMousedown && handleRangeUpdate)
);

progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => isMousedown && scrub(e));
progress.addEventListener("mousedown", () => (isMousedown = true));
progress.addEventListener("mouseup", () => (isMousedown = false));

fullscreenButton.addEventListener("click", toggleFullscreen);
