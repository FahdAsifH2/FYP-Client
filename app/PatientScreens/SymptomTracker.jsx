import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../_config/config';

const SYMPTOMS = [
  { id: 'morning_sickness', label: 'Morning Sickness', icon: 'sad-outline', color: '#EC4899' },
  { id: 'fatigue', label: 'Fatigue', icon: 'bed-outline', color: '#64748B' },
  { id: 'headache', label: 'Headache', icon: 'flash-outline', color: '#EF4444' },
  { id: 'back_pain', label: 'Back Pain', icon: 'body-outline', color: '#F59E0B' },
  { id: 'cramps', label: 'Cramps', icon: 'pulse-outline', color: '#10B981' },
  { id: 'spotting', label: 'Spotting', icon: 'water-outline', color: '#EF4444' },
  { id: 'swelling', label: 'Swelling', icon: 'footsteps-outline', color: '#3B82F6' },
  { id: 'heartburn', label: 'Heartburn', icon: 'flame-outline', color: '#F97316' },
  { id: 'shortness_of_breath', label: 'Breathlessness', icon: 'medical-outline', color: '#6366F1' },
  { id: 'anxiety', label: 'Anxiety', icon: 'alert-circle-outline', color: '#0EA5E9' },
  { id: 'no_symptoms', label: 'Feeling Good!', icon: 'happy-outline', color: '#10B981' },
];

export default function SymptomTracker() {
  const [selected, setSelected] = useState([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedToday, setSavedToday] = useState(false);

  const getToken = async () => await AsyncStorage.getItem('userToken');

  useEffect(() => {
    loadTodayLog();
  }, []);

  const loadTodayLog = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/symptoms/today`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.data) {
        const log = res.data.data;
        const parsed = JSON.parse(log.symptoms || '[]');
        setSelected(parsed);
        setNotes(log.notes || '');
        setSavedToday(true);
      }
    } catch (err) {
      console.error('Load symptoms error:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (id) => {
    if (id === 'no_symptoms') {
      setSelected(selected.includes('no_symptoms') ? [] : ['no_symptoms']);
      return;
    }
    const withoutNone = selected.filter(s => s !== 'no_symptoms');
    setSelected(withoutNone.includes(id)
      ? withoutNone.filter(s => s !== id)
      : [...withoutNone, id]
    );
  };

  const handleSave = async () => {
    if (selected.length === 0 && notes.trim() === '') {
      Alert.alert('Nothing to log', 'Select at least one symptom or write a note.');
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      await axios.post(`${config.API_URL}/api/symptoms/log`, {
        symptoms: selected,
        notes: notes.trim() || null,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedToday(true);
      Alert.alert('Logged!', 'Your symptoms have been saved and shared with your doctor.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err) {
      console.error('Save symptoms error:', err?.response?.data || err.message);
      Alert.alert('Error', 'Failed to save symptoms. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getSymptomInfo = (id) => SYMPTOMS.find(s => s.id === id);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <ActivityIndicator size="large" color="#ec4899" />
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>Symptom Log</Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
              {new Date().toLocaleDateString('en-PK', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          {savedToday && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ECFDF5', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#10B981' }}>Logged today</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={{ padding: 20 }}>

          {/* Info */}
          <View style={{ backgroundColor: '#fdf2f8', borderRadius: 16, padding: 14, marginBottom: 24, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="eye" size={18} color="#ec4899" />
            <Text style={{ flex: 1, fontSize: 13, color: '#be185d', lineHeight: 19 }}>
              Your daily log is shared with your doctor and helps them monitor your pregnancy in real time.
            </Text>
          </View>

          {/* Selected chips */}
          {selected.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#a1a1aa', letterSpacing: 1.2, marginBottom: 8 }}>TODAY'S LOG</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {selected.map(id => {
                  const info = getSymptomInfo(id);
                  if (!info) return null;
                  return (
                    <View key={id} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: info.color + '18', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: info.color + '30' }}>
                      <Ionicons name={info.icon} size={13} color={info.color} />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: info.color }}>{info.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Symptom grid */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1.2, marginBottom: 14 }}>HOW ARE YOU FEELING TODAY?</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {SYMPTOMS.map(symptom => {
              const isSelected = selected.includes(symptom.id);
              return (
                <TouchableOpacity
                  key={symptom.id}
                  onPress={() => toggleSymptom(symptom.id)}
                  style={{
                    width: (symptom.id === 'no_symptoms') ? '100%' : '47%',
                    backgroundColor: isSelected ? symptom.color : 'white',
                    borderRadius: 18,
                    padding: 16,
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: isSelected ? symptom.color : '#F3F4F6',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected ? 0.12 : 0.04,
                    shadowRadius: 6,
                    elevation: isSelected ? 4 : 1,
                  }}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : symptom.color + '15', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name={symptom.icon} size={22} color={isSelected ? 'white' : symptom.color} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: isSelected ? 'white' : '#374151', textAlign: 'center' }}>
                    {symptom.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Notes */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1.2, marginBottom: 10 }}>ADDITIONAL NOTES FOR DOCTOR</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe how you're feeling in more detail... any concerns?"
            placeholderTextColor="#D1D5DB"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ backgroundColor: 'white', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 16, padding: 16, fontSize: 14, color: '#111827', minHeight: 100, marginBottom: 24 }}
          />

          {/* Save */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{ backgroundColor: saving ? '#D1D5DB' : '#ec4899', borderRadius: 18, padding: 18, alignItems: 'center', marginBottom: 8, shadowColor: '#ec4899', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="save" size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>
                  {savedToday ? 'Update Today\'s Log' : 'Save Daily Log'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
