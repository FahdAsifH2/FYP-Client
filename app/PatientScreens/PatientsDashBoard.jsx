import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2 - 8; // 48 for padding, 8 for gap

const PatientsDashBoard = () => {
  const router = useRouter();
  const { getWaterProgress, getSleepDisplay, loadHealthData, waterCount, sleepHours } = useHealth();

  // Refresh data when component mounts
  React.useEffect(() => {
    loadHealthData();
    console.log('Dashboard loaded - Water:', waterCount, 'Sleep:', sleepHours);
  }, []);

  // Calculate current pregnancy week based on current date
  const getCurrentWeek = () => {
    // For demo purposes, using a base date calculation
    // In a real app, this would be based on last menstrual period (LMP) or due date
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((today - startOfYear) / (24 * 60 * 60 * 1000) + startOfYear.getDay() + 1) / 7);
    
    // Calculate pregnancy week (typically 1-40 weeks)
    const pregnancyWeek = ((weekNumber % 40) || 1) + 20; // Starting from week 20 for demo
    return Math.min(pregnancyWeek, 40);
  };

  const getWeeksToGo = (currentWeek) => {
    return Math.max(40 - currentWeek, 0);
  };

  const getProgressPercentage = (currentWeek) => {
    return Math.round((currentWeek / 40) * 100);
  };

  const currentWeek = getCurrentWeek();
  const weeksToGo = getWeeksToGo(currentWeek);
  const progressPercentage = getProgressPercentage(currentWeek);

  const FeatureCard = ({ title, description, onPress, icon, colors, size = "large" }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.featureCard,
        { width: size === "large" ? cardWidth * 2 + 16 : cardWidth }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors[0] }]}>
        <Ionicons name={icon} size={size === "large" ? 28 : 24} color="white" />
      </View>
      <Text style={[styles.cardTitle, { fontSize: size === "large" ? 18 : 16 }]}>
        {title}
      </Text>
      <Text style={[styles.cardDescription, { fontSize: size === "large" ? 14 : 12 }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ title, subtitle, onPress, icon, color }) => (
    <TouchableOpacity onPress={onPress} style={styles.quickActionCard}>
      <View style={[styles.quickIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <View style={styles.quickTextContainer}>
        <Text style={styles.quickTitle}>{title}</Text>
        <Text style={styles.quickSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const InsightCard = ({ title, value, change, icon, color, onPress }) => (
    <TouchableOpacity style={styles.insightCard} onPress={onPress}>
      <View style={styles.insightHeader}>
        <View style={[styles.insightIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={16} color="white" />
        </View>
        <Text style={styles.changeText}>{change}</Text>
      </View>
      <Text style={styles.insightValue}>{value}</Text>
      <Text style={styles.insightTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#374151" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Welcome Back!</Text>
        <Text style={styles.headerSubtitle}>Your pregnancy journey, day by day</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Pregnancy Progress Card */}
        <View style={styles.section}>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.weekText}>Week {currentWeek}</Text>
                <Text style={styles.weeksToGoText}>{weeksToGo} weeks to go</Text>
              </View>
              <View style={styles.heartContainer}>
                <Ionicons name="heart" size={24} color="white" />
              </View>
            </View>
            <Text style={styles.progressDescription}>
              Your baby is now the size of a corn. Amazing progress! 🌽
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressPercent}>{progressPercentage}% Complete</Text>
          </View>
        </View>

        {/* Quick Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Health Today</Text>
          <View style={styles.insightsContainer}>
            <InsightCard
              title="Water Intake"
              value={getWaterProgress()}
              change="glasses"
              icon="water-outline"
              color="#3B82F6"
              onPress={() => router.push("/PatientScreens/HealthTracking")}
            />
            <InsightCard
              title="Sleep Hours"
              value={getSleepDisplay()}
              change={getSleepDisplay() === "0h" ? "not tracked" : "last night"}
              icon="moon-outline"
              color="#8B5CF6"
              onPress={() => router.push("/PatientScreens/HealthTracking")}
            />
          </View>
        </View>

        {/* Daily Health Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Health Tips</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScrollView}>
            <View style={styles.tipCard}>
              <Ionicons name="nutrition-outline" size={24} color="#EC4899" style={styles.tipIcon} />
              <Text style={styles.tipTitle}>Nutrition Tip</Text>
              <Text style={styles.tipDescription}>Eat iron-rich foods like spinach and lean meats to prevent anemia.</Text>
              <Text style={styles.tipCategory}>Nutrition</Text>
            </View>
            <View style={styles.tipCard}>
              <Ionicons name="fitness-outline" size={24} color="#10B981" style={styles.tipIcon} />
              <Text style={styles.tipTitle}>Exercise Tip</Text>
              <Text style={styles.tipDescription}>Try prenatal yoga for 15 minutes to reduce back pain and stress.</Text>
              <Text style={styles.tipCategory}>Exercise</Text>
            </View>
            <View style={styles.tipCard}>
              <Ionicons name="moon-outline" size={24} color="#8B5CF6" style={styles.tipIcon} />
              <Text style={styles.tipTitle}>Sleep Tip</Text>
              <Text style={styles.tipDescription}>Sleep on your left side to improve blood flow to your baby.</Text>
              <Text style={styles.tipCategory}>Wellness</Text>
            </View>
          </ScrollView>
        </View>

        {/* Main Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health & Wellness</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard
              title="Health Assessment"
              description="Complete your personalized health check-up form"
              icon="clipboard-outline"
              colors={["#8B5CF6"]}
              onPress={() => router.push("/PatientScreens/Form")}
              size="large"
            />
            <View style={styles.featuresRow}>
              <FeatureCard
                title="BMI Tracker"
                description="Monitor weight gain"
                icon="analytics-outline"
                colors={["#3B82F6"]}
                onPress={() => console.log("BMI Calculator")}
                size="small"
              />
              <FeatureCard
                title="Appointments"
                description="Schedule visits"
                icon="calendar"
                colors={["#10B981"]}
                onPress={() => console.log("Appointments")}
                size="small"
              />
            </View>
            <View style={styles.featuresRow}>
              <FeatureCard
                title="Find Facilities"
                description="Nearby pharmacies & hospitals"
                icon="location"
                colors={["#F59E0B"]}
                onPress={() => router.push("/PatientScreens/NearbyFacilities")}
                size="small"
              />
              <FeatureCard
                title="Emergency"
                description="Quick help"
                icon="call"
                colors={["#EF4444"]}
                onPress={() => console.log("Emergency")}
                size="small"
              />
            </View>
          </View>
        </View>

        {/* Pregnancy Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pregnancy Resources</Text>
          <View style={styles.resourcesContainer}>
            <TouchableOpacity style={styles.resourceCard}>
              <View style={styles.resourceHeader}>
                <Ionicons name="library-outline" size={20} color="#EC4899" />

              </View>
              <Text style={styles.resourceTitle}>Pregnancy Articles</Text>
              <Text style={styles.resourceSubtitle}>Expert advice for every week</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceCard}>
              <View style={styles.resourceHeader}>
                <Ionicons name="people-outline" size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.resourceTitle}>Community</Text>
              <Text style={styles.resourceSubtitle}>Connect with other moms</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <QuickActionCard
              title="View Medical Records"
              subtitle="Access your pregnancy history"
              icon="document-text-outline"
              color="#6366F1"
              onPress={() => router.push("/DoctorScreens/Patients")}
            />
            <QuickActionCard
              title="Medication Reminders"
              subtitle="Track prenatal vitamins"
              icon="medical-outline"
              color="#EC4899"
              onPress={() => console.log("Medications")}
            />
            <QuickActionCard
              title="Symptom Tracker"
              subtitle="Log how you're feeling"
              icon="heart-outline"
              color="#F59E0B"
              onPress={() => console.log("Symptoms")}
            />
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Material Design surface color
  },
  header: {
    paddingTop: 64,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#EC4899',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weekText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  weeksToGoText: {
    color: '#F9A8D4',
    fontSize: 14,
  },
  heartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDescription: {
    color: 'white',
    fontSize: 14,
    marginBottom: 12,
  },
  progressBarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    height: 8,
    marginBottom: 8,
  },
  progressBar: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 8,
    width: '60%',
  },
  progressPercent: {
    color: '#F9A8D4',
    fontSize: 12,
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
    numberOfLines: 1,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  insightTitle: {
    color: '#6B7280',
    fontSize: 12,
  },
  featuresGrid: {
    gap: 16,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  tipsScrollView: {
    flexGrow: 0,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  tipIcon: {
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  tipCategory: {
    fontSize: 12,
    color: '#EC4899',
    fontWeight: '600',
    backgroundColor: '#FDF2F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  resourcesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  resourceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resourceBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  resourceSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  featuresContainer: {
    gap: 16,
  },
  smallCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 20, // More rounded for modern look
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 0.5,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    borderRadius: 16,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#6B7280',
    lineHeight: 20,
  },
  quickActionsContainer: {
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quickIconContainer: {
    borderRadius: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickTextContainer: {
    flex: 1,
  },
  quickTitle: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 14,
  },
  quickSubtitle: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
});

export default PatientsDashBoard;
