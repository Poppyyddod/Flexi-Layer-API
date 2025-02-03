import { createClient } from 'redis';
// import { storeTableNamesInRedis } from './store.redis';

// สร้างการเชื่อมต่อกับ Redis
export const redisClient = createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err: Error) => {
    console.error('Failed connect to Redis:');
});

redisClient.on('connect', () => {
    console.log('* Redis connected');
});