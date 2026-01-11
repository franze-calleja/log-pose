import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function CreateLogModal() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add Log Details' }} />
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold">Create Log</Text>
        <Text className="text-gray-600 mt-2">Add notes and details to your log</Text>
      </View>
    </>
  );
}
