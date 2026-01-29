import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';

/**
 * Get user by ID with artisan profile
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>}
 */
export const getUserById = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                artisan: true,
            },
        });

        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }

        return null;
    } catch (error) {
        logger.error('Get user by ID error:', error);
        throw error;
    }
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>}
 */
export const getUserByEmail = async (email) => {
    try {
        return await prisma.user.findUnique({
            where: { email },
            include: {
                artisan: true,
            },
        });
    } catch (error) {
        logger.error('Get user by email error:', error);
        throw error;
    }
};

/**
 * Get user by phone
 * @param {string} phone - User phone
 * @returns {Promise<Object|null>}
 */
export const getUserByPhone = async (phone) => {
    try {
        return await prisma.user.findUnique({
            where: { phone },
            include: {
                artisan: true,
            },
        });
    } catch (error) {
        logger.error('Get user by phone error:', error);
        throw error;
    }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>}
 */
export const updateUser = async (userId, updateData) => {
    try {
        const { name, phone, experienceYears, ...otherData } = updateData;

        // Prepare user update data
        const userUpdate = {};
        if (name) userUpdate.name = name;
        if (phone) userUpdate.phone = phone;

        // Prepare artisan update data
        const artisanUpdate = {};
        if (experienceYears !== undefined)
            artisanUpdate.experienceYears = experienceYears;

        // Update user and artisan profile if applicable
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...userUpdate,
                ...(Object.keys(artisanUpdate).length > 0 && {
                    artisan: {
                        update: artisanUpdate,
                    },
                }),
            },
            include: {
                artisan: true,
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        logger.error('Update user error:', error);
        throw error;
    }
};

export const userService = {
    getUserById,
    getUserByEmail,
    getUserByPhone,
    updateUser,
};

export default userService;
