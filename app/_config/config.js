import Constants from 'expo-constants';
import { Platform } from 'react-native';

// The Expo packager host — used to auto-detect the dev machine's LAN IP.
// Only reliable in local (non-tunnel) mode. Ignored for tunnel/production.
const debuggerHost = Constants.expoConfig?.hostUri;
const isTunnel = debuggerHost && !debuggerHost.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);

// Backend IP — resolved from the packager when on LAN, hardcoded fallback otherwise.
let backendIp = '192.168.100.105'; // fallback: Windows dev machine IP

if (!isTunnel && debuggerHost) {
  // Local mode: packager runs on the same machine as the backend
  backendIp = debuggerHost.split(':')[0];
} else if (Platform.OS === 'android' && !debuggerHost) {
  backendIp = '10.0.2.2'; // Android emulator → host machine
}

export const config = {
  EXPRESS_API_URL: `http://${backendIp}:5001`,
  API_URL: `http://${backendIp}:5001`,
  FASTAPI_MODEL_URL: `http://${backendIp}:8000`,
  ML_API_URL: 'http://13.60.14.31:5000',

  REQUEST_TIMEOUT: 15000,

  ENDPOINTS: {
    PREDICT: '/predict',
    MODEL_INFO: '/model/info',
    HEALTH: '/health',
  },
};

export const getConfig = () => config;

export default config;
