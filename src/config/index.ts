import dotenv from 'dotenv';
import Joi from 'joi';

export interface IConfig {
  host: string;
  port: string;
  env: string;
  logLevel: string;
  donatePublickey: string;
  solanaRpc: string;
}

dotenv.config();

export function loadConfig(): IConfig {
  const schema = Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'testing', 'production')
      .required(),
    LOG_LEVEL: Joi.string()
      .valid('debug', 'info', 'warn', 'error', 'fatal')
      .required(),
    API_HOST: Joi.string().required(),
    API_PORT: Joi.string().required(),
    DONATE_PUBLICKEY: Joi.string().required(),
    SOLANA_RPC: Joi.string().required(),
  }).unknown(true);

  const { error } = schema.validate(process.env, { abortEarly: false });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return {
    host: process.env.API_HOST,
    port: process.env.API_PORT,
    env: process.env.NODE_ENV,
    logLevel: process.env.LOG_LEVEL,
    donatePublickey: process.env.DONATE_PUBLICKEY,
    solanaRpc: process.env.SOLANA_RPC,
  };
}
