/*
  =========================================
  GRADUATION PROJECT SHOWCASE - LOGIC
  Interactivity & Custom Player Implementation
  =========================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const video = document.getElementById('projectVideo');
  const videoWrapper = document.getElementById('videoWrapper');
  const playBtn = document.getElementById('playBtn');
  const bigPlayBtn = document.getElementById('bigPlayBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const muteBtn = document.getElementById('muteBtn');
  const volumeIcon = document.getElementById('volumeIcon');
  const muteIcon = document.getElementById('muteIcon');
  const volumeSlider = document.getElementById('volumeSlider');
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationTimeEl = document.getElementById('durationTime');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const fullscreenIcon = document.getElementById('fullscreenIcon');
  const exitFullscreenIcon = document.getElementById('exitFullscreenIcon');
  const speedBtn = document.getElementById('speedBtn');
  const speedOptions = document.getElementById('speedOptions');

  // Video State Variables
  let lastVolume = 1;
  let isSpeedOptionsOpen = false;

  // Format Time (Seconds -> MM:SS)
  function formatTime(timeInSeconds) {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Update Play/Pause UI
  function updatePlayState() {
    if (video.paused) {
      videoWrapper.classList.add('paused');
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    } else {
      videoWrapper.classList.remove('paused');
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    }
  }

  // Play / Pause Toggle
  function togglePlay() {
    if (video.paused) {
      video.play().catch(e => console.log("Video playback interrupted:", e));
    } else {
      video.pause();
    }
    updatePlayState();
  }

  // Event Listeners for Play/Pause
  playBtn.addEventListener('click', togglePlay);
  bigPlayBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);
  video.addEventListener('play', updatePlayState);
  video.addEventListener('pause', updatePlayState);

  // Time & Progress Update
  video.addEventListener('timeupdate', () => {
    if (video.duration) {
      const percentage = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${percentage}%`;
      currentTimeEl.textContent = formatTime(video.currentTime);
    }
  });

  // Load Metadata (Duration)
  video.addEventListener('loadedmetadata', () => {
    durationTimeEl.textContent = formatTime(video.duration);
  });
  
  // Fallback for duration if loadedmetadata already fired
  if (video.readyState >= 1) {
    durationTimeEl.textContent = formatTime(video.duration);
  }

  // Progress scrubbing
  function scrubVideo(e) {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const boundedPos = Math.max(0, Math.min(1, pos));
    video.currentTime = boundedPos * video.duration;
  }

  let isScrubbing = false;
  progressContainer.addEventListener('mousedown', (e) => {
    isScrubbing = true;
    scrubVideo(e);
  });
  document.addEventListener('mousemove', (e) => {
    if (isScrubbing) scrubVideo(e);
  });
  document.addEventListener('mouseup', () => {
    isScrubbing = false;
  });
  progressContainer.addEventListener('click', scrubVideo);

  // Mute / Unmute
  function toggleMute() {
    if (video.muted) {
      video.muted = false;
      video.volume = lastVolume;
      volumeSlider.value = lastVolume;
      volumeIcon.style.display = 'block';
      muteIcon.style.display = 'none';
    } else {
      lastVolume = video.volume;
      video.muted = true;
      video.volume = 0;
      volumeSlider.value = 0;
      volumeIcon.style.display = 'none';
      muteIcon.style.display = 'block';
    }
  }

  muteBtn.addEventListener('click', toggleMute);

  // Volume Slider
  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    video.volume = val;
    if (val === 0) {
      video.muted = true;
      volumeIcon.style.display = 'none';
      muteIcon.style.display = 'block';
    } else {
      video.muted = false;
      lastVolume = val;
      volumeIcon.style.display = 'block';
      muteIcon.style.display = 'none';
    }
  });

  // Playback Speed Toggle
  speedBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isSpeedOptionsOpen = !isSpeedOptionsOpen;
    speedOptions.classList.toggle('active', isSpeedOptionsOpen);
  });

  // Select speed
  speedOptions.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', () => {
      const rate = parseFloat(option.getAttribute('data-speed'));
      video.playbackRate = rate;
      speedBtn.textContent = rate === 1 ? '1.0x' : `${rate}x`;
      
      // Update selected class
      speedOptions.querySelector('.selected').classList.remove('selected');
      option.classList.add('selected');
      
      isSpeedOptionsOpen = false;
      speedOptions.classList.remove('active');
    });
  });

  // Close speed dropdown when clicking elsewhere
  document.addEventListener('click', () => {
    if (isSpeedOptionsOpen) {
      isSpeedOptionsOpen = false;
      speedOptions.classList.remove('active');
    }
  });

  // Fullscreen Mode Toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement) {
      // Enter Fullscreen
      if (videoWrapper.requestFullscreen) {
        videoWrapper.requestFullscreen();
      } else if (videoWrapper.webkitRequestFullscreen) {
        videoWrapper.webkitRequestFullscreen();
      } else if (videoWrapper.mozRequestFullScreen) {
        videoWrapper.mozRequestFullScreen();
      } else if (videoWrapper.msRequestFullscreen) {
        videoWrapper.msRequestFullscreen();
      }
      fullscreenIcon.style.display = 'none';
      exitFullscreenIcon.style.display = 'block';
    } else {
      // Exit Fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      fullscreenIcon.style.display = 'block';
      exitFullscreenIcon.style.display = 'none';
    }
  }

  fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Monitor fullscreen change events (e.g. if exited via Escape key)
  const onFullscreenChange = () => {
    const isFullscreen = document.fullscreenElement ||
                         document.webkitFullscreenElement ||
                         document.mozFullScreenElement ||
                         document.msFullscreenElement;
    if (isFullscreen) {
      fullscreenIcon.style.display = 'none';
      exitFullscreenIcon.style.display = 'block';
    } else {
      fullscreenIcon.style.display = 'block';
      exitFullscreenIcon.style.display = 'none';
    }
  };

  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
  document.addEventListener('mozfullscreenchange', onFullscreenChange);
  document.addEventListener('MSFullscreenChange', onFullscreenChange);

  // Keyboard Shortcuts (Space for Play/Pause, M for Mute, F for Fullscreen)
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'f') {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key === 'm') {
      e.preventDefault();
      toggleMute();
    }
  });
});
