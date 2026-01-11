import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useCreateLog } from '../../hooks/queries/useLogs';
import { useTrips } from '../../hooks/queries/useTrips';

export default function SettingsScreen() {
  const createLog = useCreateLog();
  const { data: trips } = useTrips();

  const addMockLog = async () => {
    try {
      // Mock coordinates (Tokyo Station)
      await createLog.mutateAsync({
        photoUris: [], // No photos for now
        latitude: 35.6812,
        longitude: 139.7671,
        notes: 'Test log from settings - Tokyo Station',
      });
      Alert.alert('Success', 'Mock log created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create log');
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-6">Settings</Text>
      
      {/* Debug Tools */}
      <View className="bg-gray-100 p-4 rounded-lg mb-4">
        <Text className="font-semibold mb-2">🛠️ Debug Tools</Text>
        
        <TouchableOpacity
          onPress={addMockLog}
          className="bg-blue-500 p-3 rounded-lg mb-2"
          disabled={createLog.isPending}
        >
          <Text className="text-white text-center font-semibold">
            {createLog.isPending ? 'Creating...' : 'Add Mock Log'}
          </Text>
        </TouchableOpacity>

        <View className="mt-2">
          <Text className="text-sm text-gray-600">
            Trips: {trips?.length || 0}
          </Text>
        </View>
      </View>

      <Text className="text-gray-500 text-sm mt-4">
        Tap "Add Mock Log" to create test data.
        Go to Journals tab to see it appear.
      </Text>
    </View>
  );
}
