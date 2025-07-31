import {
  ScrollView,
  Text,
  TextInput,
  Switch,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gravida: '',
    blood_pressure: '',
    height: '',
    diabetes: false,
    previous_c_section: false,
  });

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.age || !formData.gravida) {
      alert('Please fill in all required fields');
      return;
    }

    console.log('Form Data:', formData);

    // ✅ Map frontend keys to backend expected keys
    const apiPayload = {
      Name: formData.name,
      Age: formData.age,
      Gravida: formData.gravida,
      BloodPreassure: formData.blood_pressure,
      Height: formData.height,
      Diabetes: formData.diabetes,
      PreviousCSections: formData.previous_c_section,
    };

    try {
      const response = await axios.post(
        "http://192.168.31.189:5001/api/Doctors/putPatients",
        apiPayload
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Form submitted successfully");
        alert("Form submitted successfully");

        // setFormData({
        //   name: '',
        //   age: '',
        //   gravida: '',
        //   blood_pressure: '',
        //   height: '',
        //   diabetes: false,
        //   previous_c_section: false,
        // });
      } else {
        console.log("Error submitting form");
        alert("Error submitting form");
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Something went wrong while submitting the form');
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Navbar />

      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          className="mt-40 p-4"
          contentContainerStyle={{
            paddingBottom: 50,
            flexGrow: 1
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold text-center mb-4 text-black dark:text-white">
            Patient Information Form
          </Text>

          {/* Basic Information */}
          <Input
            label="Name *"
            value={formData.name}
            onChange={val => handleChange('name', val)}
          />

          <Input
            label="Age *"
            value={formData.age}
            keyboardType="numeric"
            onChange={val => handleChange('age', val)}
          />

          <Input
            label="Height (cm)"
            value={formData.height}
            keyboardType="numeric"
            onChange={val => handleChange('height', val)}
          />

          {/* Pregnancy Information */}
          <Input
            label="Gravida *"
            value={formData.gravida}
            keyboardType="numeric"
            onChange={val => handleChange('gravida', val)}
          />

          {/* Medical Information */}
          <Input
            label="Blood Pressure (e.g., 120/80)"
            value={formData.blood_pressure}
            onChange={val => handleChange('blood_pressure', val)}
          />

          {/* Boolean Fields with Switches */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-black dark:text-white">Has Diabetes?</Text>
            <Switch
              value={formData.diabetes}
              onValueChange={val => handleChange('diabetes', val)}
            />
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-black dark:text-white">Previous C-Section?</Text>
            <Switch
              value={formData.previous_c_section}
              onValueChange={val => handleChange('previous_c_section', val)}
            />
          </View>

          <TouchableOpacity
            className='bg-purple-600 flex items-center rounded-md h-10 mt-6 mb-8'
            onPress={handleSubmit}
          >
            <Text className='font-bold text-xl mt-1 text-white'>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Form;

// ✅ Reusable Input Component
const Input = ({ label, value, onChange, keyboardType = 'default' }) => (
  <View className="mb-4">
    <Text className="mb-1 text-black dark:text-white">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      placeholder={label}
      className="border border-gray-300 dark:border-purple-600 p-3 rounded text-black dark:text-white"
      placeholderTextColor="#9CA3AF"
    />
  </View>
);
