import 'dotenv/config';

const environment = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 4000),
    host: process.env.HOST || 'localhost',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    logLevel: process.env.LOG_LEVEL || 'info',

    // Database
    databaseUrl: process.env.DATABASE_URL,

    // SuperTokens
    supertokens: {
        connectionUri: process.env.SUPERTOKENS_CONNECTION_URI || 'http://localhost:3567',
        apiKey: process.env.SUPERTOKENS_API_KEY || '',
    },

    // Cloudinary
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
};

environment.isProduction = environment.nodeEnv === 'production';
environment.isDevelopment = environment.nodeEnv === 'development';

export default environment;
