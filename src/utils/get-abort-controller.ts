import { isAbortControllerSupported } from './constant.js'

// Expose the AbortController instance through the library interface
export const getAbortController = () => (isAbortControllerSupported ? global.abortController : null)
