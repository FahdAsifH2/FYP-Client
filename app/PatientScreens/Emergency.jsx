import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const EMERGENCY_CONTACTS = [
  {
    name: 'Rescue Service',
    number: '1122',
    detail: 'Ambulance & Paramedics (Punjab)',
    icon: 'car',
    color: '#EF4444',
    bg: '#FEF2F2',
    primary: true,
  },
  {
    name: 'Edhi Foundation',
    number: '115',
    detail: 'Ambulance & Emergency Aid (24/7)',
    icon: 'heart',
    color: '#EC4899',
    bg: '#FDF2F8',
    primary: false,
  },
  {
    name: 'Chhipa Welfare',
    number: '1021',
    detail: 'Emergency Ambulance Service',
    icon: 'medical',
    color: '#ec4899',
    bg: '#F5F3FF',
    primary: false,
  },
  {
    name: 'Umang Helpline',
    number: '0317-4288665',
    detail: 'Mental health & maternal support',
    icon: 'person',
    color: '#3B82F6',
    bg: '#EFF6FF',
    primary: false,
  },
  {
    name: 'Pakistan Emergency',
    number: '115',
    detail: 'National emergency helpline',
    icon: 'shield',
    color: '#10B981',
    bg: '#ECFDF5',
    primary: false,
  },
];

const DANGER_SIGNS = [
  'Heavy vaginal bleeding',
  'Severe abdominal or chest pain',
  'Absence of fetal movement',
  'Contractions every 5 minutes',
  'Water breaking / fluid leak',
  'Blurred vision or severe headache',
  'Swollen face, hands or legs',
];

export default function Emergency() {
  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <View style={{
        paddingTop: 64, paddingBottom: 20, paddingHorizontal: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#FEE2E2',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 4,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
          <Text style={{ color: '#6B7280', fontSize: 13 }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ color: '#111827', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>Emergency Help</Text>
        <Text style={{ color: '#EF4444', fontSize: 13, marginTop: 4 }}>Pakistan emergency contacts — tap to call</Text>
      </View>

      <View style={{ padding: 20 }}>
        {/* Warning banner */}
        <View style={{
          backgroundColor: '#EF4444', borderRadius: 20, padding: 20, marginBottom: 24,
          shadowColor: '#EF4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Ionicons name="warning" size={24} color="white" />
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '800' }}>Seek immediate care if you have:</Text>
          </View>
          {DANGER_SIGNS.map((sign, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)' }} />
              <Text style={{ color: '#FEE2E2', fontSize: 13 }}>{sign}</Text>
            </View>
          ))}
        </View>

        {/* Emergency contacts */}
        <Text style={{ fontSize: 11, fontWeight: '800', color: '#EF4444', letterSpacing: 1.2, marginBottom: 12 }}>QUICK CONTACTS</Text>

        {EMERGENCY_CONTACTS.map((contact) => (
          <TouchableOpacity
            key={contact.number + contact.name}
            onPress={() => handleCall(contact.number)}
            style={{
              backgroundColor: contact.primary ? contact.color : 'white',
              borderRadius: 18,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
              borderWidth: contact.primary ? 0 : 1,
              borderColor: contact.bg,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: contact.primary ? 0.2 : 0.05,
              shadowRadius: 8,
              elevation: contact.primary ? 5 : 2,
            }}
          >
            <View style={{
              width: 48, height: 48, borderRadius: 14,
              backgroundColor: contact.primary ? 'rgba(255,255,255,0.2)' : contact.bg,
              justifyContent: 'center', alignItems: 'center', marginRight: 14,
            }}>
              <Ionicons name={contact.icon} size={22} color={contact.primary ? 'white' : contact.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: contact.primary ? 'white' : '#111827' }}>
                {contact.name}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: contact.primary ? 'rgba(255,255,255,0.9)' : contact.color, letterSpacing: 1 }}>
                {contact.number}
              </Text>
              <Text style={{ fontSize: 12, color: contact.primary ? 'rgba(255,255,255,0.65)' : '#9CA3AF' }}>
                {contact.detail}
              </Text>
            </View>
            <View style={{
              width: 36, height: 36, borderRadius: 10,
              backgroundColor: contact.primary ? 'rgba(255,255,255,0.15)' : contact.bg,
              justifyContent: 'center', alignItems: 'center',
            }}>
              <Ionicons name="call" size={18} color={contact.primary ? 'white' : contact.color} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Present screen notice */}
        <View style={{ backgroundColor: '#FEF2F2', borderRadius: 16, padding: 16, marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="information-circle" size={20} color="#EF4444" />
          <Text style={{ flex: 1, fontSize: 12, color: '#7F1D1D', lineHeight: 18 }}>
            Show this screen to first responders if you are unable to speak.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </View>
    </ScrollView>
  );
}
