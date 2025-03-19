/**
 * Utility functions for handling environment configuration
 */

/**
 * Checks if a specific feature should use mock data based on environment variables
 * @param {string} feature - Feature name (e.g., 'CHAT', 'SOUL_QUEST', 'WISDOM_PETS')
 * @returns {boolean} - True if mock data should be used, false otherwise
 */
export const shouldUseMockData = (feature) => {
  const envKey = `REACT_APP_${feature}_USE_MOCK`;
  const envValue = process.env[envKey];
  
  // If the specific setting is defined, use that
  if (envValue !== undefined) {
    return envValue !== 'false';
  }
  
  // Fall back to global setting
  return process.env.REACT_APP_USE_MOCK_DATA !== 'false';
};

/**
 * Gets the API base URL from environment variables
 * @returns {string} - The API base URL
 */
export const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
};

/**
 * Logs current environment configuration for debugging
 */
export const logEnvConfig = () => {
  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment Configuration:');
    console.log(`API URL: ${getApiBaseUrl()}`);
    console.log(`Global Mock Data: ${shouldUseMockData('GLOBAL')}`);
    console.log(`Chat Mock: ${shouldUseMockData('CHAT')}`);
    console.log(`SoulQuest Mock: ${shouldUseMockData('SOUL_QUEST')}`);
    console.log(`WisdomPets Mock: ${shouldUseMockData('WISDOM_PETS')}`);
  }
}; 