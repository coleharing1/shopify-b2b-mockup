/**
 * @fileoverview Scrapes product data from a Shopify store using its JSON API.
 * @description This script fetches product data from the /products.json endpoint of a Shopify store,
 *              formats it into a structure suitable for our mock data, and saves it to a file.
 */

import fs from 'fs';
import path from 'path';

// The URL to the collections endpoint which returns products as JSON
const SHOPIFY_COLLECTION_URL = 'https://fishmonkeygloves.com/collections/all/products.json';

// The path where the scraped data will be saved
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'mockdata', 'scraped-products.json');

/**
 * @description Fetches all products from the Shopify collection URL.
 * It handles pagination to ensure all products are retrieved.
 * @returns {Promise<any[]>} A promise that resolves to an array of product data.
 */
async function fetchAllProducts() {
  let page = 1;
  let allProducts = [];
  let keepFetching = true;

  console.log('Starting to fetch products...');

  while (keepFetching) {
    try {
      // Append the page number to the URL to fetch paginated results
      const url = `${SHOPIFY_COLLECTION_URL}?page=${page}`;
      console.log(`Fetching from: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const products = data.products;

      if (products && products.length > 0) {
        allProducts.push(...products);
        console.log(`Fetched ${products.length} products. Total so far: ${allProducts.length}`);
        page++;
        // Add a small delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 250));
      } else {
        // No more products found, stop the loop
        keepFetching = false;
        console.log('No more products found. Concluding fetch.');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      keepFetching = false;
    }
  }

  return allProducts;
}

/**
 * @description Transforms the raw Shopify product data into the format needed for our mock data.
 * @param {any[]} shopifyProducts - The array of raw product data from Shopify.
 * @returns {any[]} An array of formatted products.
 */
function formatProductsForMockData(shopifyProducts) {
  console.log('Formatting products for our mock data structure...');
  return shopifyProducts.map((product, index) => ({
    id: `prod-${index + 1}`,
    sku: product.variants[0]?.sku || `SKU-00${index + 1}`,
    name: product.title,
    category: product.product_type || 'Gloves',
    subcategory: product.tags.length > 0 ? product.tags[0] : 'Performance',
    description: product.body_html.replace(/<[^>]*>?/gm, ''), // Strip HTML tags
    msrp: parseFloat(product.variants[0]?.compare_at_price) || parseFloat(product.variants[0]?.price) * 1.5,
    images: product.images.map(img => img.src),
    variants: product.variants.map(variant => ({
      id: `var-${index + 1}-${variant.id}`,
      color: variant.option1 || 'Default',
      size: variant.option2 || 'One Size',
      sku: variant.sku,
      inventory: variant.inventory_quantity || 100,
      weight: `${variant.weight} ${variant.weight_unit}`,
    })),
    pricing: {
      "tier-1": { price: parseFloat(product.variants[0]?.price) * 0.8, minQuantity: 1 },
      "tier-2": { price: parseFloat(product.variants[0]?.price) * 0.7, minQuantity: 1 },
      "tier-3": { price: parseFloat(product.variants[0]?.price) * 0.6, minQuantity: 1 },
    },
  }));
}

/**
 * @description Main function to run the scraping process.
 */
async function main() {
  const rawProducts = await fetchAllProducts();
  if (rawProducts.length === 0) {
    console.log('No products were fetched. Exiting.');
    return;
  }

  const formattedProducts = formatProductsForMockData(rawProducts);
  
  try {
    // Write the formatted data to the output file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ products: formattedProducts }, null, 2));
    console.log(`✅ Successfully saved ${formattedProducts.length} products to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Failed to write product file:', error);
  }
}

main();

