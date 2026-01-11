import { ActivityIndicator, FlatList, View } from 'react-native';
import { EmptyState } from '../../components/journals/EmptyState';
import { JournalCard } from '../../components/journals/JournalCard';
import { useLogs } from '../../hooks/queries/useLogs';
import { useGeocodeEnrichment } from '../../hooks/useGeocodeEnrichment';

export default function JournalsScreen() {
  const { data: logs, isLoading } = useLogs();
  
  // Trigger geocoding enrichment when screen is focused
  useGeocodeEnrichment();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <View className="flex-1 bg-white">
        <EmptyState />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="px-4 mt-4">
            <JournalCard 
              log={item} 
              onPress={() => console.log('View log:', item.id)}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
