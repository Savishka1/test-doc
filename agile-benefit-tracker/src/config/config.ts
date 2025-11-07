// Application Configuration
// Toggle between mock data and real API

export const config = {
  // Set to false to use real backend API
  USE_MOCK_DATA: true,
  
  // Backend API URL
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Feature flags
  ENABLE_FILE_UPLOAD: true,
  ENABLE_EMAIL_NOTIFICATIONS: true,
};

// Helper to check if using mock data
export const useMockData = () => config.USE_MOCK_DATA;
