// API configuration
export const BASE_URL = 'https://metarama-webhook-g603.onrender.com';

// Log the current API configuration
console.log('API Configuration:', {
  BASE_URL,
  ENV: import.meta.env.MODE
});

// API endpoints
export const ENDPOINTS = {
  NEW_TOKENS: `${BASE_URL}/api/tokens/recent?limit=100`,
  ALL_TOKENS: `${BASE_URL}/api/tokens`,
  TOKEN_DETAILS: (address) => `${BASE_URL}/api/tokens/${address}`,
  CREATE_TOKEN: `${BASE_URL}/api/tokens/create`,
};

// Helper function for API calls
export const fetchAPI = async (endpoint, options = {}) => {
  console.log(`Fetching API: ${endpoint}`);
  
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    console.log(`API Response Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status}`, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log(`API Response Data:`, data);
      return data;
    } else {
      const text = await response.text();
      console.error('API returned non-JSON response:', text);
      throw new Error('API returned non-JSON response');
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}; 