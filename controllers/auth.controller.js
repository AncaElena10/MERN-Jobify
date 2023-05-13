const StatusCodes = require('http-status-codes').StatusCodes;
const Joi = require('joi');

const User = require('../models/user');
const ErrorMessages = require('../messages');

const PrivateConstants = {
    RequiredProperties: ['name', 'password', 'email'],
    schema: Joi.object({
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        password: Joi.string()
            .min(3) // TODO - change this
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
    }),
};

const PrivateMethods = {

};

const PublicMethods = {
    register: async (req, res) => {
        try {
            /* empty db << for testing purposes only >> */
            await User.model.deleteMany({});

            const reqBody = req.body;
            const validationResult = PrivateConstants.schema.validate(reqBody);

            // missing/invalid properties
            if ((validationResult.error && validationResult.error.details)) {
                console.debug(`One following properties must be provided: ${JSON.stringify(PrivateConstants.RequiredProperties)}`);
                return res.status(StatusCodes.BAD_REQUEST).send(ErrorMessages.BAD_REQUEST_MESSAGES.E4000001);
            }

            // unique values
            const emailExists = await User.model.findOne({ email: reqBody.email });
            if (emailExists) {
                console.debug(`E-mail is not unique`);
                return res.status(StatusCodes.BAD_REQUEST).send(ErrorMessages.BAD_REQUEST_MESSAGES.E4000002);
            }

            const userSavedToDb = await User.model.create(req.body);

            // the token used in communication between backend and frontend
            const token = userSavedToDb.createJWT();
            res.setHeader('token', token);
            res.status(StatusCodes.CREATED).send(ErrorMessages.CREATED_MESSAGES.E2010001);
        } catch (error) {
            console.error(`An error occurred while trying to register user: ${error}\n${error.stack}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorMessages.INTERNAL_SERVER_ERROR_MESSAGES.E5000001);
        }
    },

    login: async (req, res) => {
        res.send('login user');
    },

    update: async (req, res) => {
        res.send('update user');
    },
};

module.exports = { ...PublicMethods };