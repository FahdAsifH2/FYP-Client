import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Appointments() {
    const router = useRouter();

    // Dummy dynamic data
    const [appointments] = useState([
        { id: '1', date: 'Oct 15, 2026', time: '10:00 AM', doctor: 'Dr. Sarah Jenkins', type: '20-Week Ultrasound', status: 'upcoming', clinic: 'Women Health Clinic' },
        { id: '2', date: 'Nov 12, 2026', time: '02:30 PM', doctor: 'Dr. Sarah Jenkins', type: 'Routine Checkup', status: 'upcoming', clinic: 'Women Health Clinic' },
        { id: '3', date: 'Sep 10, 2026', time: '11:15 AM', doctor: 'Dr. Sarah Jenkins', type: '12-Week Scan (Nuchal Translucency)', status: 'completed', clinic: 'City General Hospital' },
    ]);

    const renderItem = ({ item }) => {
        const isUpcoming = item.status === 'upcoming';
        return (
            <View className={`p-5 mb-4 rounded-2xl border ${isUpcoming ? 'bg-white border-green-100 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                <View className="flex-row justify-between items-start mb-3">
                    <View>
                        <Text className="text-lg font-bold text-gray-900">{item.type}</Text>
                        <Text className="text-sm text-gray-500 mt-1">{item.doctor}</Text>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${isUpcoming ? 'bg-green-100' : 'bg-gray-200'}`}>
                        <Text className={`text-xs font-bold ${isUpcoming ? 'text-green-700' : 'text-gray-600'}`}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center mt-2">
                    <Ionicons name="calendar-outline" size={16} color="#4B5563" />
                    <Text className="text-gray-600 ml-2 text-sm">{item.date} • {item.time}</Text>
                </View>
                <View className="flex-row items-center mt-2">
                    <Ionicons name="location-outline" size={16} color="#4B5563" />
                    <Text className="text-gray-600 ml-2 text-sm">{item.clinic}</Text>
                </View>

                {isUpcoming && (
                    <View className="flex-row justify-between mt-4 border-t border-gray-100 pt-4">
                        <TouchableOpacity className="flex-1 bg-green-50 rounded-xl py-2 mr-2 items-center border border-green-200">
                            <Text className="text-green-700 font-bold">Reschedule</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-xl py-2 ml-2 items-center">
                            <Text className="text-gray-600 font-bold">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <View className="pt-16 pb-6 px-6 bg-white shadow-sm flex-row items-center border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gynai-gray-800 tracking-tight">Appointments</Text>
            </View>

            <FlatList
                className="flex-1 px-6 pt-6"
                data={appointments}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListHeaderComponent={() => (
                    <TouchableOpacity className="w-full bg-green-500 rounded-2xl py-4 flex-row justify-center items-center shadow-sm mb-6">
                        <Ionicons name="add" size={24} color="white" />
                        <Text className="text-white font-bold text-lg ml-2">Book New Appointment</Text>
                    </TouchableOpacity>
                )}
                ListFooterComponent={<View className="h-10" />}
            />
        </View>
    );
}
