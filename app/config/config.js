// Configuration for different environments
export const config = {

//PLEASE REPLACE IP ADDRESS WITH YOUR IP ADDRESS
//IN CMD RUN ipconfig and replace the IP address below with your IPv4 address
// Set EXPRESS_API_URL via environment variable for flexibility and security.
// Example: EXPRESS_API_URL='http://192.168.194.42:5001' npm start
  EXPRESS_API_URL: process.env.EXPRESS_API_URL || 'http://192.168.100.108:5001',
  FASTAPI_MODEL_URL: process.env.FASTAPI_MODEL_URL || 'http://192.168.100.108:8000',

  ALTERNATIVE_URLS: [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://192.168.100.100:8000',
    'http://0.0.0.0:8000'
  ],
  

  REQUEST_TIMEOUT: 15000, 
  

  ENDPOINTS: {
    PREDICT: '/predict',
    MODEL_INFO: '/model/info',
    HEALTH: '/health'
  }
};

export const getConfig = () => {
  return config;
};

// Default export to prevent expo-router warnings
export default config;