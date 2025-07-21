import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() 
{
  return (
    <SafeAreaView className="flex-1 bg-white px-4 justify-center">
      <Text className="text-2xl font-bold text-center mb-6">Welcome Doctor</Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4"
        placeholder="Enter patient name helo"
      />

      <TouchableOpacity className="bg-zinc-600 py-3 rounded-lg">
        <Text className="text-white text-center font-semibold">Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
