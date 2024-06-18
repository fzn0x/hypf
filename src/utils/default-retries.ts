/**
 * Calculates the exponential backoff time.
 *
 * @param {number} retryCount - The number of retries attempted.
 * @param {number} factor - The factor to multiply the backoff time.
 *
 * @returns {number} The calculated backoff time in milliseconds.
 */
export const defaultBackoff = (retryCount: number, factor: number) =>
  Math.pow(2, retryCount) * 1000 * factor // Exponential backoff, starting from 1 second

/**
 * Generates a random delay time with a given factor.
 *
 * @param {number} factor - The factor to multiply the jitter time.
 *
 * @returns {number} The calculated jitter time in milliseconds.
 */
export const defaultJitter = (factor: number) => Math.random() * 1000 * factor // Randomized delay up to 1 second
