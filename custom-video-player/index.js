/* Elements */
const player = document.querySelector('.video-player');
const video = player.querySelector('.viewer');
const controls = player.querySelector('.video-player__controls');
const progress = player.querySelector('.video-player__progress');
const progressBar = player.querySelector('.video-player__progress--filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.video-player__slider');
const fullscreenButton = player.querySelector('.video-player__btn--fullscreen');


/* Flags */
let mousTimer = null;
let isHidden = false;
let isMousedown = false;

/* Functions */
function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
  }
  else {
    video.pause();
  }
}

function updateButton() {
  toggle.style.setProperty('');
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  const value = this.value;
  video[this.name] = value;
}

function handleRangeProgress() {
  const value = this.value;
  const max = this.max;
  const min = this.min;
  const percent = Math.floor(((value - min) / (max - min)) * 100);
  this.style.background = `linear-gradient(to right, #710707 0%, #710707 ${percent}%, #C4C4C4 ${percent}%)`;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.width = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    hide();
  }
  else if (document.webkitFullscrrenElement) {
    document.webkitExitFullscreen();
    hide();
  }
  else if (player.fullscreenElement) {
    player.webkitExitFullscreen();
    hide();
  }
  else {
    player.requestFullscreen();
    hide();
  }
}

function hide() {
  mouseTimer = null;
  player.style.cursor = 'none';
  isHidden = true;
}

/* Event listeners */
// video.addEventListener('play', updateButton);
// video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
video.addEventListener('click', togglePlay);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));


ranges.forEach(range => range.addEventListener('input', handleRangeProgress));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('click', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', () => isMousedown && handleRangeUpdate));

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => isMousedown && scrub(e));
progress.addEventListener('mousedown', () => isMousedown = true);
progress.addEventListener('mouseup', () => isMousedown = false);

fullscreenButton.addEventListener('click', toggleFullscreen);

player.addEventListener('mousemove', function() {
  if (mouseTimer) {
    window.clearTimeout('mouseTimer');
  }
  if (isHidden) {
    player.style.cursor = 'default';
    isHidden = false;
  }
  mouseTimer = window.setTimeout(hide, 3000);
});
