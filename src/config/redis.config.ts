import Redis from 'ioredis';
import envConfig from '@/config/env.config';

const redis = new Redis(envConfig.redis_url!, {
  tls: {}, // required for Redis Cloud
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redis;
