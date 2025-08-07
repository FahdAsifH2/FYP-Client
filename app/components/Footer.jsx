import { Text, View } from 'react-native'
import React from 'react'

const Footer = () => (
  <View className="bg-white border-t border-gray-100 py-4 px-6">
    <Text className="text-center text-sm text-gynai-gray-500">
      © {new Date().getFullYear()} GynAI - All Rights Reserved.
    </Text>
    <Text className="text-center text-xs text-gynai-gray-400 mt-1">
      Your trusted companion for every stage of womanhood
    </Text>
  <View className="absolute bottom-0 left-0 right-0 h-12 bg-purple-600 justify-center items-center z-10 mt-12">
      <Text style={{ color: 'white' }}>{`© ${new Date().getFullYear()} - All Rights Reserved.`}</Text>
  </View>
)

export default Footer
