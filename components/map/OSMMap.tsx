import { Platform } from 'react-native';
import MapView, { UrlTile, type MapViewProps } from 'react-native-maps';
import { OSM_TILE_URL } from '../../lib/constants';

export function OSMMap({ children, ...props }: MapViewProps) {
  return (
    <MapView {...props}>
      {Platform.OS === 'android' && (
        <UrlTile
          urlTemplate={OSM_TILE_URL}
          maximumZ={19}
          flipY={false}
        />
      )}
      {children}
    </MapView>
  );
}
