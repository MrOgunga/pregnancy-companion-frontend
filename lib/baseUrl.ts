// The app's public base URL, used for webhooks + email links.
// Prefers explicit env, falls back to Railway's auto-provided domain.
export function publicBaseUrl(): string {
  const explicit = process.env.PUBLIC_WEBHOOK_URL || process.env.APP_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const railway = process.env.RAILWAY_PUBLIC_DOMAIN;
  return railway ? `https://${railway}` : "";
}

export function isPublicHttps(url: string): boolean {
  return /^https:\/\//.test(url) && !/localhost|127\.0\.0\.1/.test(url);
}
