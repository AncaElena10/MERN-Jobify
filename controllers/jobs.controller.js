const StatusCodes = require('http-status-codes').StatusCodes;
const Joi = require('joi');

const JobsService = require('../services/jobs.service');
const ErrorMessages = require('../messages');
const job = require('../models/job');

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
    defaultJobsResponse: (jobs) => {
        const response = {
            result: [],
            total: jobs.length,
            numOfPages: 1,
        };

        for (let index = 0; index < jobs.length; index++) {
            const job = jobs[index];
            const obj = {
                company: job.company,
                position: job.position,
                status: job.status,
                jobType: job.jobType,
                jobLocation: job.jobLocation
            }
            response.result.push(obj);
        }

        return response;
    }
};

const PublicMethods = {
    getAll: async (req, res) => {
        try {
            const allJobs = await JobsService.getAllJobs(req.user.userId);
            const result = PrivateMethods.defaultJobsResponse(allJobs);

            res.status(StatusCodes.OK).send(result);
        } catch (error) {
            console.error(`An error occurred while trying to get all jobs: ${error}\n${error.stack}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorMessages.INTERNAL_SERVER_ERROR_MESSAGES.E5000001);
        }
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

            await JobsService.insertJob(reqBody);

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