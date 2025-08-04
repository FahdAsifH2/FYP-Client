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
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Background from '../components/Background';
import axios from 'axios';
import { config } from '../config/config'; 

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
    
    if (!formData.mother_age || !formData.gravida || !formData.parity || 
        !formData.gestation_weeks || !formData.previous_cs) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

  
    const age = parseFloat(formData.mother_age);
    const gravida = parseFloat(formData.gravida);
    const parity = parseFloat(formData.parity);
    const weeks = parseFloat(formData.gestation_weeks);
    const cs = parseFloat(formData.previous_cs);

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
          timeout: config.REQUEST_TIMEOUT || 10000,
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
        errorMessage = error.response.data?.detail || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and server URL.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
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
    <View className="flex-1 bg-white">
      <Navbar />
      <Background />
      
      <ScrollView className="flex-1 px-4 pt-32" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-purple-500 text-center mb-8">
          DELIVERY MODE PREDICTION
        </Text>

        {/* Input Form */}
        <View style={{
          backgroundColor: '#E9D5FF',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: 16,
            textAlign: 'center'
          }}>
            Patient Information
          </Text>

          <InputField
            label="Mother's Age (12-60 years)"
            value={formData.mother_age}
            onChange={(val) => handleChange('mother_age', val)}
            keyboardType="numeric"
            placeholder="e.g., 28"
          />

          <InputField
            label="Gravida (Total Pregnancies)"
            value={formData.gravida}
            onChange={(val) => handleChange('gravida', val)}
            keyboardType="numeric"
            placeholder="e.g., 2"
          />

          <InputField
            label="Parity (Previous Live Births)"
            value={formData.parity}
            onChange={(val) => handleChange('parity', val)}
            keyboardType="numeric"
            placeholder="e.g., 1"
          />

          <InputField
            label="Gestational Weeks (20-45)"
            value={formData.gestation_weeks}
            onChange={(val) => handleChange('gestation_weeks', val)}
            keyboardType="numeric"
            placeholder="e.g., 38.5"
          />

          <InputField
            label="Previous Cesarean Sections"
            value={formData.previous_cs}
            onChange={(val) => handleChange('previous_cs', val)}
            keyboardType="numeric"
            placeholder="e.g., 1 (0 for none)"
          />

          {/* Action Buttons */}
          <View className="mt-6">
            <TouchableOpacity
              onPress={resetForm}
              className="bg-gray-400 py-4 px-6 rounded-lg mb-3"
            >
              <Text className="text-white font-bold text-center text-lg">
                RESET FORM
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePredict}
              disabled={loading}
              className="bg-purple-600 py-4 px-6 rounded-lg"
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-bold ml-2">Predicting...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-center text-lg">
                  🔮 PREDICT DELIVERY MODE
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Prediction Results*/}
        {prediction && (
          <View className="bg-green-100 rounded-xl p-6 mb-6 border-2 border-green-300">
            <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🎯 PREDICTION RESULTS
            </Text>
            
            <View>
              <View className="mb-6 bg-white p-4 rounded-lg shadow">
                <Text className="text-lg font-semibold text-green-600 mb-2">
                  🏥 Recommended Delivery Mode:
                </Text>
                <Text className="text-2xl text-gray-800 font-bold text-center bg-yellow-100 p-3 rounded">
                  {prediction.predicted_delivery_type}
                </Text>
              </View>

              {prediction.confidence_score && (
                <View className="mb-4 bg-white p-4 rounded-lg shadow">
                  <Text className="text-lg font-semibold text-blue-600 mb-2">
                    📊 Confidence Score:
                  </Text>
                  <Text className="text-xl text-gray-800 font-bold">
                    {(prediction.confidence_score * 100).toFixed(1)}%
                  </Text>
                </View>
              )}

              {prediction.probabilities && (
                <View className="mb-4 bg-white p-4 rounded-lg shadow">
                  <Text className="text-lg font-semibold text-purple-600 mb-2">
                    📈 All Probabilities:
                  </Text>
                  {Object.entries(prediction.probabilities).map(([mode, prob]) => (
                    <Text key={mode} className="text-md text-gray-700 ml-2 mb-1">
                      • {mode}: {(prob * 100).toFixed(1)}%
                    </Text>
                  ))}
                </View>
              )}

              {prediction.confidence_level && (
                <View className="mb-4 bg-white p-4 rounded-lg shadow">
                  <Text className="text-lg font-semibold text-indigo-600 mb-2">
                    🎚️ Confidence Level:
                  </Text>
                  <Text className="text-md text-gray-700">
                    {prediction.confidence_level.level}: {prediction.confidence_level.description}
                  </Text>
                </View>
              )}

              {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                <View className="mb-4 bg-red-50 p-4 rounded-lg border border-red-200">
                  <Text className="text-lg font-semibold text-red-600 mb-2">
                    ⚠️ Risk Factors:
                  </Text>
                  {prediction.risk_factors.map((factor, index) => (
                    <Text key={index} className="text-md text-gray-700 ml-2 mb-1">
                      • {factor}
                    </Text>
                  ))}
                </View>
              )}

              {prediction.recommendations && prediction.recommendations.length > 0 && (
                <View className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Text className="text-lg font-semibold text-blue-600 mb-2">
                    💡 Clinical Recommendations:
                  </Text>
                  {prediction.recommendations.map((recommendation, index) => (
                    <Text key={index} className="text-md text-gray-700 ml-2 mb-1">
                      • {recommendation}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        <View className="mb-32" />
      </ScrollView>
    </View>
  );
};


const InputField = ({ label, value, onChange, keyboardType = 'default', placeholder }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ 
      marginBottom: 8, 
      color: '#374151', 
      fontWeight: '600',
      fontSize: 16 
    }}>
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      placeholder={placeholder}
      style={{
        borderWidth: 1,
        borderColor: '#D1A3FF',
        padding: 12,
        borderRadius: 8,
        color: '#1F2937',
        backgroundColor: 'white',
        fontSize: 16,
        minHeight: 48
      }}
      placeholderTextColor="#9CA3AF"
    />
  </View>
);

export default PredictDelivery;