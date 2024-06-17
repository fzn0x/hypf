export const defaultBackoff = (retryCount, factor) => Math.pow(2, retryCount) * 1000 * factor; // Exponential backoff, starting from 1 second
export const defaultJitter = (factor) => Math.random() * 1000 * factor; // Randomized delay up to 1 second
//# sourceMappingURL=default-retries.js.map