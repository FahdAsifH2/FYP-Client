import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DoctorSvg from './components/DoctorSvg';
import ExpectingMotherSvg from './components/ExpectingMotherSvg';
import { useAuth } from './contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'doctor') {
        router.replace('/DoctorScreens/DashBoard');
      } else {
        router.replace('/PatientScreens/PatientsDashBoard');
      }
    }
  }, [user, loading]);

  if (loading || user) {
    return (
      <View className="flex-1 justify-center items-center bg-gradient-to-br from-primary-50 via-white to-white">
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-br from-primary-50 via-white to-white">
      {/* Header */}
      <View className="pt-16 pb-8 px-6 bg-transparent">
        <Text className="text-3xl font-bold text-gynai-gray-800 text-center tracking-tight">
          GynAI
        </Text>
        <Text className="text-lg text-gynai-gray-600 text-center mt-2">
          Your trusted companion for every stage of womanhood
        </Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-6">
        <View className="flex-1 justify-between py-6">
          {/* Cards Container */}
          <View className="flex-1">
            {/* Medical Professional Card */}
            <TouchableOpacity
              onPress={() => router.push('/register?role=doctor')}
              className="flex-1 mb-4"
            >
              <View className="bg-white/80 rounded-3xl shadow-sm border border-gynai-gray-100 flex-1 overflow-hidden">
                {/* Large SVG section - fills entire top area */}
                <View className="flex-[2]">
                  <DoctorSvg width="100%" height="100%" />
                </View>

                {/* Text section below */}
                <View className="px-6 pb-6 pt-4 bg-transparent">
                  <Text className="text-lg font-bold text-gynai-gray-900 mb-2">
                    I am a medical professional
                  </Text>
                  <Text className="text-gynai-gray-600 text-sm leading-5">
                    Access tools and resources for gynecological practice.
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Expecting Mother Card */}
            <TouchableOpacity
              onPress={() => router.push('/register?role=patient')}
              className="flex-1"
            >
              <View className="bg-white/80 rounded-3xl shadow-sm border border-gynai-gray-100 flex-1 overflow-hidden">
                {/* Large SVG section - fills entire top area */}
                <View className="flex-[2]">
                  <ExpectingMotherSvg width="100%" height="100%" />
                </View>

                {/* Text section below */}
                <View className="px-6 pb-6 pt-4 bg-transparent">
                  <Text className="text-lg font-bold text-gynai-gray-900 mb-2">
                    I am expecting or tracking my pregnancy
                  </Text>
                  <Text className="text-gynai-gray-600 text-sm leading-5">
                    Support and guidance for your pregnancy journey.
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Login Link - Fixed at bottom */}
          <View className="items-center py-4">
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-gynai-gray-500 text-sm">
                Already have an account?{' '}
                <Text className="text-gynai-pink font-bold">Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
