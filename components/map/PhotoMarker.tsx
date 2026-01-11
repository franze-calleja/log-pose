import { Image, Text, View } from 'react-native';
import { Callout, Marker } from 'react-native-maps';
import type { Log } from '../../db/schema';
import { SkeletonLoader } from '../ui/SkeletonLoader';

interface PhotoMarkerProps {
  log: Log;
  thumbnailUri?: string;
  onPress?: () => void;
}

export function PhotoMarker({ log, thumbnailUri, onPress }: PhotoMarkerProps) {
  const coordinates = {
    latitude: log.latitude,
    longitude: log.longitude,
  };

  const coordinatesText = `${log.latitude.toFixed(4)}, ${log.longitude.toFixed(4)}`;

  return (
    <Marker
      coordinate={coordinates}
      onPress={onPress}
      identifier={log.id.toString()}
    >
      {thumbnailUri && (
        <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
          <Image
            source={{ uri: thumbnailUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}

      <Callout>
        <View className="p-2 min-w-[200px]">
          {log.address ? (
            <Text className="font-semibold mb-1">{log.address}</Text>
          ) : (
            <View className="mb-1">
              <SkeletonLoader width={150} height={14} />
              <Text className="text-xs text-gray-500 mt-1">
                {coordinatesText}
              </Text>
            </View>
          )}

          {log.notes && (
            <Text className="text-sm text-gray-600" numberOfLines={2}>
              {log.notes}
            </Text>
          )}

          <Text className="text-xs text-gray-400 mt-1">
            {new Date(log.created_at).toLocaleDateString()}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}
