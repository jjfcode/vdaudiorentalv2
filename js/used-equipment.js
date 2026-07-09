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
});