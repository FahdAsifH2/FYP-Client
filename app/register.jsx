import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from './_contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
    const { role } = useLocalSearchParams();
    const { register, loading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Use the passed role or default to patient
    const [selectedRole, setSelectedRole] = useState(role || 'patient');

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const result = await register(name, email, password, selectedRole);
        if (result.success) {
            // Push user to new confirmation flow
            router.replace(`/confirmation?role=${selectedRole}`);
        } else {
            Alert.alert('Registration Failed', result.error);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gradient-to-br from-primary-50 via-white to-white" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}>
            <TouchableOpacity
                className="absolute top-16 left-6 z-10 w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                onPress={() => router.replace('/')}
            >
                <Ionicons name="arrow-back" size={20} className="text-gynai-gray-700" />
            </TouchableOpacity>

            <View className="items-center mb-8 mt-12">
                <Text className="text-4xl font-extrabold text-gynai-gray-900 mb-2 tracking-tight">Create Account</Text>
                <Text className="text-gynai-gray-500 text-base text-center">Join our supportive community today</Text>
            </View>

            <View className="mb-6">
                <Text className="text-sm font-medium text-gynai-gray-700 mb-2">Full Name</Text>
                <TextInput
                    className="w-full bg-white border border-gynai-gray-100 placeholder:text-gynai-gray-400 rounded-2xl px-5 py-4 text-gynai-gray-900 shadow-sm"
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View className="mb-6">
                <Text className="text-sm font-medium text-gynai-gray-700 mb-2">Email</Text>
                <TextInput
                    className="w-full bg-white border border-gynai-gray-100 placeholder:text-gynai-gray-400 rounded-2xl px-5 py-4 text-gynai-gray-900 shadow-sm"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View className="mb-6">
                <Text className="text-sm font-medium text-gynai-gray-700 mb-2">Password</Text>
                <View className="w-full bg-white border border-gynai-gray-100 rounded-2xl flex-row items-center px-5 shadow-sm">
                    <TextInput
                        className="flex-1 py-4 text-gynai-gray-900 placeholder:text-gynai-gray-400"
                        placeholder="Create a password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="pl-3">
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Internal Role Selection, if not provided via params */}
            {!role && (
                <View className="mb-8">
                    <Text className="text-sm font-medium text-gynai-gray-700 mb-3">I am a...</Text>
                    <View className="flex-row gap-4">
                        <TouchableOpacity
                            className={`flex-1 py-4 rounded-2xl border shadow-sm items-center justify-center ${selectedRole === 'patient' ? 'bg-primary-50 border-gynai-pink' : 'bg-white border-gynai-gray-100'}`}
                            onPress={() => setSelectedRole('patient')}
                        >
                            <Text className={`text-center font-bold ${selectedRole === 'patient' ? 'text-gynai-pink' : 'text-gynai-gray-500'}`}>Patient</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 py-4 rounded-2xl border shadow-sm items-center justify-center ${selectedRole === 'doctor' ? 'bg-purple-50 border-gynai-purple' : 'bg-white border-gynai-gray-100'}`}
                            onPress={() => setSelectedRole('doctor')}
                        >
                            <Text className={`text-center font-bold ${selectedRole === 'doctor' ? 'text-gynai-purple' : 'text-gynai-gray-500'}`}>Doctor</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <TouchableOpacity
                className={`w-full rounded-2xl py-4 flex-row justify-center items-center shadow-md pb-4 pt-4 mt-2 ${selectedRole === 'doctor' ? 'bg-gynai-purple' : 'bg-gynai-pink'} ${(loading) ? 'opacity-70' : ''}`}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Sign Up</Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-10 pb-6">
                <Text className="text-gynai-gray-500 text-base">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text className={`font-bold text-base ${selectedRole === 'doctor' ? 'text-gynai-purple' : 'text-gynai-pink'}`}>Log In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
