import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Cards from '../components/cards';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Dashboard = () => {
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-white">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gynai-gray-800">
              Doctor Panel Dashboard
            </Text>
          </View>
          <View className="w-6" />
        </View>
      </View>

      {/* Welcome Section */}
      <View className="px-6 py-4 bg-white mb-2">
        <Text className="text-lg text-gynai-gray-600">
          Welcome back, Dr. XYZ
        </Text>
        <Text className="text-sm text-gynai-gray-500 mt-1">
          Manage your patients and medical records
        </Text>
import Patients from './Patients';
import Footer from '../components/Footer';

const Dashboard = () => {
  return (
    <View className="flex-1">
      <Background />
      <Navbar />
      
      <View className="flex-1 justify-center items-center px-4 mt-32 mb-12">
        <Cards 
          Title="Predict Delivery Mode"
          Description="Use this tool to predict the most likely delivery method for your patient."
          onPress={() => router.push('/DoctorScreens/DelieveryModePredictionService')   }
        />
        <View style={{ height: 24 }} />
        <Cards 
          Title="Appointment Booking"
          Description="You can check your appointments here."
          onPress={() => console.log("Navigation to the Appointments")}
        />
        <View style={{ height: 24 }} />
        <Cards 
          Title="Patients History"
          Description="Chat and interact with your patient."
          onPress={() => router.push('/DoctorScreens/AntenatalForm')}
        />
        <View style={{ height: 24 }} />
        <Cards 
          Title="Patient's Medical Records"
          Description="Check the medical records of your patients here. You can also chat with them."
          onPress={() => router.push('/DoctorScreens/Patients')}
        />
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        <View className="space-y-4">
          <Cards 
            Title="Predict Delivery Mode"
            Description="Use AI-powered analysis to predict the most likely delivery method for your patient based on medical history and current data."
            onPress={() => router.push('/DoctorScreens/PredictDelivery')}
            icon="analytics"
            iconColor="primary-500"
          />
          
          <View className="h-4" />
          
          <Cards 
            Title="Appointment Schedule"
            Description="View and manage your upcoming appointments. Check patient schedules and availability slots."
            onPress={() => console.log("Navigation to the Appointments")}
            icon="calendar"
            iconColor="blue-500"
          />
          
          <View className="h-4" />
          
          <Cards 
            Title="Patient Medical History"
            Description="Access comprehensive medical histories and communicate directly with your patients through secure messaging."
            onPress={() => router.push('/DoctorScreens/AntenatalForm')}
            icon="document-text"
            iconColor="green-500"
          />
          
          <View className="h-4" />
          
          <Cards 
            Title="Patient Medical Records"
            Description="Browse through detailed medical records of your patients. Review test results, diagnoses, and treatment plans."
            onPress={() => router.push('/DoctorScreens/Patients')}
            icon="folder"
            iconColor="orange-500"
          />

          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
