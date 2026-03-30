import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHealth } from '../_contexts/HealthContext';

const { width } = Dimensions.get('window');
const DAILY_WATER_GOAL = 8;
const SLEEP_KEY_PREFIX = 'sleep_hours_';

export default function HealthTracking() {
  const { waterCount, updateWaterCount, sleepHours, updateSleepHours } = useHealth();
  const [sleepDraft, setSleepDraft] = useState(0);

  useEffect(() => {
    loadSleep();
  }, []);

  const todayKey = () => new Date().toDateString();

  // ── Water ─────────────────────────────────────────────────────────────────
  const addWater = async () => {
    if (waterCount >= DAILY_WATER_GOAL) return;
    const next = waterCount + 1;
    updateWaterCount(next);
    await AsyncStorage.setItem(`water_${todayKey()}`, String(next));
  };

  const removeWater = async () => {
    if (waterCount <= 0) return;
    const next = waterCount - 1;
    updateWaterCount(next);
    await AsyncStorage.setItem(`water_${todayKey()}`, String(next));
  };

  const waterPct = Math.round((waterCount / DAILY_WATER_GOAL) * 100);

  // ── Sleep ─────────────────────────────────────────────────────────────────
  const loadSleep = async () => {
    try {
      const stored = await AsyncStorage.getItem(SLEEP_KEY_PREFIX + todayKey());
      if (stored) {
        const h = parseFloat(stored);
        setSleepDraft(h);
        updateSleepHours(h);
      } else {
        setSleepDraft(sleepHours || 0);
      }
    } catch { /* silent */ }
  };

  const saveSleep = async (val) => {
    const clamped = Math.max(0, Math.min(12, val));
    setSleepDraft(clamped);
    updateSleepHours(clamped);
    await AsyncStorage.setItem(SLEEP_KEY_PREFIX + todayKey(), String(clamped));
  };

  const getSleepQuality = (h) => {
    if (h >= 7 && h <= 9) return { label: 'Excellent', color: '#10B981', emoji: '😴' };
    if (h >= 6) return { label: 'Good', color: '#F59E0B', emoji: '🙂' };
    if (h >= 5) return { label: 'Fair', color: '#F97316', emoji: '😐' };
    if (h > 0)  return { label: 'Poor', color: '#EF4444', emoji: '😞' };
    return { label: 'Not logged', color: '#D1D5DB', emoji: '💤' };
  };

  const sleepQ = getSleepQuality(sleepDraft);

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Ionicons name="arrow-back" size={20} color="#374151" />
          <Text style={{ color: '#6B7280', fontSize: 13 }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 26, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>Daily Wellness</Text>
        <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
          {new Date().toLocaleDateString('en-PK', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>

          {/* ── WATER INTAKE ────────────────────────────────────────────── */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#3B82F6', letterSpacing: 1.2, marginBottom: 12 }}>WATER INTAKE</Text>

          <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 4 }}>
            {/* Progress arc / big number */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View>
                <Text style={{ fontSize: 52, fontWeight: '900', color: '#111827', lineHeight: 56 }}>{waterCount}</Text>
                <Text style={{ fontSize: 14, color: '#9CA3AF', fontWeight: '500' }}>of {DAILY_WATER_GOAL} glasses</Text>
                <Text style={{ fontSize: 13, color: waterPct >= 100 ? '#10B981' : '#3B82F6', fontWeight: '700', marginTop: 4 }}>
                  {waterPct >= 100 ? 'Goal reached! 🎉' : `${DAILY_WATER_GOAL - waterCount} more to go`}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: '800', color: '#3B82F6' }}>{waterPct}%</Text>
                <Text style={{ fontSize: 11, color: '#93C5FD' }}>daily goal</Text>
              </View>
            </View>

            {/* Water glasses grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
              {Array.from({ length: DAILY_WATER_GOAL }, (_, i) => (
                <TouchableOpacity key={i} onPress={i < waterCount ? removeWater : addWater}>
                  <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: i < waterCount ? '#EFF6FF' : '#F9FAFB', borderWidth: 2, borderColor: i < waterCount ? '#3B82F6' : '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="water" size={20} color={i < waterCount ? '#3B82F6' : '#D1D5DB'} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Progress bar */}
            <View style={{ backgroundColor: '#EFF6FF', borderRadius: 10, height: 10, marginBottom: 16 }}>
              <View style={{ width: `${waterPct}%`, backgroundColor: '#3B82F6', height: 10, borderRadius: 10 }} />
            </View>

            {/* Controls */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={removeWater}
                disabled={waterCount <= 0}
                style={{ flex: 1, backgroundColor: waterCount <= 0 ? '#F9FAFB' : '#EFF6FF', borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}
              >
                <Ionicons name="remove-circle" size={20} color={waterCount <= 0 ? '#D1D5DB' : '#3B82F6'} />
                <Text style={{ fontWeight: '700', color: waterCount <= 0 ? '#D1D5DB' : '#3B82F6', fontSize: 14 }}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={addWater}
                disabled={waterCount >= DAILY_WATER_GOAL}
                style={{ flex: 1, backgroundColor: waterCount >= DAILY_WATER_GOAL ? '#F9FAFB' : '#3B82F6', borderRadius: 14, padding: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}
              >
                <Ionicons name="add-circle" size={20} color={waterCount >= DAILY_WATER_GOAL ? '#D1D5DB' : 'white'} />
                <Text style={{ fontWeight: '700', color: waterCount >= DAILY_WATER_GOAL ? '#D1D5DB' : 'white', fontSize: 14 }}>Add Glass</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── SLEEP TRACKER ───────────────────────────────────────────── */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#818cf8', letterSpacing: 1.2, marginBottom: 12 }}>SLEEP TRACKER</Text>

          <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 4 }}>
            {/* Quality badge + hours */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <View>
                <Text style={{ fontSize: 52, fontWeight: '900', color: '#111827', lineHeight: 56 }}>{sleepDraft}h</Text>
                <Text style={{ fontSize: 14, color: '#9CA3AF', fontWeight: '500' }}>last night</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: sleepQ.color }} />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: sleepQ.color }}>{sleepQ.label}</Text>
                </View>
              </View>
              <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="moon-outline" size={28} color="#818cf8" />
              </View>
            </View>

            {/* Hour stepper */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 12 }}>SET SLEEP HOURS</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <TouchableOpacity
                  onPress={() => saveSleep(sleepDraft - 0.5)}
                  style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Ionicons name="remove" size={24} color="#818cf8" />
                </TouchableOpacity>
                <View style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: '#818cf8', justifyContent: 'center', alignItems: 'center', shadowColor: '#818cf8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 }}>
                  <Text style={{ fontSize: 30, fontWeight: '900', color: 'white' }}>{sleepDraft}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => saveSleep(sleepDraft + 0.5)}
                  style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#818cf8', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 12, color: '#D1D5DB', marginTop: 8 }}>Tap ± to adjust by 0.5 hours</Text>
            </View>

            {/* Quick presets */}
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
              {[5, 6, 7, 8, 9, 10].map(h => (
                <TouchableOpacity
                  key={h}
                  onPress={() => saveSleep(h)}
                  style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: sleepDraft === h ? '#818cf8' : '#F3F4F6' }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: sleepDraft === h ? 'white' : '#6B7280' }}>{h}h</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Sleep progress bar */}
            <View style={{ backgroundColor: '#F5F3FF', borderRadius: 10, height: 10 }}>
              <View style={{ width: `${Math.min(100, (sleepDraft / 9) * 100)}%`, backgroundColor: sleepQ.color, height: 10, borderRadius: 10 }} />
            </View>

            {/* Tip */}
            <View style={{ backgroundColor: '#FDF4FF', borderRadius: 14, padding: 14, marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="information-circle" size={18} color="#818cf8" />
              <Text style={{ flex: 1, fontSize: 12, color: '#6366f1', lineHeight: 18 }}>
                During pregnancy, 7–9 hours is recommended. Sleep on your left side to improve blood flow to your baby.
              </Text>
            </View>
          </View>

          {/* ── DAILY SUMMARY ───────────────────────────────────────────── */}
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1.2, marginBottom: 12 }}>DAILY SUMMARY</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
            <View style={{ flex: 1, backgroundColor: '#EFF6FF', borderRadius: 18, padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#1E40AF' }}>{waterPct}%</Text>
              <Text style={{ fontSize: 11, color: '#93C5FD', fontWeight: '700', marginTop: 2 }}>Water Goal</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: '#F5F3FF', borderRadius: 18, padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: sleepQ.color }}>{sleepDraft}h</Text>
              <Text style={{ fontSize: 11, color: '#C4B5FD', fontWeight: '700', marginTop: 2 }}>Sleep</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: sleepDraft >= 7 && waterPct >= 75 ? '#ECFDF5' : '#FEF9C3', borderRadius: 18, padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 22 }}>{sleepDraft >= 7 && waterPct >= 75 ? '⭐' : '💪'}</Text>
              <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '700', marginTop: 2 }}>
                {sleepDraft >= 7 && waterPct >= 75 ? 'On Track!' : 'Keep Going'}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}
