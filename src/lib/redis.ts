import { Redis } from '@upstash/redis';

export const FACTORY_STATUS_KEY = 'factory:status';

function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    throw new Error('Missing Upstash Redis credentials');
  }
  
  return new Redis({ url, token });
}

// Lazy initialization to avoid build-time errors
let _redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!_redis) {
    _redis = getRedis();
  }
  return _redis;
}
