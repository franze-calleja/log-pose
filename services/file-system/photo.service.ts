import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { IMAGE_MAX_WIDTH, IMAGE_QUALITY, THUMBNAIL_SIZE } from '../../lib/constants';

export interface SavedPhoto {
  uri: string;
  thumbnailUri: string;
}

export async function savePhoto(sourceUri: string): Promise<SavedPhoto> {
  try {
    console.log('[PhotoService] Saving photo:', sourceUri);

    // Ensure directories exist
    const photosDir = `${(FileSystem as any).documentDirectory}photos/`;
    const thumbnailsDir = `${(FileSystem as any).documentDirectory}thumbnails/`;

    await ensureDirectoryExists(photosDir);
    await ensureDirectoryExists(thumbnailsDir);

    // Generate unique filename
    const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;

    // Compress and resize main image
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      sourceUri,
      [{ resize: { width: IMAGE_MAX_WIDTH } }],
      {
        compress: IMAGE_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    // Move main image to permanent storage
    const photoUri = `${photosDir}${filename}`;
    await FileSystem.moveAsync({
      from: manipulatedImage.uri,
      to: photoUri,
    });

    // Create thumbnail
    const thumbnail = await ImageManipulator.manipulateAsync(
      sourceUri,
      [{ resize: { width: THUMBNAIL_SIZE } }],
      {
        compress: IMAGE_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    // Move thumbnail to permanent storage
    const thumbnailUri = `${thumbnailsDir}${filename}`;
    await FileSystem.moveAsync({
      from: thumbnail.uri,
      to: thumbnailUri,
    });

    console.log('[PhotoService] Photo saved successfully:', {
      photoUri,
      thumbnailUri,
    });

    return {
      uri: photoUri,
      thumbnailUri,
    };
  } catch (error) {
    console.error('[PhotoService] Error saving photo:', error);
    throw new Error('Failed to save photo');
  }
}

async function ensureDirectoryExists(dirUri: string): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(dirUri);

  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
    console.log('[PhotoService] Created directory:', dirUri);
  }
}
