import * as Network from 'expo-network';
import {
    GEOCODE_BATCH_SIZE,
    NOMINATIM_API_URL,
    NOMINATIM_DELAY_MS,
    NOMINATIM_USER_AGENT,
} from '../../lib/constants';
import * as logRepository from '../database/log.repository';

interface NominatimResponse {
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    city?: string;
    country?: string;
  };
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function enrichLogAddress(
  logId: number,
  lat: number,
  lng: number
): Promise<void> {
  try {
    console.log(`[GeocodingService] Enriching address for log ${logId}...`);

    const url = `${NOMINATIM_API_URL}/reverse?format=json&lat=${lat}&lon=${lng}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': NOMINATIM_USER_AGENT,
      },
    });

    if (!response.ok) {
      console.warn(
        `[GeocodingService] Nominatim returned ${response.status}`
      );
      return;
    }

    const data: NominatimResponse = await response.json();

    if (data.display_name) {
      await logRepository.updateLogAddress(logId, data.display_name);
      console.log(
        `[GeocodingService] Updated address for log ${logId}:`,
        data.display_name
      );
    }
  } catch (error) {
    // Silent failure - network may be down or rate limited
    console.warn(
      '[GeocodingService] Failed to fetch address (ignoring):',
      error
    );
  }
}

export async function batchEnrichPendingLogs(options?: {
  visibleLogIds?: number[];
}): Promise<void> {
  try {
    // Check network connectivity
    const networkState = await Network.getNetworkStateAsync();

    if (!networkState.isConnected || !networkState.isInternetReachable) {
      console.log('[GeocodingService] No network connection, skipping batch enrichment');
      return;
    }

    console.log('[GeocodingService] Starting batch enrichment...');

    // Get logs needing geocoding (prioritize visible items)
    const logs = await logRepository.getLogsNeedingGeocode({
      limit: GEOCODE_BATCH_SIZE,
      logIds: options?.visibleLogIds,
    });

    if (logs.length === 0) {
      console.log('[GeocodingService] No logs need geocoding');
      return;
    }

    console.log(
      `[GeocodingService] Enriching ${logs.length} logs with 1.5s delay...`
    );

    // Process each log with delay to respect rate limits
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];

      await enrichLogAddress(log.id, log.latitude, log.longitude);

      // Add delay between requests (except after the last one)
      if (i < logs.length - 1) {
        await sleep(NOMINATIM_DELAY_MS);
      }
    }

    console.log('[GeocodingService] Batch enrichment complete');
  } catch (error) {
    console.error('[GeocodingService] Error in batch enrichment:', error);
  }
}
