// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: T = await response.json();

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers,
    });
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: Record<string, unknown> | unknown[],
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: Record<string, unknown> | unknown[],
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  // DELETE request
  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    data?: Record<string, unknown> | unknown[],
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  // Set Authorization header for authenticated requests
  withAuth(token: string) {
    return {
      get: <T>(endpoint: string) => 
        this.get<T>(endpoint, { Authorization: `Bearer ${token}` }),
      post: <T>(endpoint: string, data?: Record<string, unknown> | unknown[]) => 
        this.post<T>(endpoint, data, { Authorization: `Bearer ${token}` }),
      put: <T>(endpoint: string, data?: Record<string, unknown> | unknown[]) => 
        this.put<T>(endpoint, data, { Authorization: `Bearer ${token}` }),
      delete: <T>(endpoint: string) => 
        this.delete<T>(endpoint, { Authorization: `Bearer ${token}` }),
      patch: <T>(endpoint: string, data?: Record<string, unknown> | unknown[]) => 
        this.patch<T>(endpoint, data, { Authorization: `Bearer ${token}` }),
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for custom instances if needed
export default ApiService;
