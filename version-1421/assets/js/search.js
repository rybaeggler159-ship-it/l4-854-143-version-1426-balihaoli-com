(function () {
  function createCard(movie) {
    var tags = (movie.tags || []).slice(0, 2).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a href="' + escapeAttr(movie.url) + '" class="poster-link" aria-label="观看' + escapeAttr(movie.title) + '">',
      '    <span class="poster-frame">',
      '      <img src="./' + escapeAttr(movie.cover) + '" alt="' + escapeAttr(movie.title) + '" loading="lazy" />',
      '      <span class="poster-gradient"></span>',
      '      <span class="region-badge">' + escapeHtml(movie.region) + '</span>',
      '      <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
      '      <span class="play-float">▶</span>',
      '      <span class="poster-info"><strong>' + escapeHtml(movie.title) + '</strong><em>' + escapeHtml(movie.genre) + '</em></span>',
      '    </span>',
      '  </a>',
      '  <div class="card-body">',
      '    <h2><a href="' + escapeAttr(movie.url) + '">' + escapeHtml(movie.title) + '</a></h2>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="card-meta"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.year) + '</span></div>',
      '    <div class="mini-tags">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, '&#39;');
  }

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var form = document.querySelector('[data-search-page-form]');
    var input = document.querySelector('[data-search-page-input]');
    var result = document.querySelector('[data-search-results]');
    var count = document.querySelector('[data-search-count]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    if (input) {
      input.value = initial;
    }

    function render() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var movies = window.SITE_MOVIES || [];
      var matched = movies.filter(function (movie) {
        if (!query) {
          return true;
        }
        var haystack = [
          movie.title,
          movie.year,
          movie.type,
          movie.region,
          movie.genre,
          movie.oneLine,
          (movie.tags || []).join(' ')
        ].join(' ').toLowerCase();
        return haystack.indexOf(query) !== -1;
      }).slice(0, 240);

      if (count) {
        count.textContent = String(matched.length);
      }

      if (!result) {
        return;
      }

      if (!matched.length) {
        result.innerHTML = '<div class="empty-state">未找到相关影片</div>';
        return;
      }

      result.innerHTML = matched.map(createCard).join('');
      result.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function () {
          img.classList.add('is-missing');
        });
      });
    }

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var q = input ? input.value.trim() : '';
        var url = q ? 'search.html?q=' + encodeURIComponent(q) : 'search.html';
        history.replaceState(null, '', url);
        render();
      });
    }

    if (input) {
      input.addEventListener('input', render);
    }
    render();
  });
})();
