/**
 * Error handling utilities for API responses
 */

/**
 * Standard error messages for different scenarios
 */
export const ERROR_MESSAGES = {
    NETWORK: "Network error. Please check your connection.",
    SERVER: "Server error. Please try again later.",
    VALIDATION: "Invalid request. Please check your input.",
    TIMEOUT: "Request timed out. Please try again.",
    DEFAULT: "An error occurred. Please try again."
};

/**
 * Formats API error response into a user-friendly message
 * @param {Error} error - The error object from axios
 * @returns {string} User-friendly error message
 */
export const formatApiError = (error) => {
    if (!error.response) {
        return error.message === 'Network Error' 
            ? ERROR_MESSAGES.NETWORK 
            : ERROR_MESSAGES.DEFAULT;
    }

    switch (error.response.status) {
        case 400:
            return error.response.data?.message || ERROR_MESSAGES.VALIDATION;
        case 422:
            return error.response.data?.message || ERROR_MESSAGES.VALIDATION;
        case 500:
            return error.response.data?.message || ERROR_MESSAGES.SERVER;
        default:
            return ERROR_MESSAGES.DEFAULT;
    }
};

/**
 * Checks if an error is a network error
 * @param {Error} error - The error object from axios
 * @returns {boolean} True if it's a network error
 */
export const isNetworkError = (error) => {
    return !error.response && error.message === 'Network Error';
};

/**
 * Checks if an error is a timeout error
 * @param {Error} error - The error object from axios
 * @returns {boolean} True if it's a timeout error
 */
export const isTimeoutError = (error) => {
    return error.code === 'ECONNABORTED';
}; 