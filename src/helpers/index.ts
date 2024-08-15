import { IConfig } from '../config';

export function getRootUri(protocol: string, config: IConfig): string {
  return [
    protocol,
    '://',
    config.host,
    config.port.length ? ':' : '',
    config.port,
    '/',
  ].join('');
}
