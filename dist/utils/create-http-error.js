export function createHTTPError(response, responseData) {
    const code = response.status || response.status === 0 ? response.status : "";
    const title = response.statusText || "";
    const status = `${code} ${title}`.trim();
    const reason = status ? `status code ${status}` : "an unknown error";
    const error = new Error(reason);
    error.name = "HTTPError";
    error.response = response;
    error.data = responseData;
    return error;
}
//# sourceMappingURL=create-http-error.js.map