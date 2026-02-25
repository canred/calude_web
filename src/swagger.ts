import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'calude_web API',
      version: '1.0.0',
      description: 'REST API with Express, TypeScript, and Prisma',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string', nullable: true },
            published: { type: 'boolean' },
            authorId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            body: { type: 'string' },
            postId: { type: 'integer' },
            authorId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Like: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            postId: { type: 'integer' },
            userId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Message: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            body: { type: 'string' },
            senderId: { type: 'integer' },
            receiverId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            type: { type: 'string' },
            body: { type: 'string' },
            read: { type: 'boolean' },
            userId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication (public)' },
      { name: 'Search', description: 'Search (public)' },
      { name: 'Users', description: 'User management' },
      { name: 'Posts', description: 'Post management' },
      { name: 'Comments', description: 'Comment management' },
      { name: 'Likes', description: 'Like management' },
      { name: 'Followers', description: 'Follow management' },
      { name: 'Messages', description: 'Direct messages' },
      { name: 'Notifications', description: 'Notifications' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
