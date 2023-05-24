const http = require('http');
const express = require('express');
// const cors = require('cors');
const morgan = require('morgan');

// build app
const path = require('path');
const clientBuildPath = path.join(__dirname, '../client/build');
const indexPath = path.join(clientBuildPath, 'index.html');

// security packages
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

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

    app.use(express.static(path.resolve(clientBuildPath)));

    app.use(express.json());

    app.use(helmet()); // secured headers
    app.use(xss()); // make sure the input is sanitized
    app.use(mongoSanitize()); // prevents mongodb operator injection

    app.use(appRouter, appMiddleware.notFound);

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(indexPath));
    });
};

module.exports = {
    initialSetup,
};