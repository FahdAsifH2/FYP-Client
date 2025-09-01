import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const AppointmentBookingForm = () => {
  const [formData, setFormData] = useState({
    patientName: '', appointmentDate: '', appointmentTime: '', appointmentType: '', issue: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAppointmentTypes, setShowAppointmentTypes] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const appointmentTypes = ['Routine Checkup', 'Consultation', 'Follow-up','New Patinets', 'Ultrasound', 'Lab Review', 'Emergency'];

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (formData.patientName && formData.appointmentDate && formData.appointmentTime && formData.appointmentType) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({ patientName: '', appointmentDate: '', appointmentTime: '', appointmentType: '', issue: '' });
      }, 2500);
    } else {
      Alert.alert('Missing Information', 'Please fill all required fields');
    }
  };

  // Generate next 6 working days (Monday to Saturday)
  const getWorkingDays = () => {
    const dates = [];
    const today = new Date();
    let daysAdded = 0;
    let dayOffset = 0;
    
    while (daysAdded < 6) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Only add Monday (1) to Saturday (6)
      if (dayOfWeek >= 1 && dayOfWeek <= 6) {
        dates.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
          isToday: dayOffset === 0
        });
        daysAdded++;
      }
      dayOffset++;
    }
    return dates;
  };

  // Generate organized time slots
  const generateTimeSlots = () => {
    const sessions = {
      morning: { label: '🌅 Morning (10:00 - 12:00)', slots: [] },
      afternoon: { label: '☀️ Afternoon (12:00 - 17:00)', slots: [] },
      evening: { label: '🌆 Evening (17:00 - 22:00)', slots: [] }
    };

    // Morning slots (10 AM - 12 PM)
    for (let hour = 10; hour < 12; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeString = time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
        sessions.morning.slots.push(timeString);
      }
    }

    // Afternoon slots (12 PM - 5 PM)
    for (let hour = 12; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeString = time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
        sessions.afternoon.slots.push(timeString);
      }
    }

    // Evening slots (5 PM - 10 PM)
    for (let hour = 17; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeString = time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
        sessions.evening.slots.push(timeString);
      }
    }

    return sessions;
  };

  const selectedDateObj = getWorkingDays().find(d => d.date === formData.appointmentDate);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* Header */}
          <View style={{ paddingTop: (StatusBar.currentHeight || 44) + 20, paddingHorizontal: 20, paddingBottom: 30 }}>
            <TouchableOpacity onPress={() => router.back()}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Text style={{ color: 'white', fontSize: 18 }}>←</Text>
            </TouchableOpacity>
            
            <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 8 }}>Book Appointment</Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 16 }}>Schedule a new patient appointment</Text>
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            
            {/* Patient Name */}
            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Patient Name</Text>
              <TextInput 
                value={formData.patientName} 
                onChangeText={(text) => handleInputChange('patientName', text)}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  borderWidth: 2, 
                  borderColor: formData.patientName ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: 16, 
                  padding: 18, 
                  color: 'white', 
                  fontSize: 16 
                }}
                placeholder="Enter patient name" 
                placeholderTextColor="rgba(255, 255, 255, 0.5)" 
              />
            </View>

            {/* Date Selection */}
            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Select Date</Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, marginBottom: 15 }}>Available Monday - Saturday</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                {getWorkingDays().map((dateObj, index) => (
                  <TouchableOpacity 
                    key={index}
                    onPress={() => handleInputChange('appointmentDate', dateObj.date)}
                    style={{
                      backgroundColor: formData.appointmentDate === dateObj.date ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 16, 
                      padding: 16, 
                      alignItems: 'center', 
                      minWidth: 80,
                      marginRight: 12,
                      borderWidth: 2, 
                      borderColor: formData.appointmentDate === dateObj.date ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)'
                    }}>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, marginBottom: 4 }}>
                      {dateObj.weekday}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 2 }}>
                      {dateObj.day}
                    </Text>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 11 }}>
                      {dateObj.month}
                    </Text>
                    {dateObj.isToday && (
                      <Text style={{ color: '#22c55e', fontSize: 10, fontWeight: 'bold', marginTop: 2 }}>
                        Today
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Time Selection */}
            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Select Time</Text>
              {selectedDateObj && (
                <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, marginBottom: 15 }}>
                  {selectedDateObj.fullDate}
                </Text>
              )}
              
              <TouchableOpacity 
                onPress={() => setShowTimeSlots(true)}
                style={{ 
                  backgroundColor: formData.appointmentTime ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)', 
                  borderWidth: 2, 
                  borderColor: formData.appointmentTime ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: 16, 
                  padding: 20, 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                <View>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>
                    {formData.appointmentTime || 'Choose time slot'}
                  </Text>
                  {!formData.appointmentTime && (
                    <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 13, marginTop: 2 }}>
                      15-minute slots available
                    </Text>
                  )}
                </View>
                <Text style={{ color: '#8b5cf6', fontSize: 18 }}>⏰</Text>
              </TouchableOpacity>
            </View>

            {/* Appointment Type */}
            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>Appointment Type</Text>
              <TouchableOpacity 
                onPress={() => setShowAppointmentTypes(true)}
                style={{ 
                  backgroundColor: formData.appointmentType ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)', 
                  borderWidth: 2, 
                  borderColor: formData.appointmentType ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: 16, 
                  padding: 20, 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                <Text style={{ color: formData.appointmentType ? 'white' : 'rgba(255, 255, 255, 0.5)', fontSize: 16 }}>
                  {formData.appointmentType || 'Select appointment type'}
                </Text>
                <Text style={{ color: '#8b5cf6', fontSize: 18 }}>📋</Text>
              </TouchableOpacity>
            </View>

            {/* Issue/Notes */}
            <View style={{ marginBottom: 30 }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
                Additional Notes 
                <Text style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 14, fontWeight: '400' }}> (optional)</Text>
              </Text>
              <TextInput 
                value={formData.issue} 
                onChangeText={(text) => handleInputChange('issue', text)} 
                multiline 
                numberOfLines={4}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  borderWidth: 2, 
                  borderColor: formData.issue ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)', 
                  borderRadius: 16, 
                  padding: 18, 
                  color: 'white', 
                  fontSize: 16, 
                  textAlignVertical: 'top',
                  minHeight: 100
                }}
                placeholder="Brief description of the issue or reason for visit" 
                placeholderTextColor="rgba(255, 255, 255, 0.5)" 
              />
            </View>
            
            {/* Submit Button */}
            <TouchableOpacity 
              onPress={handleSubmit}
              style={{ 
                backgroundColor: '#8b5cf6', 
                borderRadius: 16, 
                padding: 20, 
                alignItems: 'center', 
                shadowColor: '#8b5cf6', 
                shadowOffset: { width: 0, height: 4 }, 
                shadowOpacity: 0.3, 
                shadowRadius: 8, 
                elevation: 8,
                marginBottom: 40
              }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Time Slots Modal */}
        <Modal visible={showTimeSlots} transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
            <View style={{ 
              flex: 1, 
              backgroundColor: '#1a1a2e', 
              marginTop: 60,
              borderTopLeftRadius: 24, 
              borderTopRightRadius: 24 
            }}>
              
              {/* Modal Header */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: 20, 
                borderBottomWidth: 1, 
                borderBottomColor: 'rgba(255, 255, 255, 0.1)' 
              }}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Choose Time Slot</Text>
                <TouchableOpacity onPress={() => setShowTimeSlots(false)}>
                  <Text style={{ color: '#8b5cf6', fontSize: 16, fontWeight: '600' }}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View style={{ padding: 20 }}>
                  {Object.entries(generateTimeSlots()).map(([key, session]) => (
                    <View key={key} style={{ marginBottom: 25 }}>
                      <Text style={{ 
                        color: 'white', 
                        fontSize: 16, 
                        fontWeight: '600', 
                        marginBottom: 15,
                        paddingLeft: 4
                      }}>
                        {session.label}
                      </Text>
                      
                      <View style={{ 
                        flexDirection: 'row', 
                        flexWrap: 'wrap', 
                        justifyContent: 'space-between' 
                      }}>
                        {session.slots.map((slot, index) => (
                          <TouchableOpacity 
                            key={index}
                            onPress={() => {
                              handleInputChange('appointmentTime', slot);
                              setShowTimeSlots(false);
                            }}
                            style={{
                              backgroundColor: formData.appointmentTime === slot ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                              borderRadius: 12, 
                              padding: 14, 
                              alignItems: 'center', 
                              width: '31%', 
                              marginBottom: 12,
                              borderWidth: 1, 
                              borderColor: formData.appointmentTime === slot ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)'
                            }}>
                            <Text style={{ 
                              color: 'white', 
                              fontSize: 13, 
                              fontWeight: formData.appointmentTime === slot ? '600' : '400'
                            }}>
                              {slot}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Appointment Type Modal */}
        <Modal visible={showAppointmentTypes} transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
            <View style={{ 
              backgroundColor: '#1a1a2e', 
              borderTopLeftRadius: 24, 
              borderTopRightRadius: 24, 
              paddingTop: 20, 
              maxHeight: '60%' 
            }}>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingHorizontal: 20, 
                paddingBottom: 15, 
                borderBottomWidth: 1, 
                borderBottomColor: 'rgba(255, 255, 255, 0.1)' 
              }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Appointment Type</Text>
                <TouchableOpacity onPress={() => setShowAppointmentTypes(false)}>
                  <Text style={{ color: '#8b5cf6', fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 300 }}>
                {appointmentTypes.map((type, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => { 
                      handleInputChange('appointmentType', type); 
                      setShowAppointmentTypes(false); 
                    }}
                    style={{ 
                      padding: 20, 
                      borderBottomWidth: 1, 
                      borderBottomColor: 'rgba(255, 255, 255, 0.05)' 
                    }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        <Modal visible={showSuccess} transparent animationType="fade">
          <View style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: 24 
          }}>
            <View style={{ 
              backgroundColor: '#1a1a2e', 
              borderRadius: 24, 
              padding: 32, 
              borderWidth: 1, 
              borderColor: 'rgba(255, 255, 255, 0.2)', 
              alignItems: 'center', 
              minWidth: 300 
            }}>
              <View style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 40, 
                backgroundColor: 'rgba(34, 197, 94, 0.2)', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: 20 
              }}>
                <Text style={{ fontSize: 32 }}>✅</Text>
              </View>
              <Text style={{ 
                color: 'white', 
                fontSize: 22, 
                fontWeight: 'bold', 
                marginBottom: 8, 
                textAlign: 'center' 
              }}>
                Appointment Booked!
              </Text>
              <Text style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: 14, 
                textAlign: 'center', 
                marginBottom: 20 
              }}>
                {formData.patientName}'s appointment scheduled for {selectedDateObj?.fullDate} at {formData.appointmentTime}
              </Text>
              <View style={{ 
                backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                borderWidth: 1, 
                borderColor: 'rgba(34, 197, 94, 0.2)', 
                borderRadius: 12, 
                padding: 12, 
                alignItems: 'center' 
              }}>
                <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: '600' }}>
                  Confirmation sent to patient
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default AppointmentBookingForm;