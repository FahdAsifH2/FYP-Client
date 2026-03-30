import { Text, View, ScrollView, TouchableOpacity, Modal, Linking } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../_contexts/HealthContext';
import { useAuth } from '../_contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { T } from '../_theme';

const GAP = 12;
const PAD = 20;

const PREG_KEY = 'gynai_pregnancy_lmp';

// ── Week-by-week development milestones ────────────────────────────────────
const getMilestone = (week) => {
  if (week <= 4)  return "Implantation complete. The embryo is forming its first cells.";
  if (week <= 6)  return "Heart beginning to beat! Neural tube is developing.";
  if (week <= 8)  return "Tiny fingers and toes are forming. Organs are taking shape.";
  if (week <= 10) return "Baby is now a fetus! All vital organs are present.";
  if (week <= 12) return "Baby can open and close fingers. Reflexes are developing.";
  if (week <= 14) return "Facial features are forming. Baby can squint and frown.";
  if (week <= 16) return "Baby can hear your voice for the first time!";
  if (week <= 18) return "Baby is yawning, hiccupping, and rolling around.";
  if (week <= 20) return "You're halfway there! Unique fingerprints are forming.";
  if (week <= 22) return "Baby's lips and eyebrows are now visible.";
  if (week <= 24) return "Baby has a real sleep/wake cycle now. Brain growing fast!";
  if (week <= 26) return "Eyes are beginning to open. Responding to light and sound.";
  if (week <= 28) return "Baby can blink! Brain activity surging. 3rd trimester begins.";
  if (week <= 30) return "Baby is storing fat and building immune system.";
  if (week <= 32) return "Baby is practicing breathing movements with amniotic fluid.";
  if (week <= 34) return "Fingernails reached fingertips. Almost fully developed!";
  if (week <= 36) return "Baby is likely head-down preparing for birth.";
  if (week <= 38) return "Lungs are fully mature. Baby is ready to breathe air!";
  if (week <= 40) return "Full term! Baby could arrive any day now.";
  return "Congratulations — your baby is ready to meet you!";
};

const getBabySize = (week) => {
  if (week <= 4)  return { emoji: '🌱', label: 'Poppy seed', length: '< 1mm', color: '#D1FAE5' };
  if (week <= 6)  return { emoji: '🫐', label: 'Blueberry', length: '~6mm', color: '#EDE9FE' };
  if (week <= 8)  return { emoji: '🍓', label: 'Strawberry', length: '~1.6cm', color: '#FEE2E2' };
  if (week <= 10) return { emoji: '🍊', label: 'Kumquat', length: '~3cm', color: '#FEF3C7' };
  if (week <= 12) return { emoji: '🍋', label: 'Lime', length: '~5cm', color: '#ECFCCB' };
  if (week <= 14) return { emoji: '🍋', label: 'Lemon', length: '~8cm', color: '#FEF9C3' };
  if (week <= 16) return { emoji: '🥑', label: 'Avocado', length: '~11cm', color: '#D1FAE5' };
  if (week <= 18) return { emoji: '🫑', label: 'Bell pepper', length: '~14cm', color: '#DCFCE7' };
  if (week <= 20) return { emoji: '🍌', label: 'Banana', length: '~16cm', color: '#FEF9C3' };
  if (week <= 22) return { emoji: '🥭', label: 'Mango', length: '~27cm', color: '#FEF3C7' };
  if (week <= 24) return { emoji: '🌽', label: 'Corn cob', length: '~30cm', color: '#FEF9C3' };
  if (week <= 26) return { emoji: '🥦', label: 'Broccoli', length: '~35cm', color: '#DCFCE7' };
  if (week <= 28) return { emoji: '🍆', label: 'Eggplant', length: '~38cm', color: '#EDE9FE' };
  if (week <= 30) return { emoji: '🥥', label: 'Coconut', length: '~40cm', color: '#FEF3C7' };
  if (week <= 32) return { emoji: '🎃', label: 'Squash', length: '~43cm', color: '#FEF3C7' };
  if (week <= 34) return { emoji: '🍍', label: 'Pineapple', length: '~45cm', color: '#FEF9C3' };
  if (week <= 36) return { emoji: '🍈', label: 'Papaya', length: '~47cm', color: '#DCFCE7' };
  if (week <= 38) return { emoji: '🥬', label: 'Leek', length: '~49cm', color: '#D1FAE5' };
  return { emoji: '👶', label: 'Full term baby', length: '~50cm', color: '#FCE7F3' };
};

const getTrimester = (week) => {
  if (week <= 13) return { label: '1st Trimester', color: T.pinkDark,  bg: 'rgba(255,255,255,0.95)' };
  if (week <= 27) return { label: '2nd Trimester', color: '#C2410C',   bg: 'rgba(255,255,255,0.95)' };
  return           { label: '3rd Trimester', color: T.sageDark,  bg: 'rgba(255,255,255,0.95)' };
};

// ── Main component ──────────────────────────────────────────────────────────
const PatientsDashBoard = () => {
  const { getWaterProgress, getSleepDisplay, loadHealthData } = useHealth();
  const { logout, user } = useAuth();

  const [weeksPregnant, setWeeksPregnant] = React.useState(null); // null = not set up
  const [showSetup, setShowSetup] = React.useState(false);
  const [draftWeeks, setDraftWeeks] = React.useState(1);            // stepper value in modal

  React.useEffect(() => {
    loadHealthData();
    loadWeeks();
  }, []);

  const loadWeeks = async () => {
    try {
      const stored = await AsyncStorage.getItem(PREG_KEY);
      if (stored) setWeeksPregnant(Number(JSON.parse(stored)));
    } catch { /* no stored value */ }
  };

  const saveWeeks = async (w) => {
    try {
      await AsyncStorage.setItem(PREG_KEY, JSON.stringify(w));
    } catch { /* silent */ }
  };

  // ── Derived stats from weeks pregnant ────────────────────────────────────
  const getStats = () => {
    if (!weeksPregnant) return null;
    const msPerDay = 24 * 60 * 60 * 1000;
    const lmp = new Date(Date.now() - weeksPregnant * 7 * msPerDay);
    const dueDate = new Date(lmp.getTime() + 280 * msPerDay);
    const weeksToGo = Math.max(0, 40 - weeksPregnant);
    const pct = Math.min(100, Math.round((weeksPregnant / 40) * 100));
    return { currentWeek: weeksPregnant, dueDate, weeksToGo, pct };
  };

  const stats = getStats();

  const confirmSetup = async () => {
    setWeeksPregnant(draftWeeks);
    await saveWeeks(draftWeeks);
    setShowSetup(false);
  };

  const clearPregnancy = async () => {
    await AsyncStorage.removeItem(PREG_KEY);
    setWeeksPregnant(null);
    setShowSetup(false);
  };

  const openSetup = () => {
    setDraftWeeks(weeksPregnant || 1);
    setShowSetup(true);
  };

  // ─── Reusable bento tile ─────────────────────────────────────────────────
  const BentoTile = ({ onPress, bg, children, style }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[{
        backgroundColor: bg || 'white',
        borderRadius: 20,
        padding: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 4,
      }, style]}
    >
      {children}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: T.pageBg }}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={{
        paddingTop: 60, paddingBottom: 20, paddingHorizontal: PAD,
        backgroundColor: T.card,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04, shadowRadius: 8, elevation: 4,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.pinkBg, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: T.pinkBorder }}>
              <Ionicons name="flower-outline" size={20} color={T.pink} />
            </View>
            <Text style={{ color: T.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.5 }}>GynAI</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={() => Linking.openURL('tel:1122')}
              style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.emergencyBg, justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name="call" size={20} color={T.emergency} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => { await logout(); router.replace('/'); }}
              style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.surface, justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name="log-out-outline" size={20} color={T.subtle} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{ color: T.muted, fontSize: 13, fontWeight: '500' }}>
          {new Date().toLocaleDateString('en-PK', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
        <Text style={{ color: T.text, fontSize: 22, fontWeight: '800', marginTop: 2, letterSpacing: -0.5 }}>
          {stats
            ? `Hello, ${user?.name?.split(' ')[0] || 'there'} — Week ${stats.currentWeek}`
            : `Hello, ${user?.name?.split(' ')[0] || 'there'} 👋`}
        </Text>
        {stats && (
          <Text style={{ color: T.subtle, fontSize: 13, marginTop: 1 }}>
            {stats.weeksToGo > 0 ? `${stats.weeksToGo} weeks until due date` : 'Full term reached!'}
          </Text>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ═══════════════════════════════════════════════════════════════
            PREGNANCY TRACKER CARD — Original pink style, now interactive
        ═══════════════════════════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: PAD, marginTop: 20 }}>
          <TouchableOpacity
            onPress={openSetup}
            activeOpacity={0.92}
            style={{
              backgroundColor: '#EC4899',
              borderRadius: 24,
              padding: 24,
              shadowColor: '#EC4899',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
              elevation: 10,
              marginBottom: 4,
            }}
          >
            {stats ? (() => {
              const baby = getBabySize(stats.currentWeek);
              const trimester = getTrimester(stats.currentWeek);
              return (
                <>
                  {/* Top row */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Text style={{ color: 'white', fontSize: 32, fontWeight: '900' }}>Week {stats.currentWeek}</Text>
                        <View style={{ backgroundColor: trimester.bg, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 }}>
                          <Text style={{ color: trimester.color, fontSize: 10, fontWeight: '800' }}>{trimester.label}</Text>
                        </View>
                      </View>
                      <Text style={{ color: '#F9A8D4', fontSize: 14 }}>
                        {stats.weeksToGo > 0 ? `${stats.weeksToGo} weeks until due date` : 'Full term reached!'}
                      </Text>
                    </View>

                    {/* Baby size */}
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ width: 68, height: 68, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginBottom: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 }}>
                        <Text style={{ fontSize: 34 }}>{baby.emoji}</Text>
                      </View>
                      <View style={{ backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 2 }}>
                        <Text style={{ color: 'white', fontSize: 11, fontWeight: '700', textAlign: 'center' }}>{baby.label}</Text>
                      </View>
                      <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '500' }}>{baby.length}</Text>
                    </View>
                  </View>

                  {/* Milestone */}
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 12, marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Ionicons name="sparkles" size={13} color="rgba(255,255,255,0.8)" />
                      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 }}>THIS WEEK</Text>
                    </View>
                    <Text style={{ color: 'white', fontSize: 13, lineHeight: 19 }}>{getMilestone(stats.currentWeek)}</Text>
                  </View>

                  {/* Progress bar */}
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, height: 8, marginBottom: 8 }}>
                    <View style={{ width: `${stats.pct}%`, backgroundColor: 'white', height: 8, borderRadius: 10 }} />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#F9A8D4', fontSize: 12, fontWeight: '600' }}>{stats.pct}% complete</Text>
                    <Text style={{ color: '#F9A8D4', fontSize: 12 }}>
                      Due {stats.dueDate.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                </>
              );
            })() : (
              /* Not set up yet */
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 32 }}>🤰</Text>
                </View>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '800', marginBottom: 8 }}>Track Your Pregnancy</Text>
                <Text style={{ color: '#F9A8D4', fontSize: 14, textAlign: 'center', marginBottom: 16, lineHeight: 20 }}>
                  Enter your last period date or due date to get your personalized pregnancy journey.
                </Text>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="add-circle" size={18} color="white" />
                  <Text style={{ color: 'white', fontWeight: '800', fontSize: 14 }}>Set Up Tracker</Text>
                </View>
              </View>
            )}

            {/* Edit hint */}
            {stats && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10, gap: 4 }}>
                <Ionicons name="pencil" size={11} color="rgba(255,255,255,0.4)" />
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>Tap to update dates</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1 — CLINICAL CARE
        ═══════════════════════════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: PAD, marginTop: 22 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: T.sectionLabel, letterSpacing: 1.2, marginBottom: 12 }}>
            CLINICAL CARE
          </Text>

          {/* Row 1: My Doctor + Appointments */}
          <View style={{ flexDirection: 'row', gap: GAP, marginBottom: GAP }}>
            <BentoTile onPress={() => router.push('/PatientScreens/MyDoctor')} bg={T.card} style={{ flex: 1, borderWidth: 1, borderColor: T.border }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: T.pinkBg, justifyContent: 'center', alignItems: 'center', marginBottom: 36 }}>
                <Ionicons name="person-outline" size={22} color={T.pink} />
              </View>
              <Text style={{ color: T.text, fontSize: 16, fontWeight: '800' }}>My Doctor</Text>
              <Text style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Connect with your OB-GYN</Text>
            </BentoTile>

            <BentoTile onPress={() => router.push('/PatientScreens/Appointments')} bg={T.card} style={{ flex: 1, borderWidth: 1, borderColor: T.border }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: T.pinkBg, justifyContent: 'center', alignItems: 'center', marginBottom: 36 }}>
                <Ionicons name="calendar-outline" size={22} color={T.pink} />
              </View>
              <Text style={{ color: T.text, fontSize: 16, fontWeight: '800' }}>Appointments</Text>
              <Text style={{ color: T.muted, fontSize: 12, marginTop: 3 }}>Book & track visits</Text>
            </BentoTile>
          </View>

          {/* Row 2: My Documents — full width */}
          <BentoTile onPress={() => router.push('/PatientScreens/Documents')} bg={T.card} style={{ marginBottom: GAP, borderWidth: 1, borderColor: T.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: T.pinkBg, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="documents-outline" size={20} color={T.pink} />
                  </View>
                  <View>
                    <Text style={{ color: T.text, fontSize: 16, fontWeight: '800' }}>My Documents</Text>
                    <Text style={{ color: T.subtle, fontSize: 12 }}>Upload & share clinical files</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {['Lab Reports', 'Ultrasounds', 'Prescriptions'].map(tag => (
                    <View key={tag} style={{ backgroundColor: T.pinkBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ color: T.pinkDark, fontSize: 10, fontWeight: '700' }}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={T.pinkLight} />
            </View>
          </BentoTile>

          {/* Row 3: Medications + Nearby */}
          <View style={{ flexDirection: 'row', gap: GAP, marginBottom: GAP }}>
            <BentoTile onPress={() => router.push('/PatientScreens/Medications')} bg={T.card} style={{ flex: 3, borderWidth: 1, borderColor: T.border }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: T.pinkBg, justifyContent: 'center', alignItems: 'center', marginBottom: 32 }}>
                <Ionicons name="medical-outline" size={20} color={T.pink} />
              </View>
              <Text style={{ color: T.text, fontSize: 15, fontWeight: '800' }}>Medications</Text>
              <Text style={{ color: T.muted, fontSize: 11, marginTop: 3 }}>Daily prenatal schedule</Text>
            </BentoTile>

            <BentoTile onPress={() => router.push('/PatientScreens/NearbyFacilities')} bg={T.card} style={{ flex: 2, borderWidth: 1, borderColor: T.border }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: T.pinkBg, justifyContent: 'center', alignItems: 'center', marginBottom: 32 }}>
                <Ionicons name="location-outline" size={20} color={T.pink} />
              </View>
              <Text style={{ color: T.text, fontSize: 15, fontWeight: '800' }}>Nearby</Text>
              <Text style={{ color: T.muted, fontSize: 11, marginTop: 3 }}>Hospitals</Text>
            </BentoTile>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — DAILY WELLNESS
        ═══════════════════════════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: PAD, marginTop: 10 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: T.sectionLabel, letterSpacing: 1.2, marginBottom: 12 }}>
            TODAY'S WELLNESS
          </Text>
          <View style={{ flexDirection: 'row', gap: GAP }}>
            <TouchableOpacity
              onPress={() => router.push('/PatientScreens/HealthTracking')}
              style={{ flex: 1, backgroundColor: T.card, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: T.border }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.skyBg, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="water" size={18} color={T.sky} />
              </View>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: T.text }}>{getWaterProgress()}</Text>
                <Text style={{ fontSize: 11, color: T.muted }}>Water glasses</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/PatientScreens/HealthTracking')}
              style={{ flex: 1, backgroundColor: T.card, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: T.border }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.indigoBg, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="moon" size={18} color={T.indigo} />
              </View>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: T.text }}>{getSleepDisplay()}</Text>
                <Text style={{ fontSize: 11, color: T.muted }}>Sleep hours</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — HEALTH TOOLS
        ═══════════════════════════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: PAD, marginTop: 22 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: T.sectionLabel, letterSpacing: 1.2, marginBottom: 12 }}>
            HEALTH TOOLS
          </Text>
          <View style={{ flexDirection: 'row', gap: GAP, marginBottom: GAP }}>
            <BentoTile onPress={() => router.push('/PatientScreens/Form')} style={{ flex: 1, borderWidth: 1, borderColor: T.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.pinkBg, justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="clipboard-outline" size={18} color={T.pink} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: T.text }}>Health Form</Text>
                  <Text style={{ fontSize: 11, color: T.muted }}>Assessment check-up</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={T.pinkBorder} />
              </View>
            </BentoTile>
            <BentoTile onPress={() => router.push('/PatientScreens/BMITracker')} style={{ flex: 1, borderWidth: 1, borderColor: T.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.amberBg, justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="analytics-outline" size={18} color={T.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: T.text }}>BMI Tracker</Text>
                  <Text style={{ fontSize: 11, color: T.muted }}>Weight monitoring</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={T.pinkBorder} />
              </View>
            </BentoTile>
          </View>
          <BentoTile onPress={() => router.push('/PatientScreens/SymptomTracker')} style={{ marginBottom: GAP, borderWidth: 1, borderColor: T.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.pinkBg, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="heart-outline" size={18} color={T.pink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: T.text }}>Symptom Tracker</Text>
                <Text style={{ fontSize: 11, color: T.muted }}>Log how you're feeling today</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={T.pinkBorder} />
            </View>
          </BentoTile>
        </View>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — TIPS
        ═══════════════════════════════════════════════════════════════ */}
        <View style={{ marginTop: 10 }}>
          <View style={{ paddingHorizontal: PAD, marginBottom: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: T.sectionLabel, letterSpacing: 1.2 }}>TODAY'S TIPS</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: PAD, gap: 12 }}>
            {[
              { icon: 'nutrition-outline', title: 'Nutrition', tip: 'Eat iron-rich foods like spinach and lean meats to prevent anemia.', tag: 'Nutrition' },
              { icon: 'fitness-outline', title: 'Movement', tip: 'Try prenatal yoga for 15 minutes to reduce back pain and stress.', tag: 'Exercise' },
              { icon: 'moon-outline', title: 'Rest', tip: 'Sleep on your left side to improve blood flow to your baby.', tag: 'Wellness' },
            ].map(item => (
              <View key={item.title} style={{ width: 240, backgroundColor: T.card, borderRadius: 18, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: T.border }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: T.pinkBg, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                  <Ionicons name={item.icon} size={18} color={T.pink} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: T.text, marginBottom: 6 }}>{item.title} Tip</Text>
                <Text style={{ fontSize: 12, color: T.subtle, lineHeight: 18, marginBottom: 10 }}>{item.tip}</Text>
                <View style={{ backgroundColor: T.pinkBg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: T.pinkDark }}>{item.tag}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — EMERGENCY
        ═══════════════════════════════════════════════════════════════ */}
        <View style={{ paddingHorizontal: PAD, marginTop: 22, marginBottom: 4 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: T.sectionLabel, letterSpacing: 1.2, marginBottom: 12 }}>EMERGENCY</Text>
          <TouchableOpacity
            onPress={() => router.push('/PatientScreens/Emergency')}
            style={{ backgroundColor: T.emergencyBg, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: T.emergencyBorder }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: T.emergency, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Ionicons name="call" size={20} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: T.emergencyBorder }}>Emergency Contacts</Text>
              <Text style={{ fontSize: 11, color: T.emergency }}>Rescue 1122 · Edhi 115 · Chhipa 1021</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={T.emergencyBorder} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ═══════════════════════════════════════════════════════════════
          PREGNANCY SETUP MODAL — Week stepper (no date picker needed)
      ═══════════════════════════════════════════════════════════════ */}
      <Modal visible={showSetup} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44 }}>

            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: T.text }}>How far along are you?</Text>
              <TouchableOpacity onPress={() => setShowSetup(false)}>
                <Ionicons name="close" size={26} color={T.subtle} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 13, color: T.muted, marginBottom: 28 }}>
              Use the buttons to set your current week of pregnancy.
            </Text>

            {/* Big week display + stepper */}
            <View style={{ alignItems: 'center', marginBottom: 28 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: T.muted, letterSpacing: 1, marginBottom: 16 }}>WEEKS PREGNANT</Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
                {/* Decrease */}
                <TouchableOpacity
                  onPress={() => setDraftWeeks(w => Math.max(1, w - 1))}
                  style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: T.surface, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Ionicons name="remove" size={28} color={T.subtle} />
                </TouchableOpacity>

                {/* Week number */}
                <View style={{ width: 100, height: 100, borderRadius: 24, backgroundColor: T.pink, justifyContent: 'center', alignItems: 'center',
                  shadowColor: T.pinkShadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 }}>
                  <Text style={{ fontSize: 48, fontWeight: '900', color: 'white', lineHeight: 52 }}>{draftWeeks}</Text>
                </View>

                {/* Increase */}
                <TouchableOpacity
                  onPress={() => setDraftWeeks(w => Math.min(42, w + 1))}
                  style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: T.pink, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Ionicons name="add" size={28} color="white" />
                </TouchableOpacity>
              </View>

              {/* Fast-jump buttons */}
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {[4, 8, 12, 16, 20, 24, 28, 32, 36, 40].map(w => (
                  <TouchableOpacity
                    key={w}
                    onPress={() => setDraftWeeks(w)}
                    style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10,
                      backgroundColor: draftWeeks === w ? T.pink : T.surface }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: draftWeeks === w ? 'white' : T.subtle }}>W{w}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Live preview */}
            {(() => {
              const msPerDay = 24 * 60 * 60 * 1000;
              const lmp = new Date(Date.now() - draftWeeks * 7 * msPerDay);
              const due = new Date(lmp.getTime() + 280 * msPerDay);
              const toGo = Math.max(0, 40 - draftWeeks);
              const baby = getBabySize(draftWeeks);
              return (
                <View style={{ backgroundColor: T.pinkBg, borderRadius: 18, padding: 16, marginBottom: 20 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 22, fontWeight: '900', color: T.pink }}>{draftWeeks}</Text>
                      <Text style={{ fontSize: 11, color: T.muted }}>Weeks along</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: T.pinkLight }} />
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 22, fontWeight: '900', color: T.pink }}>{toGo}</Text>
                      <Text style={{ fontSize: 11, color: T.muted }}>Weeks to go</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: T.pinkLight }} />
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: T.pink }}>
                        {due.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                      </Text>
                      <Text style={{ fontSize: 11, color: T.muted }}>Est. due date</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: T.pinkLight }} />
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 22 }}>{baby.emoji}</Text>
                      <Text style={{ fontSize: 11, color: T.muted }}>{baby.label}</Text>
                    </View>
                  </View>
                </View>
              );
            })()}

            <TouchableOpacity
              onPress={confirmSetup}
              style={{ backgroundColor: T.pink, borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 12,
                shadowColor: T.pinkShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
            >
              <Text style={{ color: 'white', fontWeight: '800', fontSize: 16 }}>Save — I'm {draftWeeks} weeks pregnant</Text>
            </TouchableOpacity>

            {weeksPregnant && (
              <TouchableOpacity onPress={clearPregnancy} style={{ alignItems: 'center', padding: 8 }}>
                <Text style={{ color: T.divider, fontSize: 13 }}>Clear tracker</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PatientsDashBoard;
