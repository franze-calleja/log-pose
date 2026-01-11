import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateTripInput } from '../../db/schema';
import * as logRepository from '../../services/database/log.repository';
import * as tripRepository from '../../services/database/trip.repository';

export function useTrips(options?: { excludeEmptyDefault?: boolean }) {
  return useQuery({
    queryKey: ['trips', options],
    queryFn: async () => {
      return await tripRepository.getAllTrips(options);
    },
  });
}

export function useArchivedTrips() {
  return useQuery({
    queryKey: ['trips', 'archived'],
    queryFn: async () => {
      return await tripRepository.getArchivedTrips();
    },
  });
}

export function useActiveTrip() {
  return useQuery({
    queryKey: ['activeTrip'],
    queryFn: async () => {
      return await tripRepository.getOrCreateActiveTrip();
    },
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTripInput) => {
      return await tripRepository.createTrip(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['activeTrip'] });
    },
  });
}

export function useRenameTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, name }: { tripId: number; name: string }) => {
      return await tripRepository.renameTrip(tripId, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useArchiveTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripId: number) => {
      await tripRepository.archiveTrip(tripId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useMoveLogsToTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fromTripId,
      toTripId,
    }: {
      fromTripId: number;
      toTripId: number;
    }) => {
      await logRepository.moveLogsToTrip(fromTripId, toTripId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}
