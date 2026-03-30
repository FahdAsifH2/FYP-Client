import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../_config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getToken = async () => await AsyncStorage.getItem('userToken');

  const fetchPatients = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/relationships/my-patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data.data || []);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchPatients();
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPatients();
    setRefreshing(false);
  }, []);

  const goToProfile = (item) =>
    router.push({ pathname: '/DoctorScreens/PatientDetails', params: { id: item.patient_id, name: item.patient_name } });

  const renderPatient = ({ item }) => (
    <TouchableOpacity
      onPress={() => goToProfile(item)}
      activeOpacity={0.92}
      style={{ backgroundColor: 'white', borderRadius: 20, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 4 }}
    >
      {/* Patient identity row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
          <Ionicons name="person" size={26} color="#8B5CF6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: '800', color: '#111827' }}>{item.patient_name}</Text>
          <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{item.patient_email}</Text>
          <Text style={{ fontSize: 11, color: '#D1D5DB', marginTop: 2 }}>
            Connected {new Date(item.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
          <Text style={{ fontSize: 10, color: '#10B981', fontWeight: '700' }}>Active</Text>
        </View>
      </View>

      {/* Action */}
      <View style={{ borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 14 }}>
        <TouchableOpacity
          onPress={() => goToProfile(item)}
          style={{ backgroundColor: '#8B5CF6', borderRadius: 12, paddingVertical: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}
        >
          <Ionicons name="person-circle-outline" size={18} color="white" />
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAFAFA', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Ionicons name="arrow-back" size={20} color="#374151" />
          <Text style={{ color: '#6B7280', fontSize: 13 }}>Back</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>My Patients</Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Tap any patient to view their full profile</Text>
          </View>
          <View style={{ backgroundColor: '#F5F3FF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#8B5CF6' }}>{patients.length}</Text>
            <Text style={{ fontSize: 10, color: '#C4B5FD', fontWeight: '700', textAlign: 'center' }}>Patients</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={patients}
        keyExtractor={item => String(item.id)}
        renderItem={renderPatient}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <Ionicons name="people-outline" size={64} color="#D1D5DB" />
            <Text style={{ color: '#9CA3AF', fontSize: 16, marginTop: 16, fontWeight: '500' }}>No patients connected yet</Text>
            <Text style={{ color: '#D1D5DB', fontSize: 13, marginTop: 4 }}>Patients will appear here once they connect with you</Text>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />}
      />
    </View>
  );
}
