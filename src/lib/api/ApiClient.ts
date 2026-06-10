// Frontend/lib/api/ApiClient.ts
export class ApiClient {
  private baseUrl: string;
  private getToken: () => string | null;

  constructor(baseUrl: string, getToken: () => string | null) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
    console.log('constructor:baseUrl:', baseUrl, ' - getToken:', getToken);
  }

  // SỬA 1: Thêm <T = any> để 'request' hỗ trợ kiểu generic
  private async request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`API ${res.status}: ${msg}`);
    }
    try {
      // SỬA 2: Ép kiểu dữ liệu trả về là T
      return (await res.json()) as T;
    } catch {
      return null as any; // Trả về null (ép kiểu) nếu không có JSON
    }
  }

  // SỬA 3: Cập nhật 'get', 'post', 'put', 'delete' để dùng <T>
  get<T = any>(path: string): Promise<T> { 
    return this.request<T>(path, { method: 'GET' }); 
  }
  
  post<T = any>(path: string, body?: any): Promise<T> { 
    console.log('post:path:', path);
    console.log('post:body:', body);
    return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) }); 
  }
  
  put<T = any>(path: string, body?: any): Promise<T> { 
    return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) }); 
  }

  patch<T = any>(path: string, body?: any): Promise<T> { 
    return this.request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }); 
  }
  
  delete<T = any>(path: string): Promise<T> { 
    return this.request<T>(path, { method: 'DELETE' }); 
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
);