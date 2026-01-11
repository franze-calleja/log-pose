import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import type { Trip } from '../../db/schema';
import { GlassCard } from '../ui/GlassCard';

interface TripSelectorPillProps {
  activeTrip: Trip | null;
  onPress?: () => void;
}

export function TripSelectorPill({ activeTrip, onPress }: TripSelectorPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="absolute top-12 self-center"
    >
      <GlassCard className="flex-row items-center px-4 py-2">
        <Ionicons name="location" size={16} color="#3b82f6" />
        <Text className="mx-2 font-semibold text-gray-800">
          {activeTrip?.name || 'Loading...'}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#6b7280" />
      </GlassCard>
    </TouchableOpacity>
  );
}
