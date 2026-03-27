import React, { useState, useEffect } from "react";
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import config from '../_config/config';

import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

const anenatalAPI = {
  async saveAntenatalCard(
    formData,
    checkboxStates,
    obhRows,
    investigationRows
  ) {
    try {
      const payload = {
        patientInfo: {
          patientName: formData.patientName,
          guardianName: formData.guardianName,
          guardianType: formData.guardianType,
          age: formData.age,
          marriedSince: formData.marriedSince,
          cousinMarriage: formData.cousinMarriage,
          address: formData.address,
          tel: formData.tel,
          bloodGroup: formData.bloodGroup,
          husbandName: formData.husbandName,
          husbandBloodGroup: formData.husbandBloodGroup,
          patientOccupation: formData.patientOccupation,
          husbandOccupation: formData.husbandOccupation,
          refBy: formData.refBy,
          date: formData.date,
          p: formData.p,
        },

        medicalInfo: {
          complaints: formData.complaints,
          lmp: formData.lmp,
          edd: formData.edd,
          riskFactors: formData.riskFactors,
          medications: formData.medications,
          surgicalHistory: formData.surgicalHistory,
          diagnosis: formData.diagnosis,
          plan: formData.plan,
          additionalNotes: formData.additionalNotes,
        },

        vitals: {
          height: formData.height,
          weight: formData.weight,
          bp: formData.bp,
          pallor: formData.pallor,
          thyroidNormal: formData.thyroidNormal,
          thyroidNotes: formData.thyroidNotes,
          edema: formData.edema,
          edemaLocation: formData.edemaLocation,
          chestFindings: formData.chestFindings,
          breasts: formData.breasts,
        },

        scans: {
          edd: formData.scans_EDD,
          pa: formData.scans_PA,
          ps: formData.scans_PS,
          bimanual: formData.scans_Bimanual,
          scanTypes: {
            bookingScan: checkboxStates.bookingScan,
            ntScan: checkboxStates.ntScan,
            anomalyScan: checkboxStates.anomalyScan,
            scan28Weeks: checkboxStates.scan28Weeks,
            scan34Weeks: checkboxStates.scan34Weeks,
            termScan: checkboxStates.termScan,
          },
        },

        history: {
          gynaeHistory: {
            regular: checkboxStates.regular,
            irregular: checkboxStates.irregular,
            pco: checkboxStates.pco,
            hirsutism: checkboxStates.hirsutism,
            papSmear: checkboxStates.papSmear,
            contraception: checkboxStates.contraception,
          },

          familyHistory: {
            dm: checkboxStates.dm,
            htn: checkboxStates.htn,
            cancer: checkboxStates.cancer,
            twins: checkboxStates.twins,
            specialChild: checkboxStates.specialChild,
            thalassemia: checkboxStates.thalassemia,
          },
          medicalHistory: {
            drugAllergy: checkboxStates.drugAllergy,
            chickenPox: checkboxStates.chickenPox,
            htnMedical: checkboxStates.htnMedical,
            dmMedical: checkboxStates.dmMedical,
            thyroid: checkboxStates.thyroid,
            others: checkboxStates.others,
          },
        },

        obstetricHistory: obhRows.filter(
          (row) =>
            row.yrs ||
            row.term ||
            row.mod ||
            row.complications ||
            row.genderWeight ||
            row.status
        ),
        investigations: investigationRows.filter(
          (row) =>
            row.test ||
            row.date ||
            row.hb ||
            row.bsr ||
            row.urine ||
            row.ultrasound
        ),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(
        `${config.API_URL}/api/Doctors/SubmitAntenatalform`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
    } catch (err) {
      console.error("Error submitting antenatal card:", err);
      throw err;
    }
  },
};

// Simple SVG-like icons using Text components
const Check = ({ size = 16, color = "white" }) => (
  <Text style={{ fontSize: size, color, fontWeight: "bold" }}>✓</Text>
);

const Plus = ({ size = 16, color = "white" }) => (
  <Text style={{ fontSize: size, color, fontWeight: "bold" }}>+</Text>
);

const X = ({ size = 16, color = "white" }) => (
  <Text style={{ fontSize: size, color, fontWeight: "bold" }}>×</Text>
);

// Reusable Components
const TextInputField = ({
  label,
  required = false,
  placeholder = "",
  value = "",
  onChangeText,
  multiline = false,
  keyboardType = "default",
  style = {},
  testID = "",
}) => (
  <View style={[{ marginBottom: 12 }, style]}>
    <Text style={{ fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 }}>
      {label}
      {required && <Text style={{ color: '#EF4444' }}> *</Text>}
    </Text>
    <TextInput
      style={[
        {
          backgroundColor: '#F9FAFB',
          borderWidth: 1.5,
          borderColor: '#E5E7EB',
          borderRadius: 12,
          paddingHorizontal: 12,
          height: 44,
          fontSize: 14,
          color: '#111827',
        },
        multiline
          ? { height: 80, textAlignVertical: "top", paddingTop: 12 }
          : {},
      ]}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={keyboardType}
      testID={testID}
      accessibilityLabel={label}
    />
  </View>
);

const Checkbox = ({ checked, onToggle, label, testID = "" }) => (
  <TouchableOpacity
    onPress={onToggle}
    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, minHeight: 44 }}
    testID={testID}
    accessibilityLabel={label}
    accessibilityRole="checkbox"
    accessibilityState={{ checked }}
  >
    <View
      style={{
        width: 20,
        height: 20,
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: checked ? '#8B5CF6' : 'transparent',
        borderColor: checked ? '#8B5CF6' : '#E5E7EB',
      }}
    >
      {checked && <Check size={12} color="white" />}
    </View>
    <Text style={{ fontSize: 14, color: '#374151', flex: 1 }}>{label}</Text>
  </TouchableOpacity>
);

const RadioGroup = ({ options, selected, onSelect, label, testID = "" }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 8 }}>{label}</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 24, marginBottom: 8, minHeight: 44 }}
          testID={`${testID}-${option}`}
          accessibilityLabel={`${label} ${option}`}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === option }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderWidth: 2,
              borderRadius: 10,
              marginRight: 8,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: selected === option ? '#8B5CF6' : '#E5E7EB',
            }}
          >
            {selected === option && (
              <View style={{ width: 10, height: 10, backgroundColor: '#8B5CF6', borderRadius: 5 }} />
            )}
          </View>
          <Text style={{ fontSize: 14, color: '#374151' }}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const SectionCard = ({ title, children }) => (
  <View
    style={{
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 18,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.07,
      shadowRadius: 10,
      elevation: 4,
    }}
  >
    <Text
      style={{
        fontSize: 11,
        fontWeight: '800',
        color: '#8B5CF6',
        letterSpacing: 1.2,
        marginBottom: 16,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 10,
      }}
    >
      {title}
    </Text>
    {children}
  </View>
);

const TableRow = ({ children, isHeader = false, isEven = false }) => (
  <View
    style={{
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
      paddingVertical: 8,
      backgroundColor: isHeader ? '#F5F3FF' : isEven ? '#FAFAFA' : 'white',
    }}
  >
    {children}
  </View>
);

const TableCell = ({ children, flex = 1 }) => (
  <View style={{ flex, paddingHorizontal: 8 }}>
    {children}
  </View>
);

// Main Form Component
export default function AntenatalCardForm() {
  const [obhRows, setObhRows] = useState([
    {
      yrs: "",
      term: "",
      mod: "",
      complications: "",
      genderWeight: "",
      status: "",
    },
  ]);

  const [investigationRows, setInvestigationRows] = useState([
    {
      test: "Rubella IgG",
      date: "",
      hb: "",
      bsr: "",
      urine: "",
      ultrasound: "",
    },
    { test: "HBsAg", date: "", hb: "", bsr: "", urine: "", ultrasound: "" },
    { test: "HCV", date: "", hb: "", bsr: "", urine: "", ultrasound: "" },
    { test: "HIV", date: "", hb: "", bsr: "", urine: "", ultrasound: "" },
    {
      test: "Syphilis VDRL",
      date: "",
      hb: "",
      bsr: "",
      urine: "",
      ultrasound: "",
    },
    { test: "TSH", date: "", hb: "", bsr: "", urine: "", ultrasound: "" },
    { test: "Vit D3", date: "", hb: "", bsr: "", urine: "", ultrasound: "" },
    {
      test: "Thalassemia",
      date: "",
      hb: "",
      bsr: "",
      urine: "",
      ultrasound: "",
    },
    { test: "GTT", date: "", hb: "", bsr: "", urine: "", ultrasound: "" },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    riskFactors: "",
    medications: "",
    surgicalHistory: "",
    additionalNotes: "",
    diagnosis: "",
    plan: "",

    pallor: "",
    thyroidNormal: true,
    thyroidNotes: "",
    edema: "",
    edemaLocation: "",
    chestFindings: "",
    breasts: "",
    //scans
    scans_EDD: "",
    scans_PA: "",
    scans_PS: "",
    scans_Bimanual: "",
  });
  const [checkboxStates, setCheckboxStates] = useState({
    regular: false,
    irregular: false,
    pco: false,
    hirsutism: false,
    papSmear: false,
    contraception: false,
    dm: false,
    htn: false,
    cancer: false,
    twins: false,
    specialChild: false,
    thalassemia: false,
    vaccinated: false,
    recovered: false,
    drugAllergy: false,
    chickenPox: false,
    htnMedical: false,
    dmMedical: false,
    thyroid: false,
    others: false,
    bookingScan: false,
    ntScan: false,
    anomalyScan: false,
    scan28Weeks: false,
    scan34Weeks: false,
    termScan: false,
  });

  const [bmi, setBmi] = useState("");

  // Calculate BMI when height or weight changes
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInM = formData.height / 100;
      const calculatedBmi = formData.weight / (heightInM * heightInM);
      setBmi(calculatedBmi.toFixed(1));
    } else {
      setBmi("");
    }
  }, [formData.height, formData.weight]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCheckbox = (key) => {
    setCheckboxStates((prev) => {
      const newState = { ...prev, [key]: !prev[key] };

      // Handle exclusive selection for regular/irregular
      if (key === "regular" && newState.regular) {
        newState.irregular = false;
      } else if (key === "irregular" && newState.irregular) {
        newState.regular = false;
      }

      return newState;
    });
  };

  const addObhRow = () => {
    setObhRows([
      ...obhRows,
      {
        yrs: "",
        term: "",
        mod: "",
        complications: "",
        genderWeight: "",
        status: "",
      },
    ]);
  };

  const updateObhRow = (index, field, value) => {
    const newRows = [...obhRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setObhRows(newRows);
  };

  const addInvestigationRow = () => {
    setInvestigationRows([
      ...investigationRows,
      { test: "", date: "", hb: "", bsr: "", urine: "", ultrasound: "" },
    ]);
  };

  const updateInvestigationRow = (index, field, value) => {
    const newRows = [...investigationRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setInvestigationRows(newRows);
  };

  const handleSave = async () => {
    // // Basic validation
    // const requiredFields = {
    //   patientName: formData.patientName,
    //   guardianName: formData.guardianName,
    //   age: formData.age,
    //   tel: formData.tel,
    //   bloodGroup: formData.bloodGroup,
    //   lmp: formData.lmp,
    //   edd: formData.edd,
    // };

    // const missingFields = Object.keys(requiredFields).filter(
    //   (key) => !requiredFields[key] || requiredFields[key] === ""
    // );

    // if (missingFields.length > 0) {
    //   Alert.alert(
    //     "Validation Error",
    //     "Please fill in all required fields marked with *"
    //   );
    //   return;
    // }

    // if (formData.age && (formData.age < 18 || formData.age > 55)) {
    //   Alert.alert("Validation Error", "Age must be between 18 and 55 years");
    //   return;
    // }

    const response = await anenatalAPI.saveAntenatalCard(
      formData,
      checkboxStates,
      obhRows,
      investigationRows
    );

    Alert.alert("Success", "Antenatal card saved successfully!");
  };

  const handleExportPDF = () => {
    Alert.alert("Export", "PDF export functionality would be implemented here");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: '#FAFAFA' }}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={{ paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 4 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Ionicons name="arrow-back" size={20} color="#374151" />
            <Text style={{ color: '#6B7280', fontSize: 13 }}>Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 26, fontWeight: '800', color: '#111827', letterSpacing: -0.5 }}>Antenatal Card</Text>
          <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Comprehensive antenatal record</Text>
        </View>

        <View style={{ padding: 16 }}>

          {/* Header Card */}
          <SectionCard title="ANTENATAL CARD">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontSize: 14, color: '#374151' }}>Dr. Mariam Iqbal</Text>
              <Text style={{ fontSize: 14, color: '#374151' }}>Dr. Saba Ansari</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TextInputField
                label="Ref"
                style={{ flex: 1, marginRight: 8 }}
                value={formData.refBy || ""}
                onChangeText={(value) => updateFormData("refBy", value)}
                testID="ref-input"
              />
              <TextInputField
                label="Date"
                style={{ flex: 1, marginLeft: 8 }}
                value={formData.date || ""}
                onChangeText={(value) => updateFormData("date", value)}
                placeholder="DD/MM/YYYY"
                testID="date-input"
              />
            </View>
          </SectionCard>

          {/* Patient Information */}
          <SectionCard title="PATIENT INFORMATION">
            <TextInputField
              label="Patient's Name"
              required
              value={formData.patientName || ""}
              onChangeText={(value) => updateFormData("patientName", value)}
              testID="patient-name"
            />

            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <RadioGroup
                  label="Guardian Type"
                  options={["W/O", "D/O"]}
                  selected={formData.guardianType}
                  onSelect={(value) => updateFormData("guardianType", value)}
                  testID="guardian-type"
                />
              </View>
              <TextInputField
                label="Guardian Name"
                required
                style={{ flex: 2, marginLeft: 8 }}
                value={formData.guardianName || ""}
                onChangeText={(value) => updateFormData("guardianName", value)}
                testID="guardian-name"
              />
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TextInputField
                label="Age"
                required
                style={{ flex: 1, marginRight: 8 }}
                keyboardType="numeric"
                value={formData.age?.toString() || ""}
                onChangeText={(value) =>
                  updateFormData("age", parseInt(value) || undefined)
                }
                testID="age"
              />
              <TextInputField
                label="Married Since"
                style={{ flex: 1, marginHorizontal: 4 }}
                value={formData.marriedSince || ""}
                onChangeText={(value) => updateFormData("marriedSince", value)}
                testID="married-since"
              />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <RadioGroup
                  label="Cousin Marriage"
                  options={["Yes", "No"]}
                  selected={formData.cousinMarriage}
                  onSelect={(value) => updateFormData("cousinMarriage", value)}
                  testID="cousin-marriage"
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TextInputField
                label="P"
                style={{ flex: 1, marginRight: 8 }}
                value={formData.p || ""}
                onChangeText={(value) => updateFormData("p", value)}
                testID="p-field"
              />
              <TextInputField
                label="Address"
                style={{ flex: 2, marginLeft: 8 }}
                value={formData.address || ""}
                onChangeText={(value) => updateFormData("address", value)}
                testID="address"
              />
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TextInputField
                label="Tel"
                required
                style={{ flex: 1, marginRight: 8 }}
                keyboardType="phone-pad"
                value={formData.tel || ""}
                onChangeText={(value) => updateFormData("tel", value)}
                testID="telephone"
              />
              <TextInputField
                label="Blood Group"
                required
                style={{ flex: 1, marginLeft: 8 }}
                value={formData.bloodGroup || ""}
                onChangeText={(value) => updateFormData("bloodGroup", value)}
                testID="blood-group"
              />
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TextInputField
                label="Husband Name"
                style={{ flex: 1, marginRight: 8 }}
                value={formData.husbandName || ""}
                onChangeText={(value) => updateFormData("husbandName", value)}
                testID="husband-name"
              />
              <TextInputField
                label="Husband Blood Group"
                style={{ flex: 1, marginLeft: 8 }}
                value={formData.husbandBloodGroup || ""}
                onChangeText={(value) =>
                  updateFormData("husbandBloodGroup", value)
                }
                testID="husband-blood-group"
              />
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TextInputField
                label="Patient Occupation"
                style={{ flex: 1, marginRight: 8 }}
                value={formData.patientOccupation || ""}
                onChangeText={(value) =>
                  updateFormData("patientOccupation", value)
                }
                testID="patient-occupation"
              />
              <TextInputField
                label="Husband Occupation"
                style={{ flex: 1, marginLeft: 8 }}
                value={formData.husbandOccupation || ""}
                onChangeText={(value) =>
                  updateFormData("husbandOccupation", value)
                }
                testID="husband-occupation"
              />
            </View>
          </SectionCard>

          {/* Complaints */}
          <SectionCard title="COMPLAINTS">
            <TextInputField
              label="Complaints"
              multiline
              value={formData.complaints || ""}
              onChangeText={(value) => updateFormData("complaints", value)}
              testID="complaints"
            />
          </SectionCard>

          {/* OB/H Table */}
          <SectionCard title="OB/H">
            <View style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
              <TableRow isHeader>
                <TableCell>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    Yrs
                  </Text>
                </TableCell>
                <TableCell>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    Term
                  </Text>
                </TableCell>
                <TableCell>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    MOD
                  </Text>
                </TableCell>
                <TableCell flex={2}>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    Complications
                  </Text>
                </TableCell>
                <TableCell>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    Gender & Weight
                  </Text>
                </TableCell>
                <TableCell>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    Status
                  </Text>
                </TableCell>
              </TableRow>

              {obhRows.map((row, index) => (
                <TableRow key={index} isEven={index % 2 === 1}>
                  <TableCell>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.yrs}
                      onChangeText={(value) =>
                        updateObhRow(index, "yrs", value)
                      }
                      testID={`obh-yrs-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.term}
                      onChangeText={(value) =>
                        updateObhRow(index, "term", value)
                      }
                      testID={`obh-term-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.mod}
                      onChangeText={(value) =>
                        updateObhRow(index, "mod", value)
                      }
                      testID={`obh-mod-${index}`}
                    />
                  </TableCell>
                  <TableCell flex={2}>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.complications}
                      onChangeText={(value) =>
                        updateObhRow(index, "complications", value)
                      }
                      testID={`obh-complications-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.genderWeight}
                      onChangeText={(value) =>
                        updateObhRow(index, "genderWeight", value)
                      }
                      testID={`obh-gender-weight-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.status}
                      onChangeText={(value) =>
                        updateObhRow(index, "status", value)
                      }
                      testID={`obh-status-${index}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </View>

            <TouchableOpacity
              onPress={addObhRow}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 12,
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: '#8B5CF6',
                borderRadius: 10,
              }}
              testID="add-obh-row"
            >
              <Plus size={16} color="white" />
              <Text style={{ color: 'white', marginLeft: 8, fontSize: 14 }}>Add Row</Text>
            </TouchableOpacity>
          </SectionCard>

          {/* Gynae History */}
          <SectionCard title="GYNAE HISTORY">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <View style={{ width: '50%' }}>
                <Checkbox
                  checked={checkboxStates.regular}
                  onToggle={() => toggleCheckbox("regular")}
                  label="Regular"
                  testID="regular-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.irregular}
                  onToggle={() => toggleCheckbox("irregular")}
                  label="Irregular"
                  testID="irregular-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.pco}
                  onToggle={() => toggleCheckbox("pco")}
                  label="PCO"
                  testID="pco-checkbox"
                />
              </View>
              <View style={{ width: '50%' }}>
                <Checkbox
                  checked={checkboxStates.hirsutism}
                  onToggle={() => toggleCheckbox("hirsutism")}
                  label="Hirsutism"
                  testID="hirsutism-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.papSmear}
                  onToggle={() => toggleCheckbox("papSmear")}
                  label="Pap Smear"
                  testID="pap-smear-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.contraception}
                  onToggle={() => toggleCheckbox("contraception")}
                  label="Contraception"
                  testID="contraception-checkbox"
                />
              </View>
            </View>

            <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 4, marginTop: 16 }}>
              M/C
            </Text>
          </SectionCard>

          {/* LMP & EDD */}
          <SectionCard title="LMP & EDD">
            <View style={{ flexDirection: 'row' }}>
              <TextInputField
                label="LMP"
                required
                placeholder="DD/MM/YYYY"
                style={{ flex: 1, marginRight: 8 }}
                value={formData.lmp || ""}
                onChangeText={(value) => updateFormData("lmp", value)}
                testID="lmp"
              />
              <TextInputField
                label="EDD"
                required
                placeholder="DD/MM/YYYY"
                style={{ flex: 1, marginLeft: 8 }}
                value={formData.edd || ""}
                onChangeText={(value) => updateFormData("edd", value)}
                testID="edd"
              />
            </View>
          </SectionCard>

          {/* Family History */}
          <SectionCard title="F/H">
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, marginRight: 16 }}>
                <Checkbox
                  checked={checkboxStates.dm}
                  onToggle={() => toggleCheckbox("dm")}
                  label="DM"
                  testID="fh-dm-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.htn}
                  onToggle={() => toggleCheckbox("htn")}
                  label="HTN"
                  testID="fh-htn-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.cancer}
                  onToggle={() => toggleCheckbox("cancer")}
                  label="Cancer"
                  testID="fh-cancer-checkbox"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Checkbox
                  checked={checkboxStates.twins}
                  onToggle={() => toggleCheckbox("twins")}
                  label="Twins"
                  testID="fh-twins-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.specialChild}
                  onToggle={() => toggleCheckbox("specialChild")}
                  label="Special Child"
                  testID="fh-special-child-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.thalassemia}
                  onToggle={() => toggleCheckbox("thalassemia")}
                  label="Thalassemia"
                  testID="fh-thalassemia-checkbox"
                />
              </View>
            </View>
          </SectionCard>

          {/* Risk Factors */}
          <SectionCard title="RISK FACTORS">
            <TextInputField
              label="Risk Factors"
              multiline
              value={formData.riskFactors || ""}
              onChangeText={(value) => updateFormData("riskFactors", value)}
              testID="risk-factors"
            />
          </SectionCard>

          {/* Medical History */}
          <SectionCard title="MEDICAL Hx">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <View style={{ width: '50%' }}>
                <Checkbox
                  checked={checkboxStates.drugAllergy}
                  onToggle={() => toggleCheckbox("drugAllergy")}
                  label="Drug Allergy"
                  testID="drug-allergy-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.chickenPox}
                  onToggle={() => toggleCheckbox("chickenPox")}
                  label="Chicken Pox"
                  testID="chicken-pox-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.htnMedical}
                  onToggle={() => toggleCheckbox("htnMedical")}
                  label="HTN"
                  testID="htn-medical-checkbox"
                />
              </View>
              <View style={{ width: '50%' }}>
                <Checkbox
                  checked={checkboxStates.dmMedical}
                  onToggle={() => toggleCheckbox("dmMedical")}
                  label="DM"
                  testID="dm-medical-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.thyroid}
                  onToggle={() => toggleCheckbox("thyroid")}
                  label="Thyroid"
                  testID="thyroid-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.others}
                  onToggle={() => toggleCheckbox("others")}
                  label="Others"
                  testID="others-checkbox"
                />
              </View>
            </View>
          </SectionCard>

          {/* Medication & Surgical History */}
          <SectionCard title="MEDICATION / SURGICAL Hx">
            <TextInputField
              label="Medications"
              multiline
              value={formData.medications}
              onChangeText={(value) => {
                updateFormData("medications", value);
              }}
              testID="medications"
            />
            <TextInputField
              label="Surgical History"
              multiline
              value={formData.surgicalHistory}
              onChangeText={(value) => updateFormData("surgicalHistory", value)}
              testID="surgical-history"
            />
          </SectionCard>

          {/* Vitals & Examination */}
          <SectionCard title="VITALS & EXAMINATION">
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <TextInputField
                label="Height (cm)"
                keyboardType="numeric"
                style={{ flex: 1, marginRight: 8 }}
                value={formData.height?.toString() || ""}
                onChangeText={(value) =>
                  updateFormData("height", parseFloat(value) || undefined)
                }
                testID="height"
              />
              <TextInputField
                label="Weight (kg)"
                keyboardType="numeric"
                style={{ flex: 1, marginHorizontal: 4 }}
                value={formData.weight?.toString() || ""}
                onChangeText={(value) =>
                  updateFormData("weight", parseFloat(value) || undefined)
                }
                testID="weight"
              />
              <View style={{ flex: 1, marginLeft: 8, marginBottom: 12 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 6 }}>BMI</Text>
                <View style={{ backgroundColor: '#F5F3FF', borderRadius: 12, paddingHorizontal: 12, height: 44, justifyContent: 'center' }}>
                  <Text style={{ color: '#8B5CF6', fontSize: 14, fontWeight: '600' }}>
                    {bmi || "Auto-calc"}
                  </Text>
                </View>
              </View>
            </View>

            <TextInputField
              label="B.P."
              placeholder="120/80"
              value={formData.bp || ""}
              onChangeText={(value) => updateFormData("bp", value)}
              testID="blood-pressure"
            />
            {/*HAHAHAAH */}
          </SectionCard>

          {/* Scans */}
          <SectionCard title="SCANS">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <View style={{ width: '50%' }}>
                <Checkbox
                  checked={checkboxStates.bookingScan}
                  onToggle={() => toggleCheckbox("bookingScan")}
                  label="Booking Scan:"
                  testID="booking-scan-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.ntScan}
                  onToggle={() => toggleCheckbox("ntScan")}
                  label="NT Scan:"
                  testID="nt-scan-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.anomalyScan}
                  onToggle={() => toggleCheckbox("anomalyScan")}
                  label="Anomaly Scan:"
                  testID="anomaly-scan-checkbox"
                />
              </View>
              <View style={{ width: '50%' }}>
                <Checkbox
                  checked={checkboxStates.scan28Weeks}
                  onToggle={() => toggleCheckbox("scan28Weeks")}
                  label="28 Weeks:"
                  testID="28-weeks-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.scan34Weeks}
                  onToggle={() => toggleCheckbox("scan34Weeks")}
                  label="34 Weeks:"
                  testID="34-weeks-checkbox"
                />
                <Checkbox
                  checked={checkboxStates.termScan}
                  onToggle={() => toggleCheckbox("termScan")}
                  label="Term:"
                  testID="term-scan-checkbox"
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <TextInputField
                label="EDD"
                placeholder="DD/MM/YYYY"
                value={formData.scans_EDD}
                onChangeText={(value) => {
                  updateFormData("scans_EDD", value);
                }}
                style={{ flex: 1, marginRight: 8 }}
                testID="scan-edd"
              />
              <TextInputField
                label="P/A"
                style={{ flex: 1, marginLeft: 8 }}
                value={formData.scans_PA}
                onChangeText={(value) => {
                  updateFormData("scans_PA", value);
                }}
                testID="pa-examination"
              />
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TextInputField
                label="P/S"
                style={{ flex: 1, marginRight: 8 }}
                value={formData.scans_PS}
                onChangeText={(value) => {
                  updateFormData("scans_PS", value);
                }}
                testID="ps-examination"
              />
              <TextInputField
                label="Bimanual"
                style={{ flex: 1, marginLeft: 8 }}
                value={formData.scans_Bimanual}
                onChangeText={(value) => {
                  updateFormData("scans_Bimanual", value);
                }}
                testID="bimanual-examination"
              />
            </View>
          </SectionCard>

          {/* Investigations Table */}
          <SectionCard title="INVESTIGATIONS">
            <View style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
              <TableRow isHeader>
                <TableCell flex={1.5}>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    Test
                  </Text>
                </TableCell>
                <TableCell>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    Date
                  </Text>
                </TableCell>
                <TableCell>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    Hb
                  </Text>
                </TableCell>
                <TableCell>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    BSR
                  </Text>
                </TableCell>
                <TableCell>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    Urine
                  </Text>
                </TableCell>
                <TableCell flex={1.5}>
                  <Text style={{ color: '#8B5CF6', fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>
                    Ultrasound
                  </Text>
                </TableCell>
              </TableRow>

              {investigationRows.map((row, index) => (
                <TableRow key={index} isEven={index % 2 === 1}>
                  <TableCell flex={1.5}>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.test}
                      onChangeText={(value) =>
                        updateInvestigationRow(index, "test", value)
                      }
                      testID={`investigation-test-${index}`}
                      editable={index >= 9} // First 9 rows are pre-filled
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.date}
                      placeholder="DD/MM"
                      placeholderTextColor="#9CA3AF"
                      onChangeText={(value) =>
                        updateInvestigationRow(index, "date", value)
                      }
                      testID={`investigation-date-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.hb}
                      onChangeText={(value) =>
                        updateInvestigationRow(index, "hb", value)
                      }
                      testID={`investigation-hb-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.bsr}
                      onChangeText={(value) =>
                        updateInvestigationRow(index, "bsr", value)
                      }
                      testID={`investigation-bsr-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.urine}
                      onChangeText={(value) =>
                        updateInvestigationRow(index, "urine", value)
                      }
                      testID={`investigation-urine-${index}`}
                    />
                  </TableCell>
                  <TableCell flex={1.5}>
                    <TextInput
                      style={{ color: '#111827', fontSize: 12, backgroundColor: 'transparent' }}
                      value={row.ultrasound}
                      onChangeText={(value) =>
                        updateInvestigationRow(index, "ultrasound", value)
                      }
                      testID={`investigation-ultrasound-${index}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </View>

            <TouchableOpacity
              onPress={addInvestigationRow}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 12,
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: '#8B5CF6',
                borderRadius: 10,
              }}
              testID="add-investigation-row"
            >
              <Plus size={16} color="white" />
              <Text style={{ color: 'white', marginLeft: 8, fontSize: 14 }}>Add Investigation</Text>
            </TouchableOpacity>
          </SectionCard>

          {/* Footer Section */}
          <SectionCard title="ADDITIONAL NOTES">
            <TextInputField
              label="Other:"
              multiline
              testID="other-notes"
              value={formData.additionalNotes}
              onChangeText={(value) => {
                updateFormData("additionalNotes", value);
              }}
            />

            <TextInputField
              label="DIAGNOSIS:"
              multiline
              value={formData.diagnosis || ""} // Fixed typo and connected to formData
              onChangeText={(value) => updateFormData("diagnosis", value)}
              testID="diagnosis"
            />

            <TextInputField
              label="PLAN:"
              multiline
              testID="plan"
              value={formData.plan}
              onChangeText={(value) => {
                updateFormData("plan", value);
              }}
            />
          </SectionCard>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
            <TouchableOpacity
              onPress={handleSave}
              style={{
                flex: 1,
                backgroundColor: '#8B5CF6',
                borderRadius: 14,
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginRight: 8,
                minHeight: 44,
              }}
              testID="save-button"
              accessibilityLabel="Save antenatal card"
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: '700', fontSize: 16 }}>
                Save Draft
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleExportPDF}
              style={{
                flex: 1,
                backgroundColor: '#F3F4F6',
                borderRadius: 14,
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginLeft: 8,
                minHeight: 44,
              }}
              testID="export-button"
              accessibilityLabel="Export as PDF"
            >
              <Text style={{ color: '#374151', textAlign: 'center', fontWeight: '700', fontSize: 16 }}>
                Export PDF
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
