/* import awsLambdaFastify from '@fastify/aws-lambda';
import { init } from './functions/api/api';

const app = await init();
const proxy = awsLambdaFastify(app);
await app.ready();
const handler = async (event: APIGatewayProxyEvent, context: Context) => await proxy(event, context);

export { handler };
export default handler;

const proxy = awsLambdaFastify(init());
// or
// const proxy = awsLambdaFastify(init(), { binaryMimeTypes: ['application/octet-stream'] })

export const handler = proxy;
// or
// exports.handler = (event, context, callback) => proxy(event, context, callback);
// or
// exports.handler = (event, context) => proxy(event, context);
// or
// exports.handler = async (event, context) => proxy(event, context);

// Since AWS Lambda now enables the use of ECMAScript (ES) modules in Node.js 14 runtimes, you could lower the cold start latency when used with Provisioned Concurrency thanks to the top-level await functionality.
await app.ready();
 */