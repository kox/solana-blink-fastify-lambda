import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import { actions } from '../blinks/actions';
import { STANDARD } from '../constants';

async function actionsRouter(fastify: FastifyInstance) {
  fastify.route({
    method: ['GET', 'OPTIONS'],
    url: '/actions.json',
    schema: {},
    handler: async (_request: FastifyRequest, reply: FastifyReply) => {
      return reply
        .code(STANDARD.OK.statusCode)
        .header('Content-Type', 'application/json')
        .send(actions);
    },
  });
}

export default actionsRouter;
