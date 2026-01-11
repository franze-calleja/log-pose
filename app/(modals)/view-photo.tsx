import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function ViewPhotoModal() {
  return (
    <>
      <Stack.Screen options={{ title: 'Photo', presentation: 'fullScreenModal' }} />
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-xl">Photo Viewer</Text>
        <Text className="text-gray-400 mt-2">Full-screen photo view</Text>
      </View>
    </>
  );
}
