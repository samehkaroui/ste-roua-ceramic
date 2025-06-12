document.addEventListener('DOMContentLoaded', function() {
    const catalogueGrid = document.querySelector('.catalogue-grid');

    async function loadCategories() {
        try {
            const response = await fetch('/api/product-categories');
            const categories = await response.json();
            
            if (catalogueGrid) {
                catalogueGrid.innerHTML = ''; // Clear existing static content
                categories.forEach(category => {
                    const item = document.createElement('div');
                    item.className = 'catalogue-item';
                    item.setAttribute('data-category', 'general'); // You can customize this later

                    item.innerHTML = `
                        <div class="catalogue-image">
                            <img src="/assets/images/catalogue-placeholder.jpg" alt="${category.title}">
                        </div>
                        <div class="catalogue-overlay">
                            <h3 class="catalogue-title">${category.title}</h3>
                        </div>
                        <div class="catalogue-details">
                            <p class="catalogue-description">${category.description}</p>
                            <div class="catalogue-actions">
                                <a href="#" class="download-btn"><i class="fas fa-download"></i> Télécharger</a>
                                <a href="#" class="view-btn"><i class="far fa-eye"></i> Consulter</a>
                            </div>
                        </div>
                    `;
                    catalogueGrid.appendChild(item);
                });
            }
        } catch (error) {
            console.error('Erreur lors du chargement des catalogues:', error);
            if (catalogueGrid) {
                catalogueGrid.innerHTML = '<p>Impossible de charger les catalogues pour le moment. Veuillez réessayer plus tard.</p>';
            }
        }
    }

    loadCategories();

    // Note: The original filter and form submission logic can be integrated here if needed.
    // For now, this script focuses on dynamically loading the categories.
});
