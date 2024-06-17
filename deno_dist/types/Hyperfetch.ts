import type { HttpRequestFunctions } from "./request.ts";
import type { Hooks } from "./hooks.ts";

declare function init(
  baseUrl?: string,
  hooks?: Hooks,
  DEBUG?: boolean
): HttpRequestFunctions;
declare const _default: {
  init: typeof init;
};
export default _default;
