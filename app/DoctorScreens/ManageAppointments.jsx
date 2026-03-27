import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, TextInput, RefreshControl, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../_config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const DAY_SIZE = Math.floor((width - 48) / 7);

// ── Appointment type color palette ──────────────────────────────────────────
const TYPE_COLORS = {
  'Routine Checkup':    { color: '#10B981', bg: '#ECFDF5', light: '#D1FAE5' },
  'Ultrasound':         { color: '#8B5CF6', bg: '#F5F3FF', light: '#EDE9FE' },
  'Blood Work':         { color: '#EF4444', bg: '#FEF2F2', light: '#FEE2E2' },
  'Consultation':       { color: '#3B82F6', bg: '#EFF6FF', light: '#DBEAFE' },
  'Emergency':          { color: '#F97316', bg: '#FFF7ED', light: '#FED7AA' },
  'Follow-up':          { color: '#06B6D4', bg: '#ECFEFF', light: '#CFFAFE' },
  'Antenatal Visit':    { color: '#EC4899', bg: '#FDF2F8', light: '#FCE7F3' },
  'General':            { color: '#6B7280', bg: '#F3F4F6', light: '#E5E7EB' },
};

const getTypeStyle = (type) =>
  TYPE_COLORS[type] || TYPE_COLORS['General'];

const STATUS_STYLES = {
  pending:   { color: '#F59E0B', bg: '#FFFBEB', label: 'Pending' },
  confirmed: { color: '#10B981', bg: '#ECFDF5', label: 'Confirmed' },
  completed: { color: '#3B82F6', bg: '#EFF6FF', label: 'Completed' },
  cancelled: { color: '#EF4444', bg: '#FEF2F2', label: 'Cancelled' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ── Helpers ──────────────────────────────────────────────────────────────────
const toDateStr = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Normalize appointment_date to 'YYYY-MM-DD' string regardless of whether
// Neon returns it as a Date object or an ISO string
const normDateStr = (d) => {
  if (!d) return '';
  if (d instanceof Date) return toDateStr(d);
  if (typeof d === 'string') return d.split('T')[0];
  return '';
};

const formatTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
};

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [noteModal, setNoteModal] = useState(null);
  const [doctorNote, setDoctorNote] = useState('');
  const [detailModal, setDetailModal] = useState(null);

  // Calendar state
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toDateStr(today));

  const getToken = async () => await AsyncStorage.getItem('userToken');

  const fetchAppointments = async () => {
    try {
      const token = await getToken();
      const res = await axios.get(`${config.API_URL}/api/appointments/doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchAppointments();
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  }, []);

  const updateStatus = async (id, status, notes) => {
    try {
      const token = await getToken();
      await axios.patch(
        `${config.API_URL}/api/appointments/${id}/status`,
        { status, notes: notes || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAppointments();
    } catch {
      Alert.alert('Error', 'Failed to update appointment');
    }
  };

  const confirmAppointment = (id) => updateStatus(id, 'confirmed');

  const submitCompletion = async () => {
    await updateStatus(noteModal, 'completed', doctorNote);
    setNoteModal(null);
    setDoctorNote('');
    setDetailModal(null);
  };

  const cancelAppointment = (id, name) => {
    Alert.alert('Cancel', `Cancel appointment with ${name}?`, [
      { text: 'No', style: 'cancel' },
      { text: 'Cancel It', style: 'destructive', onPress: () => updateStatus(id, 'cancelled') },
    ]);
  };

  // ── Build calendar grid ──────────────────────────────────────────────────
  const buildCalendarDays = () => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const cells = [];
    // Leading days from previous month
    for (let i = firstDow - 1; i >= 0; i--) {
      cells.push({ day: daysInPrev - i, month: 'prev', dateStr: toDateStr(new Date(year, month - 1, daysInPrev - i)) });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, month: 'cur', dateStr: toDateStr(new Date(year, month, d)) });
    }
    // Trailing days
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, month: 'next', dateStr: toDateStr(new Date(year, month + 1, d)) });
    }
    return cells;
  };

  // Map date → appointments for that day
  const apptsByDate = appointments.reduce((acc, a) => {
    const key = normDateStr(a.appointment_date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  const selectedAppts = (apptsByDate[selectedDate] || [])
    .slice()
    .sort((a, b) => (a.appointment_time || '').localeCompare(b.appointment_time || ''));

  const todayStr = toDateStr(today);
  const todayAppts = apptsByDate[todayStr] || [];
  const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status));

  const prevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const nextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  const goToday = () => {
    setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(todayStr);
  };

  const calDays = buildCalendarDays();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAFAFA', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <View style={{ paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Ionicons name="arrow-back" size={20} color="#374151" />
          <Text style={{ color: '#6B7280', fontSize: 13 }}>Back</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>Appointments</Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{upcoming.length} upcoming</Text>
          </View>
          <TouchableOpacity
            onPress={goToday}
            style={{ backgroundColor: '#F5F3FF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <Ionicons name="today" size={16} color="#8B5CF6" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#8B5CF6' }}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        {todayAppts.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F5F3FF', borderRadius: 12, padding: 10, marginTop: 10 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#8B5CF6' }} />
            <Text style={{ fontSize: 13, color: '#7C3AED', fontWeight: '600' }}>
              {todayAppts.length} appointment{todayAppts.length > 1 ? 's' : ''} today
            </Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />}>

        {/* ── Calendar ────────────────────────────────────────────────── */}
        <View style={{ backgroundColor: 'white', marginTop: 12, marginHorizontal: 16, borderRadius: 24, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 4 }}>

          {/* Month nav */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <TouchableOpacity onPress={prevMonth} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="chevron-back" size={20} color="#374151" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>
              {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="chevron-forward" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Weekday headers */}
          <View style={{ flexDirection: 'row', marginBottom: 6 }}>
            {WEEKDAYS.map(d => (
              <View key={d} style={{ width: DAY_SIZE, alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#9CA3AF' }}>{d}</Text>
              </View>
            ))}
          </View>

          {/* Day cells */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {calDays.map((cell, idx) => {
              const dayAppts = apptsByDate[cell.dateStr] || [];
              const isSelected = cell.dateStr === selectedDate;
              const isToday = cell.dateStr === todayStr;
              const isOtherMonth = cell.month !== 'cur';

              // Up to 3 colored dots for appointment types
              const dots = dayAppts.slice(0, 3).map(a => getTypeStyle(a.appointment_type || 'General').color);

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedDate(cell.dateStr)}
                  style={{ width: DAY_SIZE, height: DAY_SIZE + 4, alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}
                >
                  <View style={{
                    width: DAY_SIZE - 6,
                    height: DAY_SIZE - 6,
                    borderRadius: (DAY_SIZE - 6) / 2,
                    backgroundColor: isSelected ? '#8B5CF6' : isToday ? '#F5F3FF' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: isToday && !isSelected ? 1.5 : 0,
                    borderColor: '#8B5CF6',
                  }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: isToday || isSelected ? '800' : '500',
                      color: isSelected ? 'white' : isOtherMonth ? '#D1D5DB' : isToday ? '#8B5CF6' : '#111827',
                    }}>{cell.day}</Text>
                  </View>
                  {/* Appointment dots */}
                  {dots.length > 0 && (
                    <View style={{ flexDirection: 'row', gap: 2, marginTop: 1 }}>
                      {dots.map((col, i) => (
                        <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: isSelected ? 'rgba(255,255,255,0.8)' : col }} />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Legend */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
            {Object.entries(TYPE_COLORS).slice(0, 6).map(([type, style]) => (
              <View key={type} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: style.color }} />
                <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: '600' }}>{type}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Selected Day Agenda ──────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#8B5CF6', letterSpacing: 1.2 }}>
              {selectedDate === todayStr ? "TODAY'S AGENDA" : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{selectedAppts.length} appt{selectedAppts.length !== 1 ? 's' : ''}</Text>
          </View>

          {selectedAppts.length === 0 ? (
            <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 32, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <Ionicons name="calendar-outline" size={40} color="#E5E7EB" />
              <Text style={{ color: '#9CA3AF', fontSize: 15, marginTop: 12, fontWeight: '500' }}>No appointments</Text>
              <Text style={{ color: '#D1D5DB', fontSize: 12, marginTop: 4 }}>Tap another date to view its schedule</Text>
            </View>
          ) : (
            selectedAppts.map(item => <AppointmentCard key={item.id} item={item} onConfirm={confirmAppointment} onComplete={(id) => { setNoteModal(id); setDoctorNote(''); }} onCancel={cancelAppointment} onPress={() => setDetailModal(item)} />)
          )}
        </View>

        {/* ── All Upcoming (other dates) ───────────────────────────────── */}
        {upcoming.filter(a => normDateStr(a.appointment_date) !== selectedDate).length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1.2, marginBottom: 12 }}>ALL UPCOMING</Text>
            {upcoming
              .filter(a => normDateStr(a.appointment_date) !== selectedDate)
              .sort((a, b) => (a.appointment_date || '').localeCompare(b.appointment_date || ''))
              .map(item => <AppointmentCard key={item.id} item={item} compact onConfirm={confirmAppointment} onComplete={(id) => { setNoteModal(id); setDoctorNote(''); }} onCancel={cancelAppointment} onPress={() => setDetailModal(item)} />)}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Detail Modal ─────────────────────────────────────────────── */}
      <Modal visible={!!detailModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          {detailModal && (() => {
            const ts = getTypeStyle(detailModal.appointment_type || 'General');
            const ss = STATUS_STYLES[detailModal.status] || STATUS_STYLES.pending;
            const isActionable = ['pending', 'confirmed'].includes(detailModal.status);
            return (
              <View style={{ backgroundColor: 'white', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <View style={{ backgroundColor: ts.bg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: ts.color }}>{detailModal.appointment_type || 'General'}</Text>
                      </View>
                      <View style={{ backgroundColor: ss.bg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: ss.color }}>{ss.label}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827' }}>{detailModal.patient_name}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setDetailModal(null)}>
                    <Ionicons name="close" size={26} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={{ backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, marginBottom: 16, gap: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="calendar" size={18} color="#8B5CF6" />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                      {new Date(normDateStr(detailModal.appointment_date) + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="time" size={18} color="#8B5CF6" />
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>{formatTime(detailModal.appointment_time)}</Text>
                  </View>
                </View>

                {detailModal.issue && (
                  <View style={{ backgroundColor: '#FFFBEB', borderRadius: 14, padding: 14, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#F59E0B' }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#F59E0B', marginBottom: 4 }}>PATIENT'S CONCERN</Text>
                    <Text style={{ fontSize: 14, color: '#92400E', lineHeight: 20 }}>{detailModal.issue}</Text>
                  </View>
                )}

                {detailModal.notes && (
                  <View style={{ backgroundColor: '#EFF6FF', borderRadius: 14, padding: 14, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: '#3B82F6' }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#3B82F6', marginBottom: 4 }}>YOUR NOTE</Text>
                    <Text style={{ fontSize: 14, color: '#1E40AF', lineHeight: 20 }}>{detailModal.notes}</Text>
                  </View>
                )}

                {isActionable && (
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {detailModal.status === 'pending' && (
                      <TouchableOpacity
                        onPress={() => { confirmAppointment(detailModal.id); setDetailModal(null); }}
                        style={{ flex: 1, backgroundColor: '#10B981', borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                      >
                        <Ionicons name="checkmark-circle" size={18} color="white" />
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>Confirm</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => { setNoteModal(detailModal.id); setDoctorNote(''); }}
                      style={{ flex: 1, backgroundColor: '#3B82F6', borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 }}
                    >
                      <Ionicons name="checkmark-done-circle" size={18} color="white" />
                      <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => { cancelAppointment(detailModal.id, detailModal.patient_name); setDetailModal(null); }}
                      style={{ backgroundColor: '#FEF2F2', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center' }}
                    >
                      <Ionicons name="close" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })()}
        </View>
      </Modal>

      {/* ── Complete + Note Modal ─────────────────────────────────────── */}
      <Modal visible={noteModal !== null} animationType="fade" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 24, padding: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 6 }}>Complete Appointment</Text>
            <Text style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 16 }}>Add a note for the patient (optional)</Text>
            <TextInput
              value={doctorNote}
              onChangeText={setDoctorNote}
              placeholder="e.g., All vitals normal. Next visit in 4 weeks..."
              placeholderTextColor="#D1D5DB"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 14, padding: 14, fontSize: 14, color: '#111827', minHeight: 100, marginBottom: 16 }}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={() => setNoteModal(null)}
                style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ fontWeight: '700', color: '#6B7280' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={submitCompletion}
                style={{ flex: 1, backgroundColor: '#3B82F6', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ fontWeight: '700', color: 'white' }}>Mark Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ── Appointment card sub-component ────────────────────────────────────────────
function AppointmentCard({ item, compact, onConfirm, onComplete, onCancel, onPress }) {
  const ts = getTypeStyle(item.appointment_type || 'General');
  const ss = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
  const isActionable = ['pending', 'confirmed'].includes(item.status);
  const dateLabel = (() => {
    const d = new Date(normDateStr(item.appointment_date) + 'T00:00:00');
    const t = new Date(); t.setHours(0,0,0,0);
    if (d.toDateString() === t.toDateString()) return 'Today';
    if (d.toDateString() === new Date(Date.now()+86400000).toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-PK', { weekday: 'short', month: 'short', day: 'numeric' });
  })();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.92}
      style={{ backgroundColor: 'white', borderRadius: 18, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, borderLeftWidth: 4, borderLeftColor: ts.color }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: compact ? 0 : 10 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#111827' }}>{item.patient_name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <View style={{ backgroundColor: ts.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: ts.color }}>{item.appointment_type || 'General'}</Text>
            </View>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>{compact ? dateLabel + ' · ' : ''}{formatTime(item.appointment_time)}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: ss.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: ss.color }} />
          <Text style={{ fontSize: 11, fontWeight: '700', color: ss.color }}>{ss.label}</Text>
        </View>
      </View>

      {!compact && item.issue && (
        <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 10, fontStyle: 'italic' }} numberOfLines={1}>
          "{item.issue}"
        </Text>
      )}

      {!compact && isActionable && (
        <View style={{ flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 10 }}>
          {item.status === 'pending' && (
            <TouchableOpacity
              onPress={(e) => { e.stopPropagation?.(); onConfirm(item.id); }}
              style={{ flex: 1, backgroundColor: '#ECFDF5', borderRadius: 10, paddingVertical: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}
            >
              <Ionicons name="checkmark-circle" size={15} color="#10B981" />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#10B981' }}>Confirm</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation?.(); onComplete(item.id); }}
            style={{ flex: 1, backgroundColor: '#EFF6FF', borderRadius: 10, paddingVertical: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 }}
          >
            <Ionicons name="checkmark-done-circle" size={15} color="#3B82F6" />
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#3B82F6' }}>Complete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation?.(); onCancel(item.id, item.patient_name); }}
            style={{ backgroundColor: '#FEF2F2', borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center' }}
          >
            <Ionicons name="close" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}
