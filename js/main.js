document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    
    // Only proceed if we have the required navigation elements
    if (navToggle && mainNav && navOverlay) {
        // Function to open the navigation
        function openNav() {
            navToggle.classList.add('active');
            mainNav.classList.add('active');
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        }
        
        // Function to close the navigation
        function closeNav() {
            navToggle.classList.remove('active');
            mainNav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        }
        
        // Toggle navigation when clicking the hamburger button
        navToggle.addEventListener('click', function() {
            if (mainNav.classList.contains('active')) {
                closeNav();
            } else {
                openNav();
            }
        });
        
        // Close navigation when clicking the overlay
        navOverlay.addEventListener('click', closeNav);
        
        // Close navigation when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                closeNav();
            }
        });
        
        // Handle any remaining mobile menu toggle (for backward compatibility)
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                openNav();
            });
        }
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Load product categories dynamically on the homepage
    const productCategoriesContainer = document.getElementById('product-categories-container');
    if (productCategoriesContainer) {
        fetch('/api/categories')
            .then(response => response.json())
            .then(categories => {
                categories.forEach(category => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'category';

                    const title = document.createElement('h2');
                    title.textContent = category.title;

                    const description = document.createElement('p');
                    description.textContent = category.description;

                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'category-actions';

                    const downloadLink = document.createElement('a');
                    downloadLink.href = '#';
                    downloadLink.className = 'btn';
                    downloadLink.textContent = 'TÉLÉCHARGER';

                    const emailLink = document.createElement('a');
                    emailLink.href = '#';
                    emailLink.className = 'btn';
                    emailLink.textContent = 'ENVOYER PAR MAIL';

                    actionsDiv.appendChild(downloadLink);
                    actionsDiv.appendChild(emailLink);

                    categoryDiv.appendChild(title);
                    categoryDiv.appendChild(description);
                    categoryDiv.appendChild(actionsDiv);

                    productCategoriesContainer.appendChild(categoryDiv);
                });
            })
            .catch(error => console.error('Error loading product categories:', error));
    }
});
