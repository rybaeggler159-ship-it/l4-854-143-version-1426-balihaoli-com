(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    document.querySelectorAll('.player-shell').forEach(function (shell) {
      var video = shell.querySelector('video');
      var overlay = shell.querySelector('.player-overlay');
      var stream = video ? video.getAttribute('data-stream-url') : '';
      var started = false;
      var hls = null;

      function attachStream() {
        if (!video || !stream || started) {
          return;
        }
        started = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls();
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function startPlayback() {
        attachStream();
        shell.classList.add('is-playing');
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            shell.classList.remove('is-playing');
          });
        }
      }

      if (overlay) {
        overlay.addEventListener('click', startPlayback);
      }

      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            startPlayback();
          }
        });
        video.addEventListener('play', function () {
          shell.classList.add('is-playing');
        });
        video.addEventListener('pause', function () {
          if (video.currentTime === 0) {
            shell.classList.remove('is-playing');
          }
        });
        window.addEventListener('pagehide', function () {
          if (hls) {
            hls.destroy();
          }
        });
      }
    });
  });
})();
