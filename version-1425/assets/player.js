(function () {
    window.initMoviePlayer = function (config) {
        var video = document.getElementById(config.video);
        var cover = document.getElementById(config.cover);
        var loaded = false;
        var hls = null;

        if (!video || !cover || !config.source) {
            return;
        }

        function attachSource() {
            if (loaded) {
                return;
            }

            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = config.source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false,
                    backBufferLength: 90
                });
                hls.loadSource(config.source);
                hls.attachMedia(video);
            } else {
                video.src = config.source;
            }
        }

        function startPlay() {
            attachSource();
            cover.classList.add('is-hidden');
            video.setAttribute('controls', 'controls');
            video.play().catch(function () {});
        }

        cover.addEventListener('click', startPlay);
        video.addEventListener('click', function () {
            if (!loaded) {
                startPlay();
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
