const defaultBase = "http://localhost:3000/";

export const urlBuilder = (
  baseUrl: string = defaultBase,
  paths?: string[],
  params?: Record<string, any>
) => {
  let segments = "/" + paths?.join("/");
  const searchParams = new URLSearchParams();

  if (params && params instanceof Object) {
    Object.keys(params).forEach((key) => searchParams.append(key, params[key]));
  }

  let url = new URL(segments, baseUrl);

  url.search = searchParams.toString();

  return url.href;
};
