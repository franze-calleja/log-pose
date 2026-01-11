import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Ionicons name="compass-outline" size={80} color="#d1d5db" />
      <Text className="text-xl font-bold text-gray-800 mt-6 mb-2">
        Start Capturing Memories
      </Text>
      <Text className="text-gray-500 text-center">
        Take your first photo to begin your travel journal
      </Text>
    </View>
  );
}
