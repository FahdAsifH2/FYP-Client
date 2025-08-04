import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Background from "../components/Background";

const AntenatalForm = () => {
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [showPatientIdentification, setShowPatientIdentification] =
    useState(false);

  // Patient Info states
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [marriedSince, setMarriedSince] = useState("");
  const [isCousinMarriage, setIsCousinMarriage] = useState(false);
  const [referredBy, setReferredBy] = useState("");
  const [date, setDate] = useState("");

  // Patient Identification states
  const [relation, setRelation] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [husbandName, setHusbandName] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [occupation, setOccupation] = useState("");

  return (

    <View className="flex-1">
     
     <Background />
      <Navbar />
      <Footer/>
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 items-center pt-10 mt-20">
          <View className="w-11/12 bg-gray-100 rounded-xl p-4 shadow-md mb-6">
            <Text className="text-2xl font-bold text-center mb-4">
              Antenatal Form
            </Text>

            {/* Patient Info Toggle Button */}
            <TouchableOpacity
              className="bg-purple-400 p-3 rounded-md mb-1"
              onPress={() => setShowPatientInfo(!showPatientInfo)}
            >
              <Text className="text-lg font-semibold text-black">
                {showPatientInfo ? "▼" : "▶"} Patient Info
              </Text>
            </TouchableOpacity>

            {/* Patient Info Collapsible Section */}
            {showPatientInfo && (
              <View>
                <TextInput
                  className="bg-purple-200 w-full h-12 rounded-md px-4 text-black mb-1"
                  value={patientName}
                  onChangeText={setPatientName}
                  placeholder="Enter patient's name"
                  placeholderTextColor="#4B5563"
                  returnKeyType="next"
                />

                <TextInput
                  className="bg-purple-200 w-full h-12 rounded-md px-4 text-black mb-1"
                  value={age}
                  onChangeText={setAge}
                  placeholder="Enter age"
                  placeholderTextColor="#4B5563"
                  keyboardType="numeric"
                  returnKeyType="next"
                />

                <TextInput
                  className="bg-purple-200 w-full h-12 rounded-md px-4 text-black mb-1"
                  value={marriedSince}
                  onChangeText={setMarriedSince}
                  placeholder="Married since (years/months)"
                  placeholderTextColor="#4B5563"
                  returnKeyType="next"
                />

                <View className="flex-row items-center mb-1 bg-purple-200 rounded-md p-3">
                  <Text className="flex-1 text-base text-black">
                    Cousin Marriage
                  </Text>
                  <Switch
                    value={isCousinMarriage}
                    onValueChange={setIsCousinMarriage}
                  />
                </View>

                <TextInput
                  className="bg-purple-200 w-full h-12 rounded-md px-4 text-black mb-1"
                  value={referredBy}
                  onChangeText={setReferredBy}
                  placeholder="Referred by"
                  placeholderTextColor="#4B5563"
                  returnKeyType="next"
                />

                <TextInput
                  className="bg-purple-200 w-full h-12 rounded-md px-4 text-black mb-1"
                  value={date}
                  onChangeText={setDate}
                  placeholder="Date (YYYY-MM-DD)"
                  placeholderTextColor="#4B5563"
                  returnKeyType="done"
                />
              </View>
            )}

            {/* Patient Identification Toggle Button */}
            <TouchableOpacity
              className="bg-purple-400 p-3 rounded-md mb-1 mt-5"
              onPress={() =>
                setShowPatientIdentification(!showPatientIdentification)
              }
            >
              <Text className="text-lg font-semibold text-black">
                {showPatientIdentification ? "▼" : "▶"} Patient Identification
              </Text>
            </TouchableOpacity>

            {/* Patient Identification Collapsible Section */}
            {showPatientIdentification && (
              <View>
                <TextInput
                  className="bg-purple-200 w-full h-12 rounded-md px-4 text-black mb-1"
                  value={relation}
                  onChangeText={setRelation}
                  placeholder="W/O or D/O"
                  placeholderTextColor="#4B5563"
                  returnKeyType="next"
                />

                <TextInput
                  className="bg-purple-200 w-full rounded-md px-4 text-black mb-1"
                  style={{
                    minHeight: 60,
                    textAlignVertical: "top",
                    paddingTop: 12,
                  }}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Address"
                  placeholderTextColor="#4B5563"
                  multiline
                  numberOfLines={3}
                  returnKeyType="next"
                />

                <TextInput
                  className="bg-purple-200 w-full h-12 rounded-md px-4 text-black mb-1"
                  value={telephone}
                  onChangeText={setTelephone}
                  placeholder="Telephone"
                  placeholderTextColor="#4B5563"
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />

                <TextInput
                  className="bg-purple-200 w-full h-12 rounded-md px-4 text-black mb-1"
                  value={bloodGroup}
                  onChangeText={setBloodGroup}
                  placeholder="Blood Group (A+, B+, O-, etc.)"
                  placeholderTextColor="#4B5563"
                  returnKeyType="next"
                />

                <TextInput
                  className="bg-purple-200 w-full h-12 rounded-md px-4 text-black mb-1"
                  value={husbandName}
                  onChangeText={setHusbandName}
                  placeholder="Husband's Name"
                  placeholderTextColor="#4B5563"
                  returnKeyType="next"
                />

                <TextInput
                  className="bg-purple-200 w-full h-12 rounded-md px-4 text-black mb-1"
                  value={emergencyContact}
                  onChangeText={setEmergencyContact}
                  placeholder="Emergency Contact"
                  placeholderTextColor="#4B5563"
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />

                <TextInput
                  className="bg-purple-200 w-full h-12 rounded-md px-4 text-black mb-1"
                  value={occupation}
                  onChangeText={setOccupation}
                  placeholder="Occupation"
                  placeholderTextColor="#4B5563"
                  returnKeyType="done"
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>

            
    </View>
  );
};

export default AntenatalForm;
