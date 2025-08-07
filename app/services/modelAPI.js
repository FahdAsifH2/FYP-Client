import axios from 'axios';
import { config } from '../config/config';

// Configuration for your FastAPI model backend
const MODEL_API_BASE_URL = config.FASTAPI_MODEL_URL;

// API Service for ML Model Predictions
export const ModelAPI = {
  // Predict delivery mode
  predictDeliveryMode: async (patientData) => {
    try {
      const response = await axios.post(`${MODEL_API_BASE_URL}/predict`, patientData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Model API Error:', error);
      throw error;
    }
  },

  // Get model info
  getModelInfo: async () => {
    try {
      const response = await axios.get(`${MODEL_API_BASE_URL}/model/info`);
      return response.data;
    } catch (error) {
      console.error('Model Info Error:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await axios.get(`${MODEL_API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Health Check Error:', error);
      throw error;
    }
  }
};

// Helper function to transform patient data from your database to model format
export const transformPatientDataForModel = (patientData) => {
  return {
    mother_age: parseFloat(patientData.age) || 0,
    gravida: parseFloat(patientData.gravida) || 0,
    parity: patientData.parity !== undefined && patientData.parity !== null && !isNaN(parseFloat(patientData.parity))
      ? parseFloat(patientData.parity)
      : (parseFloat(patientData.gravida) - 1 || 0), // Use actual parity if available, else fallback
    gestation_weeks: 38.0, // Default value, you might want to add this field to your database
    previous_cs: patientData.previous_c_section ? 1.0 : 0.0
  };
};

// Default export to prevent expo-router warnings
export default ModelAPI;
