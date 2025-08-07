import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { config } from '../config/config'; 

// Constants
const DEFAULT_REQUEST_TIMEOUT_MS = 10000; 

const PredictDelivery = () => {
  const [formData, setFormData] = useState({
    mother_age: '',
    gravida: '',
    parity: '',
    gestation_weeks: '',
    previous_cs: ''
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handlePredict = async () => {
    
    if (
      formData.mother_age === '' ||
      formData.gravida === '' ||
      formData.parity === '' ||
      formData.gestation_weeks === '' ||
      formData.previous_cs === '' ||
      formData.mother_age == null ||
      formData.gravida == null ||
      formData.parity == null ||
      formData.gestation_weeks == null ||
      formData.previous_cs == null
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

  
    const age = parseFloat(formData.mother_age);
    const gravida = parseFloat(formData.gravida);
    const parity = parseFloat(formData.parity);
    const weeks = parseFloat(formData.gestation_weeks);
    const cs = parseFloat(formData.previous_cs);

    // Validate numeric inputs
    if (isNaN(age) || isNaN(gravida) || isNaN(parity) || isNaN(weeks) || isNaN(cs)) {
      Alert.alert('Error', 'Please enter valid numeric values');
      return;
    }

    // Range validations
    if (age < 12 || age > 60) {
      Alert.alert('Error', 'Mother age must be between 12 and 60 years');
      return;
    }
    if (weeks < 20 || weeks > 45) {
      Alert.alert('Error', 'Gestational weeks must be between 20 and 45');
      return;
    }
    if (parity > gravida) {
      Alert.alert('Error', 'Parity cannot be greater than Gravida');
      return;
    }
    if (cs < 0) {
      Alert.alert('Error', 'Previous cesarean sections cannot be negative');
      return;
    }
    if (gravida < 1) {
      Alert.alert('Error', 'Gravida must be at least 1');
      return;
    }
    if (parity < 0) {
      Alert.alert('Error', 'Parity cannot be negative');
      return;
    }

    setLoading(true);
    
    try {
      const apiPayload = {
        Mother_Age: age,
        Gravida: gravida,
        Parity: parity,
        Gestation_Weeks: weeks,
        Previous_CS: cs
      };

      console.log('Sending prediction request:', apiPayload);
      console.log('API URL:', `${config.FASTAPI_MODEL_URL}/predict`); 

      const response = await axios.post(
        `${config.FASTAPI_MODEL_URL}/predict`, 
        apiPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: config.REQUEST_TIMEOUT || DEFAULT_REQUEST_TIMEOUT_MS,
          validateStatus: function (status) {
            return status >= 200 && status < 300;
          }
        }
      );

      console.log('Prediction response:', response.data);
      setPrediction(response.data);
      
    } catch (error) {
      console.error('Prediction error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config?.url
      });
      
      let errorMessage = 'Unable to get prediction. Please check if the model server is running.';
      
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const detail = error.response.data?.detail || error.response.data?.message;
        
        if (status === 400) {
          errorMessage = `Invalid input data: ${detail || 'Please check your input values'}`;
        } else if (status === 422) {
          errorMessage = `Validation error: ${detail || 'Please check your input format'}`;
        } else if (status === 500) {
          errorMessage = `Server error: ${detail || 'Model prediction failed'}`;
        } else {
          errorMessage = detail || `Server error: ${status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection and server URL.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. The server is taking too long to respond.';
      } else {
        errorMessage = `Unexpected error: ${error.message}`;
      }
      
      Alert.alert('Prediction Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      mother_age: '',
      gravida: '',
      parity: '',
      gestation_weeks: '',
      previous_cs: ''
    });
    setPrediction(null);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-white">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-gynai-gray-800">
              Delivery Prediction
            </Text>
          </View>
          <View className="w-6" />
        </View>
      </View>
      
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold text-primary-600 text-center mb-2">
          AI Delivery Mode Prediction
        </Text>
        <Text className="text-sm text-gynai-gray-600 text-center mb-8">
          Enter patient information to get AI-powered delivery recommendations
        </Text>

        {/* Input Form */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-gray-100">
          <Text className="text-lg font-bold text-gynai-gray-800 mb-6 text-center">
            Patient Information
          </Text>

          <InputField
            label="Mother's Age"
            value={formData.mother_age}
            onChange={(val) => handleChange('mother_age', val)}
            keyboardType="numeric"
            placeholder="Enter age (12-60 years)"
            icon="person"
            required={true}
          />

          <InputField
            label="Gravida (Total Pregnancies)"
            value={formData.gravida}
            onChange={(val) => handleChange('gravida', val)}
            keyboardType="numeric"
            placeholder="Total number of pregnancies (minimum 1)"
            icon="heart"
            required={true}
          />

          <InputField
            label="Parity (Previous Live Births)"
            value={formData.parity}
            onChange={(val) => handleChange('parity', val)}
            keyboardType="numeric"
            placeholder="Number of previous live births (0 or more)"
            icon="happy"
            required={true}
          />

          <InputField
            label="Gestational Weeks"
            value={formData.gestation_weeks}
            onChange={(val) => handleChange('gestation_weeks', val)}
            keyboardType="numeric"
            placeholder="Current gestational weeks (20-45)"
            icon="time"
            required={true}
          />

          <InputField
            label="Previous Cesarean Sections"
            value={formData.previous_cs}
            onChange={(val) => handleChange('previous_cs', val)}
            keyboardType="numeric"
            placeholder="Number of previous C-sections (0 if none)"
            icon="medical"
            required={true}
          />

          {/* Action Buttons */}
          <View className="mt-6 space-y-3">
            <TouchableOpacity
              onPress={resetForm}
              className="bg-gray-100 py-4 px-6 rounded-2xl border border-gray-200"
            >
              <Text className="text-gynai-gray-700 font-semibold text-center text-base">
                Reset Form
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePredict}
              disabled={loading}
              className="bg-primary-500 py-4 px-6 rounded-2xl shadow-lg"
              style={{
                shadowColor: '#ec4899',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-bold ml-2">Analyzing...</Text>
                </View>
              ) : (
                <View className="flex-row justify-center items-center">
                  <Ionicons name="analytics" size={20} color="white" />
                  <Text className="text-white font-bold text-center text-base ml-2">
                    Predict Delivery Mode
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Prediction Results*/}
        {prediction && (
          <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-gray-100">
            <View className="items-center mb-6">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="checkmark-circle" size={32} color="#10b981" />
              </View>
              <Text className="text-xl font-bold text-gynai-gray-800 text-center">
                Prediction Results
              </Text>
            </View>
            
            <View className="space-y-4">
              <View className="bg-primary-50 p-4 rounded-2xl border border-primary-200">
                <Text className="text-sm font-semibold text-primary-700 mb-2">
                  Recommended Delivery Mode
                </Text>
                <Text className="text-xl text-gynai-gray-800 font-bold">
                  {prediction.predicted_delivery_type}
                </Text>
              </View>

              {prediction.confidence_score && (
                <View className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                  <Text className="text-sm font-semibold text-blue-700 mb-2">
                    Confidence Score
                  </Text>
                  <Text className="text-lg text-gynai-gray-800 font-semibold">
                    {(prediction.confidence_score * 100).toFixed(1)}%
                  </Text>
                </View>
              )}

              {prediction.probabilities && (
                <View className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                  <Text className="text-sm font-semibold text-purple-700 mb-3">
                    All Probabilities
                  </Text>
                  {Object.entries(prediction.probabilities).map(([mode, prob]) => (
                    <View key={mode} className="flex-row justify-between items-center mb-2">
                      <Text className="text-sm text-gynai-gray-700">{mode}</Text>
                      <Text className="text-sm font-semibold text-gynai-gray-800">
                        {(prob * 100).toFixed(1)}%
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                <View className="bg-red-50 p-4 rounded-2xl border border-red-200">
                  <Text className="text-sm font-semibold text-red-700 mb-3">
                    Risk Factors
                  </Text>
                  {prediction.risk_factors.map((factor, index) => (
                    <Text key={index} className="text-sm text-gynai-gray-700 mb-1">
                      • {factor}
                    </Text>
                  ))}
                </View>
              )}

              {prediction.recommendations && prediction.recommendations.length > 0 && (
                <View className="bg-green-50 p-4 rounded-2xl border border-green-200">
                  <Text className="text-sm font-semibold text-green-700 mb-3">
                    Clinical Recommendations
                  </Text>
                  {prediction.recommendations.map((recommendation, index) => (
                    <Text key={index} className="text-sm text-gynai-gray-700 mb-1">
                      • {recommendation}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        <View className="mb-8" />
      </ScrollView>
    </View>
  );
};


const InputField = ({ label, value, onChange, keyboardType = 'default', placeholder, icon, required = false }) => (
  <View className="mb-4">
    <Text className="text-sm font-semibold text-gynai-gray-700 mb-2">
      {label}{required && <Text className="text-red-500"> *</Text>}
    </Text>
    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
      <Ionicons name={icon} size={20} color="#9ca3af" />
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={placeholder}
        className="flex-1 ml-3 text-gynai-gray-800 text-base"
        placeholderTextColor="#9CA3AF"
        returnKeyType="next"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  </View>
);

export default PredictDelivery;