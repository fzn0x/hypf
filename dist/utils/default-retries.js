// src/utils/default-retries.ts
var defaultBackoff = (retryCount, factor) => Math.pow(2, retryCount) * 1e3 * factor;
var defaultJitter = (factor) => Math.random() * 1e3 * factor;
export {
  defaultBackoff,
  defaultJitter
};
