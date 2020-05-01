import { promisify } from 'util';
import { RedisClient, createClient } from 'redis';

class Redis {

  private client: RedisClient;
  private static instance: Redis;

  private constructor(url: string, password?: string) {

    this.client = createClient(url)
    if (password) {
      this.client.auth(password);
    }
  }

  public static getInstance(): Redis {
    if (!Redis.instance) {
      const { REDIS_URL, REDIS_PASSWORD } = process.env;

      if (!REDIS_URL) {
        throw new Error('Um dos parâmetros de conexão do Redis tem um valor inválido.');
      }

      Redis.instance = new Redis(REDIS_URL, REDIS_PASSWORD);
    }

    return Redis.instance;
  }

  public async publish(key: string, value: any): Promise<boolean> {
    if (typeof value !== 'string') value = JSON.stringify(value);
    return promisify(this.client.publish).bind(this.client)(key, value) as any as boolean;
  }

  public subscribe(key: string, callback: (channel: string, message: string) => void): void {
    this.client.subscribe(key);
    this.client.on('message', callback);
  }
}

export default Redis.getInstance();