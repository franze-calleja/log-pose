import { getDatabase } from '../../db/client';
import type { CreateLogInput, Log } from '../../db/schema';
import * as photoRepository from './photo.repository';

export async function createLog(input: CreateLogInput): Promise<Log> {
  const db = getDatabase();

  const result = await db.runAsync(
    'INSERT INTO logs (trip_id, latitude, longitude, notes, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
    [input.trip_id, input.latitude, input.longitude, input.notes ?? null]
  );

  const log = await db.getFirstAsync<Log>(
    'SELECT * FROM logs WHERE id = ?',
    [result.lastInsertRowId]
  );

  if (!log) {
    throw new Error('Failed to create log');
  }

  console.log('[LogRepo] Created log:', log);
  return log;
}

export async function getLogs(options?: {
  tripId?: number;
  includeArchived?: boolean;
}): Promise<Log[]> {
  const db = getDatabase();

  if (options?.tripId) {
    const logs = await db.getAllAsync<Log>(
      'SELECT l.* FROM logs l WHERE l.trip_id = ? ORDER BY l.created_at DESC',
      [options.tripId]
    );
    return logs;
  }

  // Get all logs from active trips
  const query = options?.includeArchived
    ? 'SELECT l.* FROM logs l ORDER BY l.created_at DESC'
    : `SELECT l.* FROM logs l 
       JOIN trips t ON l.trip_id = t.id 
       WHERE t.status = 'active' 
       ORDER BY l.created_at DESC`;

  const logs = await db.getAllAsync<Log>(query);
  return logs;
}

export async function getLogsNeedingGeocode(options?: {
  limit?: number;
  logIds?: number[];
}): Promise<Log[]> {
  const db = getDatabase();
  const limit = options?.limit ?? 5;

  if (options?.logIds && options.logIds.length > 0) {
    // Prioritize specific log IDs (visible items)
    const placeholders = options.logIds.map(() => '?').join(',');
    const logs = await db.getAllAsync<Log>(
      `SELECT * FROM logs 
       WHERE address IS NULL 
       AND id IN (${placeholders}) 
       LIMIT ?`,
      [...options.logIds, limit]
    );
    return logs;
  }

  // Get any logs without addresses
  const logs = await db.getAllAsync<Log>(
    'SELECT * FROM logs WHERE address IS NULL LIMIT ?',
    [limit]
  );

  return logs;
}

export async function updateLogAddress(
  logId: number,
  address: string
): Promise<void> {
  const db = getDatabase();

  await db.runAsync('UPDATE logs SET address = ? WHERE id = ?', [
    address,
    logId,
  ]);

  console.log('[LogRepo] Updated address for log:', logId);
}

export async function updateLog(
  logId: number,
  updates: { notes?: string; address?: string }
): Promise<Log> {
  const db = getDatabase();

  const setClauses: string[] = [];
  const values: any[] = [];

  if (updates.notes !== undefined) {
    setClauses.push('notes = ?');
    values.push(updates.notes);
  }

  if (updates.address !== undefined) {
    setClauses.push('address = ?');
    values.push(updates.address);
  }

  if (setClauses.length === 0) {
    throw new Error('No updates provided');
  }

  values.push(logId);

  await db.runAsync(
    `UPDATE logs SET ${setClauses.join(', ')} WHERE id = ?`,
    values
  );

  const log = await db.getFirstAsync<Log>('SELECT * FROM logs WHERE id = ?', [
    logId,
  ]);

  if (!log) {
    throw new Error('Log not found after update');
  }

  return log;
}

export async function moveLogsToTrip(
  fromTripId: number,
  toTripId: number
): Promise<void> {
  const db = getDatabase();

  await db.runAsync('UPDATE logs SET trip_id = ? WHERE trip_id = ?', [
    toTripId,
    fromTripId,
  ]);

  console.log('[LogRepo] Moved logs from trip', fromTripId, 'to', toTripId);
}

export async function deleteLogWithFiles(logId: number): Promise<void> {
  const db = getDatabase();

  // Get all photos for this log
  const photos = await photoRepository.getPhotosByLogId(logId);

  // Delete photo files
  await photoRepository.deletePhotoFiles(photos.map((p) => p.uri));
  await photoRepository.deletePhotoFiles(photos.map((p) => p.thumbnail_uri));

  // Delete the log (cascade will delete photos from DB)
  await db.runAsync('DELETE FROM logs WHERE id = ?', [logId]);

  console.log('[LogRepo] Deleted log with files:', logId);
}

export async function getLogById(logId: number): Promise<Log | null> {
  const db = getDatabase();

  const log = await db.getFirstAsync<Log>('SELECT * FROM logs WHERE id = ?', [
    logId,
  ]);

  return log || null;
}

export async function getLogCountByTripId(tripId: number): Promise<number> {
  const db = getDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM logs WHERE trip_id = ?',
    [tripId]
  );

  return result?.count ?? 0;
}
