import { getDatabase } from '../../db/client';
import type { CreateTripInput, Trip } from '../../db/schema';

export async function getOrCreateActiveTrip(): Promise<Trip> {
  const db = getDatabase();

  // First, try to find an active non-default trip
  const activeTrip = await db.getFirstAsync<Trip>(
    'SELECT * FROM trips WHERE status = ? AND is_default = 0 ORDER BY created_at DESC LIMIT 1',
    ['active']
  );

  if (activeTrip) {
    return activeTrip;
  }

  // Fall back to the system "Unsorted Adventure" trip (id = 1)
  const systemTrip = await db.getFirstAsync<Trip>(
    'SELECT * FROM trips WHERE id = 1'
  );

  if (!systemTrip) {
    throw new Error('System trip not found. Database may be corrupted.');
  }

  return systemTrip;
}

export async function createTrip(input: CreateTripInput): Promise<Trip> {
  const db = getDatabase();

  const result = await db.runAsync(
    'INSERT INTO trips (name, is_default, start_date) VALUES (?, ?, datetime("now"))',
    [input.name, input.is_default ?? 0]
  );

  const trip = await db.getFirstAsync<Trip>(
    'SELECT * FROM trips WHERE id = ?',
    [result.lastInsertRowId]
  );

  if (!trip) {
    throw new Error('Failed to create trip');
  }

  console.log('[TripRepo] Created trip:', trip);
  return trip;
}

export async function getAllTrips(options?: {
  excludeEmptyDefault?: boolean;
}): Promise<Trip[]> {
  const db = getDatabase();

  if (options?.excludeEmptyDefault) {
    // Filter out the default trip if it has no logs
    const trips = await db.getAllAsync<Trip>(
      `SELECT t.* FROM trips t
       WHERE t.status = 'active' 
       AND (t.is_default = 0 OR (SELECT COUNT(*) FROM logs WHERE trip_id = t.id) > 0)
       ORDER BY t.created_at DESC`
    );
    return trips;
  }

  const trips = await db.getAllAsync<Trip>(
    "SELECT * FROM trips WHERE status = 'active' ORDER BY created_at DESC"
  );

  return trips;
}

export async function getArchivedTrips(): Promise<Trip[]> {
  const db = getDatabase();

  const trips = await db.getAllAsync<Trip>(
    "SELECT * FROM trips WHERE status = 'archived' ORDER BY created_at DESC"
  );

  return trips;
}

export async function setActiveTrip(tripId: number): Promise<void> {
  const db = getDatabase();

  // Just verify the trip exists
  const trip = await db.getFirstAsync<Trip>(
    'SELECT * FROM trips WHERE id = ?',
    [tripId]
  );

  if (!trip) {
    throw new Error('Trip not found');
  }

  console.log('[TripRepo] Set active trip:', trip);
}

export async function renameTrip(tripId: number, name: string): Promise<Trip> {
  const db = getDatabase();

  await db.runAsync('UPDATE trips SET name = ? WHERE id = ?', [name, tripId]);

  const trip = await db.getFirstAsync<Trip>(
    'SELECT * FROM trips WHERE id = ?',
    [tripId]
  );

  if (!trip) {
    throw new Error('Trip not found after rename');
  }

  console.log('[TripRepo] Renamed trip:', trip);
  return trip;
}

export async function archiveTrip(tripId: number): Promise<void> {
  const db = getDatabase();

  // Don't allow archiving the system default trip
  if (tripId === 1) {
    throw new Error('Cannot archive the system default trip');
  }

  await db.runAsync("UPDATE trips SET status = 'archived' WHERE id = ?", [
    tripId,
  ]);

  console.log('[TripRepo] Archived trip:', tripId);
}

export async function getDefaultTrip(): Promise<Trip> {
  const db = getDatabase();

  const trip = await db.getFirstAsync<Trip>(
    'SELECT * FROM trips WHERE id = 1'
  );

  if (!trip) {
    throw new Error('System default trip not found');
  }

  return trip;
}

export async function getTripById(tripId: number): Promise<Trip | null> {
  const db = getDatabase();

  const trip = await db.getFirstAsync<Trip>(
    'SELECT * FROM trips WHERE id = ?',
    [tripId]
  );

  return trip || null;
}
