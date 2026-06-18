(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('is-missing');
      });
    });

    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = panel.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.textContent = open ? '×' : '☰';
      });
    }

    var filterRoot = document.querySelector('[data-filter-root]');
    if (filterRoot) {
      var search = filterRoot.querySelector('[data-filter-search]');
      var typeSelect = filterRoot.querySelector('[data-filter-type]');
      var yearSelect = filterRoot.querySelector('[data-filter-year]');
      var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('.movie-card'));
      var count = filterRoot.querySelector('[data-filter-count]');

      function applyFilters() {
        var query = search ? search.value.trim().toLowerCase() : '';
        var type = typeSelect ? typeSelect.value : '';
        var year = yearSelect ? yearSelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = (card.getAttribute('data-search') || '').toLowerCase();
          var cardType = card.getAttribute('data-type') || '';
          var cardYear = card.getAttribute('data-year') || '';
          var matchQuery = !query || haystack.indexOf(query) !== -1;
          var matchType = !type || cardType.indexOf(type) !== -1;
          var matchYear = !year || cardYear.indexOf(year) !== -1;
          var show = matchQuery && matchType && matchYear;
          card.classList.toggle('is-hidden', !show);
          if (show) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = String(visible);
        }
      }

      [search, typeSelect, yearSelect].forEach(function (item) {
        if (item) {
          item.addEventListener('input', applyFilters);
          item.addEventListener('change', applyFilters);
        }
      });
      applyFilters();
    }
  });
})();
