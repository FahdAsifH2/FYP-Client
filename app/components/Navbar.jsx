// Navbar.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Navbar = ({ title = "GynAI", showBack = false, onBackPress }) => {
  return (
    <View className="pt-16 pb-4 px-6 bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between">
        {showBack ? (
          <TouchableOpacity onPress={onBackPress} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
        ) : (
          <View className="w-8" />
        )}
        
        <Text className="text-2xl font-bold text-gynai-gray-800 text-center flex-1">
          {title}
        </Text>
        
        <View className="w-8" />
      </View>
    <View className="absolute top-0 left-0 right-0 h-22 bg-purple-600 justify-center items-center z-10">
      <Text className="text-white font-bold  text-2xl mt-10 mb-2">GynAI</Text>
    </View>
  );
};

export default Navbar;
