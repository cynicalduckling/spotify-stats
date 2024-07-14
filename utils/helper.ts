export const appUrl =
  process.env.VERCEL_ENV === "production"
    ? "https://spotify-stats-inky.vercel.app/"
    : "http://localhost:3000/";

export const urlBuilder = (
  paths?: string[],
  params?: Record<string, any>,
  baseUrl?: string
) => {
  let segments = "/" + paths?.join("/");
  const searchParams = new URLSearchParams();

  if (params && params instanceof Object) {
    Object.keys(params).forEach((key) => searchParams.append(key, params[key]));
  }

  let url = new URL(segments, baseUrl || appUrl);

  url.search = searchParams.toString();

  return url.href;
};
