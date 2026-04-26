import serverless from 'aws-serverless-express';
import app from './app';

let cachedServer: any;

// Normalize HTTP API v2 format to REST API v1 format for aws-serverless-express
function normalizeEvent(event: any) {
  // If already in v1 format, return as-is
  if (event.httpMethod && event.path) {
    return event;
  }

  // Convert from HTTP API v2 format
  if (event.requestContext?.http) {
    const http = event.requestContext.http;
    return {
      ...event,
      httpMethod: http.method,
      path: http.path,
      resource: event.routeKey?.replace(/{proxy\+}/, '*') || http.path,
      requestContext: {
        ...event.requestContext,
        httpMethod: http.method,
        path: http.path,
      },
    };
  }

  return event;
}

export const handler = async (event: any, context: any) => {
  const normalizedEvent = normalizeEvent(event);

  console.log('[Lambda] Normalized event:', {
    path: normalizedEvent.path,
    httpMethod: normalizedEvent.httpMethod,
    resource: normalizedEvent.resource,
  });

  if (!cachedServer) {
    cachedServer = serverless.createServer(app);
  }

  return serverless.proxy(cachedServer, normalizedEvent, context, 'PROMISE').promise;
};
