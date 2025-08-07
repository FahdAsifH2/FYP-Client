import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHealth } from '../contexts/HealthContext';

const WaterTracker = () => {
  const { waterCount, updateWaterCount } = useHealth();
  const dailyGoal = 8; // 8 glasses per day

  const saveWaterData = async (count) => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(`water_${today}`, count.toString());
      updateWaterCount(count); // Update context
    } catch (error) {
      console.error('Error saving water data:', error);
    }
  };

  const addWater = () => {
    if (waterCount < dailyGoal) {
      const newCount = waterCount + 1;
      saveWaterData(newCount);
    }
  };

  const removeWater = () => {
    if (waterCount > 0) {
      const newCount = waterCount - 1;
      saveWaterData(newCount);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Intake Today</Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity onPress={removeWater} style={styles.button}>
          <Ionicons name="remove" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.display}>
          <Text style={styles.count}>{waterCount}/{dailyGoal}</Text>
          <Text style={styles.unit}>glasses</Text>
        </View>
        
        <TouchableOpacity onPress={addWater} style={styles.button}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Water glasses visualization */}
      <View style={styles.glassesContainer}>
        {Array.from({ length: dailyGoal }, (_, index) => (
          <Ionicons
            key={index}
            name="water"
            size={20}
            color={index < waterCount ? "#3B82F6" : "#E5E7EB"}
          />
        ))}
      </View>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  display: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  unit: {
    fontSize: 14,
    color: '#6B7280',
  },
  glassesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
});

export default WaterTracker;
