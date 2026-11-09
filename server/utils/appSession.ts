import { createHmac, timingSafeEqual } from 'node:crypto';
import type { H3Event } from 'h3';

const COOKIE_NAME = 'ehs_app';
const MAX_AGE_SECONDS = 60 * 60 * 12;

const safeEqual = (a: string, b: string) => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
};

const sign = (value: string, secret: string) =>
  createHmac('sha256', secret).update(value).digest('base64url');

export function issueAppSession(event: H3Event) {
  const secret = useRuntimeConfig().APP_SESSION_SECRET;
  if (!secret) return;
  const issuedAt = Date.now().toString();
  setCookie(event, COOKIE_NAME, `${issuedAt}.${sign(issuedAt, secret)}`, {
    httpOnly: true,
    sameSite: 'strict',
    secure: !import.meta.dev,
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export function hasValidAppSession(event: H3Event) {
  const secret = useRuntimeConfig().APP_SESSION_SECRET;
  const cookie = getCookie(event, COOKIE_NAME);
  if (!secret || !cookie) return false;
  const [issuedAt, signature] = cookie.split('.');
  if (!issuedAt || !signature || !safeEqual(signature, sign(issuedAt, secret)))
    return false;
  return Date.now() - Number(issuedAt) < MAX_AGE_SECONDS * 1000;
}

export function hasValidApiKey(event: H3Event) {
  const apiKey = useRuntimeConfig().API_KEY;
  const provided = getRequestHeader(event, 'x-api-key');
  return !!apiKey && !!provided && safeEqual(provided, apiKey);
}

export function isSameOrigin(event: H3Event) {
  const fetchSite = getRequestHeader(event, 'sec-fetch-site');
  if (fetchSite) return fetchSite === 'same-origin';
  const source =
    getRequestHeader(event, 'origin') || getRequestHeader(event, 'referer');
  if (!source) return false;
  try {
    return (
      new URL(source).host === getRequestHost(event, { xForwardedHost: true })
    );
  } catch {
    return false;
  }
}
