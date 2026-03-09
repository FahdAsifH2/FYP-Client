import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SymptomTracker() {
    const router = useRouter();
    const [notes, setNotes] = useState('');

    const symptomsList = [
        { id: '1', label: 'Morning Sickness', icon: 'sad-outline', color: '#EC4899' },
        { id: '2', label: 'Fatigue', icon: 'bed-outline', color: '#8B5CF6' },
        { id: '3', label: 'Headache', icon: 'flash-outline', color: '#EF4444' },
        { id: '4', label: 'Back Pain', icon: 'body-outline', color: '#F59E0B' },
        { id: '5', label: 'Cramps', icon: 'pulse-outline', color: '#10B981' },
        { id: '6', label: 'Spotting', icon: 'water-outline', color: '#EF4444' },
        { id: '7', label: 'Swelling', icon: 'footsteps-outline', color: '#3B82F6' },
        { id: '8', label: 'No Symptoms', icon: 'happy-outline', color: '#10B981' },
    ];

    const [selected, setSelected] = useState([]);

    const toggleSymptom = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleSave = () => {
        if (selected.length === 0 && notes.trim() === '') {
            Alert.alert('No Data', 'Please select a symptom or write a note.');
            return;
        }
        Alert.alert('Saved', 'Your daily logs have been safely recorded for your doctor to review.');
        router.back();
    };

    return (
        <ScrollView className="flex-1 bg-indigo-50/30">
            <View className="pt-16 pb-6 px-6 bg-white shadow-sm flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gynai-gray-800 tracking-tight">Log Symptoms</Text>
            </View>

            <View className="p-6">
                <Text className="text-gray-600 mb-6 font-medium text-base">
                    Tracking your daily symptoms helps us monitor your pregnancy progress and alert you if professional consultation is advised.
                </Text>

                <Text className="text-lg font-bold text-gray-900 mb-4 px-1">How are you feeling today?</Text>

                <View className="flex-row flex-wrap justify-between">
                    {symptomsList.map((symptom) => {
                        const isSelected = selected.includes(symptom.id);
                        return (
                            <TouchableOpacity
                                key={symptom.id}
                                onPress={() => toggleSymptom(symptom.id)}
                                className={`w-[48%] p-4 rounded-2xl border-2 items-center mb-4 shadow-sm ${isSelected ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-gray-100'}`}
                            >
                                <View className={`w-12 h-12 rounded-full justify-center items-center mb-2 ${isSelected ? 'bg-indigo-200' : 'bg-gray-100'}`}>
                                    <Ionicons name={symptom.icon} size={24} color={isSelected ? '#4F46E5' : '#6B7280'} />
                                </View>
                                <Text className={`font-bold text-center ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                                    {symptom.label}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <Text className="text-lg font-bold text-gray-900 mb-4 px-1 mt-4">Additional Notes</Text>
                <TextInput
                    className="bg-white border border-gray-200 rounded-2xl p-4 text-gray-900 h-32 shadow-sm text-base"
                    placeholder="Detailed observations or thoughts..."
                    multiline
                    textAlignVertical="top"
                    value={notes}
                    onChangeText={setNotes}
                />

                <TouchableOpacity
                    className="w-full bg-indigo-600 rounded-2xl py-4 flex-row justify-center items-center shadow-lg shadow-indigo-200 mt-8 mb-10"
                    onPress={handleSave}
                >
                    <Ionicons name="save-outline" size={24} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">Save Daily Log</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
