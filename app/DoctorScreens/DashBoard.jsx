import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

// Mock data
const mockData = {
  doctor: {
    name: 'Dr. Sarah Williams',
    profilePic: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    greeting: 'Good Morning'
  },
  appointments: {
    today: 8,
    total: 24
  },
  insights: {
    highRiskPregnancies: 3,
    csectionRate: 32,
    normalDeliveryRate: 68,
    upcomingDueDates: [
      { name: 'Maria Santos', date: 'Aug 18' },
      { name: 'Lisa Chen', date: 'Aug 22' },
      { name: 'Emma Wilson', date: 'Aug 25' }
    ]
  }
};

// Modern Icons
const Icons = {
  stethoscope: '🩺',
  calendar: '📅',
  history: '📋',
  records: '📁',
  baby: '👶',
  scale: '⚖️',
  warning: '⚠️',
  chart: '📊',
  bell: '🔔',
  stats: '📈'
};

// Modern Vertical Card Component
const ModernCard = ({ title, description, icon, onPress, bgColor = 'bg-white', iconBg = 'bg-purple-50' }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className={`${bgColor} rounded-3xl p-5 mx-5 mb-4 shadow-lg`}
    style={{
      shadowColor: '#A855F7',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    }}
  >
    {/* Icon at top */}
    <View className={`w-14 h-14 ${iconBg} rounded-2xl items-center justify-center mb-4`}>
      <Text className="text-3xl">{icon}</Text>
    </View>
    
    {/* Title */}
    <Text className="text-lg font-bold text-gray-800 mb-2 leading-6">
      {title}
    </Text>
    
    {/* Description */}
    <Text className="text-sm text-gray-500 leading-5 opacity-80">
      {description}
    </Text>
  </TouchableOpacity>
);

// Small Insight Card
const InsightCard = ({ title, value, subtitle, icon, color = 'purple' }) => {
  const getColorClasses = (color) => {
    switch(color) {
      case 'rose': return { text: 'text-rose-500', bg: 'bg-rose-50' };
      case 'pink': return { text: 'text-pink-500', bg: 'bg-pink-50' };
      case 'fuchsia': return { text: 'text-fuchsia-500', bg: 'bg-fuchsia-50' };
      default: return { text: 'text-purple-500', bg: 'bg-purple-50' };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <View 
      className="bg-white rounded-2xl p-4 flex-1 mx-2 shadow-lg"
      style={{
        shadowColor: color === 'rose' ? '#F43F5E' : color === 'pink' ? '#EC4899' : color === 'fuchsia' ? '#D946EF' : '#A855F7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className={`w-10 h-10 ${colorClasses.bg} rounded-xl items-center justify-center mb-3`}>
        <Text className="text-xl">{icon}</Text>
      </View>
      <Text className={`text-2xl font-bold ${colorClasses.text} mb-1`}>
        {value}
      </Text>
      <Text className="text-xs text-gray-500 font-semibold">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-xs text-gray-400 mt-1">
          {subtitle}
        </Text>
      )}
    </View>
  );
};

// Modern Header with elegant purple-pink gradient
const ModernHeader = ({ doctor, appointments }) => (
  <LinearGradient
    colors={['#8B5CF6', '#A855F7', '#EC4899', '#F472B6']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    className="pt-16 pb-8 px-6"
    style={{ paddingTop: (StatusBar.currentHeight || 0) + 50 }}
  >
    {/* Top Row - Better centered */}
    <View className="flex-row justify-between items-center mb-8 px-2">
      <View className="flex-1 pr-4">
        <Text className="text-white text-sm opacity-90 mb-2">
          {doctor.greeting}
        </Text>
        <Text className="text-white text-2xl font-bold leading-7">
          {doctor.name}
        </Text>
      </View>
      
      <View className="flex-row items-center">
        <TouchableOpacity 
          className="rounded-xl p-3 mr-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          <Text className="text-xl">{Icons.bell}</Text>
        </TouchableOpacity>
        
        <Image 
          source={{ uri: doctor.profilePic }}
          className="w-14 h-14 rounded-full border-2"
          style={{ borderColor: 'rgba(255,255,255,0.4)' }}
        />
      </View>
    </View>

    {/* Stats Row - Better centered */}
    <View 
      className="flex-row rounded-2xl p-6 mx-1 mb-4  "
      style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
    >
      <View className="flex-1 items-center">
        <Text className="text-white text-3xl font-bold mb-1">
          {appointments.today}
        </Text>
        <Text className="text-white text-xs opacity-90 text-center">
          Today's Visits
        </Text>
      </View>
      
      <View 
        className="w-px mx-6"
        style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
      />
      
      <View className="flex-1 items-center">
        <Text className="text-white text-3xl font-bold mb-1">
          {appointments.total}
        </Text>
        <Text className="text-white text-xs opacity-90 text-center">
          This Week
        </Text>
      </View>
    </View>
  </LinearGradient>
);

// Quick Insights Section with purple theme
const QuickInsights = ({ insights }) => (
  <View className="px-5 mt-8 mb-8">
    <Text className="text-xl font-bold text-gray-800 mb-4">
      Quick Insights
    </Text>
    
    <View className="flex-row mb-4">
      <InsightCard
        title="High Risk"
        value={insights.highRiskPregnancies}
        subtitle="Need attention"
        icon={Icons.warning}
        color="rose"
      />
      <InsightCard
        title="C-Sections"
        value={`${insights.csectionRate}%`}
        subtitle="This month"
        icon={Icons.chart}
        color="fuchsia"
      />
    </View>
    
    {/* Upcoming Due Dates */}
    <View 
      className="bg-white rounded-2xl p-4 shadow-lg"
      style={{
        shadowColor: '#A855F7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 bg-pink-100 rounded-xl items-center justify-center mr-3">
          <Text className="text-xl">{Icons.baby}</Text>
        </View>
        <Text className="text-base font-semibold text-gray-800">
          Upcoming Due Dates
        </Text>
      </View>
      
      {insights.upcomingDueDates.map((patient, index) => (
        <View 
          key={index} 
          className={`flex-row justify-between items-center py-2 ${
            index < insights.upcomingDueDates.length - 1 ? 'border-b border-gray-100' : ''
          }`}
          style={index < insights.upcomingDueDates.length - 1 ? {
            borderBottomWidth: 1,
            borderBottomColor: '#F3F4F6'
          } : {}}
        >
          <Text className="text-sm text-gray-700 font-medium">
            {patient.name}
          </Text>
          <View className="bg-pink-100 px-2 py-1 rounded-lg">
            <Text className="text-xs text-pink-700 font-semibold">
              {patient.date}
            </Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

// Clinical Tools Grid with purple-pink theme
const ClinicalTools = ({ onNavigate }) => (
  <View className="pb-10">
    <Text className="text-xl font-bold text-gray-800 mb-5 px-5">
      Clinical Tools
    </Text>
    
    <ModernCard
      title="Predict Delivery Mode"
      description="Use AI to predict the most likely delivery method for your patient"
      icon={Icons.stethoscope}
      onPress={() => onNavigate('/DoctorScreens/DelieveryModePredictionService')}
      iconBg="bg-rose-50"
    />

    <ModernCard
      title="Due Date Estimator"
      description="Calculate estimated due date based on LMP or ultrasound scan"
      icon={Icons.baby}
      onPress={() => onNavigate('/DoctorScreens/DueDateCalculator')}
      iconBg="bg-pink-50"
    />

    <ModernCard
      title="BMI Calculator"
      description="Monitor pregnancy health with BMI calculations and tracking"
      icon={Icons.scale}
      onPress={() => onNavigate('/DoctorScreens/BMICalculator')}
      iconBg="bg-purple-50"
    />

    <ModernCard 
      title="Appointment Booking"
      description="Manage and schedule patient appointments efficiently"
      icon={Icons.calendar}
      onPress={() => console.log("Navigation to Appointments")}
      iconBg="bg-fuchsia-50"
    />

    <ModernCard
      title="Patients History"
      description="Access comprehensive antenatal forms and patient records"
      icon={Icons.history}
      onPress={() => onNavigate('/DoctorScreens/AntenatalForm')}
      iconBg="bg-violet-50"
    />

    <ModernCard
      title="Medical Records"
      description="Review patient medical records and communication history"
      icon={Icons.records}
      onPress={() => onNavigate('/DoctorScreens/Patients')}
      iconBg="bg-purple-50"
    />
  </View>
);

// Main Dashboard Component
const Dashboard = () => {
  const handleNavigation = (route) => {
    console.log(`Navigating to: ${route}`);
    router.push(route);
  };

  return (
    <View className="flex-1 bg-purple-50">
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <ModernHeader 
          doctor={mockData.doctor} 
          appointments={mockData.appointments} 
        />
        
        <QuickInsights insights={mockData.insights} />
        
        <ClinicalTools onNavigate={handleNavigation} />
      </ScrollView>
    </View>
  );
};

export default Dashboard;