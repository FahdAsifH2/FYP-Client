import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Background from '../components/Background'
import axios from 'axios'
import { useLocalSearchParams, useRouter } from 'expo-router'

const PatientDetails = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError('No patient ID provided')
      return
    }
    
    console.log('Patient ID received:', id)
    
    axios.get(`http://192.168.31.189:5001/api/Doctors/getPatientDetails/${id}`)
      .then(res => {
        console.log('Full API Response:', res.data) // Debug: see full response
        console.log('Response data field:', res.data.data) 
        console.log('Type of response data:', typeof res.data.data) 
        
        // Check if res.data.data exists and has content
        if (res.data && res.data.data) {
          setPatient(res.data.data)
          console.log('Patient set successfully:', res.data.data)
        } else {
          console.log('No patient data in response')
          setError('No patient data found')
        }
        setLoading(false)
      })
      .catch(err => {
        console.log('API Error:', err)
        console.log('Error response:', err.response?.data)
        setError('Failed to load patient details')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <View className="flex-1 bg-white">
        <Navbar />
        <Background />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text className="text-lg text-gray-600 mt-4">Loading patient details...</Text>
          <Text className="text-sm text-gray-500 mt-2">ID: {id}</Text>
        </View>
        <Footer />
      </View>
    )
  }

  if (error || !patient) {
    return (
      <View className="flex-1 bg-white">
        <Navbar />
        <Background />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-lg text-red-500 mb-4 text-center">
            {error || 'Patient not found'}
          </Text>
          <Text className="text-sm text-gray-500 mb-4">Patient ID: {id}</Text>
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="bg-purple-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
        <Footer />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-purple-300">
      <Navbar />
      <Background />
      
      <ScrollView className="flex-1 px-4 pt-24" showsVerticalScrollIndicator={false}>
       
      

        <Text className="text-4xl font-bold text-purple-500 text-center mb-8 mt-10">
          PATIENT DETAILS
        </Text>

      
        <View className="bg-purple-200 rounded-xl p-6 mb-6 mx-2">
          <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {patient.name || 'N/A'}
          </Text>
          
          <View className="space-y-3">
            <View >
              <Text className="text-lg font-semibold text-purple-600">Patient ID:</Text>
              <Text className="text-lg text-gray-800">{patient.id || id}</Text>
            </View>

            {patient.age && (
              <View >
                <Text className="text-lg font-semibold text-purple-600">Age:</Text>
                <Text className="text-lg text-gray-800">{patient.age}</Text>
              </View>
            )}

            {patient.gravida && (
              <View >
                <Text className="text-lg font-semibold text-purple-600">Gravida:</Text>
                <Text className="text-lg text-gray-800">{patient.gravida}</Text>
              </View>
            )}

            {patient.blood_pressure && (
              <View >
                <Text className="text-lg font-semibold text-purple-600">Blood Pressure:</Text>
                <Text className="text-lg text-gray-800">{patient.blood_pressure}</Text>
              </View>
            )}

            {patient.height && (
              <View >
                <Text className="text-lg font-semibold text-purple-600">Height:</Text>
                <Text className="text-lg text-gray-800">{patient.height}</Text>
              </View>
            )}

            {patient.diabetes !== undefined && (
              <View>
                <Text className="text-lg font-semibold text-purple-600">Diabetes:</Text>
                <Text className="text-lg text-gray-800">{patient.diabetes ? 'Yes' : 'No'}</Text>
              </View>
            )}

            {patient.previous_c_section !== undefined && (
              <View >
                <Text className="text-lg font-semibold text-purple-600">Previous C-Section:</Text>
                <Text className="text-lg text-gray-800">{patient.previous_c_section ? 'Yes' : 'No'}</Text>
              </View>
            )}

          
          
          </View>
        </View>
      </ScrollView>
      
      <Footer className="pt-10" />
    </View>
  )
}

export default PatientDetails

const styles = StyleSheet.create({})