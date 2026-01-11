import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import type { Log } from '../../db/schema';
import { SkeletonLoader } from '../ui/SkeletonLoader';

interface JournalCardProps {
  log: Log;
  thumbnailUri?: string;
  onPress?: () => void;
}

export function JournalCard({ log, thumbnailUri, onPress }: JournalCardProps) {
  const formattedDate = new Date(log.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const coordinates = `${log.latitude.toFixed(4)}, ${log.longitude.toFixed(4)}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white rounded-xl shadow-md overflow-hidden mb-4"
    >
      {thumbnailUri && (
        <Image
          source={{ uri: thumbnailUri }}
          className="w-full h-48"
          resizeMode="cover"
        />
      )}

      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="location" size={16} color="#6b7280" />
          <View className="ml-2 flex-1">
            {log.address ? (
              <Text className="text-sm text-gray-700" numberOfLines={1}>
                {log.address}
              </Text>
            ) : (
              <SkeletonLoader width="80%" height={14} />
            )}
          </View>
        </View>

        {!log.address && (
          <Text className="text-xs text-gray-500 mb-1">{coordinates}</Text>
        )}

        {log.notes && (
          <Text className="text-gray-600 mb-2" numberOfLines={2}>
            {log.notes}
          </Text>
        )}

        <Text className="text-xs text-gray-400">{formattedDate}</Text>
      </View>
    </TouchableOpacity>
  );
}
