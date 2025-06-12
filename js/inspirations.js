document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.inspirations-grid');
    const modal = document.querySelector('.inspiration-modal');
    const filtersContainer = document.querySelector('.inspirations-filters');
    let allInspirations = [];

    const fetchInspirations = async () => {
        try {
            const response = await fetch('/api/inspirations');
            allInspirations = await response.json();
            renderInspirations(allInspirations);
            populateFilters(allInspirations);
        } catch (error) {
            console.error('Failed to load inspirations:', error);
            grid.innerHTML = '<p>Could not load inspirations. Please try again later.</p>';
        }
    };

    const renderInspirations = (inspirations) => {
        grid.innerHTML = '';
        inspirations.forEach(inspiration => {
            const item = document.createElement('div');
            item.className = 'inspiration-item';
            item.dataset.id = inspiration.id;
            item.innerHTML = `
                <img src="${inspiration.image}" alt="${inspiration.title}" class="inspiration-image">
                <div class="inspiration-overlay">
                    <h3 class="inspiration-title">${inspiration.title}</h3>
                    <div class="inspiration-tags">
                        ${inspiration.tags.map(tag => `<span class="inspiration-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            grid.appendChild(item);
        });
    };

    const populateFilters = (inspirations) => {
        const allTags = new Set(inspirations.flatMap(i => i.tags));
        filtersContainer.innerHTML = '<button class="filter-button active" data-filter="all">Tous</button>';
        allTags.forEach(tag => {
            const button = document.createElement('button');
            button.className = 'filter-button';
            button.dataset.filter = tag;
            button.textContent = tag;
            filtersContainer.appendChild(button);
        });
    };

    filtersContainer.addEventListener('click', (e) => {
        if (e.target.matches('.filter-button')) {
            document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            const filteredInspirations = filter === 'all' ? allInspirations : allInspirations.filter(i => i.tags.includes(filter));
            renderInspirations(filteredInspirations);
        }
    });

    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.inspiration-item');
        if (item) {
            const id = parseInt(item.dataset.id, 10);
            const inspiration = allInspirations.find(i => i.id === id);
            if (inspiration) openModal(inspiration);
        }
    });

    const openModal = (inspiration) => {
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <img src="${inspiration.image}" alt="${inspiration.title}" class="modal-image">
                <div class="modal-details">
                    <h2 class="modal-title">${inspiration.title}</h2>
                    <p class="modal-description">${inspiration.description}</p>
                    <div class="modal-info">
                         <div class="info-item">
                            <span class="info-title">Tags</span>
                            <p>${inspiration.tags.join(', ')}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    modal.addEventListener('click', (e) => {
        if (e.target.matches('.modal-close') || e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    fetchInspirations();
});
