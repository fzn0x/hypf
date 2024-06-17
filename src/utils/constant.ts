// Default maximum recommended timeout in milliseconds (adjust as needed)
export const DEFAULT_MAX_TIMEOUT = 2147483647

export const DEFAULT_BACKOFF_FACTOR = 0.3
export const DEFAULT_JITTER_FACTOR = 1

export const isAbortControllerSupported = typeof globalThis.AbortController === 'function'
export const isReadableStreamSupported = typeof globalThis.ReadableStream === 'function'
export const isWriteableStreamSupported = typeof globalThis.WritableStream === 'function'
export const isWebsocketSupported = typeof globalThis.WebSocket === 'function'
export const isWebRTCSupported = typeof globalThis.RTCPeerConnection === 'function'
export const isFormDataSupported = typeof globalThis.FormData === 'function'
export const isNode = typeof process !== 'undefined' && process.release.name === 'node'
