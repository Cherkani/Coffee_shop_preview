import type { Product, User } from "../types"
import { mockProducts } from "../mock-data"
import { filterProductsByTenant } from "../multi-tenant-filtering"
import { getAllProducts, addProductToMockData, updateProductInMockData, deleteProductFromMockData } from "./mock-data-persistence"
import ApiService from "./api-service"

/**
 * Product Service
 * Handles all product-related data operations with multi-tenant filtering
 */

export async function getProducts(user: User | null, selectedLocations?: string[], products?: Product[]): Promise<Product[]> {
  let sourceProducts: Product[]
  
  if (products) {
    sourceProducts = products
  } else {
    try {
      // Try to get products from API first
      sourceProducts = await ApiService.getProducts()
      console.log("Product service - getProducts from API:", sourceProducts.length)
    } catch (error) {
      console.log("API failed, falling back to mock data persistence:", error)
      sourceProducts = getAllProducts()
    }
  }
  
  console.log("Product service - getProducts called:")
  console.log("- User:", user)
  console.log("- Source products count:", sourceProducts.length)
  console.log("- Selected locations:", selectedLocations)
  
  const filteredProducts = filterProductsByTenant(sourceProducts, user, selectedLocations)
  console.log("- Filtered products count:", filteredProducts.length)
  console.log("- Filtered products:", filteredProducts)
  
  return filteredProducts
}

export async function getProductById(productId: string, user: User | null): Promise<Product | undefined> {
  const products = await getProducts(user)
  return products.find(product => product.id === productId)
}

export async function getProductsByCategory(category: string, user: User | null): Promise<Product[]> {
  const products = await getProducts(user)
  return products.filter(product => product.category === category)
}

export async function getProductsByLocation(locationId: string, user: User | null): Promise<Product[]> {
  const products = await getProducts(user)
  return products.filter(product => product.locationId === locationId)
}

export async function getAvailableProducts(user: User | null): Promise<Product[]> {
  const products = await getProducts(user)
  return products.filter(product => product.available)
}

export async function searchProducts(searchTerm: string, user: User | null): Promise<Product[]> {
  const products = await getProducts(user)
  const term = searchTerm.toLowerCase()
  
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  )
}

// Product management functions that write to mock data
export async function addProduct(productData: Omit<Product, "id">, user: User | null): Promise<Product> {
  if (!user) {
    throw new Error("User must be authenticated to add products")
  }

  const newProduct: Product = {
    ...productData,
    id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    organizationId: user.organizationId || "",
    locationId: user.locationId || "",
  }

  try {
    // Try to save to API first
    console.log("Attempting to save product to API:", newProduct)
    const result = await ApiService.createProduct(newProduct)
    console.log("Product saved to API successfully:", result)
  } catch (error) {
    console.error("Failed to save product to API:", error)
    console.error("Error details:", error.message)
    // Fallback to mock data persistence
    addProductToMockData(newProduct)
    console.log("Product saved to mock data as fallback:", newProduct)
  }

  return newProduct
}

export async function updateProduct(productId: string, updates: Partial<Product>, user: User | null): Promise<Product | null> {
  if (!user) {
    throw new Error("User must be authenticated to update products")
  }

  const product = await getProductById(productId, user)
  if (!product) {
    throw new Error("Product not found")
  }

  // Check if user has permission to update this product
  if (product.organizationId !== user.organizationId) {
    throw new Error("You don't have permission to update this product")
  }

  const updatedProduct = { ...product, ...updates }

  try {
    // Try to update in API first
    await ApiService.updateProduct(productId, updatedProduct)
    console.log("Product updated in API successfully:", updatedProduct)
  } catch (error) {
    console.error("Failed to update product in API:", error)
    // Fallback to mock data persistence
    updateProductInMockData(productId, updates)
    console.log("Product updated in mock data as fallback:", updatedProduct)
  }

  return updatedProduct
}

export async function deleteProduct(productId: string, user: User | null): Promise<boolean> {
  if (!user) {
    throw new Error("User must be authenticated to delete products")
  }

  const product = await getProductById(productId, user)
  if (!product) {
    throw new Error("Product not found")
  }

  // Check if user has permission to delete this product
  if (product.organizationId !== user.organizationId) {
    throw new Error("You don't have permission to delete this product")
  }

  try {
    // Try to delete from API first
    await ApiService.deleteProduct(productId)
    console.log("Product deleted from API successfully:", productId)
  } catch (error) {
    console.error("Failed to delete product from API:", error)
    // Fallback to mock data persistence
    deleteProductFromMockData(productId)
    console.log("Product deleted from mock data as fallback:", productId)
  }

  return true
}

// API-based product functions
export async function getProductsFromAPI(user: User | null, selectedLocations?: string[]): Promise<Product[]> {
  try {
    console.log("Fetching products from API...")
    const allProducts = await ApiService.getProducts()
    console.log("Products from API:", allProducts)
    
    const filteredProducts = filterProductsByTenant(allProducts, user, selectedLocations)
    console.log("Filtered products:", filteredProducts)
    
    return filteredProducts
  } catch (error) {
    console.error("Error fetching products from API:", error)
    // Fallback to mock data
    console.log("Falling back to mock data...")
    const sourceProducts = getAllProducts()
    return filterProductsByTenant(sourceProducts, user, selectedLocations)
  }
}

export async function addProductToAPI(productData: Omit<Product, "id">, user: User | null): Promise<Product> {
  if (!user) {
    throw new Error("User must be authenticated to add products")
  }

  const newProduct: Product = {
    ...productData,
    id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    organizationId: user.organizationId || "",
    locationId: user.locationId || "",
  }

  try {
    console.log("Adding product to API:", newProduct)
    const createdProduct = await ApiService.createProduct(newProduct)
    console.log("Product created in API:", createdProduct)
    return createdProduct
  } catch (error) {
    console.error("Error adding product to API:", error)
    // Fallback to mock data
    console.log("Falling back to mock data...")
    addProductToMockData(newProduct)
    return newProduct
  }
}

export async function updateProductInAPI(productId: string, updates: Partial<Product>, user: User | null): Promise<Product | null> {
  if (!user) {
    throw new Error("User must be authenticated to update products")
  }

  const product = await getProductById(productId, user)
  if (!product) {
    throw new Error("Product not found")
  }

  // Check if user has permission to update this product
  if (product.organizationId !== user.organizationId) {
    throw new Error("You don't have permission to update this product")
  }

  try {
    console.log("Updating product in API:", productId, updates)
    const updatedProduct = await ApiService.updateProduct(productId, { ...product, ...updates })
    console.log("Product updated in API:", updatedProduct)
    return updatedProduct
  } catch (error) {
    console.error("Error updating product in API:", error)
    // Fallback to mock data
    console.log("Falling back to mock data...")
    updateProductInMockData(productId, updates)
    return { ...product, ...updates }
  }
}

export async function deleteProductFromAPI(productId: string, user: User | null): Promise<boolean> {
  if (!user) {
    throw new Error("User must be authenticated to delete products")
  }

  const product = await getProductById(productId, user)
  if (!product) {
    throw new Error("Product not found")
  }

  // Check if user has permission to delete this product
  if (product.organizationId !== user.organizationId) {
    throw new Error("You don't have permission to delete this product")
  }

  try {
    console.log("Deleting product from API:", productId)
    await ApiService.deleteProduct(productId)
    console.log("Product deleted from API")
    return true
  } catch (error) {
    console.error("Error deleting product from API:", error)
    // Fallback to mock data
    console.log("Falling back to mock data...")
    deleteProductFromMockData(productId)
    return true
  }
}
