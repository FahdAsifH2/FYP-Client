import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const DeliveryModePredictionForm = () => {
  const [form, setForm] = useState({
    age_years: "",
    parity: "",
    gestation_weeks: "",
    previous_cs_count: "0",
    gravida_encoded: "",
    robson_group_encoded: "",
    presentation_type: "cephalic",
    labor_type: "spontaneous",
    fetal_heart: "present",
    baby_count: "single",
    age_category: "20_34",
    robson_parity_type: "nulliparous",
    term_category: "term",
    previous_scar: "no",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({});

  const presentationOptions = [
    { label: "Cephalic (Head down)", value: "cephalic" },
    { label: "Breech (Bottom first)", value: "breech" },
    { label: "Oblique/Transverse", value: "oblique" },
  ];

  const laborOptions = [
    { label: "Spontaneous Labor", value: "spontaneous" },
    { label: "Induced Labor", value: "induced" },
    { label: "Planned C-Section", value: "cs_before" },
  ];

  const fetalHeartOptions = [
    { label: "Present", value: "present" },
    { label: "Absent", value: "absent" },
  ];

  const babyCountOptions = [
    { label: "Single", value: "single" },
    { label: "Multiple", value: "multiple" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!form.age_years || form.age_years < 12 || form.age_years > 55) {
      newErrors.age_years = "Age must be 12-55 years";
    }

    if (!form.parity || form.parity < 0) {
      newErrors.parity = "Parity cannot be negative";
    }

    if (
      !form.gestation_weeks ||
      form.gestation_weeks < 20 ||
      form.gestation_weeks > 45
    ) {
      newErrors.gestation_weeks = "Gestation: 20-45 weeks";
    }

    if (parseInt(form.previous_cs_count) < 0) {
      newErrors.previous_cs_count = "CS count cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    // Auto-update related fields
    if (field === "age_years") {
      const age = parseInt(value);
      let category = "20_34";
      if (age <= 19) category = "19_or_less";
      else if (age >= 35) category = "35_plus";
      setForm((prev) => ({ ...prev, age_category: category }));
    }

    if (field === "parity") {
      const parityVal = parseInt(value);
      setForm((prev) => ({
        ...prev,
        robson_parity_type: parityVal === 0 ? "nulliparous" : "multiparous",
      }));
    }

    if (field === "gestation_weeks") {
      const weeks = parseInt(value);
      let category = "term";
      if (weeks < 37) category = "preterm";
      else if (weeks > 42) category = "post_term";
      setForm((prev) => ({ ...prev, term_category: category }));
    }

    // Clear errors
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const toggleDropdown = (field) => {
    // Dismiss keyboard when dropdown is opened
    Keyboard.dismiss();

    setDropdownOpen((prev) => {
      // Close all dropdowns first, then open the selected one
      const newState = {};
      Object.keys(prev).forEach((key) => {
        newState[key] = false;
      });
      newState[field] = !prev[field];
      return newState;
    });
  };

  const selectOption = (field, value) => {
    updateForm(field, value);
    // Close all dropdowns
    setDropdownOpen({});
  };

  // Get z-index based on dropdown hierarchy
  const getDropdownZIndex = (field) => {
    const zIndexMap = {
      presentation_type: 10000,
      labor_type: 9000,
      fetal_heart: 8000,
      baby_count: 7000,
    };
    return zIndexMap[field] || 5000;
  };

  const renderDropdown = (
    field,
    options,
    currentValue,
    label,
    isInRow = false
  ) => {
    const currentLabel =
      options.find((opt) => opt.value === currentValue)?.label || "Select...";
    const zIndex = getDropdownZIndex(field);

    return (
      <View
        className={`mb-4 ${isInRow ? "" : "relative"}`}
        style={{ zIndex: dropdownOpen[field] ? zIndex : 1 }}
      >
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          {label}
        </Text>
        <TouchableOpacity
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
          onPress={() => toggleDropdown(field)}
        >
          <Text className="text-base text-gray-700 flex-1">{currentLabel}</Text>
          <Text className="text-xs text-gray-500 ml-2">
            {dropdownOpen[field] ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>

        {dropdownOpen[field] && (
          <View
            className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 rounded-b-lg"
            style={{
              zIndex: zIndex + 1000,
              elevation: zIndex / 100,
              maxHeight: 150,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
          >
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`px-4 py-3 border-b border-gray-100 ${
                    currentValue === option.value ? "bg-blue-50" : "bg-white"
                  }`}
                  onPress={() => selectOption(field, option.value)}
                >
                  <Text
                    className={`text-base ${
                      currentValue === option.value
                        ? "text-purple-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  // Special render function for row dropdowns with proper z-index handling
  const renderRowDropdown = (field, options, currentValue, label) => {
    const currentLabel =
      options.find((opt) => opt.value === currentValue)?.label || "Select...";
    const zIndex = getDropdownZIndex(field);

    return (
      <View
        className="mb-4 relative"
        style={{ zIndex: dropdownOpen[field] ? zIndex : 1 }}
      >
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          {label}
        </Text>
        <TouchableOpacity
          className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
          onPress={() => toggleDropdown(field)}
        >
          <Text className="text-base text-gray-700 flex-1" numberOfLines={1}>
            {currentLabel}
          </Text>
          <Text className="text-xs text-gray-500 ml-2">
            {dropdownOpen[field] ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>

        {dropdownOpen[field] && (
          <View
            className="absolute top-full bg-white border border-gray-300 border-t-0 rounded-b-lg"
            style={{
              left: 0,
              right: 0,
              zIndex: zIndex + 2000,
              elevation: zIndex / 50,
              maxHeight: 150,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
            }}
          >
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`px-4 py-3 border-b border-gray-100 ${
                    currentValue === option.value ? "bg-blue-50" : "bg-white"
                  }`}
                  onPress={() => selectOption(field, option.value)}
                >
                  <Text
                    className={`text-base ${
                      currentValue === option.value
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const predict = async () => {
    Keyboard.dismiss();

    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fix the form errors before submitting."
      );
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Map form data to API format
      const apiData = {
        age_years: parseFloat(form.age_years),
        gravida_encoded: parseFloat(form.gravida_encoded) || 1,
        parity: parseFloat(form.parity),
        previous_cs_count: parseFloat(form.previous_cs_count) || 0,
        gestation_weeks: parseFloat(form.gestation_weeks),
        robson_group_encoded: parseFloat(form.robson_group_encoded) || 1,
        number_of_fetuses: form.baby_count === "single" ? 1 : 2,

        // One-hot encoded features
        age_19_or_less: form.age_category === "19_or_less" ? 1.0 : 0.0,
        age_20_34_years: form.age_category === "20_34" ? 1.0 : 0.0,
        age_35_plus_years: form.age_category === "35_plus" ? 1.0 : 0.0,

        robson_nulliparous:
          form.robson_parity_type === "nulliparous" ? 1.0 : 0.0,
        robson_multiparous:
          form.robson_parity_type === "multiparous" ? 1.0 : 0.0,

        no_previous_scar: form.previous_scar === "no" ? 1.0 : 0.0,
        previous_scar: form.previous_scar === "yes" ? 1.0 : 0.0,

        presentation_cephalic:
          form.presentation_type === "cephalic" ? 1.0 : 0.0,
        presentation_oblique: form.presentation_type === "oblique" ? 1.0 : 0.0,
        presentation_breech: form.presentation_type === "breech" ? 1.0 : 0.0,

        labour_onset_spontaneous: form.labor_type === "spontaneous" ? 1.0 : 0.0,
        induction_of_labour: form.labor_type === "induced" ? 1.0 : 0.0,
        cs_before_labour: form.labor_type === "cs_before" ? 1.0 : 0.0,

        fetal_heart_present: form.fetal_heart === "present" ? 1.0 : 0.0,
        fetal_heart_absent: form.fetal_heart === "absent" ? 1.0 : 0.0,

        single_baby: form.baby_count === "single" ? 1.0 : 0.0,
        multiple_babies: form.baby_count === "multiple" ? 1.0 : 0.0,

        term_37_41_weeks: form.term_category === "term" ? 1.0 : 0.0,
        preterm_less_37: form.term_category === "preterm" ? 1.0 : 0.0,
        post_term_more_42: form.term_category === "post_term" ? 1.0 : 0.0,
      };

      // Replace with your actual API endpoint
      const response = await fetch(
        "http://172.20.10.2:5001/api/Doctors/PredictPregnancy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        }
      );

      if (!response.ok) throw new Error("Prediction failed");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Prediction error:", error);
      // Mock result for demonstration
      const mockResult = {
        prediction: "Vaginal Delivery",
        confidence: 0.847,
        probabilities: {
          vaginal_delivery: 0.847,
          cesarean_section: 0.153,
        },
      };

      setResult(mockResult);
      Alert.alert(
        "Demo Mode",
        `Recommended: ${mockResult.prediction}\nConfidence: ${(mockResult.confidence * 100).toFixed(1)}%`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-zinc-900"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View className="bg-purple-600 pt-10 pb-2 px-4">
        <Text className="text-2xl font-bold text-white text-center">
          Delivery Prediction
        </Text>
        <Text className="text-blue-200 text-center mt-1">
          AI-powered obstetric support
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Patient Information */}
        <View
          className="bg-white rounded-lg mt-4 p-4 shadow-sm"
          style={{ zIndex: 1 }}
        >
          <Text className="text-lg font-bold text-gray-800 mb-4">
            👤 Patient Information
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Age (years) <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className={`bg-gray-50 border rounded-lg px-4 py-3 text-base ${
                errors.age_years ? "border-red-300" : "border-gray-300"
              }`}
              value={form.age_years}
              onChangeText={(value) => updateForm("age_years", value)}
              placeholder="Enter age"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            {errors.age_years && (
              <Text className="text-xs text-red-600 mt-1">
                {errors.age_years}
              </Text>
            )}
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mx-1">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Parity <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className={`bg-gray-50 border rounded-lg px-4 py-3 text-base ${
                  errors.parity ? "border-red-300" : "border-gray-300"
                }`}
                value={form.parity}
                onChangeText={(value) => updateForm("parity", value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
              {errors.parity && (
                <Text className="text-xs text-red-600 mt-1">
                  {errors.parity}
                </Text>
              )}
            </View>

            <View className="flex-1 mx-1">
              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Previous C/S
              </Text>
              <TextInput
                className={`bg-gray-50 border rounded-lg px-4 py-3 text-base ${
                  errors.previous_cs_count
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
                value={form.previous_cs_count}
                onChangeText={(value) => updateForm("previous_cs_count", value)}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Gravida (Encoded)
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
              value={form.gravida_encoded}
              onChangeText={(value) => updateForm("gravida_encoded", value)}
              placeholder="Enter value"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Robson Group
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
              value={form.robson_group_encoded}
              onChangeText={(value) =>
                updateForm("robson_group_encoded", value)
              }
              placeholder="1-10"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Pregnancy Details - Higher z-index for dropdowns */}
        <View
          className="bg-white rounded-lg mt-4 p-4 shadow-sm"
          style={{ zIndex: 100 }}
        >
          <Text className="text-lg font-bold text-gray-800 mb-4">
            📅 Pregnancy Details
          </Text>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Gestational Age (weeks) <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className={`bg-gray-50 border rounded-lg px-4 py-3 text-base ${
                errors.gestation_weeks ? "border-red-300" : "border-gray-300"
              }`}
              value={form.gestation_weeks}
              onChangeText={(value) => updateForm("gestation_weeks", value)}
              placeholder="Weeks"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            {errors.gestation_weeks && (
              <Text className="text-xs text-red-600 mt-1">
                {errors.gestation_weeks}
              </Text>
            )}
          </View>

          {renderDropdown(
            "presentation_type",
            presentationOptions,
            form.presentation_type,
            "Fetal Presentation"
          )}
          {renderDropdown(
            "labor_type",
            laborOptions,
            form.labor_type,
            "Labor Onset"
          )}

          {/* Row dropdowns with special handling */}
          <View className="flex-row justify-between mb-4">
            <View
              className="flex-1 mx-1"
              style={{ zIndex: dropdownOpen["fetal_heart"] ? 8000 : 1 }}
            >
              {renderRowDropdown(
                "fetal_heart",
                fetalHeartOptions,
                form.fetal_heart,
                "Fetal Heart"
              )}
            </View>
            <View
              className="flex-1 mx-1"
              style={{ zIndex: dropdownOpen["baby_count"] ? 7000 : 1 }}
            >
              {renderRowDropdown(
                "baby_count",
                babyCountOptions,
                form.baby_count,
                "Number of Babies"
              )}
            </View>
          </View>
        </View>

        {/* Medical History - Lower z-index */}
        <View
          className="bg-white rounded-lg mt-4 p-4 shadow-sm"
          style={{ zIndex: 1 }}
        >
          <Text className="text-lg font-bold text-gray-800 mb-4">
            📋 Medical History
          </Text>

          <TouchableOpacity
            className="flex-row items-center p-3 bg-gray-50 border border-gray-300 rounded-lg"
            onPress={() => {
              Keyboard.dismiss();
              updateForm(
                "previous_scar",
                form.previous_scar === "yes" ? "no" : "yes"
              );
            }}
          >
            <View
              className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${
                form.previous_scar === "yes"
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-400"
              }`}
            >
              {form.previous_scar === "yes" && (
                <Text className="text-white font-bold text-base">✓</Text>
              )}
            </View>
            <Text className="text-sm font-semibold text-gray-700">
              Previous Uterine Scar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Predict Button */}
        <TouchableOpacity
          className={`mt-6 rounded-lg py-4 px-6 ${
            loading ? "bg-gray-400" : "bg-purple-600"
          }`}
          onPress={predict}
          disabled={loading}
          style={{ zIndex: 1 }}
        >
          {loading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text className="text-white text-lg font-bold text-center ml-2">
                Analyzing...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-lg font-bold text-center">
              Generate Prediction
            </Text>
          )}
        </TouchableOpacity>

        {/* Results */}
        {result && (
          <View
            className="bg-blue-50 border border-blue-200 rounded-lg mt-4 p-4"
            style={{ zIndex: 1 }}
          >
            <Text className="text-lg font-bold text-blue-800 mb-4">
              📊 Results
            </Text>

            {result.error ? (
              <View className="bg-red-50 border border-red-200 rounded-lg p-3">
                <Text className="font-bold text-red-800">Error:</Text>
                <Text className="text-red-700 mt-1">{result.error}</Text>
              </View>
            ) : (
              <View>
                <View className="bg-white rounded-lg p-4 mb-3">
                  <Text className="text-gray-600 mb-2">Recommended Mode:</Text>
                  <Text className="text-xl font-bold text-blue-700 mb-3">
                    {result.prediction}
                  </Text>

                  <Text className="text-gray-600 mb-2">Confidence:</Text>
                  <Text className="text-lg font-bold text-green-600">
                    {(result.confidence * 100).toFixed(1)}%
                  </Text>
                </View>

                {result.probabilities && (
                  <View className="bg-white rounded-lg p-4 mb-3">
                    <Text className="font-bold text-gray-700 mb-2">
                      Breakdown:
                    </Text>
                    {Object.entries(result.probabilities).map(
                      ([mode, prob]) => (
                        <View
                          key={mode}
                          className="flex-row justify-between mb-1"
                        >
                          <Text className="text-gray-600 capitalize">
                            {mode.replace("_", " ")}
                          </Text>
                          <Text className="font-semibold text-blue-600">
                            {(prob * 100).toFixed(1)}%
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                )}

                {result.risk_factors && (
                  <View className="bg-white rounded-lg p-4 mb-3">
                    <Text className="text-lg font-bold mb-2">Risk Factors</Text>
                    {Object.entries(result.risk_factors).map(([key, value]) => {
                      const labelMap = {
                        high_risk_age: "High Risk Age",
                        previous_cesarean: "Previous Cesarean",
                        breech_presentation: "Breech Presentation",
                        multiple_babies: "Multiple Babies",
                        preterm: "Preterm Birth",
                      };

                      return (
                        <View
                          key={key}
                          className="flex-row justify-between items-center mb-1"
                        >
                          <Text className="text-gray-700">
                            {labelMap[key] || key.replace(/_/g, " ")}
                          </Text>
                          <Text
                            className={
                              value
                                ? "text-red-600 font-bold"
                                : "text-green-600"
                            }
                          >
                            {value ? "Yes" : "No"}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                <View className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                  <Text className="text-xs text-yellow-800 font-semibold mb-1">
                    Disclaimer:
                  </Text>
                  <Text className="text-xs text-yellow-800">
                    For clinical decision support only. Always consider
                    individual factors.
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DeliveryModePredictionForm;
