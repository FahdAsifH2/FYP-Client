import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Emergency() {
    const router = useRouter();

    const handleCall = (number) => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="pt-16 pb-6 px-6 bg-red-50 shadow-sm flex-row items-center border-b border-red-100">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 bg-white p-2 rounded-full">
                    <Ionicons name="arrow-back" size={20} color="#EF4444" />
                </TouchableOpacity>
                <Text className="text-2xl font-extrabold text-red-600 tracking-tight">Emergency Help</Text>
            </View>

            <View className="p-6">
                <View className="bg-red-500 p-6 rounded-3xl items-center shadow-md mb-8">
                    <Ionicons name="warning" size={48} color="white" className="mb-2" />
                    <Text className="text-white text-xl font-bold text-center mb-1">Seek immediate medical care if you experience:</Text>
                    <Text className="text-red-50 text-center font-medium mt-2 leading-5">
                        Heavy bleeding • Severe abdominal pain • Lack of baby movement • Contractions every 5 minutes • Water breaking
                    </Text>
                </View>

                <Text className="text-lg font-bold text-gray-800 mb-4 px-2">Quick Contacts</Text>

                <TouchableOpacity
                    onPress={() => handleCall('911')}
                    className="bg-white border-2 border-red-500 rounded-2xl p-4 flex-row justify-between items-center mb-4 shadow-sm"
                >
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-red-100 rounded-full justify-center items-center mr-4">
                            <Ionicons name="call" size={24} color="#EF4444" />
                        </View>
                        <View>
                            <Text className="text-lg font-bold text-gray-900">National Emergency</Text>
                            <Text className="text-gray-500 font-medium">Ambulance & Paramedics</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleCall('1234567890')}
                    className="bg-white border border-gray-200 rounded-2xl p-4 flex-row justify-between items-center mb-4 shadow-sm"
                >
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-blue-50 rounded-full justify-center items-center mr-4">
                            <Ionicons name="medical" size={24} color="#3B82F6" />
                        </View>
                        <View>
                            <Text className="text-lg font-bold text-gray-900">Delivery Hospital</Text>
                            <Text className="text-gray-500 font-medium">Labor & Delivery Ward (24/7)</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleCall('1234567890')}
                    className="bg-white border border-gray-200 rounded-2xl p-4 flex-row justify-between items-center mb-4 shadow-sm"
                >
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-purple-50 rounded-full justify-center items-center mr-4">
                            <Ionicons name="person" size={24} color="#8B5CF6" />
                        </View>
                        <View>
                            <Text className="text-lg font-bold text-gray-900">My Doctor / OBGYN</Text>
                            <Text className="text-gray-500 font-medium">Dr. Sarah Jenkins</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                </TouchableOpacity>

                <View className="mt-6 mb-10 px-2">
                    <Text className="text-sm text-gray-400 text-center leading-5 uppercase tracking-wider font-bold">
                        Present this screen to first responders if you are unable to speak.
                    </Text>
                </View>

            </View>
        </ScrollView>
    );
}
