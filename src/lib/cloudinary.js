/**
 * src/lib/cloudinary.js
 * Client-side Cloudinary upload.
 * Tries unsigned upload first (preset must be "Unsigned" in Cloudinary dashboard).
 * Falls back to backend-signed upload automatically.
 */
import { apiGet } from './api';

const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'hi83scmv';
const UPLOAD_PRESET = 'real estate';

async function unsignedUpload(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
}

async function signedUpload(file) {
  // Get signature from backend
  const sigRes = await apiGet('/properties/cloudinary-sign');
  if (sigRes.status !== 'success' || !sigRes.data) {
    throw new Error(sigRes.error || 'Could not get upload credentials from server');
  }
  const { signature, timestamp, apiKey, cloudName, uploadPreset } = sigRes.data;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('upload_preset', uploadPreset);
  formData.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Signed upload failed');
  return data.secure_url;
}

export async function uploadToCloudinary(file) {
  // Try unsigned first — works when preset mode is "Unsigned"
  try {
    return await unsignedUpload(file);
  } catch (unsignedErr) {
    // If unsigned fails (preset is still Signed), fall back to backend signature
    if (unsignedErr.message?.toLowerCase().includes('unsigned')) {
      return await signedUpload(file);
    }
    // Any other error — try signed as well
    return await signedUpload(file);
  }
}

