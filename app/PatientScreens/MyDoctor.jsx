import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../_config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyDoctor() {
  const [myDoctor, setMyDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showDoctorList, setShowDoctorList] = useState(false);

  const getToken = async () => {
    return await AsyncStorage.getItem('userToken');
  };

  const fetchMyDoctor = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/relationships/my-doctor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyDoctor(res.data.data);
    } catch (err) {
      console.error('Error fetching my doctor:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/relationships/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchMyDoctor(), fetchDoctors()]);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const connectWithDoctor = async (doctorId, doctorName) => {
    Alert.alert(
      'Connect with Doctor',
      `Would you like to connect with ${doctorName}? They will be able to view your shared documents and manage your appointments.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: async () => {
            setConnecting(doctorId);
            try {
              const token = await getToken();
              await axios.post(`${config.API_URL}/api/relationships/connect`,
                { doctorId },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setConnecting(null);
              Alert.alert('Connected!', `You are now connected with ${doctorName}`, [
                { text: 'OK', onPress: () => router.replace('/PatientScreens/MyDoctor') }
              ]);
            } catch (err) {
              Alert.alert('Error', err.response?.data?.error || 'Failed to connect');
              setConnecting(null);
            }
          }
        }
      ]
    );
  };

  const disconnectDoctor = async () => {
    if (!myDoctor) return;
    Alert.alert(
      'Disconnect',
      `Are you sure you want to disconnect from ${myDoctor.doctor_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect', style: 'destructive',
          onPress: async () => {
            try {
              const token = await getToken();
              await axios.delete(`${config.API_URL}/api/relationships/disconnect/${myDoctor.doctor_id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              setMyDoctor(null);
              Alert.alert('Disconnected', 'You have been disconnected from your doctor');
            } catch (err) {
              Alert.alert('Error', 'Failed to disconnect');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#ec4899" />
        <Text className="text-gray-500 mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Header */}
      <View className="pt-16 pb-6 px-6 bg-white shadow-sm flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800 tracking-tight">My Doctor</Text>
      </View>

      <View className="p-6">
        {/* Current Doctor Card */}
        {myDoctor ? (
          <View className="bg-white rounded-3xl p-6 mb-6 border border-gynai-pink-border shadow-sm">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-gynai-pink-bg justify-center items-center mr-4">
                <Ionicons name="person" size={32} color="#ec4899" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900">{myDoctor.doctor_name}</Text>
                <Text className="text-sm text-gray-500">{myDoctor.doctor_email}</Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                  <Text className="text-xs text-green-600 font-medium">Connected</Text>
                </View>
              </View>
            </View>

            <View className="bg-gynai-pink-bg rounded-2xl p-4 mb-4">
              <Text className="text-gynai-pink-dark text-sm font-medium">Your OB-GYN can view shared documents and manage your appointments.</Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity
                onPress={() => router.push('/PatientScreens/Appointments')}
                className="flex-1 bg-gynai-pink rounded-xl py-3 mr-2 items-center"
              >
                <Text className="text-white font-bold">Book Appointment</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={disconnectDoctor} className="bg-gray-100 rounded-xl py-3 px-4 items-center">
                <Ionicons name="close-circle-outline" size={22} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="bg-white rounded-3xl p-6 mb-6 border border-dashed border-gynai-pink-border">
            <View className="items-center py-4">
              <View className="w-20 h-20 rounded-full bg-gynai-pink-bg justify-center items-center mb-4">
                <Ionicons name="person-add" size={36} color="#ec4899" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">No Doctor Connected</Text>
              <Text className="text-gray-500 text-center mb-6 px-4">
                Connect with your OB-GYN to book appointments and share your clinical documents securely.
              </Text>
              <TouchableOpacity
                onPress={() => setShowDoctorList(true)}
                className="bg-gynai-pink rounded-xl py-3 px-8"
              >
                <Text className="text-white font-bold text-lg">Find a Doctor</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Doctor List */}
        {(showDoctorList || !myDoctor) && (
          <View>
            <Text className="text-lg font-bold text-gray-800 mb-4">Available Doctors</Text>
            {doctors.length === 0 ? (
              <View className="bg-white rounded-2xl p-6 items-center">
                <Ionicons name="medical-outline" size={48} color="#D1D5DB" />
                <Text className="text-gray-400 mt-2">No doctors registered yet</Text>
              </View>
            ) : (
              doctors.map((doc) => (
                <View key={doc.id} className="bg-white rounded-2xl p-4 mb-3 flex-row items-center border border-gray-100">
                  <View className="w-12 h-12 rounded-full bg-blue-50 justify-center items-center mr-3">
                    <Ionicons name="medkit" size={24} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-900">{doc.name}</Text>
                    <Text className="text-xs text-gray-500">{doc.email}</Text>
                  </View>
                  {myDoctor?.doctor_id === doc.id ? (
                    <View className="bg-green-100 rounded-lg px-3 py-2">
                      <Text className="text-green-700 text-xs font-bold">Connected</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => connectWithDoctor(doc.id, doc.name)}
                      disabled={connecting === doc.id}
                      className="bg-gynai-pink rounded-lg px-4 py-2"
                    >
                      {connecting === doc.id ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text className="text-white text-xs font-bold">Connect</Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
