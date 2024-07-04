import { getSchemaPath } from '@nestjs/swagger';

export function createResponseSchema(innerType: any) {
  return {
    allOf: [
      {
        properties: {
          message: { type: 'string' },
          data: { $ref: getSchemaPath(innerType) },
        },
      },
    ],
  };
}
