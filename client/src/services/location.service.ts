import { API_BASE_URL } from '../config/api';

// Types based on your backend API responses
export interface Province {
  id: number;
  name: string;
  nameSi: string;
  nameTa: string;
  code: string;
  capital: string;
  area: number;
  population: number;
}

export interface District {
  id: number;
  name: string;
  nameSi: string;
  nameTa: string;
  code: string;
  capital: string;
  area: number;
  population: number;
  province: string;
}

export interface DSD {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  districtId: string;
  districtName: string;
  provinceId: string;
  provinceName: string;
  divisionCount: number;
}

export interface Division {
  id: string;
  name: string;
  nameEn: string;
  nameSi: string;
  gnNumber: string;
  dsdId: string;
  dsdName: string;
  districtId: string;
  districtName: string;
  provinceId: string;
  provinceName: string;
  area: number;
  population: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class LocationService {
  private baseUrl: string;
  private apiKey: string | null;

  constructor() {
    this.baseUrl = API_BASE_URL || 'http://localhost:3000/api/v1';
    this.apiKey = localStorage.getItem('lankalocate_api_key') || null;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    if (!this.apiKey) {
      throw new Error('API key not found. Please authenticate first.');
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your authentication.');
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data.data;
    } catch (error) {
      console.error('LocationService API Error:', error);
      throw error;
    }
  }

  /**
   * Set API key for authentication
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    localStorage.setItem('lankalocate_api_key', apiKey);
  }

  /**
   * Clear stored API key
   */
  clearApiKey(): void {
    this.apiKey = null;
    localStorage.removeItem('lankalocate_api_key');
  }

  /**
   * Get all provinces in Sri Lanka
   * GET /api/v1/provinces
   */
  async getProvinces(): Promise<Province[]> {
    return this.makeRequest<Province[]>('/provinces');
  }

  /**
   * Get a specific province by ID
   * GET /api/v1/provinces/:id
   */
  async getProvinceById(provinceId: number): Promise<Province> {
    return this.makeRequest<Province>(`/provinces/${provinceId}`);
  }

  /**
   * Get all districts in a specific province
   * GET /api/v1/provinces/:id/districts
   */
  async getDistrictsByProvince(provinceId: number): Promise<District[]> {
    return this.makeRequest<District[]>(`/provinces/${provinceId}/districts`);
  }

  /**
   * Get all districts or filter by province name
   * GET /api/v1/districts
   * GET /api/v1/districts?province={provinceName}
   */
  async getDistricts(provinceName?: string): Promise<District[]> {
    const endpoint = provinceName ? `/districts?province=${encodeURIComponent(provinceName)}` : '/districts';
    return this.makeRequest<District[]>(endpoint);
  }

  /**
   * Get a specific district by ID
   * GET /api/v1/districts/:id
   */
  async getDistrictById(districtId: number): Promise<District> {
    return this.makeRequest<District>(`/districts/${districtId}`);
  }

  /**
   * Get all GN divisions in a specific district
   * GET /api/v1/districts/:id/divisions
   */
  async getDivisionsByDistrict(districtId: number): Promise<Division[]> {
    return this.makeRequest<Division[]>(`/districts/${districtId}/divisions`);
  }

  /**
   * Get all DSDs (Divisional Secretariat Divisions) with optional filters
   * GET /api/v1/dsds
   * GET /api/v1/dsds?district={district}
   * GET /api/v1/dsds?province={province}
   */
  async getDSDs(filters?: { district?: string; province?: string }): Promise<DSD[]> {
    let endpoint = '/dsds';
    const params = new URLSearchParams();
    
    if (filters?.district) {
      params.append('district', filters.district);
    }
    if (filters?.province) {
      params.append('province', filters.province);
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return this.makeRequest<DSD[]>(endpoint);
  }

  /**
   * Get a specific DSD by ID (code)
   * GET /api/v1/dsds/:id
   */
  async getDSDById(dsdId: string): Promise<DSD> {
    return this.makeRequest<DSD>(`/dsds/${dsdId}`);
  }

  /**
   * Get all GN divisions in a specific DSD
   * GET /api/v1/dsds/:id/divisions
   * GET /api/v1/dsds/:id/divisions?includeGeometry=true
   */
  async getDivisionsByDSD(dsdId: string, includeGeometry: boolean = false): Promise<Division[]> {
    const endpoint = includeGeometry 
      ? `/dsds/${dsdId}/divisions?includeGeometry=true`
      : `/dsds/${dsdId}/divisions`;
    return this.makeRequest<Division[]>(endpoint);
  }

  /**
   * Get GN divisions with optional filters
   * GET /api/v1/divisions
   * GET /api/v1/divisions?district={district}&limit={limit}
   */
  async getDivisions(filters?: { 
    district?: string; 
    city?: string; 
    province?: string; 
    limit?: number 
  }): Promise<Division[]> {
    let endpoint = '/divisions';
    const params = new URLSearchParams();
    
    if (filters?.district) {
      params.append('district', filters.district);
    }
    if (filters?.city) {
      params.append('city', filters.city);
    }
    if (filters?.province) {
      params.append('province', filters.province);
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    return this.makeRequest<Division[]>(endpoint);
  }

  /**
   * Get a specific GN division by ID
   * GET /api/v1/divisions/:id
   */
  async getDivisionById(divisionId: string, includeGeometry: boolean = false): Promise<Division> {
    const endpoint = includeGeometry 
      ? `/divisions/${divisionId}?includeGeometry=true`
      : `/divisions/${divisionId}`;
    return this.makeRequest<Division>(endpoint);
  }

  /**
   * Search GN divisions by name or code
   * GET /api/v1/divisions/search?q={query}&limit={limit}
   */
  async searchDivisions(query: string, limit: number = 10): Promise<Division[]> {
    const endpoint = `/divisions/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    return this.makeRequest<Division[]>(endpoint);
  }

  /**
   * Check if API key is valid by making a test request
   */
  async validateApiKey(): Promise<boolean> {
    try {
      await this.getProvinces();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get API connection status
   */
  getConnectionStatus(): { connected: boolean; hasApiKey: boolean } {
    return {
      connected: !!this.apiKey,
      hasApiKey: !!this.apiKey
    };
  }
}

// Export singleton instance
export const locationService = new LocationService();
export default locationService;
