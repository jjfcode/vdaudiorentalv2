document.addEventListener('DOMContentLoaded', function () {
    const galleries = document.querySelectorAll('.product-sale-gallery');

    galleries.forEach(function (gallery) {
        const mainLink = gallery.querySelector('.product-image-wrapper');
        const mainImage = gallery.querySelector('.main-product-image');
        const thumbButtons = gallery.querySelectorAll('.thumb-btn');

        thumbButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const newImage = button.getAttribute('data-full');
                const newAlt = button.getAttribute('data-alt');

                if (mainImage) {
                    mainImage.src = newImage;
                    mainImage.alt = newAlt;
                }

                if (mainLink) {
                    mainLink.href = newImage;
                }

                thumbButtons.forEach(function (btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });

                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
            });
        });
    });

    // "Ask About This Item" modal
    const openBtn = document.querySelector('[data-open-item-modal]');
    const overlay = document.getElementById('item-modal-overlay');
    if (openBtn && overlay) {
        const closeBtn = overlay.querySelector('.item-modal-close');
        const loadedAtField = overlay.querySelector('#item-loaded-at');
        const firstField = overlay.querySelector('input[name="name"]');

        function openModal() {
            overlay.hidden = false;
            if (loadedAtField) {
                loadedAtField.value = Math.floor(Date.now() / 1000);
            }
            if (firstField) {
                firstField.focus();
            }
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            overlay.hidden = true;
            document.body.style.overflow = '';
        }

        openBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !overlay.hidden) {
                closeModal();
            }
        });

        // If the page reloaded after a submit (?asked=1/0/throttled), open
        // the modal automatically and show the result.
        const params = new URLSearchParams(window.location.search);
        const asked = params.get('asked');
        if (asked !== null) {
            const status = overlay.querySelector('.item-modal-status');
            if (status) {
                if (asked === '1') {
                    status.textContent = "Thanks! We'll get back to you shortly about this item.";
                    status.className = 'item-modal-status success';
                } else if (asked === 'throttled') {
                    status.textContent = "You've sent several requests recently. Please wait a bit before trying again.";
                    status.className = 'item-modal-status error';
                } else {
                    status.textContent = 'Something went wrong sending your request. Please try again or email us directly.';
                    status.className = 'item-modal-status error';
                }
                status.hidden = false;
            }
            openModal();

            params.delete('asked');
            const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + '#ask-about-item';
            window.history.replaceState({}, '', newUrl);
        }
    }
});