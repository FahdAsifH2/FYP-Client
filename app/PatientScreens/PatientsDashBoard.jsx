import { StyleSheet, Text, View } from "react-native";
import Cards from "../components/cards";
import React from "react";
import Footer from "../components/Footer";
import Background from "../components/Background";
import Navbar from "../components/Navbar";
import { useRouter } from "expo-router";
import Form from "./Form";

const PatientsDashBoard = () => {
  const router = useRouter();

  return (
    <View className="flex-1">
      <Background />
      <Navbar />
      <View className="flex-1 justify-center items-center px-4 mt-32">
        <Cards
          Title="BMI Calculator"
          Description="Calculate your Body Mass Index to monitor your health."
          onPress={() => console.log("Navigation to the BMI Calculator")}
        />
        <View style={{ height: 24 }} />
        <Cards
          Title="Appointment Booking"
          Description="View and manage your upcoming appointments easily."
          onPress={() => console.log("Navigation to the Appointments")}
        />
        <View style={{ height: 24 }} />
        <Cards
          Title="Nearest Pharmacies"
          Description="Find pharmacies near your current location quickly."
          onPress={() => console.log("Navigation to Nearest Pharmacies")}
        />
        <View style={{ height: 24 }} />
        <Cards
          Title="My Medical Records"
          Description="Access and manage your personal medical history."
          onPress={() => router.push("/DoctorScreens/Patients")}
        />

        <View style={{ height: 24 }} />
        <Cards
          Title="Fill The Form"
          Description="Fill the form to get the medical records to your doctor."
          onPress={() => router.push("/PatientScreens/Form")}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0">
        <Footer />
      </View>
    </View>
  );
};

export default PatientsDashBoard;
