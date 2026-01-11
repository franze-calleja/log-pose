import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [permission, setPermission] =
    useState<Location.PermissionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      setPermission(status);

      if (status === 'granted') {
        getCurrentLocation();
      }
    } catch (err) {
      setError('Failed to request location permission');
      console.error(err);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);
    } catch (err) {
      setError('Failed to get current location');
      console.error(err);
    }
  };

  return {
    location,
    permission,
    error,
    requestPermission,
    getCurrentLocation,
  };
}
