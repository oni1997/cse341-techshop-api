const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Users API',
        description: 'USers Api',
    },
    host: 'localhost:3000/api/items',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/itemRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);