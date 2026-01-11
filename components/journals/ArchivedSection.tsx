import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import type { Trip } from '../../db/schema';

interface ArchivedSectionProps {
  archivedTrips: Trip[];
  onTripPress?: (trip: Trip) => void;
}

export function ArchivedSection({ archivedTrips, onTripPress }: ArchivedSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (archivedTrips.length === 0) {
    return null;
  }

  return (
    <View className="mt-6">
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between px-4 py-3 bg-gray-100 rounded-lg"
      >
        <Text className="text-gray-700 font-semibold">
          Archived ({archivedTrips.length})
        </Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6b7280"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View className="mt-2">
          {archivedTrips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              onPress={() => onTripPress?.(trip)}
              className="px-4 py-3 bg-white rounded-lg mb-2 flex-row items-center"
            >
              <Ionicons name="archive" size={20} color="#9ca3af" />
              <Text className="ml-3 text-gray-600">{trip.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
