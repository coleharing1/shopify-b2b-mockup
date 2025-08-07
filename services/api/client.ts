/**
 * Typed fetch wrapper with timeout, retries, and error handling
 */

import { API_CONFIG, IS_PRODUCTION } from '@/config/app.config'

export interface RequestConfig extends RequestInit {
  timeout?: number
  retries?: number
  retryDelay?: number
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Create a fetch request with timeout
 */
function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new ApiError('Request timeout', 408)), timeout)
    )
  ])
}

/**
 * Retry logic for failed requests
 */
async function retryRequest(
  url: string,
  options: RequestInit,
  retries: number,
  delay: number,
  timeout: number
): Promise<Response> {
  let lastError: Error | null = null
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetchWithTimeout(url, options, timeout)
      
      // Only retry on server errors or network issues
      if (response.ok || response.status < 500) {
        return response
      }
      
      lastError = new ApiError(`Server error: ${response.status}`, response.status)
    } catch (error) {
      lastError = error as Error
    }
    
    // Wait before retrying (except on last attempt)
    if (i < retries) {
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))) // Exponential backoff
    }
  }
  
  throw lastError || new ApiError('Request failed after retries')
}

/**
 * Main API client
 */
export class ApiClient {
  private baseUrl: string
  private defaultHeaders: HeadersInit
  
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_CONFIG.baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }
  
  /**
   * Set authorization header
   */
  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`
    }
  }
  
  /**
   * Clear authorization header
   */
  clearAuthToken() {
    const headers = { ...this.defaultHeaders }
    delete (headers as any).Authorization
    this.defaultHeaders = headers
  }
  
  /**
   * Make an API request
   */
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = API_CONFIG.timeout,
      retries = API_CONFIG.retries,
      retryDelay = API_CONFIG.retryDelay,
      headers = {},
      ...options
    } = config
    
    const url = `${this.baseUrl}${endpoint}`
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    }
    
    try {
      const response = await retryRequest(url, requestOptions, retries, retryDelay, timeout)
      
      // Handle different response types
      const contentType = response.headers.get('content-type')
      let data: any
      
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else if (contentType?.includes('text/')) {
        data = await response.text()
      } else {
        data = await response.blob()
      }
      
      // Check for error responses
      if (!response.ok) {
        throw new ApiError(
          data?.message || `Request failed with status ${response.status}`,
          response.status,
          data?.code,
          data
        )
      }
      
      return data as T
    } catch (error) {
      // Log errors in development
      if (!IS_PRODUCTION) {
        console.error('API Request Error:', error)
      }
      
      // Re-throw ApiError as-is
      if (error instanceof ApiError) {
        throw error
      }
      
      // Wrap other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        undefined,
        'UNKNOWN_ERROR',
        error
      )
    }
  }
  
  /**
   * Convenience methods
   */
  get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }
  
  post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
  
  put<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
  
  patch<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
  
  delete<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }
}

// Default client instance
export const apiClient = new ApiClient()