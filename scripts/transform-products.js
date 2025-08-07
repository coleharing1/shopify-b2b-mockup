/**
 * Script to transform existing products.json with new order type structure
 * Run with: node scripts/transform-products.js
 */

const fs = require('fs');
const path = require('path');

// Read existing products
const productsPath = path.join(__dirname, '../public/mockdata/products.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Transform products with new structure
const transformedProducts = productsData.products.map((product, index) => {
  // Calculate total inventory from variants
  const totalInventory = product.variants?.reduce((sum, v) => sum + (v.inventory || 0), 0) || 0;
  
  // Determine which order types this product should support based on index and inventory
  const orderTypes = [];
  const orderTypeMetadata = {};
  const tags = [];
  
  // First 60% of products are at-once (evergreen/in-stock items)
  if (index < productsData.products.length * 0.6) {
    orderTypes.push('at-once');
    tags.push('evergreen', 'bestseller');
    
    orderTypeMetadata['at-once'] = {
      atsInventory: totalInventory,
      shipWithin: Math.random() > 0.5 ? 2 : 3,
      evergreenItem: true,
      stockLocation: ['Main Warehouse'],
      backorderAvailable: totalInventory < 50
    };
  }
  
  // Next 25% are prebook items (future seasons)
  if (index >= productsData.products.length * 0.6 && index < productsData.products.length * 0.85) {
    orderTypes.push('prebook');
    tags.push('new-arrival', 'seasonal');
    
    const seasons = ['Spring 2025', 'Summer 2025', 'Fall 2025'];
    const season = seasons[Math.floor(Math.random() * seasons.length)];
    
    orderTypeMetadata['prebook'] = {
      season: season,
      collection: Math.random() > 0.5 ? 'Core' : 'Fashion',
      deliveryWindow: {
        start: season.includes('Spring') ? '2025-03-01' : 
               season.includes('Summer') ? '2025-06-01' : '2025-09-01',
        end: season.includes('Spring') ? '2025-03-31' : 
             season.includes('Summer') ? '2025-06-30' : '2025-09-30'
      },
      depositPercent: 30,
      cancellationDeadline: season.includes('Spring') ? '2025-02-01' : 
                            season.includes('Summer') ? '2025-05-01' : '2025-08-01',
      minimumUnits: 6,
      requiresFullSizeRun: product.category === 'Apparel'
    };
  }
  
  // Last 15% can be closeout items
  if (index >= productsData.products.length * 0.85) {
    orderTypes.push('closeout');
    tags.push('clearance', 'final-sale');
    
    const discountPercent = [40, 50, 60, 70][Math.floor(Math.random() * 4)];
    
    orderTypeMetadata['closeout'] = {
      originalPrice: product.msrp,
      discountPercent: discountPercent,
      availableQuantity: Math.floor(totalInventory * 0.3), // Only 30% of inventory on closeout
      expiresAt: new Date(Date.now() + (Math.random() * 72 * 60 * 60 * 1000)).toISOString(), // 0-72 hours
      finalSale: true,
      minimumOrderQuantity: discountPercent > 50 ? 3 : 1
    };
  }
  
  // Some products can be both at-once and prebook (20% overlap)
  if (orderTypes.includes('at-once') && Math.random() > 0.8) {
    if (!orderTypes.includes('prebook')) {
      orderTypes.push('prebook');
      tags.push('pre-orderable');
      
      orderTypeMetadata['prebook'] = {
        season: 'Fall 2025',
        collection: 'Core',
        deliveryWindow: {
          start: '2025-09-01',
          end: '2025-09-30'
        },
        depositPercent: 30,
        cancellationDeadline: '2025-08-01',
        minimumUnits: 12,
        requiresFullSizeRun: false
      };
    }
  }
  
  // Add category-specific tags
  if (product.category === 'SMW') {
    tags.push('made-in-usa', 'merino-wool');
  }
  if (product.subcategory?.toLowerCase().includes('sock')) {
    tags.push('socks', 'performance');
  }
  if (product.name?.toLowerCase().includes('heavyweight')) {
    tags.push('winter', 'cold-weather');
  }
  if (product.name?.toLowerCase().includes('lightweight')) {
    tags.push('summer', 'warm-weather');
  }
  
  return {
    ...product,
    orderTypes: orderTypes.length > 0 ? orderTypes : ['at-once'], // Default to at-once
    tags: [...new Set(tags)], // Remove duplicates
    orderTypeMetadata: Object.keys(orderTypeMetadata).length > 0 ? orderTypeMetadata : {
      'at-once': {
        atsInventory: totalInventory,
        shipWithin: 3,
        evergreenItem: true,
        stockLocation: ['Main Warehouse'],
        backorderAvailable: true
      }
    }
  };
});

// Write transformed products back
const transformedData = {
  products: transformedProducts
};

fs.writeFileSync(
  productsPath,
  JSON.stringify(transformedData, null, 2),
  'utf8'
);

console.log(`✅ Transformed ${transformedProducts.length} products`);
console.log(`   - At-once products: ${transformedProducts.filter(p => p.orderTypes.includes('at-once')).length}`);
console.log(`   - Prebook products: ${transformedProducts.filter(p => p.orderTypes.includes('prebook')).length}`);
console.log(`   - Closeout products: ${transformedProducts.filter(p => p.orderTypes.includes('closeout')).length}`);