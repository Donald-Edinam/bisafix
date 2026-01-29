import { verifySession } from 'supertokens-node/recipe/session/framework/express/index.js';
import { userService } from '../services/user.service.js';
import { Constants } from '../config/constants.js';

/**
 * Middleware to require authentication
 * Uses SuperTokens session verification
 */
export const requireAuth = verifySession();

/**
 * Middleware to attach user data to request
 * Must be used after requireAuth
 */
export const attachUser = async (req, res, next) => {
    try {
        const userId = req.session.getUserId();
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(Constants.HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'User not found',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Middleware to require specific role(s)
 * Must be used after requireAuth and attachUser
 * @param {...string} roles - Allowed roles
 */
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(Constants.HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                error: 'Authentication required',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(Constants.HTTP_STATUS.FORBIDDEN).json({
                success: false,
                error: `Access denied. Required role: ${roles.join(' or ')}`,
            });
        }

        next();
    };
};

export default {
    requireAuth,
    attachUser,
    requireRole,
};
