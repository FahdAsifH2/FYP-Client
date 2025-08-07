import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';
import { patientsDashboardStyles, getCardWidth } from '../styles/PatientsDashBoard.styles';

const { width } = Dimensions.get('window');
const cardWidth = getCardWidth(); // Use imported utility
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const DEFAULT_PREGNANCY_DURATION = 40; // Default pregnancy duration in weeks

// Use imported styles
const styles = patientsDashboardStyles;

const PatientsDashBoard = () => {
  const router = useRouter();
  const { getWaterProgress, getSleepDisplay, loadHealthData, waterCount, sleepHours } = useHealth();
  
  // TODO: Replace with actual user data from context/API
  const [pregnancyData, setPregnancyData] = React.useState({
    currentWeek: null,
    dueDate: null,
    lastMenstrualPeriod: null,
    totalDuration: DEFAULT_PREGNANCY_DURATION,
    isPregnant: false
  });

 
  React.useEffect(() => {
    loadHealthData();
    loadPregnancyData();
    console.log('Dashboard loaded - Water:', waterCount, 'Sleep:', sleepHours);
  }, []);

  // Load user's pregnancy data from API/context
  const loadPregnancyData = async () => {
    try {
      // TODO: Replace with actual API call to get user's pregnancy data
      // const response = await getUserPregnancyData();
      // setPregnancyData(response.data);
      
      // For now, using demo data - this should be replaced with real user data
      setPregnancyData({
        currentWeek: 28, // This should come from user's actual data
        dueDate: new Date(Date.now() + (12 * 7 * MILLISECONDS_PER_DAY)), // 12 weeks from now
        lastMenstrualPeriod: new Date(Date.now() - (28 * 7 * MILLISECONDS_PER_DAY)), // 28 weeks ago
        totalDuration: 40, // This could vary per user
        isPregnant: true
      });
    } catch (error) {
      console.error('Error loading pregnancy data:', error);
      
      setPregnancyData({
        currentWeek: null,
        dueDate: null,
        lastMenstrualPeriod: null,
        totalDuration: DEFAULT_PREGNANCY_DURATION,
        isPregnant: false
      });
    }
  };

  // Calculate pregnancy progress based on user's actual data
  const getPregnancyProgress = () => {
    if (!pregnancyData.isPregnant || !pregnancyData.currentWeek) {
      return {
        currentWeek: 0,
        weeksToGo: 0,
        progressPercentage: 0,
        isPregnant: false
      };
    }

    const currentWeek = pregnancyData.currentWeek;
    const totalDuration = pregnancyData.totalDuration;
    const weeksToGo = Math.max(totalDuration - currentWeek, 0);
    const progressPercentage = Math.round((currentWeek / totalDuration) * 100);

    return {
      currentWeek,
      weeksToGo,
      progressPercentage: Math.min(progressPercentage, 100),
      isPregnant: true
    };
  };

  // Get baby size description based on current week
  const getBabyDescription = (week) => {
    if (week <= 0) return "Start your pregnancy journey! 🌱";
    if (week <= 4) return "Your baby is the size of a poppy seed! 🌱";
    if (week <= 8) return "Your baby is the size of a raspberry! 🫐";
    if (week <= 12) return "Your baby is the size of a lime! 🟢";
    if (week <= 16) return "Your baby is the size of an avocado! 🥑";
    if (week <= 20) return "Your baby is the size of a banana! 🍌";
    if (week <= 24) return "Your baby is the size of an ear of corn! 🌽";
    if (week <= 28) return "Your baby is the size of an eggplant! 🍆";
    if (week <= 32) return "Your baby is the size of a coconut! 🥥";
    if (week <= 36) return "Your baby is the size of a papaya! 🧡";
    if (week <= 40) return "Your baby is full term! Ready to meet you! 👶";
    return "Congratulations on your bundle of joy! 👶";
  };

  // Get pregnancy progress data
  const pregnancyProgress = getPregnancyProgress();
  const { currentWeek, weeksToGo, progressPercentage, isPregnant } = pregnancyProgress;

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
        <Text style={styles.headerTitle}>
          {isPregnant ? 'Welcome Back!' : 'Welcome to GynAI!'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isPregnant 
            ? 'Your pregnancy journey, day by day' 
            : 'Your health and wellness companion'
          }
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Pregnancy Progress Card */}
        {isPregnant ? (
          <View style={styles.section}>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <View>
                  <Text style={styles.weekText}>Week {currentWeek}</Text>
                  <Text style={styles.weeksToGoText}>
                    {weeksToGo > 0 ? `${weeksToGo} weeks to go` : 'Full term reached!'}
                  </Text>
                </View>
                <View style={styles.heartContainer}>
                  <Ionicons name="heart" size={24} color="white" />
                </View>
              </View>
              <Text style={styles.progressDescription}>
                {getBabyDescription(currentWeek)}
              </Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
              </View>
              <Text style={styles.progressPercent}>{progressPercentage}% Complete</Text>
              {pregnancyData.dueDate && (
                <Text style={styles.dueDateText}>
                  Due: {pregnancyData.dueDate.toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={[styles.progressCard, { backgroundColor: '#6366F1' }]}>
              <View style={styles.progressHeader}>
                <View>
                  <Text style={styles.weekText}>Welcome to GynAI</Text>
                  <Text style={styles.weeksToGoText}>Your health companion</Text>
                </View>
                <View style={styles.heartContainer}>
                  <Ionicons name="heart-outline" size={24} color="white" />
                </View>
              </View>
              <Text style={styles.progressDescription}>
                Track your health, find nearby facilities, and get expert advice. 💜
              </Text>
            </View>
          </View>
        )}

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

export default PatientsDashBoard;
