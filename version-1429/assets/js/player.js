(function () {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));

    shells.forEach(function (shell) {
        var video = shell.querySelector('.movie-player');
        var start = shell.querySelector('.player-start');
        var src = shell.dataset.src;
        var hls = null;
        var attached = false;

        function attachMedia() {
            if (attached || !video || !src) {
                return;
            }

            attached = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false,
                    backBufferLength: 90
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal && hls) {
                        hls.destroy();
                        hls = null;
                        attached = false;
                    }
                });
                return;
            }

            video.src = src;
        }

        function play() {
            attachMedia();
            shell.classList.add('is-playing');
            video.play().catch(function () {});
        }

        if (start && video) {
            start.addEventListener('click', play);
            video.addEventListener('play', function () {
                shell.classList.add('is-playing');
            });
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
