const http = require('http');
const express = require('express');
// const cors = require('cors');
const morgan = require('morgan');

const appRouter = require('../routes');
const AppConstants = require('../config/constants');

// middleware
const appMiddleware = require('../middleware/app.middleware');

const app = express();

const initialSetup = async () => {
    const server = http.createServer(app);

    server.listen(AppConstants.Port, async () => {
        console.log(`Server listening on port ${AppConstants.Port}`);
        app.emit('started');
    });

    // app.use(cors()); // using proxy instead
    if (process.env.NODE_ENV !== 'production') {
        app.use(morgan('dev'));
    }
    app.use(express.json());
    app.use(appRouter, appMiddleware.notFound);
};

module.exports = {
    initialSetup,
}