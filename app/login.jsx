import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from './contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const { login, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const result = await login(email, password);
        if (result.success) {
            // user state is updated in context, we could route them based on role
            // Assuming user.role is accessible right after login updates the state
            // We'll let the layout handle routing or route them directly
            Alert.alert('Success', 'Logged in successfully');
            router.replace('/');
        } else {
            Alert.alert('Login Failed', result.error);
        }
    };

    return (
        <View className="flex-1 bg-gradient-to-br from-primary-50 via-white to-white px-6 justify-center">
            <TouchableOpacity
                className="absolute top-16 left-6 z-10 w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                onPress={() => router.replace('/')}
            >
                <Ionicons name="arrow-back" size={20} className="text-gynai-gray-700" />
            </TouchableOpacity>

            <View className="items-center mb-10 mt-8">
                <Text className="text-4xl font-extrabold text-gynai-gray-900 mb-2 tracking-tight">Welcome Back</Text>
                <Text className="text-gynai-gray-500 text-base text-center">Log in to continue your journey</Text>
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

            <View className="mb-8">
                <Text className="text-sm font-medium text-gynai-gray-700 mb-2">Password</Text>
                <TextInput
                    className="w-full bg-white border border-gynai-gray-100 placeholder:text-gynai-gray-400 rounded-2xl px-5 py-4 text-gynai-gray-900 shadow-sm"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity
                className={`w-full rounded-2xl py-4 flex-row justify-center items-center shadow-md bg-gynai-pink mt-3 ${loading ? 'opacity-70' : ''}`}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">Log In</Text>
                )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-10 pb-6">
                <Text className="text-gynai-gray-500 text-base">Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text className="font-bold text-base text-gynai-pink">Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
