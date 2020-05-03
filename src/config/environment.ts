const { NODE_ENV, SOCKET_HOST, SOCKET_PORT, MONGODB_HOST, MONGODB_PORT, ACCESS_TOKEN, TARGET } = process.env;

export const target = TARGET || 'trt3';
export const env = NODE_ENV || 'development';
export const accessToken = ACCESS_TOKEN || '';
export const mongodbHost = MONGODB_HOST || '127.0.0.1';
export const mongodbPort = MONGODB_PORT || '27017';
export const socketHost = SOCKET_HOST || '127.0.0.1';
export const socketPort = SOCKET_PORT || '9090';