/* Elements */
const player = document.querySelector('.video-player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.video-player__progress');
const progressBar = player.querySelector('.video-player__progress--filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.video-player__slider');

/* Functions */
function togglePlay() {
  if (video.paused) {
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

/* Event listeners */
// video.addEventListener('play', updateButton);
// video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));

let isMousedown = false;
ranges.forEach(range => range.addEventListener('input', handleRangeProgress));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate))
ranges.forEach(range => range.addEventListener('click', handleRangeUpdate))
ranges.forEach(range => range.addEventListener('mousemove', () => isMousedown && handleRangeUpdate));

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => isMousedown && scrub(e));
progress.addEventListener('mousedown', () => isMousedown = true);
progress.addEventListener('mouseup', () => isMousedown = false);
