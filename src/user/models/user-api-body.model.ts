import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const userApiBody: SchemaObject = {
  type: 'object',
  properties: {
    firstName: { type: 'string', example: 'John' },
    lastName: { type: 'string', example: 'Doe' },
    email: { type: 'string', format: 'email', example: 'john@doe.com' },
    password: { type: 'string', example: 'password123' },
    role: { type: 'string', example: 'admin' },
    isActive: { type: 'boolean', example: true },
    avatar: { type: 'string', format: 'binary', description: 'Avatar image file' },
    'photos[]': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          photo: { type: 'string', format: 'binary', description: 'Photo image file' },
          name: { type: 'string', example: 'photo1' }
        }
      },
      maxItems: 4,
      description: 'Up to 4 photos can be uploaded'
    }
  }
};
