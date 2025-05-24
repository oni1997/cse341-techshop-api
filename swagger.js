const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'TechStore API',
        description: 'TechStore API Documentation',
    },
    host: 'cse341-techshop-api.onrender.com',
    schemes: ['http', 'https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);