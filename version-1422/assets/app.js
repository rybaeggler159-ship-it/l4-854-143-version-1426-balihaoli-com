import { H as Hls } from './hls-vendor-dru42stk.js';

function ready(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-mobile-nav]');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
}

function initHero() {
  const root = document.querySelector('[data-hero]');

  if (!root) {
    return;
  }

  const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
  const previousButton = root.querySelector('[data-hero-prev]');
  const nextButton = root.querySelector('[data-hero-next]');
  let current = 0;
  let timer = null;

  function show(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  function start() {
    stop();
    timer = window.setInterval(() => show(current + 1), 5200);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      show(index);
      start();
    });
  });

  if (previousButton) {
    previousButton.addEventListener('click', () => {
      show(current - 1);
      start();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      show(current + 1);
      start();
    });
  }

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  show(0);
  start();
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function filterCards(input) {
  const scope = input.closest('main') || document;
  const cards = Array.from(scope.querySelectorAll('[data-filter-card]'));
  const empty = scope.querySelector('[data-filter-empty]');
  const query = normalize(input.value);
  let visibleCount = 0;

  cards.forEach((card) => {
    const text = normalize(card.dataset.searchText || card.textContent);
    const isVisible = !query || text.includes(query);
    card.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (empty) {
    empty.hidden = visibleCount !== 0;
  }
}

function initFilters() {
  const inputs = Array.from(document.querySelectorAll('[data-filter-input]'));
  const parameters = new URLSearchParams(window.location.search);
  const q = parameters.get('q') || '';

  inputs.forEach((input) => {
    if (input.hasAttribute('data-search-page-input')) {
      input.value = q;
    }

    input.addEventListener('input', () => filterCards(input));
    filterCards(input);
  });
}

function attachNativeHls(video, source) {
  video.src = source;
  video.addEventListener('loadedmetadata', () => {
    video.play().catch(() => undefined);
  }, { once: true });
}

function attachHls(video, source) {
  if (Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => undefined);
    });
    hls.on(Hls.Events.ERROR, (event, data) => {
      if (!data || !data.fatal) {
        return;
      }

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
      } else {
        hls.destroy();
      }
    });

    video._hls = hls;
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    attachNativeHls(video, source);
  } else {
    video.src = source;
  }
}

function initPlayers() {
  const players = Array.from(document.querySelectorAll('[data-player]'));

  players.forEach((player) => {
    const video = player.querySelector('video');
    const overlay = player.querySelector('[data-play-button]');
    const source = player.dataset.videoSrc;

    if (!video || !overlay || !source) {
      return;
    }

    overlay.addEventListener('click', () => {
      overlay.classList.add('is-hidden');

      if (!video.dataset.ready) {
        attachHls(video, source);
        video.dataset.ready = 'true';
      } else {
        video.play().catch(() => undefined);
      }
    });
  });
}

ready(() => {
  initMobileMenu();
  initHero();
  initFilters();
  initPlayers();
});
