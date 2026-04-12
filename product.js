// Modern Product Carousel for Soap Studio
class ProductCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.autoSlideInterval = null;
        this.autoSlideDelay = 5000; // 5 seconds
        this.isAutoSliding = true;
        
        this.init();
    }

    init() {
        this.setupCarousel();
        this.setupNavigation();
        this.setupCategories();
        this.setupTouchEvents();
        this.setupWishlist();
        this.setupProductCards();
        this.startAutoSlide();
    }

    setupCarousel() {
        const track = document.querySelector('.product-carousel-track');
        const slides = document.querySelectorAll('.product-carousel-slide');
        
        if (!track || !slides.length) return;
        
        this.totalSlides = Math.ceil(slides.length / 2); // 2 products per slide
        this.createPagination();
        this.updateCarousel();
    }

    setupNavigation() {
        // Create navigation arrows
        const container = document.querySelector('.product-carousel-wrapper');
        if (!container) return;

        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-nav carousel-nav--prev';
        prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => this.prevSlide());

        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-nav carousel-nav--next';
        nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => this.nextSlide());

        container.appendChild(prevBtn);
        container.appendChild(nextBtn);
    }

    createPagination() {
        const container = document.querySelector('.product-carousel-container');
        if (!container) return;

        const pagination = document.createElement('div');
        pagination.className = 'carousel-pagination';

        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `pagination-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            pagination.appendChild(dot);
        }

        container.appendChild(pagination);
    }

    setupCategories() {
        // Create category slider
        const showcase = document.querySelector('.product-showcase');
        if (!showcase) return;

        const categorySlider = document.createElement('div');
        categorySlider.className = 'category-slider';
        categorySlider.innerHTML = `
            <div class="category-tabs">
                <button class="category-tab active" data-category="all">All Products</button>
                <button class="category-tab" data-category="floral">Floral</button>
                <button class="category-tab" data-category="herbal">Herbal</button>
                <button class="category-tab" data-category="citrus">Citrus</button>
                <button class="category-tab" data-category="luxury">Luxury</button>
                <button class="category-tab" data-category="organic">Organic</button>
            </div>
        `;

        const container = showcase.querySelector('.product-carousel-container');
        container.insertBefore(categorySlider, container.firstChild);

        // Add category functionality
        const categoryTabs = categorySlider.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.filterProducts(e.target.dataset.category);
            });
        });
    }

    setupTouchEvents() {
        const track = document.querySelector('.product-carousel-track');
        if (!track) return;

        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoSlide();
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
                isDragging = false;
            }
        });

        track.addEventListener('touchend', () => {
            isDragging = false;
            this.resumeAutoSlide();
        });

        // Mouse drag support
        track.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            this.pauseAutoSlide();
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
            const diff = startX - currentX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
                isDragging = false;
            }
        });

        track.addEventListener('mouseup', () => {
            isDragging = false;
            this.resumeAutoSlide();
        });
    }

    setupWishlist() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            // Add wishlist button
            const wishlistBtn = document.createElement('button');
            wishlistBtn.className = 'wishlist-btn';
            wishlistBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
            
            wishlistBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleWishlist(wishlistBtn);
            });

            const productImage = card.querySelector('.product-image');
            productImage.appendChild(wishlistBtn);

            // Add overlay with quick actions
            const overlay = document.createElement('div');
            overlay.className = 'product-overlay';
            overlay.innerHTML = `
                <button class="overlay-btn quick-view-btn" title="Quick View">
                    <i class="fa-regular fa-eye"></i>
                </button>
                <button class="overlay-btn add-to-cart-btn" title="Add to Cart">
                    <i class="fa-solid fa-cart-plus"></i>
                </button>
            `;

            productImage.appendChild(overlay);

            // Add event listeners for overlay buttons
            const quickViewBtn = overlay.querySelector('.quick-view-btn');
            const addToCartBtn = overlay.querySelector('.add-to-cart-btn');

            quickViewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.quickView(card);
            });

            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.addToCart(card);
            });
        });
    }

    setupProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            // Add product descriptions
            const productInfo = card.querySelector('.product-info');
            const productName = card.querySelector('.product-name');
            
            if (productInfo && productName) {
                const description = this.getProductDescription(productName.textContent);
                const descElement = document.createElement('p');
                descElement.className = 'product-description';
                descElement.textContent = description;
                
                productName.insertAdjacentElement('afterend', descElement);
            }

            // Add click handler for navigation
            card.addEventListener('click', () => {
                this.navigateToProduct(card);
            });

            // Lazy load images
            this.lazyLoadImages(card);
        });
    }

    getProductDescription(productName) {
        const descriptions = {
            'Lavender Bliss Bar': 'Infused with lavender oils for calm skin\nHydrates deeply and relieves stress',
            'Rose Petal Glow': 'Natural rose extracts for radiant glow\nSoftens and nourishes delicate skin',
            'Citrus Burst Bar': 'Energizing citrus blend awakens senses\nVitamin C brightens and refreshes',
            'Charcoal Detox Bar': 'Deep cleansing activated charcoal\nPurifies pores and removes toxins',
            'Honey Glow Bar': 'Pure honey for natural moisturizing\nAntibacterial properties heal skin',
            'Oat & Milk Soothe': 'Gentle oats exfoliate naturally\nMilk proteins calm sensitive skin',
            'Vanilla Dream Bar': 'Sweet vanilla scent soothes senses\nRich moisturizing formula',
            'Tea Tree Clear Bar': 'Antibacterial tea tree oil cleanses\nPerfect for acne-prone skin',
            'Coconut Cream Bar': 'Tropical coconut deeply nourishes\nLeaves skin silky smooth',
            'Eucalyptus Fresh Bar': 'Refreshing eucalyptus awakens\nInvigorating morning cleanser',
            'Shea Butter Luxury Bar': 'Premium shea butter moisturizes\nLuxurious spa-like experience',
            'Lemon Mint Refresh Bar': 'Zesty lemon and cooling mint\nEnergizing citrus freshness'
        };
        
        return descriptions[productName] || 'Handcrafted with natural ingredients\nGentle on skin, kind to the planet';
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const track = document.querySelector('.product-carousel-track');
        const dots = document.querySelectorAll('.pagination-dot');
        
        if (track) {
            const translateX = -this.currentSlide * 100;
            track.style.transform = `translateX(${translateX}%)`;
        }

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoSlide() {
        if (!this.isAutoSliding) return;
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideDelay);
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }

    resumeAutoSlide() {
        setTimeout(() => {
            this.startAutoSlide();
        }, 1000);
    }

    toggleWishlist(button) {
        const icon = button.querySelector('i');
        const isWishlisted = icon.classList.contains('fa-solid');
        
        if (isWishlisted) {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            button.style.background = 'rgba(255, 255, 255, 0.9)';
            button.style.color = '#666';
        } else {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            button.style.background = '#ff6b6b';
            button.style.color = '#ffffff';
        }

        // Add animation
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }

    quickView(card) {
        const productName = card.querySelector('.product-name').textContent;
        const productPrice = card.querySelector('.product-price').textContent;
        const productImage = card.querySelector('.main-image').src;
        const productDescription = this.getProductDescription(productName);
        const productSlug = this.createProductSlug(productName);
        
        // Create quick view modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <img src="${productImage}" alt="${productName}">
                        <div class="modal-info">
                            <h3>${productName}</h3>
                            <p class="modal-description">${productDescription.replace('\n', '<br>')}</p>
                            <p class="modal-price">${productPrice}</p>
                            <div class="modal-actions">
                                <button class="modal-add-to-cart">Add to Cart</button>
                                <button class="modal-view-full">View Full Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        const addToCartBtn = modal.querySelector('.modal-add-to-cart');
        const viewFullBtn = modal.querySelector('.modal-view-full');
        
        closeBtn.addEventListener('click', () => modal.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) modal.remove();
        });
        
        addToCartBtn.addEventListener('click', () => {
            this.addToCart(card);
            modal.remove();
        });
        
        viewFullBtn.addEventListener('click', () => {
            modal.remove();
            // Use the same product page mapping
            const productPages = {
                'lavender-bliss-bar': 'product-lavender.html',
                'rose-petal-glow': 'product-rose.html',
                'citrus-burst-bar': 'product-citrus.html',
                'charcoal-detox-bar': 'product-charcoal.html',
                'honey-glow-bar': 'product-honey.html',
                'oat-milk-soothe': 'product-oat.html',
                'vanilla-dream-bar': 'product-vanilla.html',
                'tea-tree-clear-bar': 'product-teatree.html',
                'coconut-cream-bar': 'product-coconut.html',
                'eucalyptus-fresh-bar': 'product-eucalyptus.html',
                'shea-butter-luxury-bar': 'product-shea.html',
                'lemon-mint-refresh-bar': 'product-lemon.html'
            };
            const productPage = productPages[productSlug] || 'product-default.html';
            window.location.href = productPage;
        });
    }

    addToCart(card) {
        const productName = card.querySelector('.product-name').textContent;
        
        // Add to cart animation
        const button = card.querySelector('.add-to-cart-btn');
        if (button) {
            const originalText = button.innerHTML;
            
            button.innerHTML = '<i class="fa-solid fa-check"></i>';
            button.style.background = '#10b981';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 1500);
        }
        
        // Show notification
        this.showNotification(`${productName} added to cart!`);
    }

    navigateToProduct(card) {
        const productName = card.querySelector('.product-name').textContent;
        const productSlug = this.createProductSlug(productName);
        
        // Add page transition effect
        document.body.style.transition = 'all 0.3s ease';
        document.body.style.opacity = '0.8';
        document.body.style.transform = 'scale(0.98)';
        
        // Show loading indicator
        this.showLoadingIndicator();
        
        // Create product page URL mapping
        const productPages = {
            'lavender-bliss-bar': 'product-lavender.html',
            'rose-petal-glow': 'product-rose.html',
            'citrus-burst-bar': 'product-citrus.html',
            'charcoal-detox-bar': 'product-charcoal.html',
            'honey-glow-bar': 'product-honey.html',
            'oat-milk-soothe': 'product-oat.html',
            'vanilla-dream-bar': 'product-vanilla.html',
            'tea-tree-clear-bar': 'product-teatree.html',
            'coconut-cream-bar': 'product-coconut.html',
            'eucalyptus-fresh-bar': 'product-eucalyptus.html',
            'shea-butter-luxury-bar': 'product-shea.html',
            'lemon-mint-refresh-bar': 'product-lemon.html'
        };
        
        setTimeout(() => {
            // Navigate to specific product page
            const productPage = productPages[productSlug] || 'product-default.html';
            window.location.href = productPage;
        }, 300);
    }

    createProductSlug(productName) {
        return productName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }

    showLoadingIndicator() {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'page-loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <p class="loading-text">Loading product...</p>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
        
        // Remove loading overlay if navigation fails
        setTimeout(() => {
            if (document.body.contains(loadingOverlay)) {
                loadingOverlay.remove();
                document.body.style.opacity = '1';
                document.body.style.transform = 'scale(1)';
            }
        }, 3000);
    }

    filterProducts(category) {
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach(card => {
            if (category === 'all') {
                card.style.display = 'flex';
            } else {
                // Simple category filtering based on product names
                const productName = card.querySelector('.product-name').textContent.toLowerCase();
                const shouldShow = this.matchesCategory(productName, category);
                card.style.display = shouldShow ? 'flex' : 'none';
            }
        });
        
        // Reset carousel
        this.currentSlide = 0;
        this.updateCarousel();
    }

    matchesCategory(productName, category) {
        const categoryMap = {
            'floral': ['lavender', 'rose', 'jasmine', 'vanilla'],
            'herbal': ['neem', 'aloe', 'tea tree', 'mint', 'eucalyptus'],
            'citrus': ['citrus', 'lemon', 'grapefruit', 'orange'],
            'luxury': ['luxury', 'goat milk', 'shea butter', 'sandalwood'],
            'organic': ['organic', 'natural', 'oat', 'honey', 'coconut']
        };
        
        const keywords = categoryMap[category] || [];
        return keywords.some(keyword => productName.includes(keyword));
    }

    lazyLoadImages(card) {
        const images = card.querySelectorAll('img');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductCarousel();
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    const carousel = window.productCarousel;
    if (!carousel) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            carousel.prevSlide();
            break;
        case 'ArrowRight':
            carousel.nextSlide();
            break;
        case 'Escape':
            const modal = document.querySelector('.quick-view-modal');
            if (modal) modal.remove();
            break;
    }
});

// Store carousel instance globally for keyboard navigation
window.addEventListener('load', () => {
    window.productCarousel = new ProductCarousel();
});