import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function CameraModal() {
  return (
    <>
      <Stack.Screen options={{ title: 'Take Photo' }} />
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-xl">Camera View</Text>
        <Text className="text-gray-400 mt-2">Camera integration coming soon</Text>
      </View>
    </>
  );
}
