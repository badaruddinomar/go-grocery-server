import Redis from 'ioredis';
import envConfig from '@/config/env.config';
import logger from '@/utils/logger';

const redis = new Redis(envConfig.redis_url!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redis.on('connect', () => {
  logger.info('Redis server connected');
});

redis.on('error', (err) => {
  logger.error(`Redis connection error: ${err}`);
});

export default redis;
