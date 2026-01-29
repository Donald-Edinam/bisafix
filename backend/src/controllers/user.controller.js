import { userService } from '../services/user.service.js';
import { Constants } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * GET /api/v1/users/me
 * Get current user profile
 */
export const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.session.getUserId();
        const user = await userService.getUserById(userId);

        if (!user) {
            return errorResponse(
                res,
                Constants.HTTP_STATUS.NOT_FOUND,
                'User not found',
            );
        }

        return successResponse(res, Constants.HTTP_STATUS.OK, user);
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/v1/users/me
 * Update current user profile
 */
export const updateCurrentUser = async (req, res, next) => {
    try {
        const userId = req.session.getUserId();
        const updateData = req.body;

        const updatedUser = await userService.updateUser(userId, updateData);

        return successResponse(
            res,
            Constants.HTTP_STATUS.OK,
            updatedUser,
            'Profile updated successfully',
        );
    } catch (error) {
        if (error.code === 'P2002') {
            // Prisma unique constraint violation
            return errorResponse(
                res,
                Constants.HTTP_STATUS.CONFLICT,
                'Email or phone number already in use',
            );
        }
        next(error);
    }
};

/**
 * GET /api/v1/users/:id
 * Get user by ID (for admin or public profile view)
 */
export const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
            return errorResponse(
                res,
                Constants.HTTP_STATUS.NOT_FOUND,
                'User not found',
            );
        }

        return successResponse(res, Constants.HTTP_STATUS.OK, user);
    } catch (error) {
        next(error);
    }
};

export default {
    getCurrentUser,
    updateCurrentUser,
    getUserById,
};
