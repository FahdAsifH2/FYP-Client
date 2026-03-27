import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Cards = ({ Title, Description, onPress, icon = "medical", iconColor = "primary-500" }) => {
  const getIconBackgroundClass = (color) => {
    const colorMap = {
      'primary-500': 'bg-primary-500',
      'blue-500': 'bg-blue-500',
      'green-500': 'bg-green-500',
      'orange-500': 'bg-orange-500',
      'purple-500': 'bg-purple-500',
      'red-500': 'bg-red-500',
      'pink-500': 'bg-pink-500',
      'indigo-500': 'bg-indigo-500',
      'teal-500': 'bg-teal-500',
    };
    return colorMap[color] || 'bg-primary-500';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-3xl shadow-lg p-6 w-full border border-gray-100"
      style={{
        shadowColor: '#ec4899',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View className="flex-row items-start mb-4">
        <View className={`w-12 h-12 ${getIconBackgroundClass(iconColor)} rounded-2xl items-center justify-center mr-4`}>
          <Ionicons name={icon} size={24} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gynai-gray-800 mb-2 leading-6">
            {Title}
          </Text>
          <Text className="text-sm text-gynai-gray-600 leading-5">
            {Description}
          </Text>
        </View>
      </View>
      
      <View className="bg-primary-50 rounded-xl p-3 mt-2">
        <Text className="text-primary-700 font-medium text-center text-sm">
          Learn More →
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Cards;
