const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    institution?: string;
    department?: string;
    researchArea?: string;
    bio?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      website?: string;
    };
  }): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
    }

    return response;
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    this.clearToken();
    localStorage.removeItem('userData');
    localStorage.removeItem('verificationData');

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: any }>> {
    return this.request<{ user: any }>('/auth/me');
  }

  // Verification methods
  async sendOTP(email: string): Promise<ApiResponse> {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(email: string, otp: string): Promise<ApiResponse> {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async verifyScholarProfile(profileUrl: string): Promise<ApiResponse<{ profile: any }>> {
    return this.request<{ profile: any }>('/auth/verify-scholar', {
      method: 'POST',
      body: JSON.stringify({ profileUrl }),
    });
  }

  // Token management
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export default new ApiService();
