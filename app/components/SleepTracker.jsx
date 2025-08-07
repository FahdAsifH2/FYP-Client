import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useHealth } from '../contexts/HealthContext';

const SleepTracker = () => {
  const { sleepHours, updateSleepHours } = useHealth();
  const [sleepData, setSleepData] = useState({
    bedTime: null,
    wakeTime: null,
    sleepHours: 0,
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState('bedtime'); // 'bedtime' or 'waketime'
  const [isAsleep, setIsAsleep] = useState(false);

  useEffect(() => {
    loadSleepData();
  }, []);

  const loadSleepData = async () => {
    try {
      const today = new Date().toDateString();
      const savedData = await AsyncStorage.getItem(`sleep_${today}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        setSleepData(data);
        setIsAsleep(data.bedTime && !data.wakeTime);
        updateSleepHours(data.sleepHours || 0); // Update context
      } else {
        // Reset to default empty state each day
        const resetData = { bedTime: null, wakeTime: null, sleepHours: 0 };
        setSleepData(resetData);
        setIsAsleep(false);
        updateSleepHours(0);
      }
    } catch (error) {
      console.error('Error loading sleep data:', error);
      // Reset on error
      const resetData = { bedTime: null, wakeTime: null, sleepHours: 0 };
      setSleepData(resetData);
      setIsAsleep(false);
      updateSleepHours(0);
    }
  };

  const saveSleepData = async (data) => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(`sleep_${today}`, JSON.stringify(data));
      updateSleepHours(data.sleepHours || 0); // Update context
    } catch (error) {
      console.error('Error saving sleep data:', error);
    }
  };

  const calculateSleepHours = (bedTime, wakeTime) => {
    if (!bedTime || !wakeTime) return 0;
    
    const bed = new Date(bedTime);
    const wake = new Date(wakeTime);
    
    // If wake time is earlier than bed time, assume next day
    if (wake < bed) {
      wake.setDate(wake.getDate() + 1);
    }
    
    const diffMs = wake - bed;
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 10) / 10; // Round to 1 decimal
  };

  const handleTimeSelect = (event, selectedTime) => {
    setShowTimePicker(false);
    
    if (selectedTime) {
      const newData = { ...sleepData };
      
      if (timePickerType === 'bedtime') {
        newData.bedTime = selectedTime.toISOString();
        setIsAsleep(true);
      } else {
        newData.wakeTime = selectedTime.toISOString();
        newData.sleepHours = calculateSleepHours(newData.bedTime, selectedTime.toISOString());
        setIsAsleep(false);
      }
      
      setSleepData(newData);
      saveSleepData(newData);
    }
  };

  const openTimePicker = (type) => {
    setTimePickerType(type);
    setShowTimePicker(true);
  };

  const resetSleepData = () => {
    Alert.alert(
      'Reset Sleep Data',
      'Are you sure you want to reset today\'s sleep tracking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            const resetData = { bedTime: null, wakeTime: null, sleepHours: 0 };
            setSleepData(resetData);
            setIsAsleep(false);
            saveSleepData(resetData);
          },
        },
      ]
    );
  };

  const getSleepQuality = (hours) => {
    if (hours >= 7 && hours <= 9) return { quality: 'Excellent', color: '#10B981', icon: 'happy' };
    if (hours >= 6 && hours < 7) return { quality: 'Good', color: '#F59E0B', icon: 'happy-outline' };
    if (hours >= 5 && hours < 6) return { quality: 'Fair', color: '#EF4444', icon: 'sad-outline' };
    return { quality: 'Poor', color: '#DC2626', icon: 'sad' };
  };

  const quality = getSleepQuality(sleepData.sleepHours);

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="moon" size={24} color="#8B5CF6" />
        <Text style={styles.title}>Sleep Tracker</Text>
        <TouchableOpacity onPress={resetSleepData}>
          <Ionicons name="refresh" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Sleep Hours Display */}
      <View style={styles.sleepDisplay}>
        <Text style={styles.sleepHours}>{sleepData.sleepHours}h</Text>
        <Text style={styles.sleepLabel}>Last Night</Text>
        {sleepData.sleepHours > 0 && (
          <View style={styles.qualityContainer}>
            <Ionicons name={quality.icon} size={20} color={quality.color} />
            <Text style={[styles.qualityText, { color: quality.color }]}>
              {quality.quality}
            </Text>
          </View>
        )}
      </View>

      {/* Time Inputs */}
      <View style={styles.timeContainer}>
        <TouchableOpacity 
          style={styles.timeCard}
          onPress={() => openTimePicker('bedtime')}
        >
          <Ionicons name="bed" size={20} color="#8B5CF6" />
          <Text style={styles.timeLabel}>Bedtime</Text>
          <Text style={styles.timeValue}>{formatTime(sleepData.bedTime)}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.timeCard}
          onPress={() => openTimePicker('waketime')}
          disabled={!sleepData.bedTime}
        >
          <Ionicons name="sunny" size={20} color="#F59E0B" />
          <Text style={styles.timeLabel}>Wake Time</Text>
          <Text style={styles.timeValue}>{formatTime(sleepData.wakeTime)}</Text>
        </TouchableOpacity>
      </View>

      {/* Sleep Status */}
      {isAsleep && (
        <View style={styles.statusContainer}>
          <View style={styles.sleepingIndicator} />
          <Text style={styles.statusText}>You're currently sleeping 😴</Text>
        </View>
      )}

      {/* Sleep Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Sleep Tips for Pregnancy</Text>
        <Text style={styles.tipText}>
          • Sleep on your left side to improve blood flow
        </Text>
        <Text style={styles.tipText}>
          • Use a pregnancy pillow for support
        </Text>
        <Text style={styles.tipText}>
          • Aim for 7-9 hours of sleep per night
        </Text>
      </View>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeSelect}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  sleepDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sleepHours: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  sleepLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qualityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  timeCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  sleepingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 8,
  },
  statusText: {
    color: '#1E40AF',
    fontWeight: '500',
  },
  tipsContainer: {
    backgroundColor: '#FDF4FF',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 4,
  },
});

export default SleepTracker;
