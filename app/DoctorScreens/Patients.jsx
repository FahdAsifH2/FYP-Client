import { FlatList, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

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
    <View className="flex-1 bg-white p-4 ">
     <Navbar/>

      <Text className="text-2xl font-bold mb-4 text-gray-800 mt-28">Patients</Text>
      <FlatList
        data={patients}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="bg-purple-300 p-3 rounded-lg mb-2">
            <Text className="text-base text-gray-700">{item.name}</Text>
          </View>
        )}
      />
    </View>
  )
}

export default Patients
