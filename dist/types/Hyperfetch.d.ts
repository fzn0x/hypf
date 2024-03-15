import type { HttpRequestFunctions } from "types/request.js";
import type { Hooks } from "types/hooks.js";
declare function createRequest<T, U>(baseUrl?: string, hooks?: Hooks, DEBUG?: boolean): HttpRequestFunctions<T, U>;
declare const _default: {
    createRequest: typeof createRequest;
};
export default _default;
//# sourceMappingURL=Hyperfetch.d.ts.map