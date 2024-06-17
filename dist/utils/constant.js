// src/utils/constant.ts
var DEFAULT_MAX_TIMEOUT = 2147483647;
var DEFAULT_BACKOFF_FACTOR = 0.3;
var DEFAULT_JITTER_FACTOR = 1;
var isAbortControllerSupported = typeof globalThis.AbortController === "function";
var isReadableStreamSupported = typeof globalThis.ReadableStream === "function";
var isWriteableStreamSupported = typeof globalThis.WritableStream === "function";
var isWebsocketSupported = typeof globalThis.WebSocket === "function";
var isWebRTCSupported = typeof globalThis.RTCPeerConnection === "function";
var isFormDataSupported = typeof globalThis.FormData === "function";
var isNode = typeof process !== "undefined" && process.release.name === "node";
export {
  DEFAULT_BACKOFF_FACTOR,
  DEFAULT_JITTER_FACTOR,
  DEFAULT_MAX_TIMEOUT,
  isAbortControllerSupported,
  isFormDataSupported,
  isNode,
  isReadableStreamSupported,
  isWebRTCSupported,
  isWebsocketSupported,
  isWriteableStreamSupported
};
