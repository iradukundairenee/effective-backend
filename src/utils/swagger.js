// import path from 'path';

const swaggerDefinition = {
  explorer: true,
  definition: {
    swagger: '2.0',
    components: {},
    info: {
      title: 'cube',
      version: '1.0.0',
      description: 'A.R.I',
    },
    schemes: ['http', 'https '],
    servers: [
      {
        url: 'http://localhost:4011/api/v1',
        name: 'Cube',
      },
      {
        url: 'https://dev.arinnovations.io/',
        name: 'Cube',
      },
    ],
    consumes: ['application/json'],
    produces: ['application/json'],
    paths: {
      '/api/v1/products/client/products': {
        get: {
          description: 'products analytics',
          produces: 'application/json',
          parameters: [
            {
              in: 'header',
              name: 'Authorization',
              type: 'apiKey',
              scheme: 'bearer',
            },
          ],
          responses: {
            200: {
              description: 'message',
              schema: {
                type: 'object',
              },
            },
          },
        },
      },
    },
  },
  apis: ['../modules/*.js'],
};

export default swaggerDefinition;
