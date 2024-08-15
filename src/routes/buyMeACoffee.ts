import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from '@solana/actions';
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import BN from 'bn.js';

import { STANDARD } from '../constants';
import { actionData } from '../blinks/buyMeACoffee';
import { loadConfig } from '../config';

const config = loadConfig();

interface IRequestParams {
  action: string;
  amount: string;
}

async function buyMeACoffeeRouter(fastify: FastifyInstance) {
  fastify.route({
    method: ['GET', 'OPTIONS'],
    url: '/buy-me-a-coffee',
    schema: {},
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      const payload: ActionGetResponse = {
        ...actionData,
      };

      return reply
        .code(STANDARD.OK.statusCode)
        .headers(ACTIONS_CORS_HEADERS as Record<string, string>)
        .send(payload);
    },
  });

  fastify.post(
    '/buy-me-a-coffee',
    {},
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = request.body as ActionPostRequest;
        const queryParams = request.query as IRequestParams;
        const action = queryParams.action;
        let amount: number = parseInt(queryParams.amount);

        if (action == '1') {
          amount = 0.01 * LAMPORTS_PER_SOL;
        } else if (action == '2') {
          amount = 0.1 * LAMPORTS_PER_SOL;
        } else if (action == '3') {
          amount = 1 * LAMPORTS_PER_SOL;
        } else if (action == '4') {
          if (amount <= 0) {
            return reply
              .code(STANDARD.ERROR.statusCode)
              .headers(ACTIONS_CORS_HEADERS as Record<string, string>)
              .send({
                errorMessage:
                  'Invalid amount. The amount needs to be higher than 0',
              });
          }

          amount = amount * LAMPORTS_PER_SOL;
        } else {
          return reply
            .code(STANDARD.ERROR.statusCode)
            .headers(ACTIONS_CORS_HEADERS as Record<string, string>)
            .send({
              errorMessage: 'Invalid action. Only valid values from 1 to 4',
            });
        }

        let account: PublicKey;

        try {
          // signer publickey
          account = new PublicKey(body.account);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
          return reply
            .code(STANDARD.ERROR.statusCode)
            .headers(ACTIONS_CORS_HEADERS as Record<string, string>)
            .send({
              errorMessage:
                'Wrong account. Check again you send a body parameter a correct Publickey',
            });
        }

        const transaction = new Transaction();

        transaction.add(
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 1000,
          }),
          SystemProgram.transfer({
            fromPubkey: account,
            // Account that will receive transferred lamports
            toPubkey: new PublicKey(config.donatePublickey),
            // Amount of lamports to transfer
            lamports: amount,
          }),
        );

        transaction.feePayer = account;

        const connection = new Connection(clusterApiUrl('devnet'));
        transaction.recentBlockhash = (
          await connection.getLatestBlockhash()
        ).blockhash;

        const payload: ActionPostResponse = await createPostResponse({
          fields: {
            transaction,
            message:
              'Thanks for the coffee! Feel free to reach out anytime to know about the next coming project or if you want to collaborate',
          },
        });

        return reply
          .code(STANDARD.ACCEPTED.statusCode)
          .headers(ACTIONS_CORS_HEADERS as Record<string, string>)
          .send(payload);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: unknown) {
        console.log(err);
        return reply
          .code(STANDARD.ERROR.statusCode)
          .headers(ACTIONS_CORS_HEADERS as Record<string, string>)
          .send({
            errorMessage: 'Something went wrong',
          });
      }
    },
  );
}

export default buyMeACoffeeRouter;
