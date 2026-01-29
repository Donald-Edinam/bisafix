import { body, validationResult } from 'express-validator';
import { Constants } from '../config/constants.js';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(Constants.HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            error: 'Validation failed',
            errors: errors.array(),
        });
    }
    next();
};

/**
 * Validation rules for user signup
 */
export const validateSignup = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Invalid phone number format'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        ),
    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['client', 'artisan', 'admin'])
        .withMessage('Role must be client, artisan, or admin'),
    handleValidationErrors,
];

/**
 * Validation rules for user login
 */
export const validateLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
];

/**
 * Validation rules for updating user profile
 */
export const validateUpdateProfile = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('phone')
        .optional()
        .trim()
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Invalid phone number format'),
    body('experienceYears')
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('Experience years must be between 0 and 50'),
    handleValidationErrors,
];

/**
 * Validation rules for updating artisan skills
 */
export const validateUpdateSkills = [
    body('skills')
        .isArray({ min: 1 })
        .withMessage('Skills must be a non-empty array'),
    body('skills.*')
        .trim()
        .notEmpty()
        .withMessage('Each skill must be a non-empty string'),
    handleValidationErrors,
];

/**
 * Validation rules for identity verification
 */
export const validateIdentityVerification = [
    body('idType')
        .trim()
        .notEmpty()
        .withMessage('ID type is required')
        .isIn(['national_id', 'passport', 'drivers_license'])
        .withMessage(
            'ID type must be national_id, passport, or drivers_license',
        ),
    handleValidationErrors,
];

export default {
    validateSignup,
    validateLogin,
    validateUpdateProfile,
    validateUpdateSkills,
    validateIdentityVerification,
    handleValidationErrors,
};
