const StatusCodes = require('http-status-codes').StatusCodes;
const Joi = require('joi');

const UserService = require('../services/user.service');
const ErrorMessages = require('../messages');

const PrivateConstants = {
    RequiredPropertiesRegister: ['name', 'password', 'email'],
    RequiredPropertiesLogin: ['password', 'email'],
    RequiredPropertiesUpdate: ['name', 'lastName', 'email', 'location'],
    RegisterSchemaValidator: Joi.object({
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
    }).options({ allowUnknown: true }),
    LoginSchemaValidator: Joi.object({
        password: Joi.string()
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
    }).options({ allowUnknown: true }),
    UpdateSchemaValidator: Joi.object({
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        lastName: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        location: Joi.string()
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
    }).options({ allowUnknown: true }),
};

const PrivateMethods = {
    defaultUser: (userBody) => {
        return {
            name: userBody.name,
            lastName: userBody.lastName,
            email: userBody.email,
            location: userBody.location,
        }
    }
};

const PublicMethods = {
    register: async (req, res) => {
        try {
            /* empty db << for testing purposes only >> */
            await UserService.deleteAllUsers();

            const reqBody = req.body;
            const validationResult = PrivateConstants.RegisterSchemaValidator.validate(reqBody);

            // missing/invalid properties
            if ((validationResult.error && validationResult.error.details)) {
                console.debug(`The following properties must be provided: ${JSON.stringify(PrivateConstants.RequiredPropertiesRegister)}`);
                return res.status(StatusCodes.BAD_REQUEST).send(ErrorMessages.BAD_REQUEST_MESSAGES.E4000001);
            }

            // unique values
            const currentUser = await UserService.getUserByEmail(reqBody.email);
            if (currentUser) {
                console.debug(`E-mail is not unique, user already exists.`);
                return res.status(StatusCodes.BAD_REQUEST).send(ErrorMessages.BAD_REQUEST_MESSAGES.E4000002);
            }

            const userSavedToDb = await UserService.insertUser(reqBody);

            // the token used in communication between backend and frontend
            const token = userSavedToDb.createJWT();
            const userBodyHeader = PrivateMethods.defaultUser(userSavedToDb);

            res.setHeader('token', token);
            res.setHeader('user', JSON.stringify(userBodyHeader));

            res.status(StatusCodes.CREATED).send(ErrorMessages.CREATED_MESSAGES.E2010001);
        } catch (error) {
            console.error(`An error occurred while trying to register user: ${error}\n${error.stack}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorMessages.INTERNAL_SERVER_ERROR_MESSAGES.E5000001);
        }
    },

    login: async (req, res) => {
        try {
            const reqBody = req.body;
            const validationResult = PrivateConstants.LoginSchemaValidator.validate(reqBody);

            // missing/invalid properties
            if ((validationResult.error && validationResult.error.details)) {
                console.debug(`The following properties must be provided: ${JSON.stringify(PrivateConstants.RequiredPropertiesLogin)}`);
                return res.status(StatusCodes.BAD_REQUEST).send(ErrorMessages.BAD_REQUEST_MESSAGES.E4000003);
            }

            const currentUser = await UserService.getUserByEmail(reqBody.email);
            if (!currentUser) {
                console.debug(`User with email address ${reqBody.email} not found.`);
                return res.status(StatusCodes.UNAUTHORIZED).send(ErrorMessages.UNAUTHORIZED_MESSAGES.E4010001);
            }

            const passwordMatch = await currentUser.comparePassword(reqBody.password);
            if (!passwordMatch) {
                console.debug(`Invalid password for user with email address ${reqBody.email}.`);
                return res.status(StatusCodes.UNAUTHORIZED).send(ErrorMessages.UNAUTHORIZED_MESSAGES.E4010001);
            }

            const token = currentUser.createJWT();
            const userBodyHeader = PrivateMethods.defaultUser(currentUser);

            res.setHeader('token', token);
            res.setHeader('user', JSON.stringify(userBodyHeader));

            res.status(StatusCodes.OK).send(ErrorMessages.SUCCESS_MESSAGES.E2000001);
        } catch (error) {
            console.error(`An error occurred while trying to login user: ${error}\n${error.stack}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorMessages.INTERNAL_SERVER_ERROR_MESSAGES.E5000001);
        }
    },

    update: async (req, res) => {
        try {
            const reqBody = req.body;
            const validationResult = PrivateConstants.UpdateSchemaValidator.validate(reqBody);

            // missing/invalid properties
            if ((validationResult.error && validationResult.error.details)) {
                console.debug(`The following properties must be provided: ${JSON.stringify(PrivateConstants.RequiredPropertiesUpdate)}`);
                return res.status(StatusCodes.BAD_REQUEST).send(ErrorMessages.BAD_REQUEST_MESSAGES.E4000004);
            }

            const userId = req.user.userId
            let user = await UserService.getUserById(userId);

            if (!user) {
                console.debug(`User ${userId} not found`);
                throw new Error(`User not found.`);
            }

            const userToUpdateBody = { // TODO - use defaultUser
                name: reqBody.name,
                lastName: reqBody.lastName,
                email: reqBody.email,
                location: reqBody.location,
            };
            await UserService.updateUser(userToUpdateBody, userId);
            user = await UserService.getUserById(userId);
            const token = user.createJWT();

            res.setHeader('token', token);
            res.setHeader('user', JSON.stringify(userToUpdateBody));

            res.status(StatusCodes.OK).send(ErrorMessages.SUCCESS_MESSAGES.E2000001);
        } catch (error) {
            console.error(`An error occurred while trying to update user: ${error}\n${error.stack}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorMessages.INTERNAL_SERVER_ERROR_MESSAGES.E5000001);
        }
    },

    getOne: async (req, res) => {
        try {
            const userId = req.user.userId;
            const user = await UserService.getUserById(userId);
            const token = user.createJWT();

            if (!user) {
                console.debug(`User ${userId} not found`);
                throw new Error(`User not found.`);
            }

            res.setHeader('token', token);
            res.setHeader('user', JSON.stringify(user));

            res.status(StatusCodes.OK).send(ErrorMessages.SUCCESS_MESSAGES.E2000001);
        } catch (error) {
            console.error(`An error occurred while trying to login user: ${error}\n${error.stack}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorMessages.INTERNAL_SERVER_ERROR_MESSAGES.E5000001);
        }
    },
};

module.exports = { ...PublicMethods };