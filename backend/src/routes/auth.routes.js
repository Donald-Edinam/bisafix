import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import validationMiddleware from '../middlewares/validation.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.post(
    '/signup',
    validationMiddleware.validateSignup,
    authController.signup,
);

router.post(
    '/login',
    validationMiddleware.validateLogin,
    authController.login,
);

// Protected routes
router.post(
    '/logout',
    authMiddleware.requireAuth,
    authController.logout,
);

export default router;
