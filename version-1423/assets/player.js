(function () {
  window.startPlayer = function (options) {
    const video = document.getElementById(options.videoId);
    const button = document.getElementById(options.buttonId);
    const Hls = window.Hls;
    let loaded = false;
    let hls = null;

    if (!video || !options.url) {
      return;
    }

    const load = function () {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = options.url;
      } else if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(options.url);
        hls.attachMedia(video);
      } else {
        video.src = options.url;
      }
    };

    const play = function () {
      load();

      if (button) {
        button.classList.add('is-hidden');
      }

      const promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    };

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (!loaded || video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  };
}());
