import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import axios from "axios";

const screenWidth = Dimensions.get("window").width;

// Data constants
const DOCTOR_INFO = {
  tagline: "Caring for women's health with compassion",
};

// Test data matching your actual API response format
const FALLBACK_APPOINTMENTS = [
  {
    id: 3,
    appointment_date: '2025-09-09T19:00:00.000Z',
    appointment_time: '14:30:00',
    appointment_type: 'Cardiology',
    issue: 'Heart checkup and chest pain',
    patient_name: 'Ali Khan'
  },
  {
    id: 4,
    appointment_date: '2025-09-10T19:00:00.000Z',
    appointment_time: '09:00:00',
    appointment_type: 'Gynecology',
    issue: 'Pregnancy consultation',
    patient_name: 'Sara Ahmed'
  },
  {
    id: 5,
    appointment_date: '2025-09-11T19:00:00.000Z',
    appointment_time: '11:15:00',
    appointment_type: 'Dental',
    issue: 'Tooth pain and bleeding gums',
    patient_name: 'Usman Ali'
  },
  {
    id: 6,
    appointment_date: '2025-09-12T19:00:00.000Z',
    appointment_time: '16:45:00',
    appointment_type: 'Dermatology',
    issue: 'Acne and skin allergy',
    patient_name: 'Fatima Noor'
  }
];

// Icon mappings
const APP_ICONS = {
  calendar: "📅",
  history: "📋",
  records: "📁",
  baby: "👶",
  scale: "⚖️",
  bell: "🔔",
  user: "👤",
  smile: "😊",
  chat: "💬",
  home: "🏠",
};

// Styles object
const styles = {
  container: { flex: 1 },
  appointmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  appointmentIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
    marginRight: 12,
  },
  timeContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 70,
  },
  timeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  patientContainer: { flex: 1 },
  patientName: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  appointmentType: {
    color: "white",
    fontSize: 12,
    opacity: 0.7,
  },
  viewButton: {
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewButtonText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
};

// Format time to 12-hour format with AM/PM
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const hour24 = parseInt(hours);
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  
  return `${hour12}:${minutes} ${ampm}`;
};

// Components
const AppointmentItem = ({ appointmentData }) => (
  <View style={styles.appointmentContainer}>
    <View style={styles.appointmentIndicator} />
    <View style={styles.timeContainer}>
      <Text style={styles.timeText}>
        {formatTime(appointmentData.appointment_time) || appointmentData.time}
      </Text>
    </View>
    <View style={styles.patientContainer}>
      <Text style={styles.patientName}>
        {appointmentData.patient_name || appointmentData.patient}
      </Text>
      <Text style={styles.appointmentType}>
        {appointmentData.appointment_type || appointmentData.type}
      </Text>
    </View>
    <TouchableOpacity style={styles.viewButton}>
      <Text style={styles.viewButtonText}>View</Text>
    </TouchableOpacity>
  </View>
);

const AppointmentsSection = ({ appointmentsList }) => (
  <View
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
      marginBottom: 24,
      overflow: "hidden",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
        Today's Appointments
      </Text>
      <View
        style={{
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "#22c55e", fontSize: 12, fontWeight: "bold" }}>
          {appointmentsList.length} scheduled
        </Text>
      </View>
    </View>
    <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
      {appointmentsList.map((item, idx) => (
        <AppointmentItem key={item.id || idx} appointmentData={item} />
      ))}
    </ScrollView>
  </View>
);

const FeatureCard = ({
  cardTitle,
  cardDescription,
  cardIcon,
  onCardPress,
  cardBackgroundImage,
  isSpecial = false,
}) => (
  <TouchableOpacity
    onPress={onCardPress}
    activeOpacity={0.8}
    style={{
      width: (screenWidth - 60) / 2,
      marginBottom: 16,
      marginHorizontal: 4,
    }}
  >
    <ImageBackground
      source={cardBackgroundImage}
      style={{
        borderRadius: 20,
        overflow: "hidden",
        height: 140,
      }}
      imageStyle={{ borderRadius: 20, opacity: 0.4 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: isSpecial
            ? "rgba(139, 92, 246, 0.3)"
            : "rgba(0, 0, 0, 0.4)",
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.2)",
          padding: 16,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>{cardIcon}</Text>
        </View>
        <View>
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 4,
              textShadowColor: "rgba(0, 0, 0, 0.7)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}
          >
            {cardTitle}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 11,
              opacity: 0.9,
              lineHeight: 14,
              textShadowColor: "rgba(0, 0, 0, 0.5)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1,
            }}
          >
            {cardDescription}
          </Text>
        </View>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const HeaderSection = ({ doctorData }) => (
  <View
    style={{
      paddingTop: (StatusBar.currentHeight || 44) + 20,
      paddingBottom: 24,
      paddingHorizontal: 24,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        GyneAI Dashboard
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>{APP_ICONS.bell}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>{APP_ICONS.user}</Text>
        </TouchableOpacity>
      </View>
    </View>
    <View
      style={{
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        padding: 20,
        marginBottom: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Text style={{ fontSize: 24 }}>{APP_ICONS.user}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 2,
            }}
          >
            Welcome, Dr. Saba Ansari
          </Text>
          <Text style={{ color: "white", fontSize: 13, opacity: 0.8 }}>
            {doctorData.tagline}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const NavigationBar = () => (
  <View
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(26, 26, 46, 0.95)",
      borderTopWidth: 1,
      borderTopColor: "rgba(255, 255, 255, 0.1)",
      paddingVertical: 15,
      paddingHorizontal: 20,
    }}
  >
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      <TouchableOpacity style={{ alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "rgba(139, 92, 246, 0.2)",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 16 }}>{APP_ICONS.home}</Text>
        </View>
        <Text
          style={{
            color: "#8b5cf6",
            fontSize: 10,
            marginTop: 4,
            fontWeight: "600",
          }}
        >
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 16, marginBottom: 4 }}>{APP_ICONS.calendar}</Text>
        <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 10 }}>
          Appointments
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 16, marginBottom: 4 }}>{APP_ICONS.chat}</Text>
        <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 10 }}>
          Patients
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 16, marginBottom: 4 }}>{APP_ICONS.user}</Text>
        <Text style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: 10 }}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Dashboard = () => {
  const [appointmentData, setAppointmentData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const fetchAppointmentData = async () => {
    try {
      const apiResponse = await axios.get("http://192.168.31.188:5001/getAppointments");
      console.log("API Response:", apiResponse.data);
      
      // Filter out null entries and format the data
      const validAppointments = apiResponse.data.filter(appointment => 
        appointment.patient_name && appointment.appointment_time && appointment.appointment_type
      );
      
      setAppointmentData(validAppointments);
      setIsDataLoading(false);
    } catch (apiError) {
      console.log("API Error:", apiError);
      setAppointmentData(FALLBACK_APPOINTMENTS);
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentData();
  }, []);

  const navigateToScreen = (screenRoute) => {
    if (screenRoute) {
      router.push(screenRoute);
    } else {
      console.log("Navigation to Appointments");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <HeaderSection doctorData={DOCTOR_INFO} />
          <View style={{ paddingHorizontal: 20 }}>
            <AppointmentsSection
              appointmentsList={isDataLoading ? FALLBACK_APPOINTMENTS : appointmentData}
            />
          </View>
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              Quick Actions
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                paddingBottom: 100,
              }}
            >
              <FeatureCard
                cardTitle="Predict Delivery Mode"
                cardDescription="AI-powered predictions"
                cardIcon={APP_ICONS.smile}
                onCardPress={() =>
                  navigateToScreen("/DoctorScreens/DelieveryModePredictionService")
                }
                cardBackgroundImage={require("../DoctorAssets/DoctorPatient.jpg")}
                isSpecial={true}
              />
              <FeatureCard
                cardTitle="Chat & Patients"
                cardDescription="Monitor conversations"
                cardIcon={APP_ICONS.chat}
                onCardPress={() => navigateToScreen("/DoctorScreens/Patients")}
                cardBackgroundImage={require("../DoctorAssets/ai.jpg")}
              />
              <FeatureCard
                cardTitle="Due Date Calculator"
                cardDescription="Calculate due dates"
                cardIcon={APP_ICONS.baby}
                onCardPress={() =>
                  navigateToScreen("/DoctorScreens/DueDateCalculator")
                }
                cardBackgroundImage={require("../DoctorAssets/DueDate.webp")}
              />
              <FeatureCard
                cardTitle="BMI Calculator"
                cardDescription="Health monitoring"
                cardIcon={APP_ICONS.scale}
                onCardPress={() => navigateToScreen("/DoctorScreens/BMICalculator")}
                cardBackgroundImage={require("../DoctorAssets/bmi.jpg")}
              />
              <FeatureCard
                cardTitle="Appointments"
                cardDescription="Schedule & manage"
                cardIcon={APP_ICONS.calendar}
                onCardPress={() =>
                  navigateToScreen("/DoctorScreens/AppointmentBookingForm")
                }
                cardBackgroundImage={require("../DoctorAssets/appointments.jpg")}
              />
              <FeatureCard
                cardTitle="Patient History"
                cardDescription="Antenatal records"
                cardIcon={APP_ICONS.history}
                onCardPress={() => navigateToScreen("/DoctorScreens/AntenatalForm")}
                cardBackgroundImage={require("../DoctorAssets/history.jpg")}
              />
            </View>
          </View>
        </ScrollView>
        <NavigationBar />
      </LinearGradient>
    </View>
  );
};

export default Dashboard;