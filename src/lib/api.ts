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

  private buildBodyAndHeaders(options: RequestInit): { body?: BodyInit | null; headers?: HeadersInit } {
    const rawBody = options.body as any;

    // If using FormData/Blob/ArrayBuffer/ReadableStream, pass through and don't set JSON headers
    const isFormData = typeof FormData !== 'undefined' && rawBody instanceof FormData;
    const isBinary =
      rawBody instanceof Blob ||
      rawBody instanceof ArrayBuffer ||
      (typeof ReadableStream !== 'undefined' && rawBody instanceof ReadableStream);

    if (isFormData || isBinary) {
      // Do not set Content-Type; browser will set correct boundary for FormData
      return {
        body: rawBody ?? null,
        headers: {
          ...(options.headers ?? {}),
        },
      };
    }

    // If body is already a string, assume caller set headers correctly
    if (typeof rawBody === 'string') {
      return {
        body: rawBody,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers ?? {}),
        },
      };
    }

    // For plain objects/arrays, JSON encode
    const hasJsonBody = rawBody !== undefined && rawBody !== null;
    return {
      body: hasJsonBody ? JSON.stringify(rawBody) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const { body, headers } = this.buildBodyAndHeaders(options);
    const config: RequestInit = { ...options, body, headers };

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
    data?: Record<string, unknown> | unknown[] | FormData | string | Blob,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: (data as any) ?? undefined,
      headers,
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: Record<string, unknown> | unknown[] | FormData | string | Blob,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: (data as any) ?? undefined,
      headers,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    data?: Record<string, unknown> | unknown[] | FormData | string | Blob,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: (data as any) ?? undefined,
      headers,
    });
  }

  withAuth(token: string) {
    return {
      get: <T>(endpoint: string) => this.get<T>(endpoint, { Authorization: `Bearer ${token}` }),
      post: <T>(endpoint: string, data?: Record<string, unknown> | unknown[] | FormData | string | Blob) =>
        this.post<T>(endpoint, data, { Authorization: `Bearer ${token}` }),
      put: <T>(endpoint: string, data?: Record<string, unknown> | unknown[] | FormData | string | Blob) =>
        this.put<T>(endpoint, data, { Authorization: `Bearer ${token}` }),
      delete: <T>(endpoint: string) => this.delete<T>(endpoint, { Authorization: `Bearer ${token}` }),
      patch: <T>(endpoint: string, data?: Record<string, unknown> | unknown[] | FormData | string | Blob) =>
        this.patch<T>(endpoint, data, { Authorization: `Bearer ${token}` }),
    };
  }
}

export const apiService = new ApiService();

export default ApiService;
