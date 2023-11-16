
import { RedisClient } from 'redis';

export abstract class BaseCache {
  protected client: RedisClient;

  abstract init(): Promise<any>;

  abstract get(key: string): Promise<any>;

  abstract set(key: string, value: any): Promise<void>;

  abstract del(key:string): Promise<void>;
}