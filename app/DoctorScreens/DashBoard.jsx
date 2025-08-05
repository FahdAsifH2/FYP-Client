import React from 'react';
import { View } from 'react-native';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import Cards from '../components/cards';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import Patients from './Patients';
import Footer from '../components/Footer';
const Dashboard = () => {
  return (
    <View className="flex-1">
      <Background />
      <Navbar />
      
      <View className="flex-1 justify-center items-center px-4 mt-32 mb-12">
        <Cards 
          Title="Predict Delivery Mode"
          Description="Use this tool to predict the most likely delivery method for your patient."
          onPress={() => router.push('/DoctorScreens/PredictDelivery')}
        />
        <View style={{ height: 24 }} />
        <Cards 
          Title="Appointment Booking"
          Description="You can check your appointments here."
          onPress={() => console.log("Navigation to the Appointments")}
        />
        <View style={{ height: 24 }} />
        <Cards 
          Title="Patients History"
          Description="Chat and interact with your patient."
          onPress={() => router.push('/DoctorScreens/AntenatalForm')}
        />
        <View style={{ height: 24 }} />
        <Cards 
          Title="Patient's Medical Records"
          Description="Check the medical records of your patients here. You can also chat with them."
          onPress={() => router.push('/DoctorScreens/Patients')}
        />
      </View>

      <Footer/>
    </View>
  );
};

export default Dashboard;
