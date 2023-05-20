const StatusCodes = require('http-status-codes').StatusCodes;
const jwt = require('jsonwebtoken');

const ErrorMessages = require('../messages');

const PublicMethods = {
    notFound: (req, res) => {
        console.debug(`[MIDDLEWARE] Got the req PATH ${req.originalUrl} that does not exist.`);

        res.status(StatusCodes.NOT_FOUND).send(ErrorMessages.NOT_FOUND_MESSAGES.E4040001);
    },
    serverError: (error, req, res, next) => {
        console.debug(`[MIDDLEWARE] Error occured while processing the request: ${error}\n${error.stack}`);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ErrorMessages.INTERNAL_SERVER_ERROR_MESSAGES.E5000001);
    },
    auth: (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            console.debug(`[MIDDLEWARE] User is not authenticated, unable to access the PATH ${req.originalUrl}.`);
            return res.status(StatusCodes.UNAUTHORIZED).send(ErrorMessages.UNAUTHORIZED_MESSAGES.E4010002);
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { userId: payload.userId };

            next();
        } catch (error) {
            console.error(`An error occurred while trying verify the token: ${error}`);
            return res.status(StatusCodes.UNAUTHORIZED).send(ErrorMessages.UNAUTHORIZED_MESSAGES.E4010002);
        }
    }
}

module.exports = { ...PublicMethods };