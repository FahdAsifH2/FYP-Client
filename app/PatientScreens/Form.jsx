import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../_config/config';

const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

export default function Form() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gravida: '',
    blood_group: '',
    diabetes: false,
    previous_c_section: false,
    allergies: '',
    medical_conditions: '',
  });

  const getToken = async () => await AsyncStorage.getItem('userToken');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/health-profile/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.data) {
        const p = res.data.data;
        setForm({
          name: p.name || '',
          age: p.age ? String(p.age) : '',
          height: p.height || '',
          weight: p.weight || '',
          gravida: p.gravida ? String(p.gravida) : '',
          blood_group: p.blood_group || '',
          diabetes: p.diabetes || false,
          previous_c_section: p.previous_c_section || false,
          allergies: p.allergies || '',
          medical_conditions: p.medical_conditions || '',
        });
        setSaved(true);
      }
    } catch (err) {
      console.error('Load profile error:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.age.trim()) {
      Alert.alert('Required', 'Name and age are required.');
      return;
    }
    setSaving(true);
    try {
      const token = await getToken();
      await axios.post(`${config.API_URL}/api/health-profile/save`, {
        ...form,
        age: form.age ? parseInt(form.age) : null,
        gravida: form.gravida ? parseInt(form.gravida) : null,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(true);
      Alert.alert('Profile Saved', 'Your health profile has been saved and shared with your doctor.');
    } catch (err) {
      console.error('Save error:', err?.response?.data || err.message);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        {/* Header */}
        <View style={{ paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Ionicons name="arrow-back" size={20} color="#374151" />
            <Text style={{ color: '#6B7280', fontSize: 13 }}>Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <View>
              <Text style={{ fontSize: 26, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>Health Profile</Text>
              <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Shared automatically with your OB-GYN</Text>
            </View>
            {saved && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ECFDF5', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#10B981' }}>Saved</Text>
              </View>
            )}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={{ padding: 20 }}>

            {/* Info banner */}
            <View style={{ backgroundColor: '#F5F3FF', borderRadius: 16, padding: 14, marginBottom: 24, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="share-social" size={18} color="#ec4899" />
              <Text style={{ flex: 1, fontSize: 13, color: '#7C3AED', lineHeight: 19 }}>
                This profile is automatically shared with your connected doctor so they have your full medical history.
              </Text>
            </View>

            {/* BASIC INFO */}
            <SectionHeader title="BASIC INFORMATION" />

            <FormField label="Full Name *" value={form.name} onChangeText={v => set('name', v)} placeholder="e.g. Fatima Malik" />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <FormField label="Age *" value={form.age} onChangeText={v => set('age', v)} placeholder="e.g. 28" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <FormField label="Height (cm)" value={form.height} onChangeText={v => set('height', v)} placeholder="e.g. 162" keyboardType="numeric" />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <FormField label="Weight (kg)" value={form.weight} onChangeText={v => set('weight', v)} placeholder="e.g. 65" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <FormField label="Gravida (pregnancies)" value={form.gravida} onChangeText={v => set('gravida', v)} placeholder="e.g. 2" keyboardType="numeric" />
              </View>
            </View>

            {/* Blood group */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 8 }}>BLOOD GROUP</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {BLOOD_GROUPS.map(bg => (
                <TouchableOpacity
                  key={bg}
                  onPress={() => set('blood_group', bg)}
                  style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, backgroundColor: form.blood_group === bg ? '#ec4899' : '#F3F4F6', borderWidth: form.blood_group === bg ? 0 : 1, borderColor: '#E5E7EB' }}
                >
                  <Text style={{ fontWeight: '700', fontSize: 13, color: form.blood_group === bg ? 'white' : '#374151' }}>{bg}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* MEDICAL HISTORY */}
            <SectionHeader title="MEDICAL HISTORY" />

            <ToggleRow
              label="Has Diabetes / Gestational Diabetes"
              icon="pulse"
              iconColor="#EF4444"
              value={form.diabetes}
              onValueChange={v => set('diabetes', v)}
            />
            <ToggleRow
              label="Previous C-Section"
              icon="medical"
              iconColor="#ec4899"
              value={form.previous_c_section}
              onValueChange={v => set('previous_c_section', v)}
            />

            <FormField
              label="Known Allergies"
              value={form.allergies}
              onChangeText={v => set('allergies', v)}
              placeholder="e.g. Penicillin, Latex, Pollen"
              multiline
            />
            <FormField
              label="Other Medical Conditions"
              value={form.medical_conditions}
              onChangeText={v => set('medical_conditions', v)}
              placeholder="e.g. Hypothyroidism, Hypertension..."
              multiline
            />

            {/* Save */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={{ backgroundColor: saving ? '#D1D5DB' : '#ec4899', borderRadius: 18, padding: 18, alignItems: 'center', marginTop: 8, marginBottom: 12, shadowColor: '#ec4899', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="cloud-upload" size={20} color="white" />
                  <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>Save & Share with Doctor</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────
const SectionHeader = ({ title }) => (
  <Text style={{ fontSize: 11, fontWeight: '800', color: '#ec4899', letterSpacing: 1.2, marginBottom: 14, marginTop: 4 }}>{title}</Text>
);

const FormField = ({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 }}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#D1D5DB"
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
      textAlignVertical={multiline ? 'top' : 'center'}
      style={{ backgroundColor: 'white', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14, padding: 14, fontSize: 15, color: '#111827', minHeight: multiline ? 80 : 48 }}
    />
  </View>
);

const ToggleRow = ({ label, icon, iconColor, value, onValueChange }) => (
  <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1.5, borderColor: value ? iconColor + '30' : '#F3F4F6' }}>
    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: iconColor + '15', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
      <Ionicons name={icon} size={18} color={iconColor} />
    </View>
    <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: '#111827' }}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#E5E7EB', true: iconColor + '50' }}
      thumbColor={value ? iconColor : '#9CA3AF'}
    />
  </View>
);
