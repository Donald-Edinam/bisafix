import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>}
 */
export const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

/**
 * Register a new user (client or artisan)
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user (without password)
 */
export const signup = async (userData) => {
    const { name, email, phone, password, role } = userData;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phone }],
            },
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new Error('Email already registered');
            }
            if (existingUser.phone === phone) {
                throw new Error('Phone number already registered');
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user with artisan profile if role is artisan
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                role,
                ...(role === 'artisan' && {
                    artisan: {
                        create: {
                            verificationStatus: 'tier1_pending',
                        },
                    },
                }),
            },
            include: {
                artisan: role === 'artisan',
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        logger.error('Signup error:', error);
        throw error;
    }
};

/**
 * Authenticate a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data (without password)
 */
export const login = async (email, password) => {
    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                artisan: true,
            },
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        logger.error('Login error:', error);
        throw error;
    }
};

export default {
    signup,
    login,
    hashPassword,
    verifyPassword,
};
