import multer from 'multer';
import { storagePut } from './storage';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

/**
 * Upload file to S3 and return the URL
 */
export async function uploadFileToS3(
  file: Express.Multer.File,
  userId: number,
  fileType: 'dashboard' | 'database'
): Promise<{ fileKey: string; fileUrl: string }> {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(7);
  const fileKey = `user-${userId}/${fileType}-${timestamp}-${randomSuffix}${getFileExtension(file.originalname)}`;
  
  const { url } = await storagePut(
    fileKey,
    file.buffer,
    file.mimetype
  );
  
  return {
    fileKey,
    fileUrl: url,
  };
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.substring(lastDot);
}

export { upload };
