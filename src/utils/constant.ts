// disabled in webpack
import process from 'node:process'

/**
 * Default maximum recommended timeout in milliseconds.
 * @type {number}
 */
export const DEFAULT_MAX_TIMEOUT = 2147483647

/**
 * Default factor for exponential backoff.
 * @type {number}
 */
export const DEFAULT_BACKOFF_FACTOR = 0.3

/**
 * Default factor for jitter in delay.
 * @type {number}
 */
export const DEFAULT_JITTER_FACTOR = 1

/**
 * Indicates if AbortController is supported.
 * @type {boolean}
 */
export const isAbortControllerSupported = typeof globalThis.AbortController === 'function'

/**
 * Indicates if ReadableStream is supported.
 * @type {boolean}
 */
export const isReadableStreamSupported = typeof globalThis.ReadableStream === 'function'

/**
 * Indicates if WritableStream is supported.
 * @type {boolean}
 */
export const isWriteableStreamSupported = typeof globalThis.WritableStream === 'function'

/**
 * Indicates if WebSocket is supported.
 * @type {boolean}
 */
export const isWebsocketSupported = typeof globalThis.WebSocket === 'function'

/**
 * Indicates if WebRTC is supported.
 * @type {boolean}
 */
export const isWebRTCSupported = typeof globalThis.RTCPeerConnection === 'function'

/**
 * Indicates if FormData is supported.
 * @type {boolean}
 */
export const isFormDataSupported = typeof globalThis.FormData === 'function'

/**
 * Indicates if the code is running in a Node.js environment.
 * @type {boolean}
 */
export const isNode = typeof process !== 'undefined' && process.release.name === 'node'
