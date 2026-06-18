(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    var slider = document.querySelector('[data-hero-slider]');

    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    var filterInput = document.querySelector('[data-filter-input]');
    var filterType = document.querySelector('[data-filter-type]');
    var filterRegion = document.querySelector('[data-filter-region]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

    if (filterInput && cards.length) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query) {
            filterInput.value = query;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilters() {
            var keyword = normalize(filterInput.value);
            var type = normalize(filterType ? filterType.value : '');
            var region = normalize(filterRegion ? filterRegion.value : '');

            cards.forEach(function (card) {
                var terms = normalize(card.getAttribute('data-terms'));
                var cardType = normalize(card.getAttribute('data-type'));
                var cardRegion = normalize(card.getAttribute('data-region'));
                var ok = true;

                if (keyword && terms.indexOf(keyword) === -1) {
                    ok = false;
                }

                if (type && cardType.indexOf(type) === -1 && terms.indexOf(type) === -1) {
                    ok = false;
                }

                if (region && cardRegion.indexOf(region) === -1) {
                    ok = false;
                }

                card.hidden = !ok;
            });
        }

        filterInput.addEventListener('input', applyFilters);

        if (filterType) {
            filterType.addEventListener('change', applyFilters);
        }

        if (filterRegion) {
            filterRegion.addEventListener('change', applyFilters);
        }

        applyFilters();
    }
})();
