import { Handler } from '@netlify/functions';
import fastify from 'fastify';
import pino from 'pino';
import helmet from '@fastify/helmet';

import actionsRouter from '../../routes/actions';
/* import { loadConfig } from '../../config'; */
import buyMeACoffeeRouter from '../../routes/buyMeACoffee';
import path from 'path';
import awsLambdaFastify from '@fastify/aws-lambda';

/* const config = loadConfig(); */

/* const port = Number(config.port);
const host = String(config.host); */

const init = async () => {
  const server = fastify({
    logger: pino({ level: process.env.LOG_LEVEL }),
  });

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  await server.register(require('@fastify/cors'), {
    origin: '*', // false,
    methods: 'GET,HEAD,POST',
    allowedHeaders:
      'Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Methods',
    credentials: true,
  });
  server.register(helmet, {
    crossOriginResourcePolicy: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  server.register(require('@fastify/static'), {
    root: path.join(__dirname, '../../public'),
    prefix: '/public/',
  });

  server.register(buyMeACoffeeRouter, { prefix: '/api/actions/' });
  server.register(actionsRouter, { prefix: '/' });

  // Set error handler
  server.setErrorHandler((error, _request, reply) => {
    server.log.error(error);
    reply.status(500).send({ error: 'Something went wrong' });
  });

  // Health check route
  server.get('/health', async (_request, reply) => {
    try {
      // await utils.healthCheck();
      reply.status(200).send({
        message: 'Health check endpoint success.',
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e: unknown) {
      reply.status(500).send({
        message: 'Health check endpoint failed.',
      });
    }
  });

  // Root route
  server.get('/', (request, reply) => {
    reply.status(200).send({
      message: 'Welcome to Cognis.es API. If you need any support, contact us.',
    });
  });

  return server;
};

/* (async () => {
  if (require.main === module) {
    try {
      const server = await init();
      await server.listen({ port, host });

      server.log.info(`Server listening on ${host}:${port}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
})(); */

export const handler: Handler = awsLambdaFastify(await init());
/* if (require.main === module) {
  // called directly i.e. "node app"
  init()
    .then((server) => {
      server.listen({ port, host }, (err) => {
        if (err) server.log.error(err);

        server.log.info(`Server listening on ${host}:${port}`);
      });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error starting server:', err);
      process.exit(1);
    });
} else {
  // Required as a module => executed on AWS Lambda
  // module.exports = init;
  export const handler: Handler = awsLambdaFastify(init());
  await init.ready(); */
  // const proxy = awsLambdaFastify(init);
/* } */
/* 
const proxy = awsLambdaFastify(app);
await app.ready();
const handler = async (event: APIGatewayProxyEvent, context: Context) => await proxy(event, context);

export { handler };
export default handler;
 */
// Handle unhandled rejections
/* process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
}); */
