export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'eatros image');
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'degnrlkor';
  
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }
    
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

import { fetchApi } from './api'; // assuming api is in same folder

export const uploadStrictlyPrivateImage = async (file) => {
  try {
    // 1. Get signature from backend
    const signData = await fetchApi('/agent/cloudinary-signature');
    const { signature, timestamp, cloudName, apiKey } = signData;

    if (!signature || !cloudName || !apiKey) {
      throw new Error('Failed to get signature from server');
    }

    // 2. Upload to Cloudinary with signature
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('type', 'private');
    formData.append('folder', 'eatro_kyc'); // Must match the backend

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Failed to upload image to Cloudinary');
    }
    
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error('Private upload error:', error);
    throw error;
  }
};
