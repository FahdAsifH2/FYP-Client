import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

const AntenatalForm = () => {
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState(0);
  const [marriedSince, setMarriedSince] = useState(0);
  const [isCousinMarriage, setIsCousinMarriage] = useState(false);
  const [referredBy, setReferredBy] = useState(" ");
  const [date, setDate] = useState(0);
  return (
    <View className="flex-1 items-center pt-10 bg-white">
      <View className="w-11/12 bg-gray-100 rounded-xl p-4 shadow-md">
        <Text className="text-xl font-bold mb-4 text-center">
          Antenatal Form
        </Text>

        <TextInput
          className="bg-purple-300 w-full h-12 rounded-md px-3 mb-4 border border-gray-300"
          value={patientName}
          onChangeText={setPatientName}
          placeholder="Enter patient's name"
        />

        <TextInput className="bg-purple-300 w-full h-12 rounded-md mb-2 px-3 border-grey-300 mt-2" value={age} onChange={setAge} placeholder="Enter Your age" />

        
      </View>
    </View>
  );
};

export default AntenatalForm;

const styles = StyleSheet.create({});
