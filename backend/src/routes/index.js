import express from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import artisanRoutes from './artisan.routes.js';

const router = express.Router();

router.get('/health', (_req, res) =>
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
    }),
);

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/artisans', artisanRoutes);

export default router;
