const { NODE_ENV, SOCKET_URL, MONGODB_URL, ACCESS_TOKEN, TARGET } = process.env;

export const target = TARGET || 'trt3';
export const env = NODE_ENV || 'development';
export const accessToken = ACCESS_TOKEN || '';
export const socketUrl = SOCKET_URL || 'http://127.0.0.1:9018';
export const mongodbUrl = MONGODB_URL || 'mongodb://127.0.0.1:27017/${db}';