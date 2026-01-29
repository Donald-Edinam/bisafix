/**
 * Standard success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 * @param {string} message - Optional message
 */
export const successResponse = (res, statusCode, data, message = null) => {
    const response = {
        success: true,
        ...(message && { message }),
        data,
    };
    return res.status(statusCode).json(response);
};

/**
 * Standard error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} error - Error message
 * @param {Array} errors - Optional validation errors
 */
export const errorResponse = (res, statusCode, error, errors = null) => {
    const response = {
        success: false,
        error,
        ...(errors && { errors }),
    };
    return res.status(statusCode).json(response);
};

export default {
    successResponse,
    errorResponse,
};
