import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';

export function useCamera() {
  const [permission, setPermission] = useState<Camera.PermissionStatus | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status);
    } catch (err) {
      setError('Failed to request camera permission');
      console.error(err);
    }
  };

  return {
    permission,
    error,
    requestPermission,
    hasPermission: permission === 'granted',
  };
}
