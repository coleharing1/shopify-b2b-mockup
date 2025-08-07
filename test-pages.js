const pages = [
  '/',
  '/login',
  '/select-account',
  '/retailer/dashboard',
  '/retailer/products',
  '/retailer/products/product-1',
  '/retailer/cart',
  '/retailer/checkout',
  '/retailer/orders'
];

async function testPages() {
  console.log('Testing B2B Portal Pages...\n');
  
  for (const page of pages) {
    try {
      const response = await fetch(`http://localhost:3000${page}`);
      const status = response.status;
      const statusText = status === 200 ? '✓ OK' : `✗ Error (${status})`;
      console.log(`${page.padEnd(30)} ${statusText}`);
      
      if (status !== 200) {
        const text = await response.text();
        console.log(`  Error: ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`${page.padEnd(30)} ✗ Connection Error`);
      console.log(`  Error: ${error.message}`);
    }
  }
}

testPages().then(() => {
  console.log('\nTest complete!');
  process.exit(0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});