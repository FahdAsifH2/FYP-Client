import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const Cards = ({ Title, Description, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-purple-300 rounded-xl shadow-md p-4 w-11/12 max-w-md"
    >
      <Text className="text-lg font-bold text-gray-800 mb-2">{Title}</Text>
      <Text className="text-sm text-gray-600">{Description}</Text>
    </TouchableOpacity>
  );
};

export default Cards;
