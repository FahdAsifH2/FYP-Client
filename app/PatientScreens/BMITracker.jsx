import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BMITracker() {
    const router = useRouter();
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [prePregnancyWeight, setPrePregnancyWeight] = useState('');
    const [bmiResult, setBmiResult] = useState(null);

    const calculateBMI = () => {
        if (!weight || !height || !prePregnancyWeight) {
            Alert.alert('Missing Fields', 'Please enter your current weight, height, and pre-pregnancy weight.');
            return;
        }

        const h = parseFloat(height) / 100; // convert cm to m
        const w = parseFloat(weight);
        const preW = parseFloat(prePregnancyWeight);
        const bmi = preW / (h * h); // BMI uses pre-pregnancy weight for baselines

        const weightGain = w - preW;
        let category = '';
        let recommendation = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            recommendation = 'Recommended weight gain: 12.5 - 18 kg during your pregnancy.';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = 'Normal weight';
            recommendation = 'Recommended weight gain: 11.5 - 16 kg during your pregnancy.';
        } else if (bmi >= 25 && bmi < 29.9) {
            category = 'Overweight';
            recommendation = 'Recommended weight gain: 7 - 11.5 kg during your pregnancy.';
        } else {
            category = 'Obese';
            recommendation = 'Recommended weight gain: 5 - 9 kg during your pregnancy.';
        }

        setBmiResult({
            bmi: bmi.toFixed(1),
            category,
            weightGain: weightGain.toFixed(1),
            recommendation
        });
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="pt-16 pb-6 px-6 bg-white shadow-sm flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gynai-gray-800 tracking-tight">BMI & Weight Tracker</Text>
            </View>

            <View className="p-6">
                <Text className="text-gray-600 mb-6 text-base">
                    Track your weight gain during pregnancy to ensure you and your baby are healthy. Your recommended gain depends on your pre-pregnancy BMI.
                </Text>

                <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Height (in cm)</Text>
                    <TextInput
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-4"
                        placeholder="e.g. 165"
                        keyboardType="numeric"
                        value={height}
                        onChangeText={setHeight}
                    />

                    <Text className="text-sm font-medium text-gray-700 mb-2">Pre-Pregnancy Weight (kg)</Text>
                    <TextInput
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-4"
                        placeholder="e.g. 60"
                        keyboardType="numeric"
                        value={prePregnancyWeight}
                        onChangeText={setPrePregnancyWeight}
                    />

                    <Text className="text-sm font-medium text-gray-700 mb-2">Current Weight (kg)</Text>
                    <TextInput
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-4"
                        placeholder="e.g. 68"
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={setWeight}
                    />

                    <TouchableOpacity
                        className="w-full bg-blue-500 rounded-xl py-4 items-center mt-2"
                        onPress={calculateBMI}
                    >
                        <Text className="text-white font-bold text-lg">Calculate Progress</Text>
                    </TouchableOpacity>
                </View>

                {bmiResult && (
                    <View className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <Text className="text-lg font-bold text-blue-900 mb-2">Your Results</Text>

                        <View className="flex-row justify-between mb-4">
                            <View>
                                <Text className="text-sm text-blue-700">Pre-Pregnancy BMI</Text>
                                <Text className="text-2xl font-bold text-blue-800">{bmiResult.bmi}</Text>
                                <Text className="text-xs font-medium text-blue-600 uppercase">{bmiResult.category}</Text>
                            </View>
                            <View className="items-end">
                                <Text className="text-sm text-blue-700">Total Weight Gain</Text>
                                <Text className="text-2xl font-bold text-blue-800">+{bmiResult.weightGain} kg</Text>
                            </View>
                        </View>

                        <View className="bg-white/60 p-4 rounded-xl">
                            <Ionicons name="information-circle" size={20} color="#3B82F6" className="mb-1" />
                            <Text className="text-blue-800 text-sm leading-5 font-medium">
                                {bmiResult.recommendation}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
