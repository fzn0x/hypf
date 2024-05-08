import type { HttpRequestFunctions } from "./request.ts/index.ts";
import type { Hooks } from "./hooks.ts/index.ts";

declare function createRequest(
  baseUrl?: string,
  hooks?: Hooks,
  DEBUG?: boolean
): HttpRequestFunctions;
declare const _default: {
  createRequest: typeof createRequest;
};
export default _default;
