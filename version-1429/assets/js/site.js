(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var carousel = document.querySelector('[data-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            current = index % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            if (slides.length < 2) {
                return;
            }
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                showSlide(Number(dot.dataset.slide || 0));
                start();
            });
        });

        start();
    }

    var searchInput = document.querySelector('.site-search');
    var selects = Array.prototype.slice.call(document.querySelectorAll('.filter-select'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

    function normalize(value) {
        return String(value || '').toLowerCase();
    }

    function applyFilters() {
        var query = normalize(searchInput ? searchInput.value : '');
        var year = '';
        var type = '';

        selects.forEach(function (select) {
            if (select.dataset.filter === 'year') {
                year = select.value;
            }
            if (select.dataset.filter === 'type') {
                type = select.value;
            }
        });

        cards.forEach(function (card) {
            var haystack = normalize([
                card.dataset.title,
                card.dataset.year,
                card.dataset.type,
                card.dataset.tags,
                card.textContent
            ].join(' '));
            var matchQuery = !query || haystack.indexOf(query) !== -1;
            var matchYear = !year || card.dataset.year === year;
            var matchType = !type || card.dataset.type === type;
            card.classList.toggle('is-hidden', !(matchQuery && matchYear && matchType));
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    selects.forEach(function (select) {
        select.addEventListener('change', applyFilters);
    });
})();
