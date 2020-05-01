const { NODE_ENV, HEADLESS, MONGODB_URL, ACCESS_TOKEN, REDIS_URL, TARGET } = process.env;

export const target = TARGET || 'trt3';
export const env = NODE_ENV || 'development';
export const accessToken = ACCESS_TOKEN || '';
export const redisUrl = REDIS_URL || 'redis://127.0.0.1:6379';
export const headless = HEADLESS && HEADLESS === 'false' ? false : true;
export const mongodbUrl = MONGODB_URL || 'mongodb://127.0.0.1:27017/${db}';