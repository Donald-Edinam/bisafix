import { createNewSession } from 'supertokens-node/recipe/session/index.js';
import supertokens from 'supertokens-node';
import authService from '../services/auth.service.js';
import { Constants } from '../config/constants.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

/**
 * POST /api/v1/auth/signup
 * Register a new user (client or artisan)
 */
export const signup = async (req, res, next) => {
    try {
        const { name, email, phone, password, role } = req.body;

        const user = await authService.signup({
            name,
            email,
            phone,
            password,
            role,
        });

        logger.info(`New user registered: ${user.email} (${user.role})`);

        return successResponse(
            res,
            Constants.HTTP_STATUS.CREATED,
            user,
            'User registered successfully',
        );
    } catch (error) {
        if (
            error.message.includes('already registered') ||
            error.message.includes('already exists')
        ) {
            return errorResponse(
                res,
                Constants.HTTP_STATUS.CONFLICT,
                error.message,
            );
        }
        next(error);
    }
};

/**
 * POST /api/v1/auth/login
 * Authenticate user and create session
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await authService.login(email, password);

        // Create SuperTokens session - pass user ID as string
        await createNewSession(req, res, 'public', supertokens.convertToRecipeUserId(user.id), {
            role: user.role,
        });

        logger.info(`User logged in: ${user.email}`);

        return successResponse(
            res,
            Constants.HTTP_STATUS.OK,
            user,
            'Login successful',
        );
    } catch (error) {
        if (error.message.includes('Invalid email or password')) {
            return errorResponse(
                res,
                Constants.HTTP_STATUS.UNAUTHORIZED,
                error.message,
            );
        }
        next(error);
    }
};

/**
 * POST /api/v1/auth/logout
 * Revoke user session
 */
export const logout = async (req, res, next) => {
    try {
        await req.session.revokeSession();

        return successResponse(
            res,
            Constants.HTTP_STATUS.OK,
            null,
            'Logout successful',
        );
    } catch (error) {
        next(error);
    }
};

export default {
    signup,
    login,
    logout,
};
