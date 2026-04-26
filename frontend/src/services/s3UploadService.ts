/**
 * AWS S3 Upload Service for Frontend
 * Handles file uploads to S3 with presigned URLs
 */

import { awsConfig, getApiUrl } from '../aws-config';

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
  message?: string;
}

/**
 * Request a presigned URL from backend to upload a file to S3
 */
export async function getPresignedUploadUrl(
  fileName: string,
  contentType: string,
  category: string = 'general'
): Promise<UploadResponse> {
  try {
    const response = await fetch(
      getApiUrl('/api/uploads/presigned-url'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          contentType,
          category,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[S3] Presigned URL error response:', errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText} - ${errorText}`,
      };
    }

    const data = await response.json();
    console.log('[S3] Got presigned URL for:', fileName);
    return {
      success: true,
      url: data.presignedUrl,
      message: data.key, // Return the S3 key
    };
  } catch (error) {
    console.error('[S3] Failed to get presigned URL:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Upload a file to S3 using a presigned URL
 */
export async function uploadFileToS3(
  file: File,
  presignedUrl: string
): Promise<UploadResponse> {
  try {
    console.log('[S3] Starting upload for:', file.name, 'Size:', file.size, 'Type:', file.type);
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[S3] Upload failed:', response.statusText, errorText);
      return {
        success: false,
        error: `Upload failed: ${response.statusText} (${response.status})`,
      };
    }

    console.log('[S3] Successfully uploaded:', file.name);
    return {
      success: true,
      message: 'File uploaded successfully',
    };
  } catch (error) {
    console.error('[S3] Failed to upload file to S3:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}

/**
 * Complete file upload flow: get presigned URL and upload file
 */
export async function uploadFileToS3Complete(
  file: File,
  category: string = 'general'
): Promise<UploadResponse> {
  try {
    console.log('[S3] Starting complete upload flow for:', file.name);
    // Step 1: Get presigned URL
    const presignedResponse = await getPresignedUploadUrl(
      file.name,
      file.type,
      category
    );

    if (!presignedResponse.success || !presignedResponse.url) {
      console.error('[S3] Failed to get presigned URL:', presignedResponse.error);
      return {
        success: false,
        error: presignedResponse.error || 'Failed to get presigned URL',
      };
    }

    // Step 2: Upload file
    const uploadResponse = await uploadFileToS3(file, presignedResponse.url);

    if (!uploadResponse.success) {
      console.error('[S3] Upload to S3 failed:', uploadResponse.error);
      return uploadResponse;
    }

    // Step 3: Return the S3 URL (key is in presignedResponse.message)
    const s3Url = `https://${awsConfig.uploadsBucket}.s3.${awsConfig.awsRegion}.amazonaws.com/${presignedResponse.message}`;
    console.log('[S3] Upload complete. URL:', s3Url);
    return {
      success: true,
      url: s3Url,
      message: presignedResponse.message, // Return the S3 key
    };
  } catch (error) {
    console.error('[S3] Complete upload flow failed:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}
