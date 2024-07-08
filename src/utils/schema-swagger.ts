import { getSchemaPath } from '@nestjs/swagger';
import { Page } from 'src/dto/success.dto';

export function createResponseSchema(innerType: any, isPaging = false) {
  if (isPaging) {
    return {
      allOf: [
        {
          properties: {
            message: { type: 'string' },
            data: { $ref: getSchemaPath(innerType) },
            page: { $ref: getSchemaPath(Page) },
          },
        },
      ],
    };
  }
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
