import type { Product, User } from "../types"
import { filterProductsByTenant } from "../multi-tenant-filtering"
import ApiService from "./api-service"

/**
 * Product Service
 * Handles all product-related data operations with multi-tenant filtering
 */

export async function getProducts(user: User | null, selectedLocations?: string[], products?: Product[]): Promise<Product[]> {
  const sourceProducts: Product[] = products ?? await ApiService.getProducts()
  
  console.log("Product service - getProducts called:")
  console.log("- User:", user)
  console.log("- Source products count:", sourceProducts.length)
  console.log("- Selected locations:", selectedLocations)
  
  const filteredProducts = filterProductsByTenant(sourceProducts, user, selectedLocations)
  console.log("- Filtered products count:", filteredProducts.length)
  
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

// Product management functions that write to API
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

  const result = await ApiService.createProduct(newProduct)
  return result
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
  const result = await ApiService.updateProduct(productId, updatedProduct)
  return result
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

  await ApiService.deleteProduct(productId)
  return true
}

// API-based product functions
export async function getProductsFromAPI(user: User | null, selectedLocations?: string[]): Promise<Product[]> {
  const allProducts = await ApiService.getProducts()
  return filterProductsByTenant(allProducts, user, selectedLocations)
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

  const createdProduct = await ApiService.createProduct(newProduct)
  return createdProduct
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

  const updatedProduct = await ApiService.updateProduct(productId, { ...product, ...updates })
  return updatedProduct
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

  await ApiService.deleteProduct(productId)
  return true
}
