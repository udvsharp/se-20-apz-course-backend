import process from 'process';
import crypto from 'crypto';

// Auth
export const secretKey = process.env.JWT_SECRET_KEY || crypto.randomBytes(32).toString('hex');
export const mongoDbUri = process.env.MONGODB_URI;

// DB
export const dbName = 'prodef-db';
export const dbUri = `${mongoDbUri}/${dbName}`;
export const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// App
export const appPort = process.env.PORT || 3000;