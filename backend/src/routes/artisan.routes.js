import express from 'express';
import * as artisanController from '../controllers/artisan.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import validationMiddleware from '../middlewares/validation.middleware.js';

const router = express.Router();

// All artisan routes require authentication and artisan role
router.use(authMiddleware.requireAuth);
router.use(authMiddleware.requireRole('artisan'));

// Update artisan skills
router.post(
    '/skills',
    validationMiddleware.validateUpdateSkills,
    artisanController.updateSkills,
);

// Submit identity verification
router.post(
    '/identity',
    artisanController.uploadIdentityImages,
    validationMiddleware.validateIdentityVerification,
    artisanController.submitIdentityVerification,
);

export default router;
