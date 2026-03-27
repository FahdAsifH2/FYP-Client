import Constants from 'expo-constants';
import { Platform } from 'react-native';

const debuggerHost = Constants.expoConfig?.hostUri;
let localIp = '192.168.100.105'; // fallback

if (debuggerHost) {
  localIp = debuggerHost.split(':')[0];
} else if (Platform.OS === 'android') {
  localIp = '10.0.2.2';
} else if (Platform.OS === 'ios') {
  localIp = 'localhost';
} else if (Platform.OS === 'web') {
  localIp = 'localhost';
}

// Configuration for different environments
export const config = {

  // Dynamically resolved from your Expo packager
  EXPRESS_API_URL: `http://${localIp}:5001`,
  API_URL: `http://${localIp}:5001`,
  FASTAPI_MODEL_URL: `http://${localIp}:8000`,
  ML_API_URL: 'http://13.60.14.31:5000',

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

export default config;