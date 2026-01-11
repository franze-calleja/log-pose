import * as FileSystem from 'expo-file-system';
import { getDatabase } from '../../db/client';
import type { CreatePhotoInput, Photo } from '../../db/schema';

export async function createPhoto(input: CreatePhotoInput): Promise<Photo> {
  const db = getDatabase();

  const result = await db.runAsync(
    'INSERT INTO photos (log_id, uri, thumbnail_uri, created_at) VALUES (?, ?, ?, datetime("now"))',
    [input.log_id, input.uri, input.thumbnail_uri]
  );

  const photo = await db.getFirstAsync<Photo>(
    'SELECT * FROM photos WHERE id = ?',
    [result.lastInsertRowId]
  );

  if (!photo) {
    throw new Error('Failed to create photo');
  }

  console.log('[PhotoRepo] Created photo:', photo);
  return photo;
}

export async function getPhotosByLogId(logId: number): Promise<Photo[]> {
  const db = getDatabase();

  const photos = await db.getAllAsync<Photo>(
    'SELECT * FROM photos WHERE log_id = ? ORDER BY created_at ASC',
    [logId]
  );

  return photos;
}

export async function deletePhoto(photoId: number): Promise<void> {
  const db = getDatabase();

  // Get photo to delete files
  const photo = await db.getFirstAsync<Photo>(
    'SELECT * FROM photos WHERE id = ?',
    [photoId]
  );

  if (photo) {
    await deletePhotoFiles([photo.uri, photo.thumbnail_uri]);
  }

  // Delete from database
  await db.runAsync('DELETE FROM photos WHERE id = ?', [photoId]);

  console.log('[PhotoRepo] Deleted photo:', photoId);
}

export async function deletePhotoFiles(uris: string[]): Promise<void> {
  for (const uri of uris) {
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
      console.log('[PhotoRepo] Deleted file:', uri);
    } catch (error) {
      // Silent failure - file may already be deleted
      console.warn('[PhotoRepo] Failed to delete file (ignoring):', uri, error);
    }
  }
}

export async function getPhotoById(photoId: number): Promise<Photo | null> {
  const db = getDatabase();

  const photo = await db.getFirstAsync<Photo>(
    'SELECT * FROM photos WHERE id = ?',
    [photoId]
  );

  return photo || null;
}
