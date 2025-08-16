import express from 'express';

{/*import crypto from 'crypto';

export const getCloudinarySignature = (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);

  // 🔐 Construct stringToSign exactly as Cloudinary expects
  const stringToSign = `timestamp=${timestamp}`;
  const signature = crypto
    .createHmac('sha1', process.env.CLOUDINARY_SECRET_KEY) // ✅ use createHmac
    .update(stringToSign)
    .digest('hex');

  res.json({
    timestamp,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.CLOUDINARY_NAME,
  });
};*/}

import crypto from 'crypto';

export const getCloudinarySignature = (req, res) => {
  try {
    // Check if required environment variables exist
    if (!process.env.CLOUDINARY_SECRET_KEY || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_NAME) {
      console.error('Missing Cloudinary environment variables');
      return res.status(500).json({ 
        success: false, 
        message: 'Cloudinary configuration missing' 
      });
    }

    const timestamp = Math.round(Date.now() / 1000);

    // Construct stringToSign exactly as Cloudinary expects
    const stringToSign = `timestamp=${timestamp}`;
    const signature = crypto
      .createHmac('sha1', process.env.CLOUDINARY_SECRET_KEY)
      .update(stringToSign)
      .digest('hex');

    res.json({
      success: true,
      timestamp,
      signature,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_NAME,
    });

  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate signature' 
    });
  }
};