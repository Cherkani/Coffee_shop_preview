import type { Product } from "../types"
import { mockProducts } from "../mock-data/products"

/**
 * Mock Data Persistence Service
 * Simulates writing to mock data files by updating the exported arrays
 * In a real application, this would make API calls to a backend
 */

// In-memory copy of products that can be modified
let dynamicProducts: Product[] = []

// Initialize dynamic products from the API
async function initializeProducts() {
  try {
    const products = await mockProducts()
    dynamicProducts = [...products]
    console.log("Initialized dynamic products:", dynamicProducts.length)
  } catch (error) {
    console.error("Failed to initialize products:", error)
    dynamicProducts = []
  }
}

// Initialize on module load
initializeProducts()

export function getAllProducts(): Product[] {
  console.log("Mock data persistence - getAllProducts called:")
  console.log("- Dynamic products count:", dynamicProducts.length)
  console.log("- Dynamic products:", dynamicProducts)
  return dynamicProducts
}

export function addProductToMockData(product: Product): void {
  console.log("Adding product to mock data:", product)
  dynamicProducts.push(product)
  console.log("Product added. Total products:", dynamicProducts.length)
}

export function updateProductInMockData(productId: string, updates: Partial<Product>): void {
  console.log("Updating product in mock data:", productId, updates)
  const index = dynamicProducts.findIndex(p => p.id === productId)
  if (index !== -1) {
    dynamicProducts[index] = { ...dynamicProducts[index], ...updates }
    console.log("Product updated:", dynamicProducts[index])
  } else {
    console.log("Product not found:", productId)
  }
}

export function deleteProductFromMockData(productId: string): void {
  console.log("Deleting product from mock data:", productId)
  const initialLength = dynamicProducts.length
  dynamicProducts = dynamicProducts.filter(p => p.id !== productId)
  console.log(`Product deleted. Removed ${initialLength - dynamicProducts.length} product(s)`)
}

export function getProductsByOrganization(organizationId: string): Product[] {
  return dynamicProducts.filter(p => p.organizationId === organizationId)
}

export function getProductsByLocation(locationId: string): Product[] {
  return dynamicProducts.filter(p => p.locationId === locationId)
}

export async function resetMockData(): Promise<void> {
  console.log("Resetting mock data to original state")
  try {
    const products = await mockProducts()
    dynamicProducts = [...products]
    console.log("Reset complete. Products count:", dynamicProducts.length)
  } catch (error) {
    console.error("Failed to reset products:", error)
  }
}

// Export the dynamic products array for use in other services
export { dynamicProducts }
