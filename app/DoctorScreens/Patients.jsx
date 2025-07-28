import { FlatList, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Background from '../components/Background'
import { useRouter } from 'expo-router'
import Footer from '../components/Footer'

const Patients = () => {
  const router = useRouter()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://192.168.31.188:5001/api/patients/getPatientsNames')
      .then(res => {
        setPatients(res.data.data)
        setLoading(false)
      })
      .catch(err => {
        console.log('Error loading patients:', err)
        setLoading(false)
      })
  }, [])

  const handleDetailsPress = (patient) => {
    console.log('Selected patient:', patient)
    
    if (!patient.id) {
      alert('Patient ID not found!')
      return
    }
    
    router.push({
      pathname: '/DoctorScreens/PatientDetails',
      params: { id: patient.id.toString() } //  Ensure ID is string
    })
  }

  if (loading) {
    return (
      <View className="flex-1 bg-white px-4 pt-10">
        <Navbar />
        <Background/>
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading patients...</Text>
        </View>
        <Footer className='pt-16'/>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white px-4 pt-10 pb-16">
      <Navbar />
      <Background/>
      <Text className="text-4xl font-bold text-purple-500 text-center mt-24 mb-6">
        PATIENTS
      </Text>
      
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View className="bg-purple-300 p-4 rounded-xl mb-3 mx-auto w-[90%] flex-row items-center">
            <View className="flex-1">
              <Text className="text-xl font-medium text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-600">ID: {item.id}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => handleDetailsPress(item)}
              className="ml-auto bg-red-500 px-3 py-1.5 rounded"
            >
              <Text className="text-white">Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Footer className='pt-16'/>
    </View>
  )
}

export default Patients