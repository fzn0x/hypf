import { createRequest } from "./create-request.js";
export const httpMethodFunction = (url, method = "GET", options = {}, data, initOptions) => {
    return createRequest(url, Object.assign({ method }, options), data, initOptions);
};
//# sourceMappingURL=create-http-method.js.map