import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Platform, StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { config } from '../_config/config';

const ML_URL = config.ML_API_URL || 'http://13.60.14.31:5000';

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

export default function PredictDelivery() {
  const [form, setForm] = useState(INITIAL);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm(prev => {
    const next = { ...prev, [key]: val };
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
        Alert.alert('Missing Field', 'Please fill in all required fields.');
        return false;
      }
    }
    if (!form.ethnicity) { Alert.alert('Missing Field', 'Please select an ethnicity.'); return false; }
    const age = parseFloat(form.age);
    const weeks = parseFloat(form.gestationDays) / 7;
    if (isNaN(age) || age < 12 || age > 60) { Alert.alert('Invalid Input', 'Age must be between 12 and 60.'); return false; }
    if (isNaN(weeks) || weeks < 20 || weeks > 45) { Alert.alert('Invalid Input', 'Gestation should correspond to 20–45 weeks (140–315 days).'); return false; }
    if (parseFloat(form.parity) > parseFloat(form.gravida)) { Alert.alert('Invalid Input', 'Parity cannot exceed Gravida.'); return false; }
    return true;
  };

  const handlePredict = async () => {
    if (!validate()) return;
    setLoading(true);
    setResult(null);
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
      if (err.response) msg = err.response.data?.error || err.response.data?.message || `Server error (${err.response.status})`;
      else if (err.code === 'ECONNABORTED') msg = 'Request timed out. The server may be busy.';
      else if (err.request) msg = 'Network error. Check your internet connection.';
      Alert.alert('Prediction Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const isNormal = result?.prediction === 0;
  const normalPct = result ? Math.round((result.prediction_probability?.normal_delivery || 0) * 100) : 0;
  const csPct = result ? Math.round((result.prediction_probability?.c_section || 0) * 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f7fa' }}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#5b21b6', '#7c3aed', '#8b5cf6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: Platform.OS === 'ios' ? 58 : 42,
          paddingBottom: 28,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        {/* Nav row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Delivery Prediction</Text>
          <TouchableOpacity
            onPress={() => { setForm(INITIAL); setResult(null); }}
            style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="refresh-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Hero tagline */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 52, height: 52, borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.25)',
            alignItems: 'center', justifyContent: 'center', marginRight: 14,
          }}>
            <Ionicons name="analytics" size={26} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.3 }}>
              Birth Outcome Predictor
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>
              ML model trained on clinical delivery data
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 18, paddingBottom: 48 }}
      >
        {/* ── Result (shown at top when available) ──────────────────────── */}
        {result && <ResultCard isNormal={isNormal} result={result} normalPct={normalPct} csPct={csPct} form={form} />}

        {/* ── Section label ──────────────────────────────────────────────── */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 1.1, marginBottom: 12, marginTop: result ? 20 : 4 }}>
          PATIENT DETAILS
        </Text>

        {/* ── Biometrics ────────────────────────────────────────────────── */}
        <Section title="Biometrics" icon="body-outline" color="#ec4899" bg="#fdf2f8">
          <Row>
            <Field label="Age (yrs)" value={form.age} onChange={v => set('age', v)} placeholder="28" half />
            <Field label="Height (cm)" value={form.height} onChange={v => set('height', v)} placeholder="162" half />
          </Row>
          <Row>
            <Field label="Weight (kg)" value={form.weight} onChange={v => set('weight', v)} placeholder="65" half />
            <Field label="BMI" value={form.bmi} onChange={v => set('bmi', v)} placeholder="auto" half hint="Auto-calculated" />
          </Row>
        </Section>

        {/* ── Obstetric History ─────────────────────────────────────────── */}
        <Section title="Obstetric History" icon="heart-outline" color="#8b5cf6" bg="#f5f3ff">
          <Row>
            <Field label="Gravida" value={form.gravida} onChange={v => set('gravida', v)} placeholder="Total pregnancies" half />
            <Field label="Parity" value={form.parity} onChange={v => set('parity', v)} placeholder="Live births" half />
          </Row>
          <Field label="Previous C-sections" value={form.previousCs} onChange={v => set('previousCs', v)} placeholder="0 if none" />
        </Section>

        {/* ── Current Pregnancy ─────────────────────────────────────────── */}
        <Section title="Current Pregnancy" icon="time-outline" color="#3b82f6" bg="#eff6ff">
          <Field
            label="Gestation at delivery (days)"
            value={form.gestationDays}
            onChange={v => set('gestationDays', v)}
            placeholder="266 ≈ 38 weeks"
            hint="Total gestational age in days at delivery"
          />
          <Field
            label="Gestation at booking (weeks)"
            value={form.gestationBookingWeeks}
            onChange={v => set('gestationBookingWeeks', v)}
            placeholder="e.g. 12.5"
            hint="Age in weeks at first antenatal visit"
          />
        </Section>

        {/* ── Medical Flags ─────────────────────────────────────────────── */}
        <Section title="Medical Flags" icon="medkit-outline" color="#8b5cf6" bg="#f5f3ff">
          <Toggle
            label="Obesity"
            description="BMI ≥ 30 at booking"
            value={form.obese}
            onToggle={() => set('obese', !form.obese)}
            color="#8b5cf6"
          />
          <View style={{ height: 1, backgroundColor: '#f3f4f6', marginVertical: 12 }} />
          <Toggle
            label="Gestational Diabetes"
            description="Diagnosed with GDM this pregnancy"
            value={form.gestationalDiabetes}
            onToggle={() => set('gestationalDiabetes', !form.gestationalDiabetes)}
            color="#8b5cf6"
          />
        </Section>

        {/* ── Ethnicity ─────────────────────────────────────────────────── */}
        <Section title="Ethnicity" icon="globe-outline" color="#8b5cf6" bg="#f5f3ff">
          {ETHNICITIES.map(e => (
            <TouchableOpacity
              key={e.key}
              onPress={() => set('ethnicity', e.key)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 }}
            >
              <View style={{
                width: 20, height: 20, borderRadius: 10, borderWidth: 2,
                borderColor: form.ethnicity === e.key ? '#8b5cf6' : '#d1d5db',
                backgroundColor: form.ethnicity === e.key ? '#8b5cf6' : '#fff',
                justifyContent: 'center', alignItems: 'center',
              }}>
                {form.ethnicity === e.key && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />}
              </View>
              <Text style={{ fontSize: 14, color: form.ethnicity === e.key ? '#5b21b6' : '#374151', fontWeight: form.ethnicity === e.key ? '600' : '400' }}>
                {e.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Section>

        {/* ── Predict button ────────────────────────────────────────────── */}
        <TouchableOpacity
          onPress={handlePredict}
          disabled={loading}
          activeOpacity={0.85}
          style={{ marginTop: 4, borderRadius: 18, overflow: 'hidden', opacity: loading ? 0.8 : 1 }}
        >
          <LinearGradient
            colors={['#7c3aed', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingVertical: 17,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}
          >
            {loading
              ? <><ActivityIndicator color="#fff" size="small" /><Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Analysing…</Text></>
              : <><Ionicons name="analytics" size={20} color="#fff" /><Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Run Prediction</Text></>
            }
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

// ─── Result card ─────────────────────────────────────────────────────────────
function ResultCard({ isNormal, result, normalPct, csPct, form }) {
  const accentColor = isNormal ? '#7c3aed' : '#ef4444';
  const accentBg    = isNormal ? '#f5f3ff' : '#fef2f2';
  const accentBg2   = isNormal ? '#ede9fe' : '#fee2e2';

  // Collect active risk flags for display
  const risks = [];
  if (form.obese) risks.push('Obesity');
  if (form.gestationalDiabetes) risks.push('Gestational Diabetes');
  if (parseInt(form.previousCs) > 0) risks.push(`${form.previousCs} Previous C-section(s)`);
  if (parseFloat(form.bmi) >= 35) risks.push('Severe obesity (BMI ≥ 35)');

  return (
    <View style={{
      backgroundColor: '#fff', borderRadius: 24,
      overflow: 'hidden',
      shadowColor: accentColor,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
      borderWidth: 1,
      borderColor: accentBg2,
    }}>
      {/* Outcome header */}
      <View style={{ backgroundColor: accentBg, paddingVertical: 28, paddingHorizontal: 24, alignItems: 'center' }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: accentBg2,
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}>
          <Ionicons
            name={isNormal ? 'checkmark-circle' : 'alert-circle'}
            size={46}
            color={accentColor}
          />
        </View>
        <Text style={{ fontSize: 12, fontWeight: '700', color: accentColor, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>
          Predicted Outcome
        </Text>
        <Text style={{ fontSize: 26, fontWeight: '900', color: '#111827', textAlign: 'center', letterSpacing: -0.5 }}>
          {result.delivery_mode}
        </Text>
      </View>

      <View style={{ padding: 22 }}>
        {/* Probability split bar */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
          Probability Split
        </Text>

        {/* Visual split bar */}
        <View style={{ height: 12, borderRadius: 6, flexDirection: 'row', overflow: 'hidden', marginBottom: 10 }}>
          <View style={{ flex: normalPct, backgroundColor: '#7c3aed' }} />
          <View style={{ flex: csPct, backgroundColor: '#ef4444' }} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#7c3aed' }} />
            <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600' }}>Normal Delivery</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#7c3aed', marginLeft: 4 }}>{normalPct}%</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#ef4444' }} />
            <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600' }}>C-Section</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#ef4444', marginLeft: 4 }}>{csPct}%</Text>
          </View>
        </View>

        {/* Risk factors present */}
        {risks.length > 0 && (
          <>
            <View style={{ height: 1, backgroundColor: '#f3f4f6', marginBottom: 16 }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
              Risk Factors Detected
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {risks.map((r, i) => (
                <View key={i} style={{ backgroundColor: '#ede9fe', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#5b21b6' }}>{r}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Disclaimer */}
        <View style={{ backgroundColor: '#f9fafb', borderRadius: 14, padding: 14, marginTop: 18, flexDirection: 'row', gap: 10 }}>
          <Ionicons name="information-circle-outline" size={18} color="#6b7280" style={{ marginTop: 1 }} />
          <Text style={{ color: '#6b7280', fontSize: 12, flex: 1, lineHeight: 18 }}>
            This is a decision-support tool. Clinical judgement must always take precedence over model output.
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const Section = ({ title, icon, color, bg, children }) => (
  <View style={{
    backgroundColor: '#fff', borderRadius: 18, padding: 18, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 3,
    borderWidth: 1, borderColor: '#f3f4f6',
  }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <View style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name={icon} size={15} color={color} />
      </View>
      <Text style={{ fontSize: 13, fontWeight: '800', color: '#111827', letterSpacing: -0.1 }}>{title}</Text>
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
      placeholderTextColor="#9ca3af"
      keyboardType="numeric"
      style={{
        backgroundColor: '#f9fafb', borderWidth: 1.5, borderColor: '#e5e7eb',
        borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
        fontSize: 14, color: '#111827',
      }}
    />
    {hint && <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>{hint}</Text>}
  </View>
);

const Toggle = ({ label, description, value, onToggle, color }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <View style={{ flex: 1, paddingRight: 12 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>{label}</Text>
      <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{description}</Text>
    </View>
    <TouchableOpacity
      onPress={onToggle}
      style={{
        width: 48, height: 26, borderRadius: 13,
        backgroundColor: value ? color : '#d1d5db',
        justifyContent: 'center', paddingHorizontal: 2,
      }}
    >
      <View style={{
        width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
        alignSelf: value ? 'flex-end' : 'flex-start',
      }} />
    </TouchableOpacity>
  </View>
);
