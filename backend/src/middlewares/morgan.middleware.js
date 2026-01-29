import morgan from 'morgan';
import logger from '../utils/logger.js';

const stream = {
    write: (message) => logger.info(message.trim()),
};

const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env !== 'development';
};

export const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream, skip },
);
