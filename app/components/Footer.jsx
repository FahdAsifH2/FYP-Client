import { Text, View } from 'react-native'
import React from 'react'

const Footer = () => (
  <View className="absolute bottom-0 left-0 right-0 h-14 bg-purple-600/60 justify-center items-center z-10">
      <Text style={{ color: 'white' }}>{`© ${new Date().getFullYear()} - All Rights Reserved.`}</Text>
  </View>
)

export default Footer
