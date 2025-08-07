import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import WaterTracker from '../components/WaterTracker';
import SleepTracker from '../components/SleepTracker';
import { useHealth } from '../contexts/HealthContext';

const HealthTracking = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const { getWaterProgress, getSleepDisplay, loadHealthData, waterCount, sleepHours } = useHealth();

  useEffect(() => {
    loadHealthData();
  }, []);

  // Calculate weekly statistics based on current data
  const getWaterGoalPercentage = () => {
    const dailyGoal = 8; // glasses per day
    const achievement = Math.min((waterCount / dailyGoal) * 100, 100);
    return Math.round(achievement);
  };

  const getAverageSleep = () => {
    // For now, use current sleep as average (in real app, would calculate from week's data)
    return sleepHours > 0 ? `${sleepHours}h` : '0h';
  };

  const TabButton = ({ id, title, icon, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTab]}
      onPress={() => onPress(id)}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={isActive ? '#8B5CF6' : '#6B7280'} 
      />
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const OverviewCard = ({ title, value, unit, icon, color, onPress }) => (
    <TouchableOpacity style={styles.overviewCard} onPress={onPress}>
      <View style={[styles.overviewIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <View style={styles.overviewContent}>
        <Text style={styles.overviewValue}>{value}</Text>
        <Text style={styles.overviewUnit}>{unit}</Text>
        <Text style={styles.overviewTitle}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Tracking</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TabButton
          id="overview"
          title="Overview"
          icon="grid-outline"
          isActive={activeTab === 'overview'}
          onPress={setActiveTab}
        />
        <TabButton
          id="water"
          title="Water"
          icon="water-outline"
          isActive={activeTab === 'water'}
          onPress={setActiveTab}
        />
        <TabButton
          id="sleep"
          title="Sleep"
          icon="moon-outline"
          isActive={activeTab === 'sleep'}
          onPress={setActiveTab}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <View>
            <Text style={styles.sectionTitle}>Today's Summary</Text>
            <OverviewCard
              title="Water Intake"
              value={getWaterProgress()}
              unit="glasses today"
              icon="water-outline"
              color="#3B82F6"
              onPress={() => setActiveTab('water')}
            />
            <OverviewCard
              title="Sleep"
              value={getSleepDisplay()}
              unit="last night"
              icon="moon-outline"
              color="#8B5CF6"
              onPress={() => setActiveTab('sleep')}
            />
            
            {/* Weekly Summary */}
            <View style={styles.weeklyContainer}>
              <Text style={styles.sectionTitle}>Today's Stats</Text>
              <View style={styles.weeklyStats}>
                <View style={styles.weeklyStatItem}>
                  <Text style={styles.weeklyStatValue}>{getWaterGoalPercentage()}%</Text>
                  <Text style={styles.weeklyStatLabel}>Water Goal Met</Text>
                </View>
                <View style={styles.weeklyStatItem}>
                  <Text style={styles.weeklyStatValue}>{getAverageSleep()}</Text>
                  <Text style={styles.weeklyStatLabel}>Sleep Hours</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'water' && <WaterTracker />}
        {activeTab === 'sleep' && <SleepTracker />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  activeTab: {
    backgroundColor: '#F3F4F6',
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 20,
    marginBottom: 16,
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  overviewContent: {
    flex: 1,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  overviewUnit: {
    fontSize: 12,
    color: '#6B7280',
  },
  overviewTitle: {
    fontSize: 14,
    color: '#374151',
    marginTop: 2,
  },
  weeklyContainer: {
    marginTop: 8,
  },
  weeklyStats: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyStatItem: {
    alignItems: 'center',
  },
  weeklyStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  weeklyStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default HealthTracking;
