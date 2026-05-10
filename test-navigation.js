// Test Product Navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product navigation test loaded');
    
    // Test the product slug generation
    function createProductSlug(productName) {
        return productName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
    
    // Test cases
    const testProducts = [
        'Lavender Bliss Bar',
        'Rose Petal Glow',
        'Citrus Burst Bar',
        'Charcoal Detox Bar',
        'Honey Glow Bar',
        'Oat & Milk Soothe'
    ];
    
    console.log('Testing product slug generation:');
    testProducts.forEach(product => {
        const slug = createProductSlug(product);
        console.log(`${product} -> ${slug}`);
    });
    
    // Test product page mapping
    const productPages = {
        'lavender-bliss-bar': 'product-lavender.html',
        'rose-petal-glow': 'product-rose.html',
        'citrus-burst-bar': 'product-citrus.html',
        'charcoal-detox-bar': 'product-charcoal.html',
        'honey-glow-bar': 'product-honey.html',
        'oat-milk-soothe': 'product-oat.html'
    };
    
    console.log('Product page mapping:', productPages);
    
    // Add click handlers to test navigation
    const productCards = document.querySelectorAll('.product-card');
    console.log(`Found ${productCards.length} product cards`);
    
    productCards.forEach((card, index) => {
        const productName = card.querySelector('.product-name');
        if (productName) {
            console.log(`Product ${index + 1}: ${productName.textContent}`);
        }
    });
});

// Function to manually test navigation
function testNavigation(productName) {
    function createProductSlug(productName) {
        return productName
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
    
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
    
    const slug = createProductSlug(productName);
    const productPage = productPages[slug];
    
    console.log(`Testing navigation for: ${productName}`);
    console.log(`Generated slug: ${slug}`);
    console.log(`Target page: ${productPage}`);
    
    if (productPage) {
        console.log(`✅ Navigation would work - redirecting to: ${productPage}`);
        // Uncomment the line below to actually navigate
        // window.location.href = productPage;
        return true;
    } else {
        console.log(`❌ No product page found for slug: ${slug}`);
        return false;
    }
}

// Make test function available globally
window.testNavigation = testNavigation;