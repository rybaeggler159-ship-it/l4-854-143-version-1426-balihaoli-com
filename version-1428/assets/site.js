(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var currentSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === currentSlide);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var index = Number(dot.getAttribute('data-hero-dot')) || 0;
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 6200);
  }

  var searchInput = document.querySelector('[data-card-search]');
  var cardContainer = document.querySelector('[data-card-container]');

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  if (searchInput && cardContainer) {
    var parameters = new URLSearchParams(window.location.search);
    var initialQuery = parameters.get('q');

    if (initialQuery) {
      searchInput.value = initialQuery;
    }

    var cards = Array.prototype.slice.call(cardContainer.querySelectorAll('[data-movie-card]'));

    function applySearch() {
      var query = normalize(searchInput.value);

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.textContent
        ].join(' '));

        card.style.display = !query || haystack.indexOf(query) !== -1 ? '' : 'none';
      });
    }

    searchInput.addEventListener('input', applySearch);
    applySearch();
  }

  function setupPlayer(player) {
    var video = player.querySelector('video');
    var layer = player.querySelector('.player-layer');
    var streamUrl = player.getAttribute('data-stream-url');
    var hlsInstance = null;
    var ready = false;

    if (!video || !streamUrl) {
      return;
    }

    function attachStream() {
      if (ready) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function playVideo() {
      attachStream();
      video.setAttribute('controls', 'controls');

      if (layer) {
        layer.classList.add('is-hidden');
      }

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (layer) {
            layer.classList.remove('is-hidden');
          }
        });
      }
    }

    if (layer) {
      layer.addEventListener('click', function (event) {
        event.preventDefault();
        playVideo();
      });
    }

    video.addEventListener('click', function () {
      if (!ready || video.paused) {
        playVideo();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('.movie-player')).forEach(setupPlayer);
})();
