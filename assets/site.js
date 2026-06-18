(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function initHero() {
    var hero = document.querySelector(".hero-carousel");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector(".hero-prev");
    var next = hero.querySelector(".hero-next");
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        restart();
      });
    }

    restart();
  }

  function initSearch() {
    var forms = Array.prototype.slice.call(document.querySelectorAll(".site-search-form"));
    var movies = window.SITE_MOVIES || [];
    forms.forEach(function (form) {
      var input = form.querySelector("input[type='search']");
      var panel = form.querySelector(".search-panel");
      if (!input || !panel) {
        return;
      }

      function render() {
        var value = input.value.trim().toLowerCase();
        if (!value) {
          panel.classList.remove("is-open");
          panel.innerHTML = "";
          return;
        }
        var results = movies.filter(function (movie) {
          var text = [movie.title, movie.type, movie.region, movie.year, movie.genre, movie.tags, movie.oneLine, movie.category].join(" ").toLowerCase();
          return text.indexOf(value) !== -1;
        }).slice(0, 12);
        if (!results.length) {
          panel.innerHTML = '<div class="search-result"><div></div><div><h3>没有找到匹配内容</h3><p>换个关键词再试试</p></div></div>';
          panel.classList.add("is-open");
          return;
        }
        panel.innerHTML = results.map(function (movie) {
          return [
            '<a class="search-result" href="' + movie.url + '">',
            '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '">',
            '<div><h3>' + escapeHtml(movie.title) + '</h3><p>' + escapeHtml(movie.oneLine || movie.genre) + '</p></div>',
            '</a>'
          ].join("");
        }).join("");
        panel.classList.add("is-open");
      }

      input.addEventListener("input", render);
      input.addEventListener("focus", render);
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        render();
      });
      document.addEventListener("click", function (event) {
        if (!form.contains(event.target)) {
          panel.classList.remove("is-open");
        }
      });
    });
  }

  function initFilters() {
    var listings = Array.prototype.slice.call(document.querySelectorAll(".category-listing"));
    listings.forEach(function (listing) {
      var keyword = listing.querySelector(".filter-keyword");
      var type = listing.querySelector(".filter-type");
      var year = listing.querySelector(".filter-year");
      var cards = Array.prototype.slice.call(listing.querySelectorAll(".movie-card"));
      var empty = listing.querySelector(".empty-state");
      if (!cards.length) {
        return;
      }

      function applyFilters() {
        var keyValue = keyword ? keyword.value.trim().toLowerCase() : "";
        var typeValue = type ? type.value : "";
        var yearValue = year ? year.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var cardType = card.getAttribute("data-type") || "";
          var cardYear = card.getAttribute("data-year") || "";
          var matched = true;
          if (keyValue && text.indexOf(keyValue) === -1) {
            matched = false;
          }
          if (typeValue && cardType !== typeValue) {
            matched = false;
          }
          if (yearValue && cardYear !== yearValue) {
            matched = false;
          }
          card.classList.toggle("is-hidden", !matched);
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      [keyword, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilters);
          control.addEventListener("change", applyFilters);
        }
      });
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  window.initMoviePlayer = function (playerId, sourceUrl) {
    var wrapper = document.getElementById(playerId);
    if (!wrapper) {
      return;
    }
    var video = wrapper.querySelector("video");
    var cover = wrapper.querySelector(".player-cover");
    if (!video || !cover || !sourceUrl) {
      return;
    }
    var attached = false;
    var hls = null;

    function attachSource() {
      if (attached) {
        return;
      }
      attached = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
      } else {
        video.src = sourceUrl;
      }
    }

    function playVideo(event) {
      if (event) {
        event.preventDefault();
      }
      attachSource();
      video.controls = true;
      cover.classList.add("is-hidden");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          cover.classList.remove("is-hidden");
        });
      }
    }

    cover.addEventListener("click", playVideo);
    video.addEventListener("click", function (event) {
      if (video.paused) {
        playVideo(event);
      }
    });
    video.addEventListener("play", function () {
      cover.classList.add("is-hidden");
    });
    video.addEventListener("ended", function () {
      cover.classList.remove("is-hidden");
    });
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  ready(function () {
    initNavigation();
    initHero();
    initSearch();
    initFilters();
  });
})();
