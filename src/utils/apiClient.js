// 📁 frontend/src/utils/apiClient.js

import axios from 'axios';

// Default to environment variable or fallback to the webhook URL
const BASE_URL = import.meta.env.VITE_API_URL || 'https://metarama-webhook-g603.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  // Disable credentials to avoid CORS preflight issues
  withCredentials: false
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage if it exists
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and retries
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    console.log('API Error:', error.message);
    
    // Get retry count from config or initialize it
    const retryCount = error.config.__retryCount || 0;
    const maxRetries = 5;
    
    // Handle CORS errors, rate limiting (429), and network errors
    if (
      error.message.includes('Network Error') || // Network error (including CORS)
      error.message.includes('CORS') || // Explicit CORS error
      (error.response?.status === 429) || // Rate limiting
      (error.code === 'ECONNABORTED') || // Timeout
      (!error.response) // Other network errors
    ) {
      if (retryCount < maxRetries) {
        // Increment retry count
        error.config.__retryCount = retryCount + 1;
        
        // Calculate delay with exponential backoff and jitter
        const baseDelay = 1000 * (2 ** retryCount);
        const jitter = Math.random() * 1000; // Add up to 1 second of random jitter
        const delayMs = Math.min(baseDelay + jitter, 30000); // Cap at 30 seconds
        
        console.log(`Retry #${retryCount + 1}/${maxRetries} after ${Math.round(delayMs)}ms delay...`);
        
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        
        // Retry the request
        return api(error.config);
      }
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log('Authentication error. Token may be expired.');
      // You could implement token refresh logic here
      // For now, we'll just clear the token
      localStorage.removeItem('auth_token');
    }
    
    // Handle 404 errors specifically
    if (error.response?.status === 404) {
      console.log('Resource not found:', error.config.url);
      return {
        success: false,
        message: 'Resource not found',
        error: 'NOT_FOUND'
      };
    }
    
    return Promise.reject(error);
  }
);

// Add a simple test function to verify connectivity
const testConnection = async () => {
  try {
    console.log('Testing connection to API...');
    const response = await api.get('/api/health');
    console.log('Connection test successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
};

// API methods
const apiMethods = {
  /**
   * Fetch recent tokens from the backend
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Number of tokens per page
   * @returns {Promise<Object>} Object containing success status, tokens array, and pagination metadata
   */
  getTokens: async (page = 1, limit = 230) => {
    try {
      const url = `/api/tokens/recent?limit=${limit}`;
      const fullUrl = `${BASE_URL}${url}`;
      
      console.log('API baseURL:', BASE_URL);
      console.log('API endpoint path:', url);
      console.log('Full request URL:', fullUrl);
      
      const response = await api.get(url);
      
      console.log('API Response:', response);
      
      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format');
      }
      
      // Ensure we have the expected properties
      if (!response.hasOwnProperty('tokens')) {
        throw new Error('Response missing required properties');
      }
      
      return {
        success: true,
        tokens: response.tokens,
        hasMore: response.tokens.length === limit,
        total: response.tokens.length,
        page: page,
        limit: limit
      };
    } catch (error) {
      console.error('Error fetching tokens:', error);
      
      // Return a consistent error response format
      return { 
        success: false, 
        message: error.message || 'Failed to fetch tokens',
        tokens: [], // Empty array to prevent UI errors
        hasMore: false,
        total: 0,
        page: page,
        limit: limit
      };
    }
  },
  
  /**
   * Get a specific token by mint address
   * @param {string} mint - Token mint address
   * @returns {Promise<Object>} Token data
   */
  getToken: async (mint) => {
    try {
      return await api.get(`/api/tokens/${mint}`);
    } catch (error) {
      console.error('Error fetching token:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch token',
        token: null
      };
    }
  },
  
  /**
   * Verify a wallet address
   * @param {Object} body - Request body containing publicKey
   * @returns {Promise<Object>} Verification result
   */
  verifyWallet: async (body) => {
    try {
      return await api.post('/api/connect/verify', body);
    } catch (error) {
      console.error('Wallet verification error:', error);
      return {
        success: false,
        message: error.message || 'Wallet verification failed'
      };
    }
  },
  
  /**
   * Authenticate user with credentials
   * @param {Object} credentials - User credentials
   * @returns {Promise<Object>} Authentication result
   */
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      // If login successful, store the token
      if (response.success && response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  },
  
  /**
   * Logout user and clear authentication
   */
  logout: () => {
    localStorage.removeItem('auth_token');
  }
};

// Add the methods to the api object
Object.assign(api, apiMethods);

// Export the API methods
export default {
  ...api,
  testConnection
};