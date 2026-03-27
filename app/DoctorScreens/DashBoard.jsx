import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Cards from '../_components/cards';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../_contexts/AuthContext';

const Dashboard = () => {
  const { logout, user } = useAuth();
  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-white shadow-sm shadow-black/5 z-10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.replace('/')}>
            <Ionicons name="home-outline" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gynai-gray-800 tracking-tight">
              Doctor Panel
            </Text>
          </View>
          <TouchableOpacity onPress={async () => {
            await logout();
            router.replace('/');
          }}>
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Section */}
      <View className="px-6 py-4 bg-white mb-2">
        <Text className="text-lg text-gynai-gray-600">
          Welcome back, Dr. {user?.name || 'Doctor'}
        </Text>
        <Text className="text-sm text-gynai-gray-500 mt-1">
          Manage your patients and medical records
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
        <View className="space-y-4">
          <Cards
            Title="My Patients"
            Description="View your connected patients, their documents, and manage their care from one place."
            onPress={() => router.push('/DoctorScreens/MyPatients')}
            icon="people"
            iconColor="pink-500"
          />

          <View className="h-4" />

          <Cards
            Title="Manage Appointments"
            Description="View, confirm, and manage patient appointments. Add notes after consultations."
            onPress={() => router.push('/DoctorScreens/ManageAppointments')}
            icon="calendar"
            iconColor="blue-500"
          />

          <View className="h-4" />

          <Cards
            Title="Shared Documents"
            Description="View clinical documents, lab reports, and scans shared by your patients."
            onPress={() => router.push('/DoctorScreens/SharedDocuments')}
            icon="documents"
            iconColor="purple-500"
          />

          <View className="h-4" />

          <Cards
            Title="Predict Delivery Mode"
            Description="Use AI-powered analysis to predict delivery method based on medical history."
            onPress={() => router.push('/DoctorScreens/PredictDelivery')}
            icon="analytics"
            iconColor="primary-500"
          />

          <View className="h-4" />

          <Cards
            Title="Antenatal Form"
            Description="Fill comprehensive antenatal records for your patients."
            onPress={() => router.push('/DoctorScreens/AntenatalForm')}
            icon="document-text"
            iconColor="green-500"
          />

          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
