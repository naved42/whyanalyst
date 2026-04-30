/**
 * API Client Utility
 * 
 * Automatically attaches Firebase ID tokens to all API requests.
 * Handles authentication errors and token refresh.
 */

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestOptions extends Omit<RequestInit, 'method' | 'headers'> {
  method?: ApiMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

/**
 * Makes an authenticated API request with automatic token handling.
 * 
 * @param url - The API endpoint URL
 * @param getToken - Function that returns the Firebase ID token
 * @param options - Request options (method, headers, body, etc.)
 * @returns Promise with the response data
 * 
 * @example
 * const response = await apiRequest('/api/chat', getToken, {
 *   method: 'POST',
 *   body: JSON.stringify({ messages: [] })
 * });
 */
export async function apiRequest<T = any>(
  url: string,
  getToken: () => Promise<string | null>,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers = {},
    params,
    ...restOptions
  } = options;

  // Get the authentication token
  const token = await getToken();
  if (!token) {
    return {
      ok: false,
      status: 401,
      error: 'Not authenticated'
    };
  }

  // Prepare headers with authentication
  const finalHeaders: Record<string, string> = {
    ...headers,
    'Authorization': `Bearer ${token}`
  };

  // Add Content-Type if not already set and body exists
  if (restOptions.body && !finalHeaders['Content-Type']) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  // Build URL with query parameters if provided
  let finalUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    finalUrl = queryString ? `${url}?${queryString}` : url;
  }

  try {
    const response = await fetch(finalUrl, {
      method,
      headers: finalHeaders,
      ...restOptions
    });

    // Handle 401 Unauthorized (token might be invalid)
    if (response.status === 401) {
      return {
        ok: false,
        status: 401,
        error: 'Authentication token invalid or expired'
      };
    }

    // Try to parse JSON response
    let data: T | undefined;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: !response.ok ? (data as any)?.error || `HTTP ${response.status}` : undefined
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

/**
 * GET request with automatic authentication
 */
export async function apiGet<T = any>(
  url: string,
  getToken: () => Promise<string | null>,
  options?: Omit<ApiRequestOptions, 'method'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, getToken, { ...options, method: 'GET' });
}

/**
 * POST request with automatic authentication
 */
export async function apiPost<T = any>(
  url: string,
  getToken: () => Promise<string | null>,
  body?: any,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, getToken, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined
  });
}

/**
 * PUT request with automatic authentication
 */
export async function apiPut<T = any>(
  url: string,
  getToken: () => Promise<string | null>,
  body?: any,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, getToken, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined
  });
}

/**
 * DELETE request with automatic authentication
 */
export async function apiDelete<T = any>(
  url: string,
  getToken: () => Promise<string | null>,
  options?: Omit<ApiRequestOptions, 'method'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, getToken, { ...options, method: 'DELETE' });
}

/**
 * PATCH request with automatic authentication
 */
export async function apiPatch<T = any>(
  url: string,
  getToken: () => Promise<string | null>,
  body?: any,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, getToken, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined
  });
}

/**
 * Upload a file with automatic authentication
 * 
 * @param url - The upload endpoint
 * @param getToken - Function that returns the Firebase ID token
 * @param file - The file to upload
 * @param fieldName - The form field name (default: 'file')
 * @param additionalData - Additional form data to send
 */
export async function apiUpload<T = any>(
  url: string,
  getToken: () => Promise<string | null>,
  file: File,
  fieldName: string = 'file',
  additionalData?: Record<string, string>
): Promise<ApiResponse<T>> {
  const token = await getToken();
  if (!token) {
    return {
      ok: false,
      status: 401,
      error: 'Not authenticated'
    };
  }

  const formData = new FormData();
  formData.append(fieldName, file);
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    let data: T | undefined;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: !response.ok ? (data as any)?.error || `HTTP ${response.status}` : undefined
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}
