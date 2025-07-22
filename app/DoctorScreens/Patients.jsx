import { FlatList, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { TouchableOpacity } from 'react-native'
import Background from '../components/Background';
import Footer from '../components/Footer'
const Patients = () => {
  const [patients, setPatients] = useState([])

  useEffect(() => {
    axios.get('http://192.168.31.188:5001/api/patients/getPatientsNames')
      .then(res => {
        setPatients(res.data.data);
      })
      .catch(err => {
        console.log('error', err);
      })
  }, [])

  return (
    <View className="flex-1 bg-white px-4 pt-10">
      <Navbar />
      <Background/>
      <Text className="text-4xl font-bold text-purple-500 text-center mt-24 mb-6">
        PATIENTS
      </Text>
      <FlatList
  data={patients}
  keyExtractor={(_, i) => i.toString()}
  contentContainerStyle={{ paddingBottom: 20 }}
  renderItem={({ item }) => (
    <View className="bg-purple-300 p-4 rounded-xl mb-3 mx-auto w-[90%] flex-row items-center">
      <Text className="text-xl font-medium text-gray-800">{item.name}</Text>
    
      <TouchableOpacity className="ml-auto bg-red-500 px-3 py-1.5 rounded">
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
