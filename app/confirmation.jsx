import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './_contexts/AuthContext';

export default function ConfirmationScreen() {
    const router = useRouter();
    const { role } = useLocalSearchParams();
    const { user } = useAuth();

    useEffect(() => {
        // Auto-redirect after 3 seconds for a smooth UX
        const timer = setTimeout(() => {
            handleComplete();
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleComplete = () => {
        // Just trigger standard flow logic handled by Layout/Index
        // Actually, since we want reliable UX, push directly to dashboard
        if (role === 'doctor' || user?.role === 'doctor') {
            router.replace('/DoctorScreens/DashBoard');
        } else {
            router.replace('/PatientScreens/PatientsDashBoard');
        }
    };

    return (
        <View className="flex-1 bg-gradient-to-br from-primary-50 via-white to-white px-6 justify-center items-center">
            <View className="bg-white rounded-full p-6 shadow-md shadow-pink-100 mb-8 border border-gynai-gray-100">
                <Ionicons name="checkmark-circle" size={80} color="#10B981" />
            </View>

            <Text className="text-4xl font-extrabold text-gynai-gray-900 mb-4 text-center tracking-tight">
                Account Created!
            </Text>

            <Text className="text-gynai-gray-500 text-center text-lg mb-10 mx-6">
                Your registration is complete. Welcome to GynAI! We are getting your personalized dashboard ready.
            </Text>

            <View className="mb-10 items-center justify-center">
                <ActivityIndicator size="large" color={role === 'doctor' ? "#8B5CF6" : "#EC4899"} />
            </View>

            <TouchableOpacity
                className={`w-full rounded-2xl py-4 flex-row justify-center items-center shadow-md ${role === 'doctor' ? 'bg-gynai-purple' : 'bg-gynai-pink'}`}
                onPress={handleComplete}
            >
                <Text className="text-white font-bold text-lg">Go to Dashboard</Text>
            </TouchableOpacity>
        </View>
    );
}
