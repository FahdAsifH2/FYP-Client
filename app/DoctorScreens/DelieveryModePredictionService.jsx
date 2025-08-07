import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'

const DeliveryModePredictionService = () => {
  const [form, setForm] = useState({
    age_years: '',
    parity: '',
    gestation_weeks: '',
    previous_cs_count: '',
    gravida: '',
    robson_group: '',
    presentation_type: 'cephalic',
    labor_type: 'spontaneous',
    fetal_heart: 'present',
    baby_count: 'single',
    age_category: '20_34',
    robson_parity_type: 'multiparous',
    term_pregnancy: 'yes',
    previous_scar: 'no',
    number_of_fetuses: '1'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const predict = async () => {
    Keyboard.dismiss()
    setLoading(true)
    
    try {
      const apiData = {
        age_years: parseFloat(form.age_years) || 28,
        parity: parseFloat(form.parity) || 1,
        gestation_weeks: parseFloat(form.gestation_weeks) || 39,
        previous_cs_count: parseFloat(form.previous_cs_count) || 0,
        gravida: parseFloat(form.gravida) || 2,
        robson_group: parseFloat(form.robson_group) || 3,
        number_of_fetuses: parseFloat(form.number_of_fetuses) || 1,
        age_19_or_less: form.age_category === '19_or_less' ? 1.0 : 0.0,
        age_20_34_years: form.age_category === '20_34' ? 1.0 : 0.0,
        age_35_plus_years: form.age_category === '35_plus' ? 1.0 : 0.0,
        robson_nulliparous: form.robson_parity_type === 'nulliparous' ? 1.0 : 0.0,
        robson_multiparous: form.robson_parity_type === 'multiparous' ? 1.0 : 0.0,
        presentation_cephalic: form.presentation_type === 'cephalic' ? 1.0 : 0.0,
        presentation_breech: form.presentation_type === 'breech' ? 1.0 : 0.0,
        labour_onset_spontaneous: form.labor_type === 'spontaneous' ? 1.0 : 0.0,
        induction_of_labour: form.labor_type === 'induced' ? 1.0 : 0.0,
        cs_before_labour: form.labor_type === 'cs_before' ? 1.0 : 0.0,
        fetal_heart_present: form.fetal_heart === 'present' ? 1.0 : 0.0,
        single_baby: form.baby_count === 'single' ? 1.0 : 0.0,
        multiple_babies: form.baby_count === 'multiple' ? 1.0 : 0.0,
        term_37_41_weeks: form.term_pregnancy === 'yes' ? 1.0 : 0.0,
        no_previous_scar: form.previous_scar === 'no' ? 1.0 : 0.0,
        previous_scar: form.previous_scar === 'yes' ? 1.0 : 0.0
      }
      
      const response = await fetch('http://172.20.10.2:5001/api/Doctors/PredictPregnancy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      })
      
      const data = await response.json()
      
      if (data.message && typeof data.message === 'string') {
        setResult(JSON.parse(data.message))
      } else {
        setResult(data)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get prediction. Please check your connection.')
    }
    setLoading(false)
  }

  const Input = ({ label, field, placeholder }) => (
    <View className="mb-5">
      <Text className="text-base font-semibold text-gray-700 mb-2 tracking-tight">
        {label}
      </Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3.5 bg-white text-base text-gray-900 shadow-sm"
        value={form[field]}
        onChangeText={(value) => update(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        returnKeyType="done"
      />
    </View>
  )

  const RadioGroup = ({ label, field, options }) => (
    <View className="mb-6">
      <Text className="text-base font-semibold text-gray-700 mb-3 tracking-tight">
        {label}
      </Text>
      <View className="space-y-2">
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            className={`flex-row items-center py-3.5 px-4 rounded-xl border ${
              form[field] === option.value 
                ? 'bg-blue-50 border-blue-500' 
                : 'bg-white border-gray-200'
            }`}
            onPress={() => update(field, option.value)}
          >
            <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
              form[field] === option.value 
                ? 'bg-blue-500 border-blue-500' 
                : 'border-gray-300'
            }`}>
              {form[field] === option.value && (
                <View className="w-2 h-2 bg-white rounded-full" />
              )}
            </View>
            <Text className={`text-base font-medium flex-1 ${
              form[field] === option.value ? 'text-blue-700' : 'text-gray-700'
            }`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const ButtonGroup = ({ label, field, options }) => (
    <View className="mb-6">
      <Text className="text-base font-semibold text-gray-700 mb-3 tracking-tight">
        {label}
      </Text>
      <View className="flex-row gap-3">
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            className={`flex-1 py-3 px-4 rounded-lg border ${
              form[field] === option.value
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white border-gray-300'
            }`}
            onPress={() => update(field, option.value)}
          >
            <Text className={`text-center font-semibold ${
              form[field] === option.value ? 'text-white' : 'text-gray-700'
            }`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50" 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View className="bg-blue-600 px-6 pt-14 pb-8">
          <Text className="text-2xl font-bold text-white text-center">
            Delivery Mode Predictor
          </Text>
          <Text className="text-blue-100 text-center mt-1">
            Medical prediction system
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="px-5">
            {/* Patient Demographics */}
            <View className="bg-purple-200 rounded-2xl p-6 mt-6 shadow-sm">
              <Text className="text-lg font-bold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                Patient Demographics
              </Text>
              
              <Input 
                label="Age (years)" 
                field="age_years" 
                placeholder="Enter age"
              />
              
              <RadioGroup
                label="Age Category"
                field="age_category"
                options={[
                  { value: '19_or_less', label: '≤19 years' },
                  { value: '20_34', label: '20-34 years' },
                  { value: '35_plus', label: '≥35 years' }
                ]}
              />

              <Input 
                label="Gravida" 
                field="gravida" 
                placeholder="Total pregnancies"
              />
              
              <Input 
                label="Parity" 
                field="parity" 
                placeholder="Births after 20 weeks"
              />

              <RadioGroup
                label="Parity Classification"
                field="robson_parity_type"
                options={[
                  { value: 'nulliparous', label: 'Nulliparous' },
                  { value: 'multiparous', label: 'Multiparous' }
                ]}
              />
            </View>

            {/* Current Pregnancy */}
            <View className="bg-white rounded-2xl p-6 mt-5 shadow-sm">
              <Text className="text-lg font-bold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                Current Pregnancy
              </Text>

              <Input 
                label="Gestational Age (weeks)" 
                field="gestation_weeks" 
                placeholder="Weeks of gestation"
              />

              <ButtonGroup
                label="Term Pregnancy"
                field="term_pregnancy"
                options={[
                  { value: 'yes', label: 'Term (37-41w)' },
                  { value: 'no', label: 'Preterm/Post' }
                ]}
              />

              <ButtonGroup
                label="Number of Babies"
                field="baby_count"
                options={[
                  { value: 'single', label: 'Singleton' },
                  { value: 'multiple', label: 'Multiple' }
                ]}
              />

              <Input 
                label="Number of Fetuses" 
                field="number_of_fetuses" 
                placeholder="1 or 2"
              />

              <ButtonGroup
                label="Fetal Presentation"
                field="presentation_type"
                options={[
                  { value: 'cephalic', label: 'Cephalic' },
                  { value: 'breech', label: 'Breech' }
                ]}
              />

              <ButtonGroup
                label="Fetal Heart"
                field="fetal_heart"
                options={[
                  { value: 'present', label: 'Present' },
                  { value: 'absent', label: 'Absent' }
                ]}
              />
            </View>

            {/* Labor & History */}
            <View className="bg-white rounded-2xl p-6 mt-5 shadow-sm">
              <Text className="text-lg font-bold text-gray-800 mb-5 pb-2 border-b border-gray-100">
                Labor & History
              </Text>

              <RadioGroup
                label="Labor Onset"
                field="labor_type"
                options={[
                  { value: 'spontaneous', label: 'Spontaneous' },
                  { value: 'induced', label: 'Induced' },
                  { value: 'cs_before', label: 'C/S Before Labor' }
                ]}
              />

              <Input 
                label="Previous C-Sections" 
                field="previous_cs_count" 
                placeholder="Number of previous CS"
              />

              <ButtonGroup
                label="Previous Uterine Scar"
                field="previous_scar"
                options={[
                  { value: 'no', label: 'No Scar' },
                  { value: 'yes', label: 'Has Scar' }
                ]}
              />

              <Input 
                label="Robson Group" 
                field="robson_group" 
                placeholder="Group 1-10"
              />
            </View>

            {/* Predict Button */}
            <TouchableOpacity
              className={`mt-8 py-4 rounded-xl shadow-lg ${
                loading ? 'bg-gray-400' : 'bg-green-600'
              }`}
              onPress={predict}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold text-lg">
                {loading ? 'Analyzing...' : 'Predict Delivery Mode'}
              </Text>
            </TouchableOpacity>

            {/* Results */}
            {result && (
              <View className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-6 shadow-sm">
                <Text className="text-xl font-bold text-green-800 text-center mb-4">
                  {result.predicted_delivery_mode}
                </Text>
                
                <View className="bg-white rounded-lg p-4 mb-4">
                  <Text className="text-center text-gray-700 text-lg font-semibold">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
                
                {result.all_probabilities && (
                  <View className="bg-white rounded-lg p-4">
                    <Text className="font-bold text-gray-800 mb-3 text-center">
                      All Probabilities
                    </Text>
                    {Object.entries(result.all_probabilities).map(([mode, prob]) => (
                      <View key={mode} className="flex-row justify-between items-center py-2 px-3 mb-2 bg-gray-50 rounded-lg">
                        <Text className="text-gray-700 font-medium">{mode}</Text>
                        <Text className="font-semibold text-blue-600">
                          {(prob * 100).toFixed(1)}%
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default DeliveryModePredictionService