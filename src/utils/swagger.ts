import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ExpressJS Backend API',
      version: '1.0.0',
      description: 'API documentation for the ExpressJS backend'
    },
    servers: [
      {
        url: 'https://upraised-assignment-sdgm.onrender.com/api/v1/'
      }
    ]
  },
  apis: ['./src/routes/**/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
