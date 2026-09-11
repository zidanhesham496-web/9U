const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export function getApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${configuredApiBaseUrl.replace(/\/$/, "")}${normalizedPath}`;
}