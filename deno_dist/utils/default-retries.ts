export const defaultBackoff = (retryCount: number, factor: number) =>
  Math.pow(2, retryCount) * 1000 * factor; // Exponential backoff, starting from 1 second

export const defaultJitter = (factor: number) => Math.random() * 1000 * factor; // Randomized delay up to 1 second
