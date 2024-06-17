import type { RequestMethod } from "../types/request.ts";
import type { InitOptions } from "../types/init.js/index.ts";

import { createRequest } from "./create-request.ts";

export const httpMethodFunction = (
  url: string,
  method: RequestMethod = "GET",
  options = {},
  data: unknown,
  initOptions: InitOptions
) => {
  return createRequest(url, { method, ...options }, data, initOptions);
};
