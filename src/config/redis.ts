import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
redisClient.connect().catch(console.error); 