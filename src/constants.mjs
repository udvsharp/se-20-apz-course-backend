import process from 'process';
import crypto from 'crypto';

// Auth
export const secretKey = process.env.JWT_SECRET_KEY || crypto.randomBytes(32).toString('hex');

// DB
export const dbName = 'prodef-db';
export const dbUri = `mongodb://127.0.0.1:27017/${dbName}`;
export const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// App
export const appPort = process.env.APP_PORT || 3000;