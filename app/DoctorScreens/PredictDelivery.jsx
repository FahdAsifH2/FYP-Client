import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { config } from '../_config/config';

const ML_URL = config.ML_API_URL || 'http://13.60.14.31:5000';

// ── Ethnicity options ──────────────────────────────────────────────────────
const ETHNICITIES = [
  { key: 'Ethnicity_WEU', label: 'Western European' },
  { key: 'Ethnicity_GBR', label: 'British' },
  { key: 'Ethnicity_NAF', label: 'North African' },
  { key: 'Ethnicity_MEA', label: 'Middle Eastern' },
  { key: 'Ethnicity_OTH', label: 'Other' },
];

const INITIAL = {
  age: '', weight: '', height: '', bmi: '',
  gravida: '', parity: '', previousCs: '',
  gestationDays: '', gestationBookingWeeks: '',
  obese: false, gestationalDiabetes: false,
  ethnicity: '',
};

const PredictDelivery = () => {
  const [form, setForm] = useState(INITIAL);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(prev => {
    const next = { ...prev, [key]: val };
    // Auto-calculate BMI when weight or height changes
    if (key === 'weight' || key === 'height') {
      const w = parseFloat(key === 'weight' ? val : next.weight);
      const h = parseFloat(key === 'height' ? val : next.height);
      if (!isNaN(w) && !isNaN(h) && h > 0) {
        next.bmi = (w / Math.pow(h / 100, 2)).toFixed(1);
      }
    }
    return next;
  });

  const validate = () => {
    const required = ['age', 'weight', 'height', 'bmi', 'gravida', 'parity', 'previousCs', 'gestationDays', 'gestationBookingWeeks'];
    for (const k of required) {
      if (!form[k] && form[k] !== 0) {
        Alert.alert('Missing Field', `Please fill in all required fields.`);
        return false;
      }
    }
    if (!form.ethnicity) {
      Alert.alert('Missing Field', 'Please select an ethnicity.');
      return false;
    }
    const age = parseFloat(form.age);
    const weeks = parseFloat(form.gestationDays) / 7;
    if (isNaN(age) || age < 12 || age > 60) {
      Alert.alert('Invalid Input', 'Age must be between 12 and 60.');
      return false;
    }
    if (isNaN(weeks) || weeks < 20 || weeks > 45) {
      Alert.alert('Invalid Input', 'Gestation (Days) should correspond to 20–45 weeks (140–315 days).');
      return false;
    }
    if (parseFloat(form.parity) > parseFloat(form.gravida)) {
      Alert.alert('Invalid Input', 'Parity cannot exceed Gravida.');
      return false;
    }
    return true;
  };

  const handlePredict = async () => {
    if (!validate()) return;
    setLoading(true);
    setResult(null);

    // Build ethnicity flags
    const ethnicityFlags = {};
    ETHNICITIES.forEach(e => { ethnicityFlags[e.key] = e.key === form.ethnicity ? 1 : 0; });

    const payload = {
      '    AgeAtStartOfSpell': parseFloat(form.age),
      'Body Mass Index at Booking': parseFloat(form.bmi),
      'WeightMeasured': parseFloat(form.weight),
      'Height': parseFloat(form.height),
      'Parity': parseFloat(form.parity),
      'Gravida': parseFloat(form.gravida),
      'No_Of_previous_Csections': parseFloat(form.previousCs),
      'Gestation (Days)': parseFloat(form.gestationDays),
      'Gestation at booking (Weeks)': parseFloat(form.gestationBookingWeeks),
      'Obese_Encoded': form.obese ? 1 : 0,
      'GestationalDiabetes_Encoded': form.gestationalDiabetes ? 1 : 0,
      ...ethnicityFlags,
    };

    try {
      const response = await axios.post(`${ML_URL}/predict`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000,
      });
      setResult(response.data);
    } catch (err) {
      let msg = 'Unable to reach prediction server. Please try again.';
      if (err.response) {
        msg = err.response.data?.error || err.response.data?.message || `Server error (${err.response.status})`;
      } else if (err.code === 'ECONNABORTED') {
        msg = 'Request timed out. The server may be busy.';
      } else if (err.request) {
        msg = 'Network error. Check your internet connection.';
      }
      Alert.alert('Prediction Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const isNormalDelivery = result?.prediction === 0;
  const normalPct = result ? Math.round((result.prediction_probability?.normal_delivery || 0) * 100) : 0;
  const csPct = result ? Math.round((result.prediction_probability?.c_section || 0) * 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{
        paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20,
        backgroundColor: 'white', shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05,
        shadowRadius: 8, elevation: 4,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', letterSpacing: -0.3 }}>
            Delivery Prediction
          </Text>
          <TouchableOpacity
            onPress={() => { setForm(INITIAL); setResult(null); }}
            style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }}
          >
            <Ionicons name="refresh-outline" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

        {/* Intro banner */}
        <View style={{ backgroundColor: '#F5F3FF', borderRadius: 16, padding: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="analytics" size={22} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#5B21B6', fontSize: 14, fontWeight: '700' }}>AI-Powered Prediction</Text>
            <Text style={{ color: '#7C3AED', fontSize: 12, marginTop: 2 }}>
              Powered by AWS ML model — fill all fields for accurate results
            </Text>
          </View>
        </View>

        {/* ── SECTION 1: Patient Biometrics ─────────────────────────────── */}
        <SectionCard title="Patient Biometrics" icon="body-outline" color="#EC4899">
          <Row>
            <Field label="Age (years)" value={form.age} onChange={v => set('age', v)} placeholder="e.g. 28" half />
            <Field label="Height (cm)" value={form.height} onChange={v => set('height', v)} placeholder="e.g. 162" half />
          </Row>
          <Row>
            <Field label="Weight (kg)" value={form.weight} onChange={v => set('weight', v)} placeholder="e.g. 65" half />
            <Field
              label="BMI (auto-calc)"
              value={form.bmi}
              onChange={v => set('bmi', v)}
              placeholder="auto"
              half
              hint="Calculated from height & weight"
            />
          </Row>
        </SectionCard>

        {/* ── SECTION 2: Obstetric History ──────────────────────────────── */}
        <SectionCard title="Obstetric History" icon="heart-outline" color="#8B5CF6">
          <Row>
            <Field label="Gravida" value={form.gravida} onChange={v => set('gravida', v)} placeholder="Total pregnancies" half />
            <Field label="Parity" value={form.parity} onChange={v => set('parity', v)} placeholder="Live births" half />
          </Row>
          <Field label="Previous C-sections" value={form.previousCs} onChange={v => set('previousCs', v)} placeholder="0 if none" />
        </SectionCard>

        {/* ── SECTION 3: Current Pregnancy ──────────────────────────────── */}
        <SectionCard title="Current Pregnancy" icon="time-outline" color="#3B82F6">
          <Field
            label="Gestation — days at delivery"
            value={form.gestationDays}
            onChange={v => set('gestationDays', v)}
            placeholder="e.g. 266 (≈ 38 weeks)"
            hint="Total gestational age in days at time of delivery"
          />
          <Field
            label="Gestation at booking (weeks)"
            value={form.gestationBookingWeeks}
            onChange={v => set('gestationBookingWeeks', v)}
            placeholder="e.g. 12.5"
            hint="Gestational age in weeks when first antenatal visit occurred"
          />
        </SectionCard>

        {/* ── SECTION 4: Medical Flags ───────────────────────────────────── */}
        <SectionCard title="Medical Flags" icon="medkit-outline" color="#F59E0B">
          <Toggle
            label="Obesity"
            description="Patient classified as obese (BMI ≥ 30)"
            value={form.obese}
            onToggle={() => set('obese', !form.obese)}
          />
          <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 }} />
          <Toggle
            label="Gestational Diabetes"
            description="Diagnosed with gestational diabetes mellitus"
            value={form.gestationalDiabetes}
            onToggle={() => set('gestationalDiabetes', !form.gestationalDiabetes)}
          />
        </SectionCard>

        {/* ── SECTION 5: Ethnicity ──────────────────────────────────────── */}
        <SectionCard title="Ethnicity" icon="globe-outline" color="#10B981">
          {ETHNICITIES.map(e => (
            <TouchableOpacity
              key={e.key}
              onPress={() => set('ethnicity', e.key)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 12,
                paddingVertical: 10, paddingHorizontal: 4,
              }}
            >
              <View style={{
                width: 20, height: 20, borderRadius: 10,
                borderWidth: 2,
                borderColor: form.ethnicity === e.key ? '#8B5CF6' : '#D1D5DB',
                backgroundColor: form.ethnicity === e.key ? '#8B5CF6' : 'white',
                justifyContent: 'center', alignItems: 'center',
              }}>
                {form.ethnicity === e.key && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'white' }} />
                )}
              </View>
              <Text style={{ color: form.ethnicity === e.key ? '#5B21B6' : '#374151', fontSize: 14, fontWeight: form.ethnicity === e.key ? '600' : '400' }}>
                {e.label}
              </Text>
            </TouchableOpacity>
          ))}
        </SectionCard>

        {/* ── Predict Button ─────────────────────────────────────────────── */}
        <TouchableOpacity
          onPress={handlePredict}
          disabled={loading}
          style={{
            backgroundColor: '#8B5CF6', borderRadius: 16, paddingVertical: 16,
            flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
            marginBottom: 24,
            shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
            opacity: loading ? 0.75 : 1,
          }}
        >
          {loading ? (
            <>
              <ActivityIndicator color="white" size="small" />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Analyzing…</Text>
            </>
          ) : (
            <>
              <Ionicons name="analytics" size={20} color="white" />
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Predict Delivery Mode</Text>
            </>
          )}
        </TouchableOpacity>

        {/* ── Results ────────────────────────────────────────────────────── */}
        {result && (
          <View style={{
            backgroundColor: 'white', borderRadius: 20, padding: 20,
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08, shadowRadius: 12, elevation: 6,
          }}>
            {/* Headline */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: isNormalDelivery ? '#D1FAE5' : '#FEE2E2',
                justifyContent: 'center', alignItems: 'center', marginBottom: 12,
              }}>
                <Ionicons
                  name={isNormalDelivery ? 'checkmark-circle' : 'alert-circle'}
                  size={40}
                  color={isNormalDelivery ? '#10B981' : '#EF4444'}
                />
              </View>
              <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
                Prediction Result
              </Text>
              <Text style={{ fontSize: 24, fontWeight: '900', color: '#111827', textAlign: 'center', letterSpacing: -0.5 }}>
                {result.delivery_mode}
              </Text>
            </View>

            {/* Probability bars */}
            <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 12 }}>
              Prediction Probabilities
            </Text>

            {/* Normal Delivery bar */}
            <View style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' }} />
                  <Text style={{ color: '#374151', fontSize: 13, fontWeight: '600' }}>Normal Delivery</Text>
                </View>
                <Text style={{ color: '#10B981', fontSize: 14, fontWeight: '800' }}>{normalPct}%</Text>
              </View>
              <View style={{ height: 10, backgroundColor: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                <View style={{ width: `${normalPct}%`, height: '100%', backgroundColor: '#10B981', borderRadius: 6 }} />
              </View>
            </View>

            {/* C-Section bar */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444' }} />
                  <Text style={{ color: '#374151', fontSize: 13, fontWeight: '600' }}>Cesarean Section</Text>
                </View>
                <Text style={{ color: '#EF4444', fontSize: 14, fontWeight: '800' }}>{csPct}%</Text>
              </View>
              <View style={{ height: 10, backgroundColor: '#E5E7EB', borderRadius: 6, overflow: 'hidden' }}>
                <View style={{ width: `${csPct}%`, height: '100%', backgroundColor: '#EF4444', borderRadius: 6 }} />
              </View>
            </View>

            {/* Disclaimer */}
            <View style={{ backgroundColor: '#FEF9C3', borderRadius: 12, padding: 12, flexDirection: 'row', gap: 8 }}>
              <Ionicons name="information-circle-outline" size={18} color="#D97706" style={{ marginTop: 1 }} />
              <Text style={{ color: '#92400E', fontSize: 12, flex: 1, lineHeight: 18 }}>
                This AI prediction is a decision-support tool only. Clinical judgement must always take precedence. Consult the full obstetric history before finalising the birth plan.
              </Text>
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────
const SectionCard = ({ title, icon, color, children }) => (
  <View style={{
    backgroundColor: 'white', borderRadius: 18, padding: 18, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: color + '20', justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name={icon} size={17} color={color} />
      </View>
      <Text style={{ fontSize: 14, fontWeight: '800', color: '#111827', letterSpacing: -0.2 }}>{title}</Text>
    </View>
    {children}
  </View>
);

const Row = ({ children }) => (
  <View style={{ flexDirection: 'row', gap: 10 }}>{children}</View>
);

const Field = ({ label, value, onChange, placeholder, half = false, hint }) => (
  <View style={{ flex: half ? 1 : undefined, marginBottom: 12 }}>
    <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 5 }}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType="numeric"
      style={{
        backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB',
        borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
        fontSize: 14, color: '#111827',
      }}
    />
    {hint && <Text style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3 }}>{hint}</Text>}
  </View>
);

const Toggle = ({ label, description, value, onToggle }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <View style={{ flex: 1, paddingRight: 12 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>{label}</Text>
      <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{description}</Text>
    </View>
    <TouchableOpacity
      onPress={onToggle}
      style={{
        width: 48, height: 26, borderRadius: 13,
        backgroundColor: value ? '#8B5CF6' : '#D1D5DB',
        justifyContent: 'center', paddingHorizontal: 2,
      }}
    >
      <View style={{
        width: 22, height: 22, borderRadius: 11, backgroundColor: 'white',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
        alignSelf: value ? 'flex-end' : 'flex-start',
      }} />
    </TouchableOpacity>
  </View>
);

export default PredictDelivery;
