import React, { useState, useEffect } from "react";


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

const getApiUrl = () => {
  if (typeof window !== "undefined" && window.location) {
    return "http://localhost:5001/api/Doctors";
  }
  if (Platform.OS === "ios" || Platform.OS === "android") {
    return "http://172.20.10.2:5001/api/Doctors";
  }
  return "http://172.20.10.2:5001/api/Doctors";
};

const API_BASE_URL = getApiUrl();

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
        `http://172.20.10.2:5001/api/Doctors/SubmitAntenatalform`,
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
  <View style={style} className="mb-3">
    <Text className="text-white text-sm mb-1 font-medium">
      {label}
      {required && <Text className="text-red-400"> *</Text>}
    </Text>
    <TextInput
      className="rounded-xl border border-neutral-700 bg-neutral-800 text-white px-3 h-11"
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={keyboardType}
      testID={testID}
      accessibilityLabel={label}
      style={
        multiline
          ? { height: 80, textAlignVertical: "top", paddingTop: 12 }
          : {}
      }
    />
  </View>
);

const Checkbox = ({ checked, onToggle, label, testID = "" }) => (
  <TouchableOpacity
    onPress={onToggle}
    className="flex-row items-center mb-2"
    style={{ minHeight: 44 }}
    testID={testID}
    accessibilityLabel={label}
    accessibilityRole="checkbox"
    accessibilityState={{ checked }}
  >
    <View
      className={`w-5 h-5 border-2 rounded mr-3 ${checked ? "bg-emerald-600 border-emerald-600" : "border-neutral-700"} items-center justify-center`}
    >
      {checked && <Check size={12} color="white" />}
    </View>
    <Text className="text-white text-sm flex-1">{label}</Text>
  </TouchableOpacity>
);

const RadioGroup = ({ options, selected, onSelect, label, testID = "" }) => (
  <View className="mb-4">
    <Text className="text-white text-sm mb-2 font-medium">{label}</Text>
    <View className="flex-row flex-wrap">
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onSelect(option)}
          className="flex-row items-center mr-6 mb-2"
          style={{ minHeight: 44 }}
          testID={`${testID}-${option}`}
          accessibilityLabel={`${label} ${option}`}
          accessibilityRole="radio"
          accessibilityState={{ selected: selected === option }}
        >
          <View
            className={`w-5 h-5 border-2 rounded-full mr-2 ${selected === option ? "border-emerald-600" : "border-neutral-700"}`}
          >
            {selected === option && (
              <View className="w-3 h-3 bg-emerald-600 rounded-full self-center mt-0.5" />
            )}
          </View>
          <Text className="text-white text-sm">{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const SectionCard = ({ title, children, className = "" }) => (
  <View
    className={`bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-4 ${className}`}
  >
    <Text className="text-white text-lg font-bold mb-4 text-center border-b border-neutral-700 pb-2">
      {title}
    </Text>
    {children}
  </View>
);

const TableRow = ({ children, isHeader = false }) => (
  <View
    className={`flex-row border-b border-neutral-700 py-2 ${isHeader ? "bg-neutral-800" : ""}`}
  >
    {children}
  </View>
);

const TableCell = ({ children, flex = 1, className = "" }) => (
  <View className={`px-2 ${className}`} style={{ flex }}>
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
      className="flex-1 bg-neutral-950"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Header */}
          <SectionCard title="ANTENATAL CARD">
            <View className="flex-row justify-between mb-4">
              <Text className="text-white text-sm">Dr. Mariam Iqbal</Text>
              <Text className="text-white text-sm">Dr. Saba Ansari</Text>
            </View>

            <View className="flex-row justify-between">
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

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
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

            <View className="flex-row">
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
              <View className="flex-1 ml-4">
                <RadioGroup
                  label="Cousin Marriage"
                  options={["Yes", "No"]}
                  selected={formData.cousinMarriage}
                  onSelect={(value) => updateFormData("cousinMarriage", value)}
                  testID="cousin-marriage"
                />
              </View>
            </View>

            <View className="flex-row">
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

            <View className="flex-row">
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

            <View className="flex-row">
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

            <View className="flex-row">
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
            <View className="border border-neutral-700 rounded-lg overflow-hidden">
              <TableRow isHeader>
                <TableCell>
                  <Text className="text-white text-xs font-bold text-center">
                    Yrs
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="text-white text-xs font-bold text-center">
                    Term
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="text-white text-xs font-bold text-center">
                    MOD
                  </Text>
                </TableCell>
                <TableCell flex={2}>
                  <Text className="text-white text-xs font-bold text-center">
                    Complications
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="text-white text-xs font-bold text-center">
                    Gender & Weight
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="text-white text-xs font-bold text-center">
                    Status
                  </Text>
                </TableCell>
              </TableRow>

              {obhRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextInput
                      className="text-white text-xs bg-transparent"
                      value={row.yrs}
                      onChangeText={(value) =>
                        updateObhRow(index, "yrs", value)
                      }
                      testID={`obh-yrs-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      className="text-white text-xs bg-transparent"
                      value={row.term}
                      onChangeText={(value) =>
                        updateObhRow(index, "term", value)
                      }
                      testID={`obh-term-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      className="text-white text-xs bg-transparent"
                      value={row.mod}
                      onChangeText={(value) =>
                        updateObhRow(index, "mod", value)
                      }
                      testID={`obh-mod-${index}`}
                    />
                  </TableCell>
                  <TableCell flex={2}>
                    <TextInput
                      className="text-white text-xs bg-transparent"
                      value={row.complications}
                      onChangeText={(value) =>
                        updateObhRow(index, "complications", value)
                      }
                      testID={`obh-complications-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      className="text-white text-xs bg-transparent"
                      value={row.genderWeight}
                      onChangeText={(value) =>
                        updateObhRow(index, "genderWeight", value)
                      }
                      testID={`obh-gender-weight-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      className="text-white text-xs bg-transparent"
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
              className="flex-row items-center justify-center mt-3 py-2 px-4 bg-emerald-700 rounded-lg"
              testID="add-obh-row"
            >
              <Plus size={16} color="white" />
              <Text className="text-white ml-2 text-sm">Add Row</Text>
            </TouchableOpacity>
          </SectionCard>

          {/* Gynae History */}
          <SectionCard title="GYNAE HISTORY">
            <View className="flex-row flex-wrap">
              <View className="w-1/2">
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
              <View className="w-1/2">
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

            <Text className="text-white text-sm mb-1 font-medium mt-4">
              M/C
            </Text>
          </SectionCard>

          {/* LMP & EDD */}
          <SectionCard title="LMP & EDD">
            <View className="flex-row">
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
            <View className="flex-row">
              <View className="flex-1 mr-4">
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
              <View className="flex-1">
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
            <View className="flex-row flex-wrap">
              <View className="w-1/2">
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
              <View className="w-1/2">
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
            <View className="flex-row mb-4">
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
              <View style={{ flex: 1, marginLeft: 8 }} className="mb-3">
                <Text className="text-white text-sm mb-1 font-medium">BMI</Text>
                <View className="rounded-xl border border-neutral-700 bg-neutral-700 px-3 h-11 justify-center">
                  <Text className="text-neutral-400 text-sm">
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
            <View className="flex-row flex-wrap">
              <View className="w-1/2">
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
              <View className="w-1/2">
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

            <View className="flex-row mt-4">
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

            <View className="flex-row">
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
            <View className="border border-neutral-700 rounded-lg overflow-hidden">
              <TableRow isHeader>
                <TableCell flex={1.5}>
                  <Text className="text-white text-xs font-bold text-center">
                    Test
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="text-white text-xs font-bold text-center">
                    Date
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="text-white text-s font-bold text-center">
                    Hb
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="text-white text-s font-bold text-center">
                    BSR
                  </Text>
                </TableCell>
                <TableCell>
                  <Text className="text-white text-xs font-bold text-center">
                    Urine
                  </Text>
                </TableCell>
                <TableCell flex={1.5}>
                  <Text className="text-white text-xs font-bold text-center">
                    Ultrasound
                  </Text>
                </TableCell>
              </TableRow>

              {investigationRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell flex={1.5}>
                    <TextInput
                      className="text-white text-xs bg-transparent"
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
                      className="text-white text-s bg-transparent"
                      value={row.date}
                      placeholder="DD/MM"
                      onChangeText={(value) =>
                        updateInvestigationRow(index, "date", value)
                      }
                      testID={`investigation-date-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      className="text-white text-xs bg-transparent"
                      value={row.hb}
                      onChangeText={(value) =>
                        updateInvestigationRow(index, "hb", value)
                      }
                      testID={`investigation-hb-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      className="text-white text-xs bg-transparent"
                      value={row.bsr}
                      onChangeText={(value) =>
                        updateInvestigationRow(index, "bsr", value)
                      }
                      testID={`investigation-bsr-${index}`}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      className="text-white text-xs bg-transparent"
                      value={row.urine}
                      onChangeText={(value) =>
                        updateInvestigationRow(index, "urine", value)
                      }
                      testID={`investigation-urine-${index}`}
                    />
                  </TableCell>
                  <TableCell flex={1.5}>
                    <TextInput
                      className="text-white text-xs bg-transparent"
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
              className="flex-row items-center justify-center mt-3 py-2 px-4 bg-emerald-700 rounded-lg"
              testID="add-investigation-row"
            >
              <Plus size={16} color="white" />
              <Text className="text-white ml-2 text-sm">Add Investigation</Text>
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
          <View className="flex-row justify-between mb-8">
            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 bg-emerald-700 rounded-xl py-4 px-6 mr-2"
              style={{ minHeight: 44 }}
              testID="save-button"
              accessibilityLabel="Save antenatal card"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Save Draft
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleExportPDF}
              className="flex-1 bg-neutral-700 rounded-xl py-4 px-6 ml-2"
              style={{ minHeight: 44 }}
              testID="export-button"
              accessibilityLabel="Export as PDF"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Export PDF
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
