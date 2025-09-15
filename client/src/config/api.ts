// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : 'http://localhost:3000/api/v1';
export const API_TIMEOUT = 10000; // 10 seconds

// API Key management
export const getStoredApiKey = (): string | null => {
  return localStorage.getItem('lankalocate_api_key');
};

export const setStoredApiKey = (apiKey: string): void => {
  localStorage.setItem('lankalocate_api_key', apiKey);
};

export const clearStoredApiKey = (): void => {
  localStorage.removeItem('lankalocate_api_key');
};

// Default headers for API requests
export const getDefaultHeaders = (apiKey?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  return headers;
};
