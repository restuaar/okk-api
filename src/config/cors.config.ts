import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsConfig: CorsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin',
    'Origin',
  ],
  credentials: true,
};

export default corsConfig;
