import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

const STORAGE_KEY = 'gynai_medications';

// ── Notification handler (show alerts while app is foregrounded) ────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const DEFAULT_MEDS = [
  { id: '1', name: 'Prenatal Vitamins', dose: '1 Tablet', time: '08:00', taken: false, color: '#EC4899', icon: 'medical', notificationId: null },
  { id: '2', name: 'Iron Supplement',   dose: '60mg',     time: '13:00', taken: false, color: '#F59E0B', icon: 'leaf',    notificationId: null },
  { id: '3', name: 'Folic Acid',        dose: '400mcg',   time: '18:00', taken: false, color: '#10B981', icon: 'nutrition', notificationId: null },
  { id: '4', name: 'Calcium',           dose: '1000mg',   time: '21:00', taken: false, color: '#3B82F6', icon: 'fitness', notificationId: null },
];

const ICONS   = ['medical', 'leaf', 'nutrition', 'fitness', 'water', 'heart', 'bandage', 'flask'];
const COLORS  = ['#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#F472B6', '#EF4444', '#6366F1', '#14B8A6'];

// ── Helpers ─────────────────────────────────────────────────────────────────
/** "HH:MM" → display string "8:30 AM" */
const fmtTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
};

/** Date object → "HH:MM" */
const dateToTimeStr = (d) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

/** "HH:MM" → Date object (today) */
const timeStrToDate = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

export default function Medications() {
  const [meds, setMeds]               = useState(DEFAULT_MEDS);
  const [showModal, setShowModal]     = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notifAllowed, setNotifAllowed] = useState(false);

  // Form state
  const [formName,  setFormName]  = useState('');
  const [formDose,  setFormDose]  = useState('');
  const [formTimeDate, setFormTimeDate] = useState(new Date()); // Date for picker
  const [formIcon,  setFormIcon]  = useState(ICONS[0]);
  const [formColor, setFormColor] = useState(COLORS[0]);

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadMeds();
    requestNotifPermission();
  }, []);

  const requestNotifPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotifAllowed(status === 'granted');
  };

  // ── Persistence ────────────────────────────────────────────────────────────
  const loadMeds = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setMeds(JSON.parse(stored));
    } catch { /* use defaults */ }
  };

  const saveMeds = async (updated) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch { /* silent */ }
  };

  // ── Notifications ──────────────────────────────────────────────────────────
  const scheduleNotification = async (med) => {
    if (!notifAllowed) return null;
    try {
      const [hour, minute] = med.time.split(':').map(Number);
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💊 Medication Reminder',
          body: `Time to take ${med.name} — ${med.dose}`,
          sound: true,
          data: { medId: med.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
      return id;
    } catch (e) {
      console.warn('Notification schedule failed:', e);
      return null;
    }
  };

  const cancelNotification = async (notificationId) => {
    if (!notificationId) return;
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch { /* silent */ }
  };

  // ── Actions ────────────────────────────────────────────────────────────────
  const toggleMed = async (id) => {
    const updated = meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m);
    setMeds(updated);
    await saveMeds(updated);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormName('');
    setFormDose('');
    setFormTimeDate(new Date());
    setFormIcon(ICONS[0]);
    setFormColor(COLORS[0]);
    setShowModal(true);
  };

  const openEditModal = (med) => {
    setEditingId(med.id);
    setFormName(med.name);
    setFormDose(med.dose);
    setFormTimeDate(timeStrToDate(med.time));
    setFormIcon(med.icon);
    setFormColor(med.color);
    setShowModal(true);
  };

  const saveMed = async () => {
    if (!formName.trim() || !formDose.trim()) {
      Alert.alert('Missing info', 'Please enter a medication name and dose.');
      return;
    }
    const timeStr = dateToTimeStr(formTimeDate);
    let updated;

    if (editingId) {
      const existing = meds.find(m => m.id === editingId);
      await cancelNotification(existing?.notificationId);
      const notifMed = { id: editingId, name: formName.trim(), dose: formDose.trim(), time: timeStr, icon: formIcon, color: formColor };
      const notificationId = await scheduleNotification(notifMed);
      updated = meds.map(m => m.id === editingId
        ? { ...m, name: formName.trim(), dose: formDose.trim(), time: timeStr, icon: formIcon, color: formColor, notificationId }
        : m
      );
    } else {
      const newMed = { id: String(Date.now()), name: formName.trim(), dose: formDose.trim(), time: timeStr, icon: formIcon, color: formColor, taken: false, notificationId: null };
      const notificationId = await scheduleNotification(newMed);
      updated = [...meds, { ...newMed, notificationId }];
    }

    setMeds(updated);
    await saveMeds(updated);
    setShowModal(false);
  };

  const deleteMed = (id, name) => {
    Alert.alert('Remove Medication', `Remove "${name}" from your schedule?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          const med = meds.find(m => m.id === id);
          await cancelNotification(med?.notificationId);
          const updated = meds.filter(m => m.id !== id);
          setMeds(updated);
          await saveMeds(updated);
        }
      }
    ]);
  };

  const resetDay = async () => {
    Alert.alert('Reset Day', 'Mark all medications as not taken?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset', onPress: async () => {
          const updated = meds.map(m => ({ ...m, taken: false }));
          setMeds(updated);
          await saveMeds(updated);
        }
      }
    ]);
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const takenCount  = meds.filter(m => m.taken).length;
  const totalCount  = meds.length;
  const progressPct = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;
  const allDone     = takenCount === totalCount && totalCount > 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <View style={{
        paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'white',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 4,
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Ionicons name="arrow-back" size={20} color="#374151" />
          <Text style={{ color: '#6B7280', fontSize: 13 }}>Back</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={{ color: '#111827', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}>Daily Medications</Text>
            <Text style={{ color: allDone ? '#10B981' : '#6B7280', fontSize: 13, marginTop: 4 }}>
              {allDone ? 'All done for today!' : `${takenCount} of ${totalCount} taken today`}
            </Text>
          </View>
          {notifAllowed && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fdf2f8', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 }}>
              <Ionicons name="notifications" size={13} color="#ec4899" />
              <Text style={{ fontSize: 11, color: '#ec4899', fontWeight: '700' }}>Reminders on</Text>
            </View>
          )}
        </View>

        {/* Progress bar */}
        <View style={{ backgroundColor: '#F3F4F6', borderRadius: 8, height: 8, marginTop: 14 }}>
          <View style={{ width: `${progressPct}%`, backgroundColor: allDone ? '#10B981' : '#EC4899', height: 8, borderRadius: 8 }} />
        </View>
        <Text style={{ color: '#9CA3AF', fontSize: 11, marginTop: 5 }}>{progressPct}% complete</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ padding: 20 }}>
          {/* Banner */}
          {allDone ? (
            <View style={{ backgroundColor: '#ECFDF5', borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <Text style={{ fontSize: 32 }}>🎉</Text>
              <View>
                <Text style={{ color: '#065F46', fontSize: 15, fontWeight: '800' }}>All medications taken!</Text>
                <Text style={{ color: '#6EE7B7', fontSize: 12 }}>Amazing consistency for your baby.</Text>
              </View>
            </View>
          ) : (
            <View style={{ backgroundColor: '#EC4899', borderRadius: 18, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontSize: 15, fontWeight: '800', marginBottom: 4 }}>Stay Consistent!</Text>
                <Text style={{ color: '#FBD5E8', fontSize: 12, lineHeight: 18 }}>Prenatal vitamins are crucial for your baby's neural development.</Text>
              </View>
              <Ionicons name="heart" size={40} color="rgba(255,255,255,0.3)" />
            </View>
          )}

          {/* Section header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#ec4899', letterSpacing: 1.2 }}>TODAY'S SCHEDULE</Text>
            {takenCount > 0 && (
              <TouchableOpacity onPress={resetDay}>
                <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '700' }}>Reset Day</Text>
              </TouchableOpacity>
            )}
          </View>

          {meds.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Ionicons name="medical-outline" size={56} color="#D1D5DB" />
              <Text style={{ color: '#9CA3AF', fontSize: 16, fontWeight: '600', marginTop: 12 }}>No medications added yet</Text>
              <Text style={{ color: '#D1D5DB', fontSize: 13, marginTop: 4 }}>Tap the button below to add your first one</Text>
            </View>
          ) : (
            meds.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleMed(item.id)}
                onLongPress={() => openEditModal(item)}
                style={{
                  backgroundColor: item.taken ? '#F9FAFB' : 'white',
                  borderRadius: 18, padding: 16,
                  flexDirection: 'row', alignItems: 'center',
                  marginBottom: 12, borderWidth: 1.5,
                  borderColor: item.taken ? '#E5E7EB' : item.color + '30',
                  shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: item.taken ? 0.02 : 0.06, shadowRadius: 8,
                  elevation: item.taken ? 1 : 3,
                }}
              >
                <View style={{ width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14, backgroundColor: item.taken ? '#F3F4F6' : item.color + '18' }}>
                  <Ionicons name={item.icon} size={22} color={item.taken ? '#9CA3AF' : item.color} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: item.taken ? '#9CA3AF' : '#111827', textDecorationLine: item.taken ? 'line-through' : 'none' }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: item.taken ? '#D1D5DB' : item.color, marginTop: 2 }}>
                    {item.dose}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Ionicons name="time-outline" size={12} color="#9CA3AF" />
                    <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{fmtTime(item.time)}</Text>
                    {item.notificationId && (
                      <Ionicons name="notifications-outline" size={11} color="#ec4899" style={{ marginLeft: 4 }} />
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <TouchableOpacity onPress={() => deleteMed(item.id, item.name)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="trash-outline" size={16} color="#D1D5DB" />
                  </TouchableOpacity>
                  <View style={{ width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: item.taken ? '#10B981' : 'transparent', borderWidth: 2, borderColor: item.taken ? '#10B981' : '#D1D5DB' }}>
                    {item.taken && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}

          {/* Add button */}
          <TouchableOpacity
            onPress={openAddModal}
            style={{ marginTop: 8, padding: 16, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: '#fbcfe8', backgroundColor: '#fdf2f8', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}
          >
            <Ionicons name="add-circle" size={22} color="#ec4899" />
            <Text style={{ color: '#ec4899', fontWeight: '800', fontSize: 14 }}>Add New Medication</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>
                {editingId ? 'Edit Medication' : 'Add Medication'}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={26} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Name */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 6 }}>MEDICATION NAME *</Text>
            <TextInput
              value={formName}
              onChangeText={setFormName}
              placeholder="e.g., Prenatal Vitamins"
              placeholderTextColor="#D1D5DB"
              style={{ backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14, padding: 14, fontSize: 15, color: '#111827', marginBottom: 16 }}
            />

            {/* Dose */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 6 }}>DOSE *</Text>
            <TextInput
              value={formDose}
              onChangeText={setFormDose}
              placeholder="e.g., 1 Tablet, 60mg"
              placeholderTextColor="#D1D5DB"
              style={{ backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14, padding: 14, fontSize: 15, color: '#111827', marginBottom: 16 }}
            />

            {/* Time picker */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 8 }}>
              REMINDER TIME {notifAllowed ? '🔔' : '(notifications off)'}
            </Text>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={{ backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
            >
              <Ionicons name="time-outline" size={20} color="#ec4899" />
              <Text style={{ color: '#111827', fontWeight: '700', fontSize: 16, marginLeft: 10, flex: 1 }}>
                {fmtTime(dateToTimeStr(formTimeDate))}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={formTimeDate}
                mode="time"
                minuteInterval={5}
                onChange={(e, d) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (d) setFormTimeDate(d);
                }}
              />
            )}

            {/* Color */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 8 }}>COLOR</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setFormColor(c)}
                  style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: c, justifyContent: 'center', alignItems: 'center', borderWidth: formColor === c ? 3 : 0, borderColor: 'white', shadowColor: c, shadowOpacity: 0.5, shadowRadius: 4, elevation: 3 }}
                >
                  {formColor === c && <Ionicons name="checkmark" size={14} color="white" />}
                </TouchableOpacity>
              ))}
            </View>

            {/* Save */}
            <TouchableOpacity
              onPress={saveMed}
              style={{ backgroundColor: '#ec4899', borderRadius: 16, padding: 16, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>
                {editingId ? 'Save Changes' : 'Add Medication'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
