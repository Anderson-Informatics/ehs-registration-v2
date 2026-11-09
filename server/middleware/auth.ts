const config = useRuntimeConfig();
if (!config.API_KEY || !config.APP_SESSION_SECRET) {
  console.error(
    'API_KEY and/or APP_SESSION_SECRET are not set; API requests will be rejected',
  );
}

export default defineEventHandler((event) => {
  const path = event.path;

  if (!path.startsWith('/api/') && path !== '/api') {
    issueAppSession(event);
    return;
  }

  if (hasValidApiKey(event)) return;

  if (
    !path.startsWith('/api/external') &&
    hasValidAppSession(event) &&
    isSameOrigin(event)
  ) {
    issueAppSession(event);
    return;
  }

  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
});
