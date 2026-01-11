import { Text, View } from 'react-native';
import { useLogs } from '../../hooks/queries/useLogs';
import { useActiveTrip } from '../../hooks/queries/useTrips';

export default function MapScreen() {
  const { data: activeTrip, isLoading: tripLoading } = useActiveTrip();
  const { data: logs, isLoading: logsLoading } = useLogs();

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-xl font-bold mb-4">Map View</Text>
      
      {/* Database Test */}
      <View className="bg-white p-4 rounded-lg shadow mb-4 w-80">
        <Text className="font-semibold mb-2">Database Test:</Text>
        {tripLoading ? (
          <Text className="text-gray-500">Loading trip...</Text>
        ) : (
          <Text className="text-green-600">
            ✓ Active Trip: {activeTrip?.name}
          </Text>
        )}
        {logsLoading ? (
          <Text className="text-gray-500">Loading logs...</Text>
        ) : (
          <Text className="text-blue-600 mt-1">
            Logs: {logs?.length || 0}
          </Text>
        )}
      </View>

      <Text className="text-gray-600 mt-2">OpenStreetMap integration coming soon</Text>
    </View>
  );
}
