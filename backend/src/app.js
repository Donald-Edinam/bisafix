import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import supertokens from 'supertokens-node';
import { middleware as stMiddleware } from 'supertokens-node/framework/express/index.js';
import { errorHandler as stErrorHandler } from 'supertokens-node/framework/express/index.js';
import {
    morganMiddleware,
    notFoundHandler,
    errorHandler,
} from './middlewares/index.js';
import router from './routes/index.js';
import initSuperTokens from './config/supertokens.js';

// Initialize SuperTokens
initSuperTokens();

const app = express();

// Logging
app.use(morganMiddleware);

// Security - Configure Helmet with CSP for Scalar docs
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'", // Required for Scalar
                    'https://cdn.jsdelivr.net',
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'", // Required for Scalar
                    'https://cdn.jsdelivr.net',
                    'https://fonts.googleapis.com',
                ],
                fontSrc: [
                    "'self'",
                    'https://fonts.gstatic.com',
                    'https://cdn.jsdelivr.net',
                ],
                imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
                connectSrc: ["'self'"],
            },
        },
    }),
);
app.use(compression());
app.use(
    rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true }),
);

// CORS - must be before SuperTokens middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));

// SuperTokens middleware - must be before body parsing
app.use(stMiddleware());

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', router);

// Error Handling
app.use(notFoundHandler);
app.use(stErrorHandler()); // SuperTokens error handler
app.use(errorHandler);

export default app;
