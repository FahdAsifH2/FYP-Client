// Navbar.jsx
import React from 'react';
import { View, Text } from 'react-native';

const Navbar = () => {
  return (
    <View className="absolute top-0 left-0 right-0 h-22 bg-purple-600 justify-center items-center z-10">
      <Text className="text-white font-bold  text-2xl mt-10 mb-2">GynAI</Text>
    </View>
  );
};

export default Navbar;
