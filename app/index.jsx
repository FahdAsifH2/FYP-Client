import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  LinearGradient,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const DoctorDashboard = () => {
  const doctorName = "Saba Ansari"; // This would come from props or state

  const dashboardCards = [
    {
      id: 1,
      title: 'Predict Delivery Mode',
      description: 'AI-powered delivery predictions',
      icon: 'baby-face-outline',
      gradientColors: ['rgba(236, 72, 153, 0.3)', 'rgba(219, 39, 119, 0.2)'],
      iconColor: '#F8BBD9',
    },
    {
      id: 2,
      title: 'Chat — View Your Patients',
      description: 'Monitor patient conversations',
      icon: 'chat-outline',
      gradientColors: ['rgba(168, 85, 247, 0.3)', 'rgba(139, 69, 219, 0.2)'],
      iconColor: '#DDD6FE',
    },
    {
      id: 3,
      title: 'Appointments — Schedule',
      description: 'Manage your appointments',
      icon: 'calendar-clock',
      gradientColors: ['rgba(219, 39, 119, 0.3)', 'rgba(190, 24, 93, 0.2)'],
      iconColor: '#FBBF24',
    },
    {
      id: 4,
      title: 'Chats — Patients Chatting With You',
      description: 'Active patient communications',
      icon: 'message-reply-text',
      gradientColors: ['rgba(147, 51, 234, 0.3)', 'rgba(126, 34, 206, 0.2)'],
      iconColor: '#C4B5FD',
    },
  ];

  const handleCardPress = (cardTitle) => {
    console.log(`${cardTitle} card pressed`);
    // Navigate to respective screen
  };

  const GlassCard = ({ children, style }) => (
    <View style={[styles.glassCard, style]}>
      <View style={styles.glassEffect}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1A0B2E" barStyle="light-content" />
      
      {/* Background Gradient */}
      <View style={styles.backgroundGradient}>
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
        <View style={styles.gradientLayer3} />
      </View>

      {/* Top Toolbar */}
      <SafeAreaView>
        <View style={styles.toolbar}>
          <View style={styles.toolbarContent}>
            <Text style={styles.toolbarTitle}>GyneAI Dashboard</Text>
            <View style={styles.toolbarActions}>
              <TouchableOpacity 
                style={styles.toolbarAction}
                onPress={() => console.log('Notifications pressed')}
              >
                <MaterialCommunityIcons name="bell-outline" size={24} color="#F8BBD9" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.toolbarAction}
                onPress={() => console.log('Profile pressed')}
              >
                <MaterialCommunityIcons name="account-circle" size={24} color="#F8BBD9" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.glassEffect}>
            <View style={styles.welcomeContent}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarGlow}>
                  <MaterialCommunityIcons name="doctor" size={40} color="#F8BBD9" />
                </View>
              </View>
              <View style={styles.welcomeText}>
                <Text style={styles.welcomeTitle}>
                  Welcome, Dr. {doctorName}
                </Text>
                <Text style={styles.welcomeSubtitle}>
                  Caring for women's health with compassion
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Dashboard Cards */}
        <View style={styles.cardsContainer}>
          {dashboardCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => handleCardPress(card.title)}
              activeOpacity={0.8}
            >
              <View style={styles.card}>
                <View style={styles.glassEffect}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <View style={styles.iconContainer}>
                        <View style={styles.iconGlow}>
                          <MaterialCommunityIcons
                            name={card.icon}
                            size={32}
                            color={card.iconColor}
                          />
                        </View>
                      </View>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={24}
                        color="rgba(248, 187, 217, 0.7)"
                      />
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {card.title}
                    </Text>
                    <Text style={styles.cardDescription} numberOfLines={2}>
                      {card.description}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D001A',
  },

  // Background Gradient Layers
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A0B2E',
  },
  gradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0D001A',
  },
  gradientLayer2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1A0B2E',
    opacity: 0.8,
  },
  gradientLayer3: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2D1B69',
    opacity: 0.3,
  },

  // Glass Effect Components
  glassCard: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(248, 187, 217, 0.15)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glassEffect: {
    backgroundColor: 'rgba(26, 11, 46, 0.4)',
    borderRadius: 19,
  },

  // Toolbar Styles
  toolbar: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(26, 11, 46, 0.7)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(248, 187, 217, 0.2)',
    shadowColor: '#EC4899',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  toolbarContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#F8BBD9',
    textShadowColor: 'rgba(236, 72, 153, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  toolbarActions: {
    flexDirection: 'row',
  },
  toolbarAction: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    marginLeft: 8,
    backgroundColor: 'rgba(248, 187, 217, 0.1)',
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },

  // Welcome Section Styles
  welcomeSection: {
    margin: 16,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(248, 187, 217, 0.15)',
    shadowColor: '#EC4899',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatarGlow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(248, 187, 217, 0.3)',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F8BBD9',
    marginBottom: 6,
    textShadowColor: 'rgba(236, 72, 153, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(221, 214, 254, 0.8)',
    lineHeight: 22,
  },

  // Cards Styles
  cardsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(248, 187, 217, 0.15)',
    shadowColor: '#A855F7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    backgroundColor: 'rgba(147, 51, 234, 0.15)',
  },
  cardContent: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  iconGlow: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(221, 214, 254, 0.2)',
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#F8BBD9',
    marginBottom: 10,
    textShadowColor: 'rgba(236, 72, 153, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  cardDescription: {
    fontSize: 15,
    color: 'rgba(221, 214, 254, 0.8)',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 30,
  },
});

export default DoctorDashboard;