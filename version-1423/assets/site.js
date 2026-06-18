(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let index = 0;

    const show = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const nextIndex = Number(dot.getAttribute('data-hero-dot'));
        show(nextIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  }

  const filterInput = document.querySelector('[data-page-filter]');
  const yearFilter = document.querySelector('[data-year-filter]');
  const categoryFilter = document.querySelector('[data-category-filter]');
  const list = document.querySelector('[data-filter-list]');
  const empty = document.querySelector('[data-empty-state]');

  if (filterInput && list) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';

    if (query) {
      filterInput.value = query;
    }

    const cards = Array.from(list.querySelectorAll('.movie-card'));

    const applyFilter = function () {
      const keyword = filterInput.value.trim().toLowerCase();
      const year = yearFilter ? yearFilter.value : '';
      const category = categoryFilter ? categoryFilter.value : '';
      let visible = 0;

      cards.forEach(function (card) {
        const searchText = (card.getAttribute('data-search') || '').toLowerCase();
        const cardYear = card.getAttribute('data-year') || '';
        const cardCategory = card.getAttribute('data-category') || '';
        const matchedKeyword = !keyword || searchText.includes(keyword);
        const matchedYear = !year || cardYear === year;
        const matchedCategory = !category || cardCategory === category;
        const matched = matchedKeyword && matchedYear && matchedCategory;

        card.hidden = !matched;

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };

    filterInput.addEventListener('input', applyFilter);

    if (yearFilter) {
      yearFilter.addEventListener('change', applyFilter);
    }

    if (categoryFilter) {
      categoryFilter.addEventListener('change', applyFilter);
    }

    applyFilter();
  }
}());
