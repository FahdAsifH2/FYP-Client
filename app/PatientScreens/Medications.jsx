import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Medications() {
    const router = useRouter();

    const [meds, setMeds] = useState([
        { id: '1', name: 'Prenatal Vitamins', dose: '1 Tablet', time: 'Morning after food', taken: false, color: 'bg-pink-100', icon: 'medical' },
        { id: '2', name: 'Iron Supplement', dose: '60mg', time: 'Lunch with Vitamin C', taken: true, color: 'bg-orange-100', icon: 'leaf' },
        { id: '3', name: 'Folic Acid', dose: '400mcg', time: 'Evening', taken: false, color: 'bg-green-100', icon: 'nutrition' },
        { id: '4', name: 'Calcium', dose: '1000mg', time: 'Night before bed', taken: false, color: 'bg-blue-100', icon: 'fitness' }
    ]);

    const toggleMed = (id) => {
        setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="pt-16 pb-6 px-6 bg-white shadow-sm flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gynai-gray-800 tracking-tight">Daily Medications</Text>
            </View>

            <View className="p-6">
                <View className="bg-gynai-pink p-6 flex-row justify-between items-center rounded-3xl mb-8 shadow-sm">
                    <View className="flex-1 mr-4">
                        <Text className="text-white text-lg font-bold mb-1">Stay Consistent!</Text>
                        <Text className="text-pink-100 text-sm leading-5">Prenatal vitamins provide crucial nutrients for your baby's neural development.</Text>
                    </View>
                    <Ionicons name="heart" size={48} color="white" className="opacity-80" />
                </View>

                <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Today's Schedule</Text>

                {meds.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => toggleMed(item.id)}
                        className={`p-4 rounded-2xl border flex-row items-center justify-between mb-4 shadow-sm ${item.taken ? 'bg-gray-100 border-gray-200' : 'bg-white border-pink-100'}`}
                    >
                        <View className="flex-row items-center flex-1">
                            <View className={`w-14 h-14 rounded-full justify-center items-center mr-4 ${item.taken ? 'bg-gray-200' : item.color}`}>
                                <Ionicons name={item.icon} size={24} color={item.taken ? '#9CA3AF' : '#EC4899'} />
                            </View>
                            <View className="flex-1 pb-1">
                                <Text className={`text-lg font-bold ${item.taken ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{item.name}</Text>
                                <Text className={`font-medium ${item.taken ? 'text-gray-400 line-through' : 'text-pink-500'}`}>{item.dose}</Text>
                                <View className="flex-row items-center mt-1">
                                    <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                                    <Text className="text-sm text-gray-400 ml-1">{item.time}</Text>
                                </View>
                            </View>
                        </View>
                        <View className={`w-8 h-8 rounded-full border-2 justify-center items-center ${item.taken ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-300'}`}>
                            {item.taken && <Ionicons name="checkmark" size={18} color="white" />}
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-2xl flex-row justify-center items-center bg-gray-50 shadow-sm">
                    <Ionicons name="add" size={24} color="#6B7280" />
                    <Text className="text-gray-600 font-bold ml-2">Add New Medication</Text>
                </TouchableOpacity>

                <View className="h-10" />

            </View>
        </ScrollView>
    );
}
