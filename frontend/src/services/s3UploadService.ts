/**
 * AWS S3 Upload Service for Frontend
 * Handles file uploads to S3 with presigned URLs
 */

import { awsConfig } from './aws-config';

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
      `${awsConfig.apiEndpoint}/uploads/presigned-url`,
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
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      url: data.presignedUrl,
      message: data.key, // Return the S3 key
    };
  } catch (error) {
    console.error('Failed to get presigned URL:', error);
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
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Upload failed: ${response.statusText}`,
      };
    }

    return {
      success: true,
      message: 'File uploaded successfully',
    };
  } catch (error) {
    console.error('Failed to upload file to S3:', error);
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
    // Step 1: Get presigned URL
    const presignedResponse = await getPresignedUploadUrl(
      file.name,
      file.type,
      category
    );

    if (!presignedResponse.success || !presignedResponse.url) {
      return {
        success: false,
        error: presignedResponse.error || 'Failed to get presigned URL',
      };
    }

    // Step 2: Upload file
    const uploadResponse = await uploadFileToS3(file, presignedResponse.url);

    if (!uploadResponse.success) {
      return uploadResponse;
    }

    // Step 3: Return the S3 file URL
    const fileUrl = `${awsConfig.uploadsBucket}/${presignedResponse.message}`;
    return {
      success: true,
      url: fileUrl,
      message: 'File uploaded successfully',
    };
  } catch (error) {
    console.error('File upload failed:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}
