export const appendParams = (
  url: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return url;

  const urlWithParams = new URL(url);
  Object.entries(params).forEach(([key, value]) =>
    urlWithParams.searchParams.append(key, String(value))
  );

  return urlWithParams.toString();
};
