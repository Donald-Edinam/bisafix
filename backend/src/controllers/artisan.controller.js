import multer from 'multer';
import artisanService from '../services/artisan.service.js';
import cloudinaryService from '../services/cloudinary.service.js';
import { Constants } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
});

/**
 * POST /api/v1/artisans/skills
 * Update artisan skills
 */
export const updateSkills = async (req, res, next) => {
    try {
        const userId = req.session.getUserId();
        const { skills } = req.body;

        const artisanProfile = await artisanService.updateSkills(
            userId,
            skills,
        );

        return successResponse(
            res,
            Constants.HTTP_STATUS.OK,
            artisanProfile,
            'Skills updated successfully',
        );
    } catch (error) {
        if (error.code === 'P2025') {
            // Prisma record not found
            return errorResponse(
                res,
                Constants.HTTP_STATUS.NOT_FOUND,
                'Artisan profile not found',
            );
        }
        next(error);
    }
};

/**
 * POST /api/v1/artisans/identity
 * Submit identity verification documents
 */
export const submitIdentityVerification = async (req, res, next) => {
    try {
        const userId = req.session.getUserId();
        const { idType } = req.body;
        const files = req.files;

        // Check if files are uploaded
        if (!files || !files.frontImage || !files.backImage) {
            return errorResponse(
                res,
                Constants.HTTP_STATUS.BAD_REQUEST,
                'Both front and back images of ID are required',
            );
        }

        // Upload images to Cloudinary
        const frontImageResult = await cloudinaryService.uploadImage(
            `data:${files.frontImage[0].mimetype};base64,${files.frontImage[0].buffer.toString('base64')}`,
            'bisafix/identity-verification',
        );

        const backImageResult = await cloudinaryService.uploadImage(
            `data:${files.backImage[0].mimetype};base64,${files.backImage[0].buffer.toString('base64')}`,
            'bisafix/identity-verification',
        );

        // Update artisan profile with verification data
        const artisanProfile =
            await artisanService.submitIdentityVerification(userId, {
                idType,
                idFrontImageUrl: frontImageResult.url,
                idBackImageUrl: backImageResult.url,
            });

        logger.info(
            `Identity verification submitted for user: ${userId}`,
        );

        return successResponse(
            res,
            Constants.HTTP_STATUS.OK,
            artisanProfile,
            'Identity verification submitted successfully. Status: Tier-1 Pending',
        );
    } catch (error) {
        if (error.code === 'P2025') {
            return errorResponse(
                res,
                Constants.HTTP_STATUS.NOT_FOUND,
                'Artisan profile not found',
            );
        }
        next(error);
    }
};

// Export multer upload middleware
export const uploadIdentityImages = upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
]);

export default {
    updateSkills,
    submitIdentityVerification,
    uploadIdentityImages,
};
