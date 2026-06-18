(function () {
  var button = document.querySelector('[data-menu-button]');
  var panel = document.querySelector('[data-mobile-panel]');
  if (button && panel) {
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-hero-tab]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    tabs.forEach(function (tab, i) {
      tab.classList.toggle('is-active', i === current);
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterYear = document.querySelector('[data-filter-year]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

  function filterCards() {
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var year = filterYear ? filterYear.value : '';
    cards.forEach(function (card) {
      var title = (card.getAttribute('data-title') || '').toLowerCase();
      var cardYear = card.getAttribute('data-year') || '';
      var matchedKeyword = !keyword || title.indexOf(keyword) > -1;
      var matchedYear = !year || cardYear.indexOf(year) > -1;
      card.style.display = matchedKeyword && matchedYear ? '' : 'none';
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', filterCards);
  }
  if (filterYear) {
    filterYear.addEventListener('change', filterCards);
  }

  var searchForm = document.querySelector('[data-search-form]');
  var searchInput = document.querySelector('[data-search-input]');
  var searchResults = document.querySelector('[data-search-results]');

  function renderSearch(query) {
    if (!searchResults || !window.SEARCH_INDEX) {
      return;
    }
    var keyword = (query || '').trim().toLowerCase();
    var pool = keyword
      ? window.SEARCH_INDEX.filter(function (item) {
          return item.text.toLowerCase().indexOf(keyword) > -1;
        })
      : window.SEARCH_INDEX.slice(0, 24);
    var html = pool.slice(0, 80).map(function (item) {
      return '<article class="result-item">' +
        '<a href="' + item.url + '"><img src="' + item.image + '" alt="' + escapeHtml(item.title) + '"></a>' +
        '<div><span class="badge">' + escapeHtml(item.year) + '</span>' +
        '<h2><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h2>' +
        '<p>' + escapeHtml(item.desc) + '</p></div>' +
        '</article>';
    }).join('');
    searchResults.innerHTML = html || '<p class="section-desc">没有找到匹配内容。</p>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  if (searchForm && searchInput && searchResults) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    searchInput.value = initial;
    renderSearch(initial);
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      renderSearch(searchInput.value);
      var next = new URL(window.location.href);
      if (searchInput.value.trim()) {
        next.searchParams.set('q', searchInput.value.trim());
      } else {
        next.searchParams.delete('q');
      }
      history.replaceState(null, '', next.toString());
    });
    searchInput.addEventListener('input', function () {
      renderSearch(searchInput.value);
    });
  }
})();
