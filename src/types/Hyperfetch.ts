import type { HttpRequestFunctions } from "types/request.js";
import type { Hooks } from "types/hooks.js";

declare function createRequest(
  baseUrl?: string,
  hooks?: Hooks,
  DEBUG?: boolean
): HttpRequestFunctions;
declare const _default: {
  createRequest: typeof createRequest;
};
export default _default;
