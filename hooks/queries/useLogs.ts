import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as logRepository from '../../services/database/log.repository';
import * as photoRepository from '../../services/database/photo.repository';
import * as tripRepository from '../../services/database/trip.repository';
import * as photoService from '../../services/file-system/photo.service';
import * as geocodingService from '../../services/location/geocoding.service';

export function useLogs(tripId?: number) {
  return useQuery({
    queryKey: ['logs', tripId],
    queryFn: async () => {
      return await logRepository.getLogs({ tripId });
    },
  });
}

export function useLog(logId: number | null) {
  return useQuery({
    queryKey: ['log', logId],
    queryFn: async () => {
      if (!logId) return null;
      return await logRepository.getLogById(logId);
    },
    enabled: !!logId,
  });
}

export function usePhotos(logId: number | null) {
  return useQuery({
    queryKey: ['photos', logId],
    queryFn: async () => {
      if (!logId) return [];
      return await photoRepository.getPhotosByLogId(logId);
    },
    enabled: !!logId,
  });
}

interface CreateLogWithPhotosInput {
  photoUris: string[];
  latitude: number;
  longitude: number;
  notes?: string;
}

export function useCreateLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateLogWithPhotosInput) => {
      console.log('[useCreateLog] Creating log with photos...');

      // 1. Get or create active trip
      const trip = await tripRepository.getOrCreateActiveTrip();

      // 2. Save and compress photos
      const savedPhotos = await Promise.all(
        input.photoUris.map((uri) => photoService.savePhoto(uri))
      );

      // 3. Create log with null address
      const log = await logRepository.createLog({
        trip_id: trip.id,
        latitude: input.latitude,
        longitude: input.longitude,
        notes: input.notes,
      });

      // 4. Create photo records
      await Promise.all(
        savedPhotos.map((photo) =>
          photoRepository.createPhoto({
            log_id: log.id,
            uri: photo.uri,
            thumbnail_uri: photo.thumbnailUri,
          })
        )
      );

      // 5. Trigger async address enrichment (don't await)
      geocodingService.enrichLogAddress(
        log.id,
        input.latitude,
        input.longitude
      );

      return { log, trip };
    },
    onSuccess: () => {
      // Invalidate logs query to refetch
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

export function useUpdateLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      logId,
      updates,
    }: {
      logId: number;
      updates: { notes?: string; address?: string };
    }) => {
      return await logRepository.updateLog(logId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}

export function useDeleteLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logId: number) => {
      await logRepository.deleteLogWithFiles(logId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
    },
  });
}
