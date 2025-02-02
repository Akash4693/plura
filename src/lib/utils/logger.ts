/**
 * Logs errors in a consistent format for debugging and monitoring.
 * @param message Description of the error context.
 * @param error The actual error object. 
 */

export const logError = (message: string, error: unknown): void => {
    console.error(`[ERROR]: ${message}`, error);
}