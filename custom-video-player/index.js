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
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.width = `${percent}%`;
}

/* Event listeners */
// video.addEventListener('play', updateButton);
// video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate))
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate))


