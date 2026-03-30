import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, Modal, TextInput, RefreshControl, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../_config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const APPOINTMENT_TYPES = [
  'Routine Checkup', 'Ultrasound Scan', 'Blood Work', 'NT Scan',
  'Anomaly Scan', 'Glucose Test', 'Follow-up', 'Emergency Visit', 'Consultation'
];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [myDoctor, setMyDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Booking form state
  const [bookingDate, setBookingDate] = useState(new Date(Date.now() + 86400000));
  const [bookingTime, setBookingTime] = useState(new Date());
  const [bookingType, setBookingType] = useState('Routine Checkup');
  const [bookingIssue, setBookingIssue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const getToken = async () => await AsyncStorage.getItem('userToken');

  const fetchAppointments = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/appointments/patient`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const fetchMyDoctor = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/relationships/my-doctor`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyDoctor(res.data.data);
    } catch (err) {
      console.error('Error fetching doctor:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchAppointments(), fetchMyDoctor()]);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const bookAppointment = async () => {
    if (!myDoctor) {
      Alert.alert('No Doctor', 'Please connect with a doctor first from "My Doctor" screen.');
      return;
    }
    setSubmitting(true);
    try {
      const token = await getToken();
      const dateStr = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}-${String(bookingDate.getDate()).padStart(2, '0')}`;
      const timeStr = bookingTime.toTimeString().split(' ')[0].substring(0, 5);

      await axios.post(`${config.API_URL}/api/appointments`, {
        doctorId: myDoctor.doctor_id,
        doctorName: myDoctor.doctor_name,
        appointmentDate: dateStr,
        appointmentTime: timeStr,
        appointmentType: bookingType,
        issue: bookingIssue || null,
      }, { headers: { Authorization: `Bearer ${token}` } });

      Alert.alert('Booked!', 'Your appointment has been booked successfully.');
      setShowModal(false);
      setBookingIssue('');
      await fetchAppointments();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to book appointment');
    }
    setSubmitting(false);
  };

  const cancelAppointment = (id) => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel', style: 'destructive',
        onPress: async () => {
          try {
            const token = await getToken();
            await axios.patch(`${config.API_URL}/api/appointments/${id}/status`,
              { status: 'cancelled' },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchAppointments();
          } catch (err) {
            Alert.alert('Error', 'Failed to cancel appointment');
          }
        }
      }
    ]);
  };

  const upcomingAppts = appointments.filter(a => ['pending', 'confirmed'].includes(a.status) && new Date(a.appointment_date) >= new Date(new Date().toDateString()));
  const pastAppts = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled' || new Date(a.appointment_date) < new Date(new Date().toDateString()));

  const displayAppts = activeTab === 'upcoming' ? upcomingAppts : pastAppts;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      case 'completed': return { bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  const renderItem = ({ item }) => {
    const colors = getStatusColor(item.status);
    const isActive = item.status === 'pending' || item.status === 'confirmed';
    return (
      <View className={`p-5 mb-4 rounded-2xl border ${isActive ? 'bg-white border-gynai-pink-border shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 mr-3">
            <Text className="text-lg font-bold text-gray-900">{item.appointment_type || 'Appointment'}</Text>
            <Text className="text-sm text-gray-500 mt-1">{item.doctor_name || 'Doctor'}</Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${colors.bg}`}>
            <Text className={`text-xs font-bold ${colors.text}`}>{(item.status || '').toUpperCase()}</Text>
          </View>
        </View>

        <View className="flex-row items-center mt-2">
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 ml-2 text-sm">{formatDate(item.appointment_date)} at {formatTime(item.appointment_time)}</Text>
        </View>

        {item.issue && (
          <View className="flex-row items-center mt-2">
            <Ionicons name="document-text-outline" size={16} color="#6B7280" />
            <Text className="text-gray-500 ml-2 text-sm" numberOfLines={1}>{item.issue}</Text>
          </View>
        )}

        {item.notes && (
          <View className="bg-blue-50 rounded-xl p-3 mt-3">
            <Text className="text-blue-700 text-xs font-medium">Doctor's Note: {item.notes}</Text>
          </View>
        )}

        {isActive && (
          <View className="flex-row justify-end mt-4 border-t border-gray-100 pt-3">
            <TouchableOpacity onPress={() => cancelAppointment(item.id)} className="bg-red-50 border border-red-200 rounded-xl py-2 px-6">
              <Text className="text-red-600 font-bold text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="pt-16 pb-4 px-6 bg-white shadow-sm flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800 tracking-tight flex-1">Appointments</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-6 pt-4 pb-2 bg-white">
        <TouchableOpacity
          onPress={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 items-center rounded-xl mr-2 ${activeTab === 'upcoming' ? 'bg-gynai-pink' : 'bg-gray-100'}`}
        >
          <Text className={`font-bold ${activeTab === 'upcoming' ? 'text-white' : 'text-gray-600'}`}>
            Upcoming ({upcomingAppts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('past')}
          className={`flex-1 py-2 items-center rounded-xl ml-2 ${activeTab === 'past' ? 'bg-gynai-pink' : 'bg-gray-100'}`}
        >
          <Text className={`font-bold ${activeTab === 'past' ? 'text-white' : 'text-gray-600'}`}>
            Past ({pastAppts.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        className="flex-1 px-6 pt-4"
        data={displayAppts}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <TouchableOpacity
            onPress={() => {
              if (!myDoctor) {
                Alert.alert('Connect First', 'Please connect with a doctor in "My Doctor" before booking.', [
                  { text: 'Go to My Doctor', onPress: () => router.push('/PatientScreens/MyDoctor') },
                  { text: 'Cancel', style: 'cancel' }
                ]);
              } else {
                setShowModal(true);
              }
            }}
            className="w-full bg-gynai-pink rounded-2xl py-4 flex-row justify-center items-center shadow-sm mb-6"
          >
            <Ionicons name="add" size={24} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Book New Appointment</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View className="items-center py-12">
            <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4 text-lg">No {activeTab} appointments</Text>
          </View>
        )}
        ListFooterComponent={<View className="h-10" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* Booking Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10" style={{ maxHeight: '85%' }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-900">Book Appointment</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={28} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {myDoctor && (
              <View className="bg-gynai-pink-bg rounded-xl p-3 mb-4 flex-row items-center">
                <Ionicons name="person" size={20} color="#ec4899" />
                <Text className="text-gynai-pink-dark font-medium ml-2">With {myDoctor.doctor_name}</Text>
              </View>
            )}

            {/* Date */}
            <Text className="text-gray-700 font-bold mb-2">Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 flex-row items-center">
              <Ionicons name="calendar" size={20} color="#ec4899" />
              <Text className="text-gray-800 ml-3 flex-1">{bookingDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker value={bookingDate} mode="date" minimumDate={new Date()} onChange={(e, d) => { setShowDatePicker(Platform.OS === 'ios'); if (d) setBookingDate(d); }} />
            )}

            {/* Time */}
            <Text className="text-gray-700 font-bold mb-2">Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 flex-row items-center">
              <Ionicons name="time" size={20} color="#ec4899" />
              <Text className="text-gray-800 ml-3 flex-1">{bookingTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker value={bookingTime} mode="time" minuteInterval={15} onChange={(e, d) => { setShowTimePicker(Platform.OS === 'ios'); if (d) setBookingTime(d); }} />
            )}

            {/* Type */}
            <Text className="text-gray-700 font-bold mb-2">Appointment Type</Text>
            <TouchableOpacity onPress={() => setShowTypePicker(!showTypePicker)} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-2 flex-row items-center">
              <Ionicons name="medkit" size={20} color="#ec4899" />
              <Text className="text-gray-800 ml-3 flex-1">{bookingType}</Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </TouchableOpacity>
            {showTypePicker && (
              <View className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
                {APPOINTMENT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => { setBookingType(type); setShowTypePicker(false); }}
                    className={`py-3 px-4 border-b border-gray-50 ${bookingType === type ? 'bg-gynai-pink-bg' : ''}`}
                  >
                    <Text className={`${bookingType === type ? 'text-gynai-pink-dark font-bold' : 'text-gray-700'}`}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Issue */}
            <Text className="text-gray-700 font-bold mb-2 mt-2">Reason / Notes (optional)</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-gray-800"
              placeholder="Describe your concern..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={bookingIssue}
              onChangeText={setBookingIssue}
            />

            <TouchableOpacity onPress={bookAppointment} disabled={submitting} className="bg-gynai-pink rounded-2xl py-4 items-center">
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Confirm Booking</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
