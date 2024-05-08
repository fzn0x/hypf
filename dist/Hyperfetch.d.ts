import type { HttpRequestFunctions } from "./types/request.ts";
import type { Hooks } from "./types/hooks.ts";
declare function createRequest(baseUrl?: string, hooks?: Hooks, DEBUG?: boolean): HttpRequestFunctions;
declare const _default: {
    createRequest: typeof createRequest;
};
export default _default;
//# sourceMappingURL=Hyperfetch.d.ts.map