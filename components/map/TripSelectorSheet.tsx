import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { forwardRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { Trip } from '../../db/schema';

interface TripSelectorSheetProps {
  trips: Trip[];
  activeTripId: number | null;
  onSelectTrip?: (trip: Trip) => void;
  onCreateTrip?: (name: string) => void;
  onMoveLogsPrompt?: (defaultTrip: Trip, newTrip: Trip) => void;
}

export const TripSelectorSheet = forwardRef<
  BottomSheetModal,
  TripSelectorSheetProps
>(({ trips, activeTripId, onSelectTrip, onCreateTrip, onMoveLogsPrompt }, ref) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTripName, setNewTripName] = useState('');

  const handleCreateTrip = () => {
    if (newTripName.trim()) {
      onCreateTrip?.(newTripName.trim());
      setNewTripName('');
      setIsCreating(false);
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['50%', '80%']}
      enablePanDownToClose
    >
      <BottomSheetScrollView className="px-4">
        <Text className="text-xl font-bold mb-4">Select Trip</Text>

        {/* Current Trip */}
        {activeTripId && (
          <View className="mb-4">
            <Text className="text-sm text-gray-500 mb-2">Current Trip</Text>
            {trips
              .filter((t) => t.id === activeTripId)
              .map((trip) => (
                <View
                  key={trip.id}
                  className="bg-blue-50 rounded-lg p-4 flex-row items-center"
                >
                  <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                  <Text className="ml-3 font-semibold text-blue-900">
                    {trip.name}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {/* Trip List */}
        <Text className="text-sm text-gray-500 mb-2">All Trips</Text>
        {trips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            onPress={() => onSelectTrip?.(trip)}
            className={`p-4 mb-2 rounded-lg flex-row items-center ${
              trip.id === activeTripId ? 'bg-gray-100' : 'bg-white border border-gray-200'
            }`}
          >
            <Ionicons
              name={trip.id === activeTripId ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={trip.id === activeTripId ? '#3b82f6' : '#9ca3af'}
            />
            <Text className="ml-3 text-gray-800">{trip.name}</Text>
            {trip.is_default === 1 && (
              <Text className="ml-auto text-xs text-gray-500">Default</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Create New Trip */}
        {isCreating ? (
          <View className="mt-4 p-4 bg-gray-50 rounded-lg">
            <TextInput
              value={newTripName}
              onChangeText={setNewTripName}
              placeholder="Trip name (e.g., Paris 2026)"
              className="bg-white p-3 rounded-lg mb-3"
              autoFocus
            />
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleCreateTrip}
                className="flex-1 bg-blue-500 p-3 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsCreating(false);
                  setNewTripName('');
                }}
                className="flex-1 bg-gray-200 p-3 rounded-lg items-center"
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setIsCreating(true)}
            className="mt-4 p-4 bg-blue-500 rounded-lg flex-row items-center justify-center"
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text className="ml-2 text-white font-semibold">
              Create New Trip
            </Text>
          </TouchableOpacity>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

TripSelectorSheet.displayName = 'TripSelectorSheet';
