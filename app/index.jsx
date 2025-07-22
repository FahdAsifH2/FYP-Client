import React from 'react';
import { View, Text } from 'react-native';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Cards from './components/cards';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import DashBoard from './DoctorScreens/DashBoard';

const Index = () => {
  return (
    <View className="flex-1 bg-white">
      <Navbar />

      <View className="flex items-center justify-center mt-96">
        <TouchableOpacity onPress={() => router.push('/DoctorScreens/DashBoard')} className="h-16 w-10/12 bg-purple-500 rounded-md items-center justify-center">
          <Text className="text-xl text-white font-bold">Doctor</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/PatientsScreens/Dashboard')} className="h-16 w-10/12 bg-purple-500 rounded-md items-center justify-center mt-6">
          <Text className="text-xl text-white font-bold">Patients</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;
