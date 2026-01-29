import express from 'express';
import * as userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import validationMiddleware from '../middlewares/validation.middleware.js';

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware.requireAuth);

// Get current user profile
router.get('/me', userController.getCurrentUser);

// Update current user profile
router.put(
    '/me',
    validationMiddleware.validateUpdateProfile,
    userController.updateCurrentUser,
);

// Get user by ID (public profile)
router.get('/:id', userController.getUserById);

export default router;
