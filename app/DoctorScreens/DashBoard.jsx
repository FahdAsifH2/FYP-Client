import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../_contexts/AuthContext';

// ─── 3-column icon tile ──────────────────────────────────────────────────────
const Tile = ({ icon, label, color, bg, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={{
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 18,
      paddingVertical: 18,
      paddingHorizontal: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#f0f0f0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 3,
    }}
  >
    <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', marginBottom: 9 }}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={{ fontSize: 11, fontWeight: '600', color: '#374151', textAlign: 'center', lineHeight: 15 }}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ─── Spotlight card (gradient, full-width) ───────────────────────────────────
const SpotlightCard = ({ colors, icon, title, subtitle, description, chips, badge, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 22, padding: 20 }}
    >
      {/* Title row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View style={{
          width: 44, height: 44, borderRadius: 14,
          backgroundColor: 'rgba(255,255,255,0.2)',
          alignItems: 'center', justifyContent: 'center', marginRight: 12,
        }}>
          <Ionicons name={icon} size={22} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#fff' }}>{title}</Text>
            {badge && (
              <View style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}>
                <Text style={{ fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.5 }}>{badge}</Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', marginTop: 1 }}>{subtitle}</Text>
        </View>
        <Ionicons name="arrow-forward-circle" size={24} color="rgba(255,255,255,0.8)" />
      </View>

      {/* Description */}
      <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 19, marginBottom: chips ? 14 : 0 }}>
        {description}
      </Text>

      {/* Chips */}
      {chips && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {chips.map((c, i) => (
            <View key={i} style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 100, paddingHorizontal: 11, paddingVertical: 5 }}>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>{c}</Text>
            </View>
          ))}
        </View>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

// ─── Simple row card ─────────────────────────────────────────────────────────
const RowCard = ({ icon, iconBg, iconColor, title, subtitle, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={{
      backgroundColor: '#fff', borderRadius: 18, padding: 16,
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 1, borderColor: '#f0f0f0',
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05, shadowRadius: 6, elevation: 3,
    }}
  >
    <View style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: iconBg, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
      <Ionicons name={icon} size={22} color={iconColor} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937' }}>{title}</Text>
      <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2, lineHeight: 17 }}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
  </TouchableOpacity>
);

// ─── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { logout, user } = useAuth();

  const initials = (user?.name || 'D')
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f7fa' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#be185d', '#ec4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: Platform.OS === 'ios' ? 58 : 42,
          paddingBottom: 24, paddingHorizontal: 20,
          borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <TouchableOpacity onPress={() => router.replace('/')}
            style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="home-outline" size={17} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Doctor Panel</Text>
          <TouchableOpacity onPress={async () => { await logout(); router.replace('/'); }}
            style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="log-out-outline" size={17} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 48, height: 48, borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.25)',
            alignItems: 'center', justifyContent: 'center',
            marginRight: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
          }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#fff' }}>{initials}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>Welcome back</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>Dr. {user?.name || 'Doctor'}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ padding: 18, paddingBottom: 36, gap: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick tiles */}
        <View>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 1.1, marginBottom: 12 }}>
            QUICK ACCESS
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Tile icon="people"    label="My Patients"   color="#ec4899" bg="#fdf2f8" onPress={() => router.push('/DoctorScreens/MyPatients')} />
            <Tile icon="calendar"  label="Appointments"  color="#3b82f6" bg="#eff6ff" onPress={() => router.push('/DoctorScreens/ManageAppointments')} />
            <Tile icon="documents" label="Documents"     color="#8b5cf6" bg="#f5f3ff" onPress={() => router.push('/DoctorScreens/SharedDocuments')} />
          </View>
        </View>

        {/* AI spotlights */}
        <View>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 1.1, marginBottom: 12 }}>
            AI POWERED
          </Text>
          <View style={{ gap: 12 }}>
            <SpotlightCard
              colors={['#9d174d', '#db2777', '#ec4899']}
              icon="sparkles"
              title="AI Medical Assistant"
              subtitle="Your intelligent patient assistant"
              description="Ask anything about your patients in plain English — search across all records at once."
              chips={['"2nd trimester + cousin marriage"', '"Thalassemia history"', '"Report on Ayesha"']}
              onPress={() => router.push('/DoctorScreens/DoctorChatbot')}
            />
            <SpotlightCard
              colors={['#5b21b6', '#7c3aed', '#8b5cf6']}
              icon="analytics"
              title="Birth Outcome Predictor"
              subtitle="AI prediction from clinical data"
              description="Predict whether a patient is likely to deliver naturally or require a C-section before the birth plan is finalised."
              chips={['BMI & weight', 'Obstetric history', 'Gestational diabetes', 'Prior C-sections']}
              badge="ML MODEL"
              onPress={() => router.push('/DoctorScreens/PredictDelivery')}
            />
          </View>
        </View>

        {/* Clinical records */}
        <View>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 1.1, marginBottom: 12 }}>
            CLINICAL RECORDS
          </Text>
          <RowCard
            icon="document-text" iconBg="#ecfdf5" iconColor="#10b981"
            title="Antenatal Form"
            subtitle="Record comprehensive antenatal data for a patient"
            onPress={() => router.push('/DoctorScreens/AntenatalForm')}
          />
        </View>
      </ScrollView>
    </View>
  );
}
