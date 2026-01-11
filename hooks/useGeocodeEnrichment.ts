import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import * as geocodingService from '../services/location/geocoding.service';

export function useGeocodeEnrichment(visibleLogIds?: number[]) {
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      // Run enrichment when screen is focused
      geocodingService
        .batchEnrichPendingLogs({ visibleLogIds })
        .then(() => {
          // Invalidate queries to refetch updated addresses
          queryClient.invalidateQueries({ queryKey: ['logs'] });
        })
        .catch((error) => {
          console.error('[useGeocodeEnrichment] Error:', error);
        });
    }, [visibleLogIds, queryClient])
  );
}
