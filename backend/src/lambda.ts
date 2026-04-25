import serverless from 'aws-serverless-express';
import app from './app';

let cachedServer: any;

export const handler = async (event: any, context: any) => {
  if (!cachedServer) {
    cachedServer = serverless.createServer(app);
  }

  return serverless.proxy(cachedServer, event, context, 'PROMISE').promise;
};
