import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';

/**
 * Get artisan profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>}
 */
export const getArtisanProfile = async (userId) => {
    try {
        return await prisma.artisanProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        role: true,
                    },
                },
            },
        });
    } catch (error) {
        logger.error('Get artisan profile error:', error);
        throw error;
    }
};

/**
 * Update artisan skills
 * @param {string} userId - User ID
 * @param {Array<string>} skills - Array of skills
 * @returns {Promise<Object>}
 */
export const updateSkills = async (userId, skills) => {
    try {
        return await prisma.artisanProfile.update({
            where: { userId },
            data: { skills },
        });
    } catch (error) {
        logger.error('Update skills error:', error);
        throw error;
    }
};

/**
 * Submit identity verification documents
 * @param {string} userId - User ID
 * @param {Object} verificationData - Verification data
 * @returns {Promise<Object>}
 */
export const submitIdentityVerification = async (
    userId,
    verificationData,
) => {
    try {
        const { idType, idFrontImageUrl, idBackImageUrl } = verificationData;

        return await prisma.artisanProfile.update({
            where: { userId },
            data: {
                idType,
                idFrontImageUrl,
                idBackImageUrl,
                verificationStatus: 'tier1_pending',
            },
        });
    } catch (error) {
        logger.error('Submit identity verification error:', error);
        throw error;
    }
};

export const artisanService = {
    getArtisanProfile,
    updateSkills,
    submitIdentityVerification,
};

export default artisanService;
