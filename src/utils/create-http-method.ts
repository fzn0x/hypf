import type { RequestMethod } from "../types/request.js";
import type { InitOptions } from "../types/init.js";

import { createRequest } from "./create-request.js";

export const httpMethodFunction = (
  url: string,
  method: RequestMethod = "GET",
  options = {},
  data: unknown,
  initOptions: InitOptions
) => {
  return createRequest(url, { method, ...options }, data, initOptions);
};
