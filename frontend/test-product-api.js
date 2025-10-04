// Test script to verify product API integration
const API_BASE_URL = 'http://localhost:3001'

async function testProductAPI() {
  console.log('Testing Product API Integration...')
  
  try {
    // Test 1: Get existing products
    console.log('\n1. Getting existing products...')
    const response = await fetch(`${API_BASE_URL}/products`)
    const products = await response.json()
    console.log(`Found ${products.length} existing products`)
    
    // Test 2: Create a new product
    console.log('\n2. Creating a new product...')
    const newProduct = {
      name: 'API Test Product',
      category: 'Test',
      basePrice: 9.99,
      available: true,
      organizationId: 'org-1',
      locationId: 'loc-1'
    }
    
    const createResponse = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    })
    
    if (createResponse.ok) {
      const createdProduct = await createResponse.json()
      console.log('✅ Product created successfully:', createdProduct)
      
      // Test 3: Verify the product was saved
      console.log('\n3. Verifying product was saved...')
      const verifyResponse = await fetch(`${API_BASE_URL}/products`)
      const allProducts = await verifyResponse.json()
      const foundProduct = allProducts.find(p => p.name === 'API Test Product')
      
      if (foundProduct) {
        console.log('✅ Product found in database:', foundProduct)
      } else {
        console.log('❌ Product not found in database')
      }
      
    } else {
      console.log('❌ Failed to create product:', createResponse.status, createResponse.statusText)
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error)
  }
}

testProductAPI()
