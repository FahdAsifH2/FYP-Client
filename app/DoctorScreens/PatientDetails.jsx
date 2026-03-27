import { Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../_config/config';

export default function PatientDetails() {
  const { id, name } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = async () => await AsyncStorage.getItem('userToken');

  useEffect(() => {
    if (id) loadAll();
  }, [id]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [profileRes, symptomsRes] = await Promise.allSettled([
        axios.get(`${config.API_URL}/api/health-profile/patient/${id}`, { headers }),
        axios.get(`${config.API_URL}/api/symptoms/patient/${id}`, { headers }),
      ]);
      if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data?.data || null);
      if (symptomsRes.status === 'fulfilled') setSymptoms(symptomsRes.value.data?.data || []);
    } catch (err) {
      console.error('Load patient details error:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  const today = new Date().toLocaleDateString('en-PK', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const todayLog = symptoms[0] && new Date(symptoms[0].logged_date).toLocaleDateString('en-PK', { year: 'numeric', month: '2-digit', day: '2-digit' }) === today
    ? symptoms[0] : null;

  const parseSymptoms = (raw) => {
    try { return JSON.parse(raw || '[]'); } catch { return []; }
  };

  const SYMPTOM_COLORS = {
    morning_sickness: '#EC4899', fatigue: '#8B5CF6', headache: '#EF4444',
    back_pain: '#F59E0B', cramps: '#10B981', spotting: '#EF4444',
    swelling: '#3B82F6', heartburn: '#F97316', shortness_of_breath: '#6366F1',
    anxiety: '#8B5CF6', no_symptoms: '#10B981',
  };

  const formatSymptomLabel = (id) =>
    id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Ionicons name="arrow-back" size={20} color="#374151" />
          <Text style={{ color: '#6B7280', fontSize: 13 }}>Back</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="person" size={26} color="#8B5CF6" />
          </View>
          <View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>{name || profile?.name || 'Patient'}</Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>Patient #{id}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>

          {/* ── TODAY'S SYMPTOMS WIDGET ──────────────────────────────── */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: todayLog ? '#8B5CF6' : '#9CA3AF', letterSpacing: 1.2, marginBottom: 12 }}>
            TODAY'S SYMPTOM LOG
          </Text>

          {todayLog ? (
            <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 18, marginBottom: 20, borderWidth: 1.5, borderColor: '#EDE9FE', shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151' }}>Logged today</Text>
                </View>
                <Text style={{ fontSize: 11, color: '#9CA3AF' }}>
                  {new Date(todayLog.updated_at).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>

              {/* Symptom chips */}
              {(() => {
                const syms = parseSymptoms(todayLog.symptoms);
                return syms.length > 0 ? (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: todayLog.notes ? 12 : 0 }}>
                    {syms.map(sym => {
                      const col = SYMPTOM_COLORS[sym] || '#8B5CF6';
                      return (
                        <View key={sym} style={{ backgroundColor: col + '18', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: col + '30' }}>
                          <Text style={{ fontSize: 12, fontWeight: '700', color: col }}>{formatSymptomLabel(sym)}</Text>
                        </View>
                      );
                    })}
                  </View>
                ) : null;
              })()}

              {/* Notes — highlighted */}
              {todayLog.notes ? (
                <View style={{ backgroundColor: '#FFF7ED', borderRadius: 12, padding: 12, borderLeftWidth: 3, borderLeftColor: '#F59E0B' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Ionicons name="document-text" size={14} color="#F59E0B" />
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#F59E0B', letterSpacing: 0.5 }}>PATIENT NOTE</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#92400E', lineHeight: 20 }}>{todayLog.notes}</Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={{ backgroundColor: '#F9FAFB', borderRadius: 18, padding: 20, marginBottom: 20, alignItems: 'center' }}>
              <Ionicons name="time-outline" size={32} color="#D1D5DB" />
              <Text style={{ color: '#9CA3AF', fontSize: 14, marginTop: 8, fontWeight: '500' }}>No symptom log for today</Text>
              <Text style={{ color: '#D1D5DB', fontSize: 12, marginTop: 4 }}>Patient hasn't logged yet</Text>
            </View>
          )}

          {/* ── RECENT SYMPTOM HISTORY ───────────────────────────────── */}
          {symptoms.length > 1 && (
            <>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1.2, marginBottom: 12 }}>RECENT HISTORY (7 DAYS)</Text>
              {symptoms.slice(todayLog ? 1 : 0).map((log, idx) => {
                const syms = parseSymptoms(log.symptoms);
                return (
                  <View key={idx} style={{ backgroundColor: 'white', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#F3F4F6' }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginBottom: 8 }}>
                      {new Date(log.logged_date).toLocaleDateString('en-PK', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                      {syms.map(sym => {
                        const col = SYMPTOM_COLORS[sym] || '#8B5CF6';
                        return (
                          <View key={sym} style={{ backgroundColor: col + '15', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                            <Text style={{ fontSize: 11, fontWeight: '700', color: col }}>{formatSymptomLabel(sym)}</Text>
                          </View>
                        );
                      })}
                    </View>
                    {log.notes ? (
                      <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 6, fontStyle: 'italic' }} numberOfLines={2}>{log.notes}</Text>
                    ) : null}
                  </View>
                );
              })}
            </>
          )}

          {/* ── HEALTH PROFILE ───────────────────────────────────────── */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#8B5CF6', letterSpacing: 1.2, marginBottom: 12, marginTop: 8 }}>HEALTH PROFILE</Text>

          {profile ? (
            <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 4 }}>

              {/* Basic stats row */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
                {[
                  { label: 'Age', value: profile.age ? `${profile.age} yrs` : '—' },
                  { label: 'Height', value: profile.height ? `${profile.height} cm` : '—' },
                  { label: 'Weight', value: profile.weight ? `${profile.weight} kg` : '—' },
                  { label: 'Gravida', value: profile.gravida ?? '—' },
                ].map(item => (
                  <View key={item.label} style={{ flex: 1, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 10, alignItems: 'center' }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827' }}>{item.value}</Text>
                    <Text style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{item.label}</Text>
                  </View>
                ))}
              </View>

              {/* Blood group */}
              {profile.blood_group && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14, backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12 }}>
                  <Ionicons name="water" size={18} color="#EF4444" />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>Blood Group: {profile.blood_group}</Text>
                </View>
              )}

              {/* Medical flags */}
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: profile.allergies || profile.medical_conditions ? 14 : 0 }}>
                <View style={{ flex: 1, backgroundColor: profile.diabetes ? '#FEF2F2' : '#F9FAFB', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="pulse" size={16} color={profile.diabetes ? '#EF4444' : '#9CA3AF'} />
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: profile.diabetes ? '#EF4444' : '#9CA3AF' }}>Diabetes</Text>
                    <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{profile.diabetes ? 'Yes' : 'No'}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, backgroundColor: profile.previous_c_section ? '#F5F3FF' : '#F9FAFB', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="medical" size={16} color={profile.previous_c_section ? '#8B5CF6' : '#9CA3AF'} />
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: profile.previous_c_section ? '#8B5CF6' : '#9CA3AF' }}>C-Section</Text>
                    <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{profile.previous_c_section ? 'Yes' : 'No'}</Text>
                  </View>
                </View>
              </View>

              {/* Allergies */}
              {profile.allergies ? (
                <View style={{ backgroundColor: '#FFFBEB', borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <Ionicons name="warning" size={16} color="#F59E0B" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#F59E0B', marginBottom: 2 }}>ALLERGIES</Text>
                    <Text style={{ fontSize: 13, color: '#92400E' }}>{profile.allergies}</Text>
                  </View>
                </View>
              ) : null}

              {/* Medical conditions */}
              {profile.medical_conditions ? (
                <View style={{ backgroundColor: '#F5F3FF', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                  <Ionicons name="document-text" size={16} color="#8B5CF6" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#8B5CF6', marginBottom: 2 }}>CONDITIONS</Text>
                    <Text style={{ fontSize: 13, color: '#5B21B6' }}>{profile.medical_conditions}</Text>
                  </View>
                </View>
              ) : null}

              <Text style={{ fontSize: 11, color: '#D1D5DB', marginTop: 12, textAlign: 'right' }}>
                Updated {new Date(profile.updated_at).toLocaleDateString('en-PK')}
              </Text>
            </View>
          ) : (
            <View style={{ backgroundColor: '#F9FAFB', borderRadius: 18, padding: 20, marginBottom: 20, alignItems: 'center' }}>
              <Ionicons name="person-outline" size={32} color="#D1D5DB" />
              <Text style={{ color: '#9CA3AF', fontSize: 14, marginTop: 8, fontWeight: '500' }}>No health profile yet</Text>
              <Text style={{ color: '#D1D5DB', fontSize: 12, marginTop: 4 }}>Patient hasn't completed their form</Text>
            </View>
          )}

          {/* Quick actions */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1.2, marginBottom: 12 }}>QUICK ACTIONS</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/DoctorScreens/SharedDocuments', params: { patientId: id, patientName: name } })}
              style={{ flex: 1, backgroundColor: '#F5F3FF', borderRadius: 16, padding: 16, alignItems: 'center', gap: 8 }}
            >
              <Ionicons name="documents" size={22} color="#8B5CF6" />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#8B5CF6' }}>Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/DoctorScreens/ManageAppointments')}
              style={{ flex: 1, backgroundColor: '#FDF2F8', borderRadius: 16, padding: 16, alignItems: 'center', gap: 8 }}
            >
              <Ionicons name="calendar" size={22} color="#EC4899" />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#EC4899' }}>Appointments</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
