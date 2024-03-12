declare function createRequest<T, U>(baseUrl?: string, hooks?: Hooks, DEBUG?: boolean): HttpRequestFunctions<T, U>;
export default createRequest;
export { createRequest };
