/* ════════════════════════════════
   FOAMY STYLE SHOP FUNCTIONALITY
   Clean & Minimal Interactions
════════════════════════════════ */

class FoamyShop {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentFilters = {
            availability: [],
            price: 25,
            brand: [],
            category: [],
            color: [],
            material: [],
            more: [],
            producttype: [],
            size: []
        };
        this.currentSort = 'alphabetical-az';
        this.init();
    }

    init() {
        this.collectProductData();
        this.setupFilters();
        this.setupSorting();
        this.setupPagination();
        this.setupColorSwatches();
        this.setupPriceSlider();
        this.updateProductCount();
    }

    // ═══ COLLECT PRODUCT DATA ═══
    collectProductData() {
        const productCards = document.querySelectorAll('.product-card');
        this.products = Array.from(productCards).map((card, index) => {
            const name = card.querySelector('.product-name').textContent;
            const price = parseFloat(card.querySelector('.product-price').textContent.replace('₹', ''));
            const badge = card.querySelector('.product-badge')?.textContent || '';
            
            return {
                element: card,
                name: name,
                price: price,
                badge: badge,
                index: index,
                visible: true
            };
        });
        this.filteredProducts = [...this.products];
    }

    // ═══ SETUP FILTERS ═══
    setupFilters() {
        // Availability filters
        const availabilityInputs = document.querySelectorAll('input[name="availability"]');
        availabilityInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateFilter('availability', input.value, input.checked);
            });
        });

        // Brand filters
        const brandInputs = document.querySelectorAll('input[name="brand"]');
        brandInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateFilter('brand', input.value, input.checked);
            });
        });

        // Category filters
        const categoryInputs = document.querySelectorAll('input[name="category"]');
        categoryInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateFilter('category', input.value, input.checked);
            });
        });

        // Material filters
        const materialInputs = document.querySelectorAll('input[name="material"]');
        materialInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateFilter('material', input.value, input.checked);
            });
        });

        // More filters
        const moreInputs = document.querySelectorAll('input[name="more"]');
        moreInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateFilter('more', input.value, input.checked);
            });
        });

        // Product type filters
        const productTypeInputs = document.querySelectorAll('input[name="producttype"]');
        productTypeInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateFilter('producttype', input.value, input.checked);
            });
        });

        // Size filters
        const sizeInputs = document.querySelectorAll('input[name="size"]');
        sizeInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateFilter('size', input.value, input.checked);
            });
        });

        // Category items (collection categories)
        const categoryItems = document.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.filterByCollection(item.querySelector('.category-name').textContent.toLowerCase());
            });
        });
    }

    // ═══ SETUP PRICE SLIDER ═══
    setupPriceSlider() {
        const priceSlider = document.querySelector('.price-slider');
        const priceDisplay = document.querySelector('.price-display');

        if (priceSlider && priceDisplay) {
            priceSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                priceDisplay.textContent = `₹ 0 — ₹ ${value}.00`;
                this.currentFilters.price = parseFloat(value);
                this.applyFilters();
            });
        }
    }

    // ═══ SETUP COLOR SWATCHES ═══
    setupColorSwatches() {
        const colorSwatches = document.querySelectorAll('.color-swatch');
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                const color = swatch.dataset.color;
                swatch.classList.toggle('selected');
                
                if (swatch.classList.contains('selected')) {
                    this.currentFilters.color.push(color);
                } else {
                    this.currentFilters.color = this.currentFilters.color.filter(c => c !== color);
                }
                
                this.applyFilters();
            });
        });
    }

    // ═══ SETUP SORTING ═══
    setupSorting() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortProducts();
            });
        }
    }

    // ═══ SETUP PAGINATION ═══
    setupPagination() {
        const pageButtons = document.querySelectorAll('.page-btn');
        pageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.classList.contains('page-number')) {
                    this.goToPage(parseInt(btn.textContent));
                } else if (btn.classList.contains('next-btn') && !btn.disabled) {
                    this.nextPage();
                } else if (btn.classList.contains('prev-btn') && !btn.disabled) {
                    this.prevPage();
                }
            });
        });
    }

    // ═══ UPDATE FILTER ═══
    updateFilter(filterType, value, checked) {
        if (checked) {
            if (!this.currentFilters[filterType].includes(value)) {
                this.currentFilters[filterType].push(value);
            }
        } else {
            this.currentFilters[filterType] = this.currentFilters[filterType].filter(v => v !== value);
        }
        
        this.applyFilters();
    }

    // ═══ FILTER BY COLLECTION ═══
    filterByCollection(collection) {
        // Reset all filters
        this.resetFilters();
        
        // Apply collection-specific logic
        this.filteredProducts = this.products.filter(product => {
            // Simple matching based on product name containing collection keywords
            const name = product.name.toLowerCase();
            switch(collection) {
                case 'ayurvedic':
                    return name.includes('neem') || name.includes('turmeric');
                case 'charcoal':
                    return name.includes('charcoal') || name.includes('detox');
                case 'exfoliating':
                    return name.includes('scrub') || name.includes('oat');
                case 'floral':
                    return name.includes('rose') || name.includes('lavender') || name.includes('jasmine');
                case 'kids':
                    return name.includes('gentle') || name.includes('mild');
                case 'organic':
                    return name.includes('organic') || name.includes('natural');
                default:
                    return true;
            }
        });
        
        this.displayProducts();
        this.updateProductCount();
    }

    // ═══ APPLY FILTERS ═══
    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Price filter
            if (product.price > this.currentFilters.price) {
                return false;
            }

            // Availability filter
            if (this.currentFilters.availability.length > 0) {
                // Simple logic: assume products with badges are special availability
                const hasSpecialAvailability = product.badge !== '';
                if (this.currentFilters.availability.includes('in-stock') && !hasSpecialAvailability) {
                    return false;
                }
                if (this.currentFilters.availability.includes('out-stock') && hasSpecialAvailability) {
                    return false;
                }
            }

            // Other filters would be implemented based on actual product data
            // For demo purposes, we'll keep all products visible for most filters
            
            return true;
        });

        this.sortProducts();
        this.displayProducts();
        this.updateProductCount();
    }

    // ═══ SORT PRODUCTS ═══
    sortProducts() {
        switch(this.currentSort) {
            case 'alphabetical-az':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'alphabetical-za':
                this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-low-high':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'date-old-new':
                this.filteredProducts.sort((a, b) => a.index - b.index);
                break;
            case 'date-new-old':
                this.filteredProducts.sort((a, b) => b.index - a.index);
                break;
        }
    }

    // ═══ DISPLAY PRODUCTS ═══
    displayProducts() {
        const productGrid = document.querySelector('.product-grid');
        
        // Hide all products first
        this.products.forEach(product => {
            product.element.style.display = 'none';
            product.visible = false;
        });

        // Show filtered products with animation
        this.filteredProducts.forEach((product, index) => {
            product.element.style.display = 'block';
            product.element.style.animation = `fadeIn 0.3s ease-out ${index * 0.05}s both`;
            product.visible = true;
        });

        // Reorder products in DOM
        this.filteredProducts.forEach(product => {
            productGrid.appendChild(product.element);
        });
    }

    // ═══ UPDATE PRODUCT COUNT ═══
    updateProductCount() {
        const countElement = document.querySelector('.product-count');
        if (countElement) {
            const count = this.filteredProducts.length;
            countElement.textContent = `${count} product${count !== 1 ? 's' : ''}`;
        }
    }

    // ═══ RESET FILTERS ═══
    resetFilters() {
        // Reset filter object
        this.currentFilters = {
            availability: [],
            price: 25,
            brand: [],
            category: [],
            color: [],
            material: [],
            more: [],
            producttype: [],
            size: []
        };

        // Reset UI elements
        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.checked = false;
        });

        document.querySelector('.price-slider').value = 25;
        document.querySelector('.price-display').textContent = '₹ 0 — ₹ 25.00';

        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('selected');
        });

        // Reset to show all products
        this.filteredProducts = [...this.products];
        this.displayProducts();
        this.updateProductCount();
    }

    // ═══ PAGINATION METHODS ═══
    goToPage(pageNumber) {
        const pageButtons = document.querySelectorAll('.page-number');
        pageButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === pageNumber) {
                btn.classList.add('active');
            }
        });

        // Update prev/next button states
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        prevBtn.disabled = pageNumber === 1;
        nextBtn.disabled = pageNumber === 3; // Assuming 3 pages max
    }

    nextPage() {
        const currentPage = document.querySelector('.page-number.active');
        const nextPageNum = parseInt(currentPage.textContent) + 1;
        if (nextPageNum <= 3) {
            this.goToPage(nextPageNum);
        }
    }

    prevPage() {
        const currentPage = document.querySelector('.page-number.active');
        const prevPageNum = parseInt(currentPage.textContent) - 1;
        if (prevPageNum >= 1) {
            this.goToPage(prevPageNum);
        }
    }

    // ═══ UTILITY METHODS ═══
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// ═══ INITIALIZE ON DOM LOAD ═══
document.addEventListener('DOMContentLoaded', () => {
    new FoamyShop();
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (event) => {
            if (event.target.closest('a, button, select, input, label')) return;
            window.location.href = 'product.html';
        });
    });
});

// ═══ ADDITIONAL INTERACTIONS ═══

// Smooth scroll to top when filters change
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add loading states for better UX
function showLoading() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.classList.add('loading');
    });
}

function hideLoading() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.classList.remove('loading');
    });
}

// Mobile filter toggle (for responsive design)
function setupMobileFilters() {
    if (window.innerWidth <= 768) {
        const filterSidebar = document.querySelector('.filter-sidebar');
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Filters';
        toggleBtn.className = 'mobile-filter-toggle';
        
        document.querySelector('.top-bar').appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', () => {
            filterSidebar.classList.toggle('mobile-open');
        });
    }
}

// Setup mobile filters on resize
window.addEventListener('resize', setupMobileFilters);
setupMobileFilters();

/* ════════════════════════════════
   BLOG SECTION FUNCTIONALITY
════════════════════════════════ */

// Featured Post Slider
class FeaturedPostSlider {
    constructor() {
        this.track = document.getElementById('fpTrack');
        this.slides = document.querySelectorAll('.fp-slide');
        this.prevBtn = document.getElementById('fpPrev');
        this.nextBtn = document.getElementById('fpNext');
        this.dotsContainer = document.getElementById('fpDots');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        if (this.track) {
            this.init();
        }
    }

    init() {
        this.createDots();
        this.setupEventListeners();
        this.updateSlider();
        this.startAutoPlay();
    }

    createDots() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `fp-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) this.nextSlide();
            if (endX - startX > 50) this.prevSlide();
        });
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }

    updateSlider() {
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        document.querySelectorAll('.fp-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        // Update counter
        const currentCounter = document.getElementById('fpCurrent');
        if (currentCounter) {
            currentCounter.textContent = String(this.currentSlide + 1).padStart(2, '0');
        }
    }

    startAutoPlay() {
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
}

// Blog Filter Bar
class BlogFilterBar {
    constructor() {
        this.tabs = document.getElementById('bfbTabs');
        this.searchInput = document.getElementById('bfbSearchInput');
        this.searchClear = document.getElementById('bfbSearchClear');
        this.sortSelect = document.getElementById('bfbSort');
        this.mobileToggle = document.getElementById('bfbMobileToggle');
        this.mobilePanel = document.getElementById('bfbMobilePanel');
        this.activeLabel = document.getElementById('bfbActiveLabel');
        this.countElement = document.getElementById('bfbCount');
        
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.currentSort = 'newest';
        
        if (this.tabs) {
            this.init();
        }
    }

    init() {
        this.setupTabScrolling();
        this.setupEventListeners();
        this.setupMobileFilters();
    }

    setupTabScrolling() {
        const fadeLeft = document.getElementById('bfbFadeL');
        const fadeRight = document.getElementById('bfbFadeR');
        
        this.tabs.addEventListener('scroll', () => {
            const scrollLeft = this.tabs.scrollLeft;
            const maxScroll = this.tabs.scrollWidth - this.tabs.clientWidth;
            
            fadeLeft.style.opacity = scrollLeft > 0 ? '1' : '0';
            fadeRight.style.opacity = scrollLeft < maxScroll ? '1' : '0';
        });
    }

    setupEventListeners() {
        // Tab clicks
        document.querySelectorAll('.bfb-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.selectCategory(tab.dataset.cat, tab.dataset.label, tab.dataset.count);
            });
        });

        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.currentSearch = e.target.value;
            this.searchClear.classList.toggle('visible', this.currentSearch.length > 0);
            this.filterContent();
        });

        this.searchClear.addEventListener('click', () => {
            this.searchInput.value = '';
            this.currentSearch = '';
            this.searchClear.classList.remove('visible');
            this.filterContent();
        });

        // Sort functionality
        this.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortContent();
        });

        // Mobile toggle
        this.mobileToggle.addEventListener('click', () => {
            this.mobilePanel.classList.toggle('open');
            document.getElementById('bfbMobileDot').classList.toggle('active');
        });
    }

    setupMobileFilters() {
        document.querySelectorAll('.bfb-mob-cat').forEach(cat => {
            cat.addEventListener('click', () => {
                this.selectCategory(cat.dataset.cat, cat.textContent.trim(), '0');
                this.mobilePanel.classList.remove('open');
            });
        });
    }

    selectCategory(category, label, count) {
        this.currentCategory = category;
        
        // Update active states
        document.querySelectorAll('.bfb-tab, .bfb-mob-cat').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelector(`[data-cat="${category}"]`).classList.add('active');
        
        // Update labels
        this.activeLabel.textContent = label;
        this.countElement.textContent = `${count} Articles`;
        
        this.filterContent();
    }

    filterContent() {
        // This would filter actual blog content in a real implementation
        console.log(`Filtering by category: ${this.currentCategory}, search: ${this.currentSearch}`);
    }

    sortContent() {
        // This would sort actual blog content in a real implementation
        console.log(`Sorting by: ${this.currentSort}`);
    }
}

// Blog Hero Category Pills
class BlogHeroCategories {
    constructor() {
        this.categories = document.querySelectorAll('.blog-cat');
        if (this.categories.length > 0) {
            this.init();
        }
    }

    init() {
        this.categories.forEach(cat => {
            cat.addEventListener('click', () => {
                this.categories.forEach(c => c.classList.remove('active'));
                cat.classList.add('active');
                
                // Scroll to blog filter bar
                document.querySelector('.bfb-wrap').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }
}

// Initialize Blog Components
document.addEventListener('DOMContentLoaded', () => {
    new FeaturedPostSlider();
    new BlogFilterBar();
    new BlogHeroCategories();
});
