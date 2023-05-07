const HttpStatus = require('http-status-codes').StatusCodes;
const AppMiddleware = require('../middleware/app.middleware');

const PublicMethods = {
    getAll: async (req, res) => {
        console.log('GET on /getAll');

        try {
            return res.status(HttpStatus.OK).json({ response: 'ok' });
        } catch (error) {
            AppMiddleware.serverError(error, req, res);
        }
    },
};

module.exports = { ...PublicMethods };