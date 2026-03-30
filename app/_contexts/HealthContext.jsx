import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HealthContext = createContext();

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

export const HealthProvider = ({ children }) => {
  const [waterCount, setWaterCount] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);

  // Load all health data when app starts
  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      const today = new Date().toDateString();
      
      // Load water data
      const waterData = await AsyncStorage.getItem(`water_${today}`);
      if (waterData) {
        setWaterCount(parseInt(waterData));
      }

      // Load sleep data
      const sleepData = await AsyncStorage.getItem(`sleep_${today}`);
      if (sleepData) {
        const data = JSON.parse(sleepData);
        setSleepHours(data.sleepHours || 0);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  const updateWaterCount = (count) => {
    setWaterCount(count);
  };

  const updateSleepHours = (hours) => {
    setSleepHours(hours);
  };

  const getWaterProgress = () => {
    const goal = 8;
    return `${waterCount}/${goal}`;
  };

  const getSleepDisplay = () => {
    if (sleepHours === 0) return '0h';
    return `${sleepHours}h`;
  };

  const value = {
    // Current values
    waterCount,
    sleepHours,
    
    // Update functions
    updateWaterCount,
    updateSleepHours,
    
    // Display functions
    getWaterProgress,
    getSleepDisplay,
    
    // Refresh function
    loadHealthData,
  };

  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  );
};

// Default export to prevent expo-router warnings
export default HealthProvider;
