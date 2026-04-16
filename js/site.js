'use strict';

(function ($) {
    var currentSlideIndex = 0;
    var localRsvpStorageKey = 'boda-rsvp-submissions';

    function setAlert(type, message) {
        var $alert = $('#rsvp-alert');

        $alert.removeClass('info success error is-visible');
        $alert.addClass(type + ' is-visible');
        $alert.html(message);
    }

    function updateHeaderOnScroll() {
        var scroll = $(window).scrollTop();

        if (scroll >= 20) {
            $('section.navigation').addClass('fixed');
            $('header').css({
                'border-bottom': 'none',
                'padding': '35px 0'
            });
            $('header .member-actions').css({
                'top': '26px'
            });
            $('header .navicon').css({
                'top': '34px'
            });
        } else {
            $('section.navigation').removeClass('fixed');
            $('header').css({
                'border-bottom': 'solid 1px rgba(255, 255, 255, 0.2)',
                'padding': '50px 0'
            });
            $('header .member-actions').css({
                'top': '41px'
            });
            $('header .navicon').css({
                'top': '48px'
            });
        }
    }

    function readLocalRsvps() {
        try {
            var saved = window.localStorage.getItem(localRsvpStorageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    }

    function saveLocalRsvp(payload) {
        var saved = readLocalRsvps();
        saved.push(payload);
        window.localStorage.setItem(localRsvpStorageKey, JSON.stringify(saved));
    }

    function serializeFormArray(formArray) {
        var payload = {
            submitted_at: new Date().toISOString()
        };

        formArray.forEach(function (entry) {
            payload[entry.name] = entry.value;
        });

        return payload;
    }

    function showSlide(index) {
        var slides = document.querySelectorAll('.carousel-slide');
        var dots = document.querySelectorAll('.dot');

        if (!slides.length || !dots.length) {
            return;
        }

        if (index >= slides.length) {
            currentSlideIndex = 0;
        } else if (index < 0) {
            currentSlideIndex = slides.length - 1;
        } else {
            currentSlideIndex = index;
        }

        Array.prototype.forEach.call(slides, function (slide) {
            slide.classList.remove('active');
        });
        Array.prototype.forEach.call(dots, function (dot) {
            dot.classList.remove('active');
        });

        slides[currentSlideIndex].classList.add('active');
        dots[currentSlideIndex].classList.add('active');
    }

    function setupPriegoGallery() {
        var $panel = $('#priego-gallery-panel');
        var $toggle = $('#toggle-priego-gallery');
        var $slides = $('.priego-slide');
        var $thumbs = $('.discover-priego-thumb');
        var $prev = $('#priego-prev');
        var $next = $('#priego-next');
        var priegoIndex = 0;

        function renderPriegoSlide(index) {
            priegoIndex = index;

            $slides.removeClass('is-active').eq(priegoIndex).addClass('is-active');
            $thumbs.removeClass('is-active').eq(priegoIndex).addClass('is-active');

            $prev.prop('disabled', priegoIndex === 0);
            $next.prop('disabled', priegoIndex === $slides.length - 1);
        }

        if (!$panel.length || !$toggle.length || !$slides.length) {
            return;
        }

        $toggle.on('click', function () {
            var isOpen = $panel.hasClass('is-open');

            $panel.toggleClass('is-open', !isOpen);
            $panel.prop('hidden', isOpen);
            $toggle.attr('aria-expanded', String(!isOpen));
            $toggle.text(isOpen ? 'Ver carrete de fotos' : 'Ocultar carrete');

            if (!isOpen) {
                renderPriegoSlide(priegoIndex);
            }
        });

        $prev.on('click', function () {
            if (priegoIndex > 0) {
                renderPriegoSlide(priegoIndex - 1);
            }
        });

        $next.on('click', function () {
            if (priegoIndex < $slides.length - 1) {
                renderPriegoSlide(priegoIndex + 1);
            }
        });

        $thumbs.on('click', function () {
            renderPriegoSlide(Number($(this).data('slide')));
        });

        renderPriegoSlide(0);
    }

    function setupLodgingGallery() {
        var $panel = $('#lodging-gallery-panel');
        var $toggle = $('#toggle-lodging-gallery');
        var $slides = $('.lodging-slide');
        var $thumbs = $('.discover-lodging-thumb');
        var $prev = $('#lodging-prev');
        var $next = $('#lodging-next');
        var lodgingIndex = 0;

        function renderLodgingSlide(index) {
            lodgingIndex = index;

            $slides.removeClass('is-active').eq(lodgingIndex).addClass('is-active');
            $thumbs.removeClass('is-active').eq(lodgingIndex).addClass('is-active');

            $prev.prop('disabled', lodgingIndex === 0);
            $next.prop('disabled', lodgingIndex === $slides.length - 1);
        }

        if (!$panel.length || !$toggle.length || !$slides.length) {
            return;
        }

        $toggle.on('click', function () {
            var isOpen = $panel.hasClass('is-open');

            $panel.toggleClass('is-open', !isOpen);
            $panel.prop('hidden', isOpen);
            $toggle.attr('aria-expanded', String(!isOpen));
            $toggle.text(isOpen ? 'Ver alojamientos' : 'Ocultar alojamientos');

            if (!isOpen) {
                renderLodgingSlide(lodgingIndex);
            }
        });

        $prev.on('click', function () {
            if (lodgingIndex > 0) {
                renderLodgingSlide(lodgingIndex - 1);
            }
        });

        $next.on('click', function () {
            if (lodgingIndex < $slides.length - 1) {
                renderLodgingSlide(lodgingIndex + 1);
            }
        });

        $thumbs.on('click', function () {
            renderLodgingSlide(Number($(this).data('slide')));
        });

        renderLodgingSlide(0);
    }

    window.carouselNext = function () {
        showSlide(currentSlideIndex + 1);
    };

    window.carouselPrev = function () {
        showSlide(currentSlideIndex - 1);
    };

    window.currentSlide = function (index) {
        showSlide(index);
    };

    $(function () {
        var $rsvpForm = $('#rsvp-form');
        var endpoint = ($rsvpForm.data('endpoint') || '').toString().trim();
        var successMessage = ($rsvpForm.data('success-message') || 'Gracias. Hemos recibido tu confirmacion.').toString();

        $('.nav-toggle').on('click', function (event) {
            event.preventDefault();
            $(this).toggleClass('active');
            $('.header-nav').toggleClass('open');
        });

        $('.header-nav a').on('click', function () {
            $('.nav-toggle').removeClass('active');
            $('.header-nav').removeClass('open');
        });

        $(window).on('scroll', updateHeaderOnScroll);
        updateHeaderOnScroll();

        $('a[href*="#"]:not([href="#"])').on('click', function () {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top - 90
                    }, 900);

                    return false;
                }
            }
        });

        $rsvpForm.on('submit', function (event) {
            var formData;

            event.preventDefault();
            formData = $(this).serializeArray();

            if (!endpoint) {
                saveLocalRsvp(serializeFormArray(formData));
                setAlert('success', 'Hemos guardado tu confirmacion en este navegador para no perderla. Mas adelante podremos activar el envio automatico del formulario.');
                this.reset();
                return;
            }

            setAlert('info', 'Enviando tu confirmacion...');

            $.ajax({
                url: endpoint,
                method: 'POST',
                data: $.param(formData),
                dataType: 'json'
            }).done(function () {
                setAlert('success', successMessage);
                $rsvpForm[0].reset();
            }).fail(function () {
                setAlert('error', 'No hemos podido enviar tu confirmacion. Intentalo de nuevo en unos minutos.');
            });
        });

        var fallbackImg = document.querySelector('.carousel-slide img[src^="data:image/jpeg;base64"]');
        if (fallbackImg) {
            fallbackImg.src = 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Priego_de_C%C3%B3rdoba_desde_el_Balc%C3%B3n_del_Adarve.jpg';
        }
        showSlide(0);
        setupPriegoGallery();
        setupLodgingGallery();
    });
})(window.jQuery);
