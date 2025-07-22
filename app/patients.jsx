import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Background from './components/Background';
const Patients = () => {
  const patients = [
    { Name: 'Ali' },
    { Name: 'Hassan' },
    { Name: 'Aina' }
  ];

  return (
    <View className='flex-1' >
    <Background/>

    </View>
  );
};

export default Patients;

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  patientName: {
    fontSize: 16,
    marginVertical: 4
  }
});
