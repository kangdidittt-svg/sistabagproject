// API base configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  main_image_url?: string;
  category: Category;
  images?: {
    _id: string;
    url: string;
    alt_text?: string;
    is_primary: boolean;
  }[];
  specifications?: { [key: string]: string };
  is_featured: boolean;
  stock: number;
  rating?: number;
  discount?: number;
  views?: number;
  sales?: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  product_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Promo {
  _id: string;
  title: string;
  description: string;
  discount_percentage: number;
  max_discount: number;
  start_date: string;
  end_date: string;
  applicable_categories: Category[];
  is_active: boolean;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// HTTP client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('admin_token', token);
    } else {
      localStorage.removeItem('admin_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<ApiResponse<{ token: string; admin: AdminUser }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async verifyToken(): Promise<ApiResponse<{ admin: AdminUser }>> {
    return this.request('/auth/verify', {
      method: 'POST',
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<ApiResponse<AdminUser>> {
    return this.request('/auth/profile');
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    search?: string;
    sort?: string;
  }): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    const response = await this.request<Product[]>(`/products${query ? `?${query}` : ''}`);
    return {
      success: true,
      data: response.data || [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: response.data?.length || 0,
        totalPages: 1
      }
    };
  }

  async getProduct(slug: string): Promise<ApiResponse<Product>> {
    return this.request(`/products/${slug}`);
  }

  async createProduct(productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Category endpoints
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request('/categories');
  }

  async getCategory(slug: string): Promise<ApiResponse<Category>> {
    return this.request(`/categories/${slug}`);
  }

  async getCategoryProducts(
    slug: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      sort?: string;
    }
  ): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    const response = await this.request<Product[]>(`/categories/${slug}/products${query ? `?${query}` : ''}`);
    return {
      success: true,
      data: response.data || [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: response.data?.length || 0,
        totalPages: 1
      }
    };
  }

  async createCategory(categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string): Promise<ApiResponse> {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Promo endpoints
  async getActivePromos(): Promise<ApiResponse<Promo[]>> {
    return this.request('/promos/active');
  }

  async getPromo(id: string): Promise<ApiResponse<Promo>> {
    return this.request(`/promos/${id}`);
  }

  async getAllPromos(params?: {
    status?: 'active' | 'inactive' | 'expired';
  }): Promise<ApiResponse<Promo[]>> {
    const searchParams = new URLSearchParams();
    if (params?.status) {
      searchParams.append('status', params.status);
    }
    
    const query = searchParams.toString();
    return this.request(`/promos${query ? `?${query}` : ''}`);
  }

  async createPromo(promoData: Partial<Promo>): Promise<ApiResponse<Promo>> {
    return this.request('/promos', {
      method: 'POST',
      body: JSON.stringify(promoData),
    });
  }

  async updatePromo(id: string, promoData: Partial<Promo>): Promise<ApiResponse<Promo>> {
    return this.request(`/promos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promoData),
    });
  }

  async deletePromo(id: string): Promise<ApiResponse> {
    return this.request(`/promos/${id}`, {
      method: 'DELETE',
    });
  }

  async togglePromoStatus(id: string): Promise<ApiResponse<Promo>> {
    return this.request(`/promos/${id}/toggle-status`, {
      method: 'PATCH',
    });
  }

  // Search endpoint
  async searchProducts(query: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams({ q: query });
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const response = await this.request<Product[]>(`/products/search?${searchParams.toString()}`);
    return {
      success: true,
      data: response.data || [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: response.data?.length || 0,
        totalPages: 1
      }
    };
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual service functions for convenience
export const authService = {
  login: (username: string, password: string) => apiClient.login(username, password),
  verifyToken: () => apiClient.verifyToken(),
  logout: () => apiClient.logout(),
  getProfile: () => apiClient.getProfile(),
  setToken: (token: string | null) => apiClient.setToken(token),
};

export const productService = {
  getAll: (params?: Parameters<typeof apiClient.getProducts>[0]) => apiClient.getProducts(params),
  getBySlug: (slug: string) => apiClient.getProduct(slug),
  create: (data: Partial<Product>) => apiClient.createProduct(data),
  update: (id: string, data: Partial<Product>) => apiClient.updateProduct(id, data),
  delete: (id: string) => apiClient.deleteProduct(id),
  search: (query: string, params?: Parameters<typeof apiClient.searchProducts>[1]) => 
    apiClient.searchProducts(query, params),
};

export const categoryService = {
  getAll: () => apiClient.getCategories(),
  getBySlug: (slug: string) => apiClient.getCategory(slug),
  getProducts: (slug: string, params?: Parameters<typeof apiClient.getCategoryProducts>[1]) => 
    apiClient.getCategoryProducts(slug, params),
  create: (data: Partial<Category>) => apiClient.createCategory(data),
  update: (id: string, data: Partial<Category>) => apiClient.updateCategory(id, data),
  delete: (id: string) => apiClient.deleteCategory(id),
};

export const promoService = {
  getActive: () => apiClient.getActivePromos(),
  getById: (id: string) => apiClient.getPromo(id),
  getAll: (params?: Parameters<typeof apiClient.getAllPromos>[0]) => apiClient.getAllPromos(params),
  create: (data: Partial<Promo>) => apiClient.createPromo(data),
  update: (id: string, data: Partial<Promo>) => apiClient.updatePromo(id, data),
  delete: (id: string) => apiClient.deletePromo(id),
  toggleStatus: (id: string) => apiClient.togglePromoStatus(id),
};

export default apiClient;