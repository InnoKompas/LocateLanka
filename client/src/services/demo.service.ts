import { API_BASE_URL } from '../config/api';
import { type Province, type District, type DSD, type Division, type ApiResponse } from './location.service';

interface DemoTokenData {
  token: string;
  sessionId: string;
  maxRequests: number;
  expiresAt: string;
  usage: {
    requestsUsed: number;
    requestsRemaining: number;
  };
}

/**
 * INTERNAL DEMO SERVICE - FOR DOCUMENTATION DEMO ONLY
 * 
 * This service uses JWT-based demo tokens for secure access to demo endpoints.
 * Tokens are limited to 50 requests and expire after 1 hour.
 * 
 * For production applications, users MUST use the authenticated LocationService with API keys.
 */
class DemoService {
  private baseUrl: string;
  private demoToken: string | null = null;
  private tokenData: DemoTokenData | null = null;

  constructor() {
    // Prefer explicit env; otherwise pick sensible dev default
    const isDevHost = typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost';
    const isViteDev = typeof window !== 'undefined' && window.location && window.location.port === '5173';
    const apiBase = API_BASE_URL;
    if (apiBase && apiBase.includes('localhost:3000') && isDevHost && isViteDev) {
      this.baseUrl = 'http://localhost:5000/api/v1';
    } else if (apiBase) {
      this.baseUrl = apiBase;
    } else {
      this.baseUrl = 'http://localhost:5000/api/v1';
    }
  }

  /**
   * Get or refresh demo token
   */
  private async ensureDemoToken(): Promise<string> {
    // Check if we have a valid token
    if (this.demoToken && this.tokenData) {
      const expiresAt = new Date(this.tokenData.expiresAt).getTime();
      const now = Date.now();
      const timeRemaining = expiresAt - now;
      
      // If token expires in less than 5 minutes, get a new one
      if (timeRemaining > 5 * 60 * 1000) {
        return this.demoToken;
      }
    }

    // Generate new demo token
    const response = await fetch(`${this.baseUrl}/demo-token/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ purpose: 'location-finder-demo' }),
      credentials: 'omit'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get demo token: HTTP ${response.status} - ${errorText}`);
    }

    const tokenResponse = await response.json();
    
    if (!tokenResponse.success) {
      throw new Error(tokenResponse.error || 'Failed to generate demo token');
    }

    this.demoToken = tokenResponse.data.token;
    this.tokenData = tokenResponse.data;

    console.log(`[DemoService] New token generated. Requests remaining: ${this.tokenData?.usage?.requestsRemaining || 0}`);
    
    return this.demoToken!;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      // Ensure we have a valid demo token
      const token = await this.ensureDemoToken();

      const response = await fetch(`${this.baseUrl}/demo${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'omit' // Don't send cookies or credentials
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, clear it and retry once
          this.demoToken = null;
          this.tokenData = null;
          throw new Error('Demo token expired. Please refresh the page.');
        }
        if (response.status === 403) {
          throw new Error('Access denied: This demo is only available from the official LankaLocate website.');
        }
        if (response.status === 429) {
          throw new Error('Demo usage limit reached. Please sign up for a full API key.');
        }
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      // Update token usage info from response headers
      const requestsUsed = response.headers.get('X-Demo-Requests-Used');
      const requestsRemaining = response.headers.get('X-Demo-Requests-Remaining');
      
      if (this.tokenData && requestsUsed && requestsRemaining) {
        this.tokenData.usage.requestsUsed = parseInt(requestsUsed);
        this.tokenData.usage.requestsRemaining = parseInt(requestsRemaining);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data.data;
    } catch (error) {
      console.error('DemoService API Error:', error);
      throw error;
    }
  }

  /**
   * Get all provinces in Sri Lanka
   * GET /api/v1/demo/provinces
   */
  async getProvinces(): Promise<Province[]> {
    return this.makeRequest<Province[]>('/provinces');
  }

  /**
   * Get all districts in a specific province
   * GET /api/v1/demo/provinces/:id/districts
   */
  async getDistrictsByProvince(provinceId: string): Promise<District[]> {
    return this.makeRequest<District[]>(`/provinces/${provinceId}/districts`);
  }

  /**
   * Get DSDs filtered by district name
   * GET /api/v1/demo/dsds?district={district}
   */
  async getDSDsByDistrict(districtName: string): Promise<DSD[]> {
    const endpoint = `/dsds?district=${encodeURIComponent(districtName)}`;
    return this.makeRequest<DSD[]>(endpoint);
  }

  /**
   * Get all GN divisions in a specific DSD
   * GET /api/v1/demo/dsds/:id/divisions
   */
  async getDivisionsByDSD(dsdId: string): Promise<Division[]> {
    return this.makeRequest<Division[]>(`/dsds/${dsdId}/divisions`);
  }

  /**
   * Search GN divisions by name
   * GET /api/v1/demo/divisions/search?q={query}&limit={limit}
   */
  async searchDivisions(query: string, limit: number = 10): Promise<Division[]> {
    const endpoint = `/divisions/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    return this.makeRequest<Division[]>(endpoint);
  }

  /**
   * Test connectivity to the demo API
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getProvinces();
      return true;
    } catch (error) {
      console.error('Demo API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get service status
   */
  getStatus(): { isDemo: boolean; requiresApiKey: boolean; tokenInfo?: DemoTokenData } {
    return {
      isDemo: true,
      requiresApiKey: false,
      tokenInfo: this.tokenData || undefined
    };
  }

  /**
   * Get current demo token usage info
   */
  getTokenUsage(): { requestsUsed: number; requestsRemaining: number; maxRequests: number } | null {
    if (!this.tokenData) {
      return null;
    }

    return {
      requestsUsed: this.tokenData.usage.requestsUsed,
      requestsRemaining: this.tokenData.usage.requestsRemaining,
      maxRequests: this.tokenData.maxRequests
    };
  }
}

// Export singleton instance
export const demoService = new DemoService();
export default demoService;
