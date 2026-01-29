import { v2 as cloudinary } from 'cloudinary';
import environment from '../config/environment.js';
import logger from '../utils/logger.js';

// Configure Cloudinary
cloudinary.config({
    cloud_name: environment.cloudinary.cloudName,
    api_key: environment.cloudinary.apiKey,
    api_secret: environment.cloudinary.apiSecret,
});

/**
 * Upload a single image to Cloudinary
 * @param {Buffer|string} file - File buffer or base64 string
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = async (file, folder = 'bisafix') => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder,
            resource_type: 'auto',
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        logger.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file buffers or base64 strings
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<Array<{url: string, publicId: string}>>}
 */
export const uploadMultiple = async (files, folder = 'bisafix') => {
    try {
        const uploadPromises = files.map((file) => uploadImage(file, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        logger.error('Cloudinary multiple upload error:', error);
        throw new Error('Failed to upload images');
    }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Public ID of the image
 * @returns {Promise<void>}
 */
export const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        logger.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image');
    }
};

export default {
    uploadImage,
    uploadMultiple,
    deleteImage,
};
