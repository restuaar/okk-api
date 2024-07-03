import * as fs from 'fs';
import * as crypto from 'crypto';

const generateJwtSecret = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

const jwtSecret = generateJwtSecret();
console.log('New JWT Secret:', jwtSecret);

const envFilePath = '.env';
const envContent = fs.readFileSync(envFilePath, 'utf8');

const newEnvContent = envContent.replace(
  /^JWT_SECRET=.*/gm,
  `JWT_SECRET=${jwtSecret}`,
);

fs.writeFileSync(envFilePath, newEnvContent, 'utf8');

console.log('JWT Secret telah ditulis ke file .env.');
