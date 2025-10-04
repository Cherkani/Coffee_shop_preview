/**
 * API Service
 * Handles all HTTP requests to the JSON server
 */

const API_BASE_URL = 'http://localhost:3001'

export class ApiService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Products API
  static async getProducts(): Promise<any[]> {
    return this.request('/products')
  }

  static async getProduct(id: string): Promise<any> {
    return this.request(`/products/${id}`)
  }

  static async createProduct(product: any): Promise<any> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
  }

  static async updateProduct(id: string, product: any): Promise<any> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
  }

  static async deleteProduct(id: string): Promise<void> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Users API
  static async getUsers(): Promise<any[]> {
    return this.request('/users')
  }

  static async getUser(id: string): Promise<any> {
    return this.request(`/users/${id}`)
  }

  // Organizations API
  static async getOrganizations(): Promise<any[]> {
    return this.request('/organizations')
  }

  static async getOrganization(id: string): Promise<any> {
    return this.request(`/organizations/${id}`)
  }

  // Orders API
  static async getOrders(): Promise<any[]> {
    return this.request('/orders')
  }

  static async createOrder(order: any): Promise<any> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    })
  }

  static async updateOrder(id: string, order: any): Promise<any> {
    return this.request(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    })
  }

  // Transactions API
  static async getTransactions(): Promise<any[]> {
    return this.request('/transactions')
  }

  static async createTransaction(transaction: any): Promise<any> {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    })
  }

  // Inventory API
  static async getInventory(): Promise<any[]> {
    return this.request('/inventory')
  }

  // Suppliers API
  static async getSuppliers(): Promise<any[]> {
    return this.request('/suppliers')
  }

  // Marketplace API
  static async getMarketplace(): Promise<any[]> {
    return this.request('/marketplace')
  }

  // Production API
  static async getProduction(): Promise<any[]> {
    return this.request('/production')
  }

  // Billing API
  static async getBilling(): Promise<any[]> {
    return this.request('/billing')
  }

  // Metrics API
  static async getMetrics(): Promise<any> {
    return this.request('/metrics')
  }

  // Navigation Settings API
  static async getNavigationSettings(): Promise<any[]> {
    return this.request('/navigationSettings')
  }

  static async updateNavigationSettings(id: string, settings: any): Promise<any> {
    return this.request(`/navigationSettings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  // Constants API
  static async getConstants(): Promise<any> {
    return this.request('/constants')
  }
}

export default ApiService
