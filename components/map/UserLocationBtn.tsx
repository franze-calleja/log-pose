import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { TouchableOpacity } from 'react-native';
import type { Region } from 'react-native-maps';

interface UserLocationBtnProps {
  onLocationUpdate?: (region: Region) => void;
}

export function UserLocationBtn({ onLocationUpdate }: UserLocationBtnProps) {
  const handlePress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const region: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      onLocationUpdate?.(region);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="absolute bottom-24 right-6 bg-white rounded-full w-12 h-12 items-center justify-center shadow-lg"
      activeOpacity={0.8}
    >
      <Ionicons name="navigate" size={24} color="#3b82f6" />
    </TouchableOpacity>
  );
}
