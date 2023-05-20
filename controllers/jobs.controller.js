const StatusCodes = require('http-status-codes').StatusCodes;
const Joi = require('joi');

const JobsService = require('../services/jobs.service');
const UserService = require('../services/user.service');
const ErrorMessages = require('../messages');

const PrivateConstants = {
    RequiredPropertiesCreated: ['company', 'position'],
    JobSchemaValidator: Joi.object({
        company: Joi.string()
            .max(50)
            .required(),
        position: Joi.string()
            .max(100)
            .required(),
        status: Joi.string()
            .alphanum()
            .valid('interview', 'declined', 'pending'),
        jobType: Joi.string()
            .alphanum()
            .valid('full-time', 'part-time', 'remote', 'intership'),
        jobLocation: Joi.string()
            .max(20),
    }).options({ allowUnknown: true }),
};

const PrivateMethods = {
    defaultJob: (userBody) => {
        return {
            company: userBody.company,
            position: userBody.position,
            status: userBody.status,
            jobType: userBody.jobType,
            jobLocation: userBody.jobLocation
        }
    }
};

const PublicMethods = {
    getAll: async (req, res) => {
        res.send('get all jobs');
    },

    create: async (req, res) => {
        try {
            const reqBody = req.body;
            const validationResult = PrivateConstants.JobSchemaValidator.validate(reqBody);

            // missing/invalid properties
            if ((validationResult.error && validationResult.error.details)) {
                if (validationResult.error.details[0].path.includes('status')) {
                    console.debug(`Invalid value for status.`);
                    return res.status(StatusCodes.BAD_REQUEST).send(ErrorMessages.BAD_REQUEST_MESSAGES.E4000006);
                }

                if (validationResult.error.details[0].path.includes('jobType')) {
                    console.debug(`Invalid value for jobType.`);
                    return res.status(StatusCodes.BAD_REQUEST).send(ErrorMessages.BAD_REQUEST_MESSAGES.E4000007);
                }

                console.debug(`The following properties must be provided: ${JSON.stringify(PrivateConstants.RequiredPropertiesCreated)}`);
                return res.status(StatusCodes.BAD_REQUEST).send(ErrorMessages.BAD_REQUEST_MESSAGES.E4000005);
            }

            reqBody.createdBy = req.user.userId;

            const jobSavedToDb = await JobsService.insertJob(reqBody);
            const jobBodyHeader = PrivateMethods.defaultJob(jobSavedToDb);

            res.setHeader('job', JSON.stringify(jobBodyHeader));

            res.status(StatusCodes.CREATED).send(ErrorMessages.CREATED_MESSAGES.E2010001);
        } catch (error) {
            console.error(`An error occurred while trying to create the job: ${error}\n${error.stack}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorMessages.INTERNAL_SERVER_ERROR_MESSAGES.E5000001);
        }
    },

    getStats: async (req, res) => {
        res.send('get jobs stats');
    },

    delete: async (req, res) => {
        res.send('delete job');
    },

    update: async (req, res) => {
        res.send('update job');
    },
};

module.exports = { ...PublicMethods };