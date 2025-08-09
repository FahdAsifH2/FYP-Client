import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { format } from "date-fns";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Background from "../components/Background";
import Icon from "react-native-vector-icons/FontAwesome";
const AntenatalForm = () => {
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [showPatientIdentification, setShowPatientIdentification] =
    useState(false);
  const [showPatientComplaint, setShowPatientComplaint] = useState(false);
  const [showObstetricHistory, setShowObstetricHistory] = useState(false);
  const [showLastMontPeriod, setShowLastMontPeriod] = useState(false);
  const [showFamilyHistory, setShowFamilyHistory] = useState(false);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
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

  // Patient Complaint state
  const [complaint, setComplaint] = useState("");

  //Obttetric_History Data
  const [year, setYear] = useState("");
  const [isFullTerm, setIsFullTerm] = useState(true);
  const [modeOfDelivery, setModeOfDelivery] = useState("SVD");
  const [complications, setComplications] = useState("");
  const [gender, setGender] = useState("Female");
  const [status, setStatus] = useState("Alive");
  const [termModalVisible, setTermModalVisible] = useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [showGyneHistory, setShowGyneHistory] = useState(false);

  //Gynecologicla history
  const [menstrualCycle, setMenstrualCycle] = useState("Regular");
  const [pcos, setPcos] = useState(false); // true/false
  const [fibroids, setFibroids] = useState(false);
  const [menopause, setMenopause] = useState(false);
  const [postSterilization, setPostSterilization] = useState(false);
  const [contraception, setContraception] = useState("None");
  const [complicationsGyne, setComplicationsGyne] = useState("None");

  // Add these state variables for modal visibility
  const [menstrualCycleModalVisible, setMenstrualCycleModalVisible] =
    useState(false);
  const [pcosModalVisible, setPcosModalVisible] = useState(false);
  const [fibroidsModalVisible, setFibroidsModalVisible] = useState(false);
  const [menopauseModalVisible, setMenopauseModalVisible] = useState(false);
  const [postSterilizationModalVisible, setPostSterilizationModalVisible] =
    useState(false);
  const [contraceptionModalVisible, setContraceptionModalVisible] =
    useState(false);
  4;

  //Pregnancu data
  const [LastMonthPeriod, setLastMonthPeriod] = useState(date);
  const [ExpectedDateOfDelievery, setExpectedDateOfDelievery] = useState(date);

  //Family Hisotry
  const [history, setHistory] = useState({
    dm: false,
    htn: false,
    cancer: false,
    twins: false,
    specialChild: false,
    thalassemia: false,
  });
  const toggleCheckbox = (name) => {
    setHistory((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  //Medical history
  const [medicalHistory, setMedicalHistory] = useState({
    drugAllergy: false,
    chickenPox: false,
    htn: false,
    dm: false,
    thyroid: false,
    others: false,
  });

  //details
  const [showPhysicalExam, setShowPhysicalExam] = useState(false);
  const [pallor, setPallor] = useState("");
  const [thyroid, setThyroid] = useState("");
  const [edema, setEdema] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) return "N/A";
    const heightInMeters = parseFloat(height) / 100;
    return (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(1);
  };

  //gyen visits
  const [showAntenatalVisits, setShowAntenatalVisits] = useState(false);
  const [showVisitDatePicker, setShowVisitDatePicker] = useState(false);
  const [visits, setVisits] = useState({
    bookingScanDone: false,
    ntScanDone: false,
    anomalyScanDone: false,
    weeks28Done: false,
    weeks34Done: false,
    termDone: false,
    edd: "",
    presentation: "",
    positionStation: "",
    bimanualFindings: "",
    visitDate: null,
  });
  const [antenatalVisits, setAntenatalVisits] = useState({
    firstVisit: false,
    secondVisit: false,
    thirdVisit: false,
    fourthVisit: false,
    fifthVisit: false,
    sixthVisit: false,
    additionalVisits: false,
  });
  const VisitInputField = ({ label, value, onChange, placeholder }) => (
    <View className="flex-row items-center mb-2">
      <Text className="text-gray-600 w-16">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        className="border border-purple-500 rounded p-2 text-gray-700 flex-1"
        placeholder={placeholder}
      />
    </View>
  );
  const VisitSection = ({ label, checked, onToggle, children }) => (
    <View className="mb-3">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row items-center mb-2"
      >
        <Checkbox checked={checked} />
        <Text className="text-gray-700 font-medium ml-2">{label}</Text>
      </TouchableOpacity>
      {checked && <View className="ml-6">{children}</View>}
    </View>
  );
  const updateVisit = (key, value) => {
    setVisits((prev) => ({
      ...prev,
      [key]: value, // immutably update text fields
    }));
  };
  const Checkbox = ({ checked }) => (
    <View
      className={`w-5 h-5 rounded-md border-2 border-purple-500 
      ${checked ? "bg-purple-500" : "bg-transparent"} items-center justify-center`}
    >
      {checked && <Text className="text-white">✓</Text>}
    </View>
  );

  return (
    <View className="flex-1">
      <Background />
      <Navbar />
      <Footer />
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
                  {showPatientIdentification ? "▼" : "▶"} Patient
                  Identification
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

              <TouchableOpacity
                className="bg-purple-400 p-3 rounded-md mb-1 mt-5"
                onPress={() => {
                  setShowPatientComplaint(!showPatientComplaint);
                }}
              >
                <Text className="text-lg font-semibold text-black">
                  {(() => {
                    if (showPatientComplaint) {
                      return "▼ Patient Complaint";
                    } else {
                      return "▶ Patient Complaint";
                    }
                  })()}
                </Text>
              </TouchableOpacity>

              {/* Patient Complaint Collapsible Section */}
              {(() => {
                if (showPatientComplaint) {
                  return (
                    <View>
                      <TextInput
                        className="bg-purple-200 w-full h-24 rounded-md px-4 pt-3 text-black mb-1"
                        value={complaint}
                        onChangeText={setComplaint}
                        placeholder="Enter Patient Complain if any"
                        placeholderTextColor="#4B5563"
                        multiline
                        returnKeyType="done"
                      />
                    </View>
                  );
                }
              })()}

              <TouchableOpacity
                className="bg-purple-400 p-3 rounded-md mb-1 mt-5"
                onPress={() => {
                  setShowObstetricHistory(!showObstetricHistory);
                }}
              >
                <Text className="text-lg font-semibold text-black">
                  {(() => {
                    if (showObstetricHistory) {
                      return "▼ Obstetric History";
                    } else {
                      return "▶ Obstetric History";
                    }
                  })()}
                </Text>
              </TouchableOpacity>

              {(() => {
                if (showObstetricHistory) {
                  return (
                    <>
                      <View style={{ paddingHorizontal: 4 }}>
                        <TextInput
                          style={{
                            backgroundColor: "#E9D5FF", // bg-purple-200 equivalent
                            width: "100%",
                            borderRadius: 6,
                            paddingHorizontal: 16,
                            color: "black",
                            marginBottom: 12,
                            height: 48,
                            fontSize: Platform.OS === "ios" ? 16 : 14,
                          }}
                          value={year}
                          onChangeText={setYear}
                          placeholder="Year"
                          placeholderTextColor="#6B7280"
                          keyboardType="numeric"
                          returnKeyType="next"
                        />

                        <TouchableOpacity
                          style={{
                            backgroundColor: "#E9D5FF",
                            borderRadius: 6,
                            marginBottom: 12,
                            paddingHorizontal: 16,
                            justifyContent: "center",
                            height: 48,
                          }}
                          onPress={() => setTermModalVisible(true)}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: "#374151" }}>
                            {isFullTerm ? "Full Term" : "Preterm"}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            backgroundColor: "#E9D5FF",
                            borderRadius: 6,
                            marginBottom: 12,
                            paddingHorizontal: 16,
                            justifyContent: "center",
                            height: 48,
                          }}
                          onPress={() => setDeliveryModalVisible(true)}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: "#374151" }}>
                            {modeOfDelivery || "Mode of Delivery"}
                          </Text>
                        </TouchableOpacity>

                        <TextInput
                          style={{
                            backgroundColor: "#E9D5FF",
                            width: "100%",
                            borderRadius: 6,
                            paddingHorizontal: 16,
                            color: "black",
                            marginBottom: 12,
                            minHeight: 80,
                            textAlignVertical: "top",
                            paddingTop: 12,
                            fontSize: Platform.OS === "ios" ? 16 : 14,
                          }}
                          value={complications}
                          onChangeText={setComplications}
                          placeholder="Complications (if any)"
                          placeholderTextColor="#6B7280"
                          multiline
                          numberOfLines={3}
                          returnKeyType="next"
                        />

                        <TouchableOpacity
                          style={{
                            backgroundColor: "#E9D5FF",
                            borderRadius: 6,
                            marginBottom: 12,
                            paddingHorizontal: 16,
                            justifyContent: "center",
                            height: 48,
                          }}
                          onPress={() => setGenderModalVisible(true)}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: "#374151" }}>
                            {gender || "Gender"}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            backgroundColor: "#E9D5FF",
                            borderRadius: 6,
                            marginBottom: 12,
                            paddingHorizontal: 16,
                            justifyContent: "center",
                            height: 48,
                          }}
                          onPress={() => setStatusModalVisible(true)}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: "#374151" }}>
                            {status || "Status"}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Term Modal */}
                      <Modal
                        visible={termModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setTermModalVisible(false)}
                      >
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                          }}
                          activeOpacity={1}
                          onPress={() => setTermModalVisible(false)}
                        >
                          <View
                            style={{
                              backgroundColor: "white",
                              borderTopLeftRadius: 24,
                              borderTopRightRadius: 24,
                              padding: 16,
                            }}
                          >
                            <TouchableOpacity
                              style={{ padding: 16 }}
                              onPress={() => {
                                setIsFullTerm(true);
                                setTermModalVisible(false);
                              }}
                            >
                              <Text style={{ fontSize: 18 }}>Full Term</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{ padding: 16 }}
                              onPress={() => {
                                setIsFullTerm(false);
                                setTermModalVisible(false);
                              }}
                            >
                              <Text style={{ fontSize: 18 }}>Preterm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                padding: 16,
                                backgroundColor: "#E5E7EB",
                                borderRadius: 8,
                                marginTop: 16,
                              }}
                              onPress={() => setTermModalVisible(false)}
                            >
                              <Text style={{ textAlign: "center" }}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      </Modal>

                      {/* Delivery Mode Modal */}
                      <Modal
                        visible={deliveryModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setDeliveryModalVisible(false)}
                      >
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                          }}
                          activeOpacity={1}
                          onPress={() => setDeliveryModalVisible(false)}
                        >
                          <View
                            style={{
                              backgroundColor: "white",
                              borderTopLeftRadius: 24,
                              borderTopRightRadius: 24,
                              padding: 16,
                            }}
                          >
                            {["SVD", "C-Section", "Forceps", "Vacuum"].map(
                              (mode) => (
                                <TouchableOpacity
                                  key={mode}
                                  style={{ padding: 16 }}
                                  onPress={() => {
                                    setModeOfDelivery(mode);
                                    setDeliveryModalVisible(false);
                                  }}
                                >
                                  <Text style={{ fontSize: 18 }}>{mode}</Text>
                                </TouchableOpacity>
                              )
                            )}
                            <TouchableOpacity
                              style={{
                                padding: 16,
                                backgroundColor: "#E5E7EB",
                                borderRadius: 8,
                                marginTop: 16,
                              }}
                              onPress={() => setDeliveryModalVisible(false)}
                            >
                              <Text style={{ textAlign: "center" }}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      </Modal>

                      {/* Gender Modal */}
                      <Modal
                        visible={genderModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setGenderModalVisible(false)}
                      >
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                          }}
                          activeOpacity={1}
                          onPress={() => setGenderModalVisible(false)}
                        >
                          <View
                            style={{
                              backgroundColor: "white",
                              borderTopLeftRadius: 24,
                              borderTopRightRadius: 24,
                              padding: 16,
                            }}
                          >
                            <TouchableOpacity
                              style={{ padding: 16 }}
                              onPress={() => {
                                setGender("Female");
                                setGenderModalVisible(false);
                              }}
                            >
                              <Text style={{ fontSize: 18 }}>Female</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{ padding: 16 }}
                              onPress={() => {
                                setGender("Male");
                                setGenderModalVisible(false);
                              }}
                            >
                              <Text style={{ fontSize: 18 }}>Male</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                padding: 16,
                                backgroundColor: "#E5E7EB",
                                borderRadius: 8,
                                marginTop: 16,
                              }}
                              onPress={() => setGenderModalVisible(false)}
                            >
                              <Text style={{ textAlign: "center" }}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      </Modal>

                      {/* Status Modal */}
                      <Modal
                        visible={statusModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setStatusModalVisible(false)}
                      >
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                          }}
                          activeOpacity={1}
                          onPress={() => setStatusModalVisible(false)}
                        >
                          <View
                            style={{
                              backgroundColor: "white",
                              borderTopLeftRadius: 24,
                              borderTopRightRadius: 24,
                              padding: 16,
                            }}
                          >
                            <TouchableOpacity
                              style={{ padding: 16 }}
                              onPress={() => {
                                setStatus("Alive");
                                setStatusModalVisible(false);
                              }}
                            >
                              <Text style={{ fontSize: 18 }}>Alive</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{ padding: 16 }}
                              onPress={() => {
                                setStatus("Still Birth");
                                setStatusModalVisible(false);
                              }}
                            >
                              <Text style={{ fontSize: 18 }}>Still Birth</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                padding: 16,
                                backgroundColor: "#E5E7EB",
                                borderRadius: 8,
                                marginTop: 16,
                              }}
                              onPress={() => setStatusModalVisible(false)}
                            >
                              <Text style={{ textAlign: "center" }}>
                                Cancel
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      </Modal>
                    </>
                  );
                } else {
                  return null;
                }
              })()}

              <TouchableOpacity
                className="bg-purple-400 p-3 rounded-md mb-1 mt-5"
                onPress={() => {
                  setShowGyneHistory(!showGyneHistory);
                }}
              >
                {/* Gyne Data drop down */}
                <Text className="text-lg font-semibold text-black">
                  {(() => {
                    if (showGyneHistory) {
                      return "▼ Patient Gyne Info";
                    } else {
                      return "▶ Patient Gyne Info";
                    }
                  })()}
                </Text>
              </TouchableOpacity>

              {(() => {
                const [complicationsGyne, setComplicationsGyne] =
                  useState("None");

                if (!showGyneHistory) return null;

                const modalConfig = [
                  {
                    key: "menstrualCycle",
                    label: "Menstrual Cycle",
                    value: menstrualCycle,
                    setter: setMenstrualCycle,
                    visible: menstrualCycleModalVisible,
                    setVisible: setMenstrualCycleModalVisible,
                    options: ["Regular", "Irregular"],
                  },
                  {
                    key: "pcos",
                    label: "PCOS",
                    value: pcos ? "Yes" : "No",
                    setter: setPcos,
                    visible: pcosModalVisible,
                    setVisible: setPcosModalVisible,
                    options: [true, false],
                    labels: ["Yes", "No"],
                  },
                  {
                    key: "fibroids",
                    label: "Fibroids",
                    value: fibroids ? "Yes" : "No",
                    setter: setFibroids,
                    visible: fibroidsModalVisible,
                    setVisible: setFibroidsModalVisible,
                    options: [true, false],
                    labels: ["Yes", "No"],
                  },
                  {
                    key: "menopause",
                    label: "Menopause",
                    value: menopause ? "Yes" : "No",
                    setter: setMenopause,
                    visible: menopauseModalVisible,
                    setVisible: setMenopauseModalVisible,
                    options: [true, false],
                    labels: ["Yes", "No"],
                  },
                  {
                    key: "postSterilization",
                    label: "Post Sterilization",
                    value: postSterilization ? "Yes" : "No",
                    setter: setPostSterilization,
                    visible: postSterilizationModalVisible,
                    setVisible: setPostSterilizationModalVisible,
                    options: [true, false],
                    labels: ["Yes", "No"],
                  },
                  {
                    key: "contraception",
                    label: "Contraception",
                    value: contraception,
                    setter: setContraception,
                    visible: contraceptionModalVisible,
                    setVisible: setContraceptionModalVisible,
                    options: [
                      "None",
                      "Oral Pills",
                      "IUD",
                      "Condoms",
                      "Injectable",
                      "Implant",
                      "Sterilization",
                    ],
                  },
                ];

                const buttonStyle = {
                  backgroundColor: "#E9D5FF",
                  borderRadius: 6,
                  marginBottom: 12,
                  paddingHorizontal: 16,
                  justifyContent: "center",
                  height: 48,
                };
                const textStyle = { color: "#374151" };
                const modalOverlayStyle = {
                  flex: 1,
                  justifyContent: "flex-end",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                };
                const modalContentStyle = {
                  backgroundColor: "white",
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 16,
                };
                const optionStyle = { padding: 16 };
                const optionTextStyle = { fontSize: 18 };
                const cancelButtonStyle = {
                  padding: 16,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 8,
                  marginTop: 16,
                };

                return (
                  <>
                    <View style={{ paddingHorizontal: 4 }}>
                      {modalConfig.map(({ key, label, value }) => (
                        <TouchableOpacity
                          key={key}
                          style={buttonStyle}
                          onPress={() =>
                            modalConfig
                              .find((m) => m.key === key)
                              .setVisible(true)
                          }
                          activeOpacity={0.7}
                        >
                          <Text style={textStyle}>
                            {label}: {value}
                          </Text>
                        </TouchableOpacity>
                      ))}

                      {/* Complications Input Field */}
                      <View style={{ marginBottom: 12 }}>
                        <Text
                          style={{
                            ...textStyle,
                            marginBottom: 8,
                            fontSize: 16,
                            fontWeight: "500",
                          }}
                        >
                          Complications:
                        </Text>
                        <TextInput
                          style={{
                            backgroundColor: "#E9D5FF",
                            borderRadius: 6,
                            paddingHorizontal: 16,
                            height: 48,
                            color: "#374151",
                            fontSize: 16,
                          }}
                          value={complicationsGyne}
                          onChangeText={setComplicationsGyne}
                          placeholder="Enter complications (if any)"
                          placeholderTextColor="#9CA3AF"
                        />
                      </View>
                    </View>

                    {modalConfig.map(
                      ({
                        key,
                        label,
                        visible,
                        setVisible,
                        options,
                        setter,
                        labels,
                      }) => (
                        <Modal
                          key={key}
                          visible={visible}
                          transparent
                          animationType="slide"
                          onRequestClose={() => setVisible(false)}
                        >
                          <TouchableOpacity
                            style={modalOverlayStyle}
                            activeOpacity={1}
                            onPress={() => setVisible(false)}
                          >
                            <View style={modalContentStyle}>
                              {options.map((option, index) => (
                                <TouchableOpacity
                                  key={index}
                                  style={optionStyle}
                                  onPress={() => {
                                    setter(option);
                                    setVisible(false);
                                  }}
                                >
                                  <Text style={optionTextStyle}>
                                    {labels ? labels[index] : option}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                              <TouchableOpacity
                                style={cancelButtonStyle}
                                onPress={() => setVisible(false)}
                              >
                                <Text style={{ textAlign: "center" }}>
                                  Cancel
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </TouchableOpacity>
                        </Modal>
                      )
                    )}
                  </>
                );
              })()}

              {/*Period Details*/}
              <TouchableOpacity
                className="bg-purple-400 p-3 rounded-md mb-1 mt-5"
                onPress={() => {
                  setShowLastMontPeriod(!showLastMontPeriod);
                }}
              >
                <Text className="text-lg font-semibold text-black">
                  {(() => {
                    if (showLastMontPeriod) {
                      return "▼ Last Month Period";
                    } else {
                      return "▶ Last Month Period";
                    }
                  })()}
                </Text>
              </TouchableOpacity>

              {(() => {
                if (showLastMontPeriod) {
                  return (
                    <>
                      <View style={{ paddingHorizontal: 4 }}>
                        {/* Last Month Period */}
                        <View style={{ marginBottom: 12 }}>
                          <Text
                            style={{
                              color: "#374151",
                              marginBottom: 8,
                              fontSize: 16,
                              fontWeight: "500",
                            }}
                          >
                            Last Month Period:
                          </Text>
                          <TextInput
                            style={{
                              backgroundColor: "#E9D5FF",
                              borderRadius: 6,
                              paddingHorizontal: 16,
                              height: 48,
                              color: "#374151",
                              fontSize: 16,
                            }}
                            value={LastMonthPeriod}
                            onChangeText={setLastMonthPeriod}
                            placeholder="Enter date"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>

                        {/* Expected Date of Delivery */}
                        <View style={{ marginBottom: 12 }}>
                          <Text
                            style={{
                              color: "#374151",
                              marginBottom: 8,
                              fontSize: 16,
                              fontWeight: "500",
                            }}
                          >
                            Expected Date of Delivery:
                          </Text>
                          <TextInput
                            style={{
                              backgroundColor: "#E9D5FF",
                              borderRadius: 6,
                              paddingHorizontal: 16,
                              height: 48,
                              color: "#374151",
                              fontSize: 16,
                            }}
                            value={ExpectedDateOfDelievery}
                            onChangeText={setExpectedDateOfDelievery}
                            placeholder="Enter date"
                            placeholderTextColor="#9CA3AF"
                          />
                        </View>
                      </View>
                    </>
                  );
                } else {
                  return null;
                }
              })()}

              {/*Family History*/}
              <TouchableOpacity
                className="bg-purple-400 p-3 rounded-md mb-1 mt-5"
                onPress={() => {
                  setShowFamilyHistory(!showFamilyHistory);
                }}
              >
                <Text className="text-lg font-semibold text-black">
                  {showFamilyHistory ? "▼ Family History" : "▶ Family History"}
                </Text>
              </TouchableOpacity>
              {showFamilyHistory && (
                <View
                  style={{
                    backgroundColor: "#E9D5FF",
                    padding: 12,
                    borderRadius: 6,
                  }}
                >
                  {[
                    { label: "DM", key: "dm" },
                    { label: "HTN", key: "htn" },
                    { label: "Cancer", key: "cancer" },
                    { label: "Twins", key: "twins" },
                    { label: "Special Child", key: "specialChild" },
                    { label: "Thalassemia", key: "thalassemia" },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => toggleCheckbox(item.key)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                      activeOpacity={0.7}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: "#8B5CF6",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: history[item.key]
                            ? "#8B5CF6"
                            : "transparent",
                        }}
                      >
                        {history[item.key] && (
                          <Text
                            style={{
                              color: "white",
                              fontSize: 14,
                              fontWeight: "bold",
                            }}
                          >
                            ✓
                          </Text>
                        )}
                      </View>
                      <Text style={{ marginLeft: 8, color: "#374151" }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Medial Historhy*/}
              <TouchableOpacity
                className="bg-purple-400 p-3 rounded-md mb-1 mt-5"
                onPress={() => {
                  setShowMedicalHistory(!showMedicalHistory);
                }}
              >
                <Text className="text-lg font-semibold text-black">
                  {(() => {
                    if (showMedicalHistory) {
                      return "▼ Last Month Period";
                    } else {
                      return "▶ Last Month Period";
                    }
                  })()}
                </Text>
              </TouchableOpacity>

              {showMedicalHistory && (
                <View
                  style={{
                    backgroundColor: "#E9D5FF",
                    padding: 12,
                    borderRadius: 6,
                  }}
                >
                  {[
                    { label: "Drug Allergy", key: "drugAllergy" },
                    { label: "Chicken Pox", key: "chickenPox" },
                    { label: "HTN", key: "htn" },
                    { label: "DM", key: "dm" },
                    { label: "Thyroid", key: "thyroid" },
                    { label: "Others", key: "others" },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() =>
                        setMedicalHistory((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }))
                      }
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                      activeOpacity={0.7}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: "#8B5CF6",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: medicalHistory[item.key]
                            ? "#8B5CF6"
                            : "transparent",
                        }}
                      >
                        {medicalHistory[item.key] && (
                          <Text
                            style={{
                              color: "white",
                              fontSize: 14,
                              fontWeight: "bold",
                            }}
                          >
                            ✓
                          </Text>
                        )}
                      </View>
                      <Text style={{ marginLeft: 8, color: "#374151" }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {/* Physical Examination */}
              <TouchableOpacity
                className="bg-purple-400 p-3 rounded-md mb-1 mt-5"
                onPress={() => setShowPhysicalExam(!showPhysicalExam)}
              >
                <Text className="text-lg font-semibold text-black">
                  {showPhysicalExam
                    ? "▼ Physical Examination"
                    : "▶ Physical Examination"}
                </Text>
              </TouchableOpacity>
              {showPhysicalExam && (
                <View
                  style={{
                    backgroundColor: "#F3E8FF",
                    padding: 12,
                    borderRadius: 6,
                  }}
                >
                  {/* Checkboxes Section */}
                  <View style={{ marginBottom: 16 }}>
                    {[
                      {
                        label: "Pallor",
                        key: "pallor",
                        options: ["Present", "Absent"],
                        setter: setPallor,
                        value: pallor,
                      },
                      {
                        label: "Thyroid",
                        key: "thyroid",
                        options: ["Normal", "Enlarged"],
                        setter: setThyroid,
                        value: thyroid,
                      },
                      {
                        label: "Edema",
                        key: "edema",
                        options: ["Present", "Absent"],
                        setter: setEdema,
                        value: edema,
                      },
                    ].map((item) => (
                      <View key={item.key} style={{ marginBottom: 12 }}>
                        <Text style={{ color: "#374151", marginBottom: 4 }}>
                          {item.label}:
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                          }}
                        >
                          {item.options.map((option) => (
                            <TouchableOpacity
                              key={option}
                              onPress={() => item.setter(option)}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                              activeOpacity={0.7}
                            >
                              <View
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: 8,
                                  borderWidth: 2,
                                  borderColor: "#8B5CF6",
                                  marginRight: 6,
                                  backgroundColor:
                                    item.value === option
                                      ? "#8B5CF6"
                                      : "transparent",
                                }}
                              />
                              <Text style={{ color: "#374151" }}>{option}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Input Fields Section */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ width: "32%" }}>
                      <Text style={{ color: "#374151", marginBottom: 4 }}>
                        Ht (cm):
                      </Text>
                      <TextInput
                        value={height}
                        onChangeText={setHeight}
                        keyboardType="numeric"
                        style={{
                          borderWidth: 1,
                          borderColor: "#8B5CF6",
                          borderRadius: 4,
                          padding: 8,
                          color: "#374151",
                        }}
                        placeholder="Height"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <View style={{ width: "32%" }}>
                      <Text style={{ color: "#374151", marginBottom: 4 }}>
                        Wt (kg):
                      </Text>
                      <TextInput
                        value={weight}
                        onChangeText={setWeight}
                        keyboardType="numeric"
                        style={{
                          borderWidth: 1,
                          borderColor: "#8B5CF6",
                          borderRadius: 4,
                          padding: 8,
                          color: "#374151",
                        }}
                        placeholder="Weight"
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                    <View style={{ width: "32%" }}>
                      <Text style={{ color: "#374151", marginBottom: 4 }}>
                        BMI:
                      </Text>
                      <Text
                        style={{
                          borderWidth: 1,
                          borderColor: "#8B5CF6",
                          borderRadius: 4,
                          padding: 8,
                          color: "#374151",
                          backgroundColor: "#F3E8FF",
                        }}
                      >
                        {calculateBMI()}
                      </Text>
                    </View>
                  </View>

                  {/* Blood Pressure - Full Width */}
                  <View>
                    <Text style={{ color: "#374151", marginBottom: 4 }}>
                      B.P. (mmHg):
                    </Text>
                    <TextInput
                      value={bloodPressure}
                      onChangeText={setBloodPressure}
                      style={{
                        borderWidth: 1,
                        borderColor: "#8B5CF6",
                        borderRadius: 4,
                        padding: 8,
                        color: "#374151",
                      }}
                      placeholder="e.g. 120/80"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              )}

              {/* Antenatal Visits */}
              <TouchableOpacity
                className="bg-purple-400 p-3 rounded-md mb-1 mt-5"
                onPress={() => setShowAntenatalVisits(!showAntenatalVisits)}
              >
                <Text className="text-lg font-semibold text-black">
                  {showAntenatalVisits
                    ? "▼ Antenatal Visits"
                    : "▶ Antenatal Visits"}
                </Text>
              </TouchableOpacity>

              {showAntenatalVisits && (
                <View
                  style={{
                    backgroundColor: "#E9D5FF",
                    padding: 12,
                    borderRadius: 6,
                  }}
                >
                  {[
                    { label: "Booking Scan:", key: "bookingScan" },
                    { label: "NT Scan:", key: "ntScan" },
                    { label: "Anomaly Scan:", key: "anomalyScan" },
                    { label: "28 Weeks:", key: "twentyEightWeeks" },
                    { label: "34 Weeks:", key: "thirtyFourWeeks" },
                    { label: "Term:", key: "term" },
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      onPress={() => toggleCheckbox(item.key)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                      activeOpacity={0.7}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          borderWidth: 2,
                          borderColor: "#8B5CF6",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: history[item.key]
                            ? "#8B5CF6"
                            : "transparent",
                        }}
                      >
                        {history[item.key] && (
                          <Text
                            style={{
                              color: "white",
                              fontSize: 14,
                              fontWeight: "bold",
                            }}
                          >
                            ✓
                          </Text>
                        )}
                      </View>
                      <Text style={{ marginLeft: 8, color: "#374151" }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {/* Save Button */}
              <TouchableOpacity
                className="bg-green-500 p-4 rounded-md mt-6"
                onPress={() => {
                  console.log({
                    // Patient Info
                    patientInfo: {
                      patientName,
                      age,
                      marriedSince,
                      isCousinMarriage,
                      referredBy,
                      date,
                    },

                    // Patient Identification
                    patientIdentification: {
                      relation,
                      address,
                      telephone,
                      bloodGroup,
                      husbandName,
                      emergencyContact,
                      occupation,
                    },

                    // Patient Complaint
                    complaint,

                    // Obstetric History
                    obstetricHistory: {
                      year,
                      isFullTerm,
                      modeOfDelivery,
                      complications,
                      gender,
                      status,
                      modals: {
                        termModalVisible,
                        deliveryModalVisible,
                        genderModalVisible,
                        statusModalVisible,
                      },
                      showGyneHistory,
                    },

                    // Gynecological History
                    gynecologicalHistory: {
                      menstrualCycle,
                      pcos,
                      fibroids,
                      menopause,
                      postSterilization,
                      contraception,
                      complicationsGyne,
                      modals: {
                        menstrualCycleModalVisible,
                        pcosModalVisible,
                        fibroidsModalVisible,
                        menopauseModalVisible,
                        postSterilizationModalVisible,
                        contraceptionModalVisible,
                      },
                    },

                    // Pregnancy Data
                    pregnancyData: {
                      LastMonthPeriod,
                      ExpectedDateOfDelievery,
                    },

                    // Family History
                    familyHistory: history,

                    // Medical History
                    medicalHistory,

                    // Physical Exam
                    physicalExam: {
                      showPhysicalExam,
                      pallor,
                      thyroid,
                      edema,
                      height,
                      weight,
                      bloodPressure,
                      bmi: calculateBMI(),
                    },

                    // Antenatal Visits
                    antenatalVisits: {
                      showAntenatalVisits,
                      showVisitDatePicker,
                      visits,
                    },
                  });
                  Alert.alert("Test", "Button pressed!"); // Add this temporary alert
                }}
              >
                <Text className="text-lg font-semibold text-white text-center">
                  Save Form
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AntenatalForm;
