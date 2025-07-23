import {
    ScrollView,
    Text,
    TextInput,
    Switch,
    View,
  } from 'react-native';
  import React, { useState } from 'react';
  import Navbar from '../components/Navbar';
  import { TouchableOpacity } from 'react-native';

  const Form = () => {
    const [formData, setFormData] = useState({
      name: '',
      age: '',
      weight: '',
      height: '',
      contact: '',
  
      gestationalAgeWeeks: '',
      gravida: '',
      NoPregnancies: '',
      abortions: '',
      isFirstPregnancy: false,
      previousComplicationDetails: '',
  
      preExistingConditions: [],
      familyHistory: [],
      currentMedications: [],
      bloodType: '',
  
      recentSymptoms: [],
      lastCheckupDate: '',
      bloodPressure: '',
      bloodSugarLevel: '',
      uploadedReports: [],
    });
  
    const handleChange = (key, value) => {
      setFormData(prev => ({ ...prev, [key]: value }));
    };
  
    const handleArrayInput = (key, csvString) => {
      handleChange(key, csvString.split(',').map(item => item.trim()));
    };
  
    return (
      <ScrollView className="p-4 bg-white dark:bg-black">
        <Navbar/>


       <ScrollView className='mt-40'>
    

       <Text className="text-2xl font-bold text-center mb-4 text-black dark:text-white">
          Pregnancy Form
        </Text>
       
        {/* Personal Info */}
        <Input label="Name" value={formData.name} onChange={val => handleChange('name', val)} />
        <Input label="Age" value={formData.age} keyboardType="numeric" onChange={val => handleChange('age', val)} />
        <Input label="Weight (kg)" value={formData.weight} keyboardType="numeric" onChange={val => handleChange('weight', val)} />
        <Input label="Height (cm)" value={formData.height} keyboardType="numeric" onChange={val => handleChange('height', val)} />
        <Input label="Contact Number" value={formData.contact} keyboardType="phone-pad" onChange={val => handleChange('contact', val)} />
  
        {/* Pregnancy Info */}
        <Input label="Gestational Age (weeks)" value={formData.gestationalAgeWeeks} onChange={val => handleChange('gestationalAgeWeeks', val)} />
        <Input label="Gravida" value={formData.gravida} onChange={val => handleChange('gravida', val)} />
        <Input label="No. of Pregnancies" value={formData.NoPregnancies} onChange={val => handleChange('NoPregnancies', val)} />
        <Input label="Abortions" value={formData.abortions} onChange={val => handleChange('abortions', val)} />
  
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-black dark:text-white">Is First Pregnancy?</Text>
          <Switch
            value={formData.isFirstPregnancy}
            onValueChange={val => handleChange('isFirstPregnancy', val)}
          />
        </View>
  
        <Input
          label="Previous Complication Details"
          value={formData.previousComplicationDetails}
          onChange={val => handleChange('previousComplicationDetails', val)}
        />
  
        {/* Medical History */}
        <Input
          label="Pre-existing Conditions (comma-separated)"
          value={formData.preExistingConditions.join(', ')}
          onChange={val => handleArrayInput('preExistingConditions', val)}
        />
        <Input
          label="Family History (comma-separated)"
          value={formData.familyHistory.join(', ')}
          onChange={val => handleArrayInput('familyHistory', val)}
        />
        <Input
          label="Current Medications (comma-separated)"
          value={formData.currentMedications.join(', ')}
          onChange={val => handleArrayInput('currentMedications', val)}
        />
        <Input
          label="Blood Type"
          value={formData.bloodType}
          onChange={val => handleChange('bloodType', val)}
        />
  
        {/* Current Status */}
        <Input
          label="Recent Symptoms (comma-separated)"
          value={formData.recentSymptoms.join(', ')}
          onChange={val => handleArrayInput('recentSymptoms', val)}
        />
        <Input
          label="Last Checkup Date"
          value={formData.lastCheckupDate}
          onChange={val => handleChange('lastCheckupDate', val)}
        />
        <Input
          label="Blood Pressure"
          value={formData.bloodPressure}
          onChange={val => handleChange('bloodPressure', val)}
        />
        <Input
          label="Blood Sugar Level"
          value={formData.bloodSugarLevel}
          onChange={val => handleChange('bloodSugarLevel', val)}
        />
  
        {/* Uploaded reports */}
        <Input
          label="Uploaded Reports (comma-separated URLs)"
          value={formData.uploadedReports.join(', ')}
          onChange={val => handleArrayInput('uploadedReports', val)}
        />
    
       
       <TouchableOpacity className='bg-purple-600 flex items-center rounded-md h-10 mt-3 mb-16'>
        <Text className='font-bold text-xl mt-1'>Submit</Text>
       </TouchableOpacity>
          
      </ScrollView>
      </ScrollView>
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
      />


      
    </View>
  );
  