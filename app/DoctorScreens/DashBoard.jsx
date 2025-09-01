import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const mockData = {
  doctor: {
    tagline: 'Caring for women\'s health with compassion'
  },
  todayAppointments: [
    { id: 1, time: '09:00 AM', patient: 'Maria Santos', type: 'Checkup' },
    { id: 2, time: '10:30 AM', patient: 'Lisa Chen', type: 'Ultrasound' },
    { id: 3, time: '11:15 AM', patient: 'Emma Wilson', type: 'Consultation' },
    { id: 4, time: '02:00 PM', patient: 'Sarah Ahmed', type: 'Follow-up' },
    { id: 5, time: '03:30 PM', patient: 'Anna Rodriguez', type: 'Checkup' },
    { id: 6, time: '04:45 PM', patient: 'Fatima Khan', type: 'Lab Review' }
  ]
};

const Icons = {
  calendar: '📅', history: '📋', records: '📁', baby: '👶', scale: '⚖️',
  bell: '🔔', user: '👤', smile: '😊', chat: '💬', home: '🏠'
};

const AppointmentRow = ({ appointment }) => (
  <View style={{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  }}>
    <View style={{
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#22c55e',
      marginRight: 12,
    }} />
    
    <View style={{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginRight: 12,
      minWidth: 70,
    }}>
      <Text style={{
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
      }}>
        {appointment.time}
      </Text>
    </View>
    
    <View style={{ flex: 1 }}>
      <Text style={{
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
      }}>
        {appointment.patient}
      </Text>
      <Text style={{
        color: 'white',
        fontSize: 12,
        opacity: 0.7,
      }}>
        {appointment.type}
      </Text>
    </View>
    
    <TouchableOpacity style={{
      backgroundColor: 'rgba(139, 92, 246, 0.3)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    }}>
      <Text style={{
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
      }}>
        View
      </Text>
    </TouchableOpacity>
  </View>
);

const TodaysAppointmentsWidget = ({ appointments }) => (
  <View style={{
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 24,
    overflow: 'hidden',
  }}>
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    }}>
      <Text style={{
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      }}>
        Today's Appointments
      </Text>
      <View style={{
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
      }}>
        <Text style={{
          color: '#22c55e',
          fontSize: 12,
          fontWeight: 'bold',
        }}>
          {appointments.length} scheduled
        </Text>
      </View>
    </View>
    
    <ScrollView 
      style={{ maxHeight: 200 }}
      showsVerticalScrollIndicator={false}
    >
      {appointments.map((appointment) => (
        <AppointmentRow key={appointment.id} appointment={appointment} />
      ))}
    </ScrollView>
  </View>
);

const DashboardCard = ({ title, description, icon, onPress, backgroundImage, isHighlight = false }) => (
  <TouchableOpacity 
    onPress={onPress} 
    activeOpacity={0.8}
    style={{ 
      width: (width - 60) / 2, 
      marginBottom: 16,
      marginHorizontal: 4,
    }}
  >
    <ImageBackground
      source={backgroundImage}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        height: 140,
      }}
      imageStyle={{ borderRadius: 20, opacity: 0.4 }}
    >
      <View style={{
        flex: 1,
        backgroundColor: isHighlight ? 'rgba(139, 92, 246, 0.3)' : 'rgba(0, 0, 0, 0.4)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        padding: 16,
        justifyContent: 'space-between',
      }}>
        <View style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 18 }}>{icon}</Text>
        </View>
        
        <View>
          <Text style={{
            color: 'white',
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 4,
            textShadowColor: 'rgba(0, 0, 0, 0.7)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}>
            {title}
          </Text>
          
          <Text style={{
            color: 'white',
            fontSize: 11,
            opacity: 0.9,
            lineHeight: 14,
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 1,
          }}>
            {description}
          </Text>
        </View>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const ModernHeader = ({ doctor }) => (
  <View style={{ 
    paddingTop: (StatusBar.currentHeight || 44) + 20, 
    paddingBottom: 24, 
    paddingHorizontal: 24 
  }}>
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: 24 
    }}>
      <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
        GyneAI Dashboard
      </Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          alignItems: 'center', justifyContent: 'center', marginRight: 10,
        }}>
          <Text style={{ fontSize: 16 }}>{Icons.bell}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontSize: 16 }}>{Icons.user}</Text>
        </TouchableOpacity>
      </View>
    </View>

    <View style={{
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      padding: 20,
      marginBottom: 20,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 50, height: 50, borderRadius: 25,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          alignItems: 'center', justifyContent: 'center', marginRight: 12,
        }}>
          <Text style={{ fontSize: 24 }}>{Icons.user}</Text>
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 2,
          }}>
            Welcome, Dr. Saba Ansari
          </Text>
          <Text style={{ color: 'white', fontSize: 13, opacity: 0.8 }}>
            {doctor.tagline}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const BottomTabBar = () => (
  <View style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 20,
  }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <TouchableOpacity style={{ alignItems: 'center' }}>
        <View style={{ 
          backgroundColor: 'rgba(139, 92, 246, 0.2)', 
          paddingHorizontal: 12, 
          paddingVertical: 8, 
          borderRadius: 10 
        }}>
          <Text style={{ fontSize: 16 }}>{Icons.home}</Text>
        </View>
        <Text style={{ color: '#8b5cf6', fontSize: 10, marginTop: 4, fontWeight: '600' }}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 16, marginBottom: 4 }}>{Icons.calendar}</Text>
        <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}>Appointments</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 16, marginBottom: 4 }}>{Icons.chat}</Text>
        <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}>Patients</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 16, marginBottom: 4 }}>{Icons.user}</Text>
        <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 10 }}>Profile</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Dashboard = () => {
  const handleNavigation = (route) => {
    if (route) {
      router.push(route);
    } else {
      console.log("Navigation to Appointments");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ModernHeader doctor={mockData.doctor} />
          
          {/* Today's Appointments Widget */}
          <View style={{ paddingHorizontal: 20 }}>
            <TodaysAppointmentsWidget appointments={mockData.todayAppointments} />
          </View>

          {/* Main Features */}
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 12,
            }}>
              Quick Actions
            </Text>
            <View style={{ 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              justifyContent: 'space-between',
              paddingBottom: 100,
            }}>
              <DashboardCard
                title="Predict Delivery Mode"
                description="AI-powered predictions"
                icon={Icons.smile}
                onPress={() => handleNavigation('/DoctorScreens/DelieveryModePredictionService')}
                backgroundImage={require('../DoctorAssets/DoctorPatient.jpg')}
                isHighlight={true}
              />

              <DashboardCard
                title="Chat & Patients"
                description="Monitor conversations"
                icon={Icons.chat}
                onPress={() => handleNavigation('/DoctorScreens/Patients')}
                backgroundImage={require('../DoctorAssets/ai.jpg')}
              />

              <DashboardCard
                title="Due Date Calculator"
                description="Calculate due dates"
                icon={Icons.baby}
                onPress={() => handleNavigation('/DoctorScreens/DueDateCalculator')}
                backgroundImage={require('../DoctorAssets/DueDate.webp')}
              />

              <DashboardCard
                title="BMI Calculator"
                description="Health monitoring"
                icon={Icons.scale}
                onPress={() => handleNavigation('/DoctorScreens/BMICalculator')}
                backgroundImage={require('../DoctorAssets/bmi.jpg')}
              />

              <DashboardCard
                title="Appointments"
                description="Schedule & manage"
                icon={Icons.calendar}
                onPress={() => handleNavigation('/DoctorScreens/AppointmentBookingForm')}
        
                backgroundImage={require('../DoctorAssets/appointments.jpg')}
              />

              <DashboardCard
                title="Patient History"
                description="Antenatal records"
                icon={Icons.history}
                onPress={() => handleNavigation('/DoctorScreens/AntenatalForm')}
                backgroundImage={require('../DoctorAssets/history.jpg')}
              />
            </View>
          </View>
        </ScrollView>
        
        <BottomTabBar />
      </LinearGradient>
    </View>
  );
};

export default Dashboard;