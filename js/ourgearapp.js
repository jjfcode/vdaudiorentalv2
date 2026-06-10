document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-chip');
    const gearCards = document.querySelectorAll('.gear-card');

    if (!filterButtons.length || !gearCards.length) return;

    filterButtons.forEach((button) => {
        const isActive = button.classList.contains('active');
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');

        button.addEventListener('click', function () {
            const selectedFilter = this.getAttribute('data-filter');

            filterButtons.forEach((btn) => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });

            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');

            gearCards.forEach((card) => {
                const category = card.getAttribute('data-category');

                if (selectedFilter === 'all' || category === selectedFilter) {
                    card.hidden = false;
                    card.setAttribute('aria-hidden', 'false');
                } else {
                    card.hidden = true;
                    card.setAttribute('aria-hidden', 'true');
                }
            });
        });
    });
});