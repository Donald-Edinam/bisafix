import express from 'express';
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';
import artisanRoutes from './artisan.routes.js';
import docsRoutes from './docs.routes.js';

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
router.use('/', docsRoutes); // Scalar docs at /api/v1/docs

export default router;
