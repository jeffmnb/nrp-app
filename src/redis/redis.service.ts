import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.provider';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get(key: string): Promise<any> {
    const value = await this.redis.get(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.log(`error on get cache: ${e}`);
        return value;
      }
    }
    return null;
  }

  async set(key: string, value: any, expiry?: number): Promise<void> {
    if (typeof value === 'object') {
      if (expiry) {
        await this.redis.set(key, JSON.stringify(value), 'EX', expiry);
      } else {
        await this.redis.set(key, JSON.stringify(value));
      }
    } else {
      if (expiry) {
        await this.redis.set(key, value, 'EX', expiry);
      } else {
        await this.redis.set(key, value);
      }
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    const stream = this.redis.scanStream({
      match: pattern,
      count: 100,
    });

    stream.on('data', (keys: string[]) => {
      if (keys.length) {
        const pipeline = this.redis.pipeline();
        keys.forEach((key) => {
          pipeline.del(key);
        });
        pipeline.exec();
      }
    });
  }
}
