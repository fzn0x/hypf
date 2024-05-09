export function createHTTPError(response: Response, responseData: Response) {
  const code = response.status || response.status === 0 ? response.status : "";
  const title = response.statusText || "";
  const status = `${code} ${title}`.trim();
  const reason = status ? `status code ${status}` : "an unknown error";
  const error = new Error(reason);

  error.name = "HTTPError";

  (error as any).response = response;
  (error as any).data = responseData;

  return error;
}
