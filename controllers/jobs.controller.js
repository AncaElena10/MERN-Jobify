const StatusCodes = require('http-status-codes').StatusCodes;
const Joi = require('joi');
const moment = require('moment');

const JobsService = require('../services/jobs.service');
const ErrorMessages = require('../messages');
const hasAccess = require('../utils/checkPermissions').checkPermissions;

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
                _id: job._id,
                company: job.company,
                position: job.position,
                status: job.status,
                jobType: job.jobType,
                jobLocation: job.jobLocation,
                createdBy: job.createdBy,
                createdAt: job.createdAt,
                updatedAt: job.updatedAt,
            }
            response.result.push(obj);
        }

        return response;
    },

    defaultJobsStatsResponse: (jobsStatsStatus, jobsStatsMonthly) => {
        const response = {
            statistics: {
                interview: 0,
                pending: 0,
                declined: 0
            },
            monthlyApplications: []
        };

        jobsStatsStatus.map((elem) => {
            for (let key of Object.keys(response.statistics)) {
                if (key === elem._id) {
                    response.statistics[key] = elem.count;
                }
            }
        });

        response.monthlyApplications = jobsStatsMonthly.map((elem) => {
            const {
                _id: { year, month },
                count,
            } = elem;

            const date = moment().month(month - 1).year(year).format('MMM Y')
            return { date, count };
        }).reverse();

        return response;
    },
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

    update: async (req, res) => {
        try {
            const jobId = req.params.id;
            const job = await JobsService.getJobById(jobId);

            if (!job || !hasAccess(req.user, job.createdBy)) {
                console.debug(`Couldn't find the job with id ${jobId}`);
                return res.status(StatusCodes.NOT_FOUND).send(ErrorMessages.NOT_FOUND_MESSAGES.E4040002);
            }

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

            await JobsService.updateJob(reqBody, jobId);

            res.status(StatusCodes.CREATED).send(ErrorMessages.CREATED_MESSAGES.E2010001);
        } catch (error) {
            console.error(`An error occurred while trying to update the job: ${error}\n${error.stack}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorMessages.INTERNAL_SERVER_ERROR_MESSAGES.E5000001);
        }
    },

    delete: async (req, res) => {
        try {
            const jobId = req.params.id;
            const job = await JobsService.getJobById(jobId);

            if (!job || !hasAccess(req.user, job.createdBy)) {
                console.debug(`Couldn't find the job with id ${jobId}`);
                return res.status(StatusCodes.NOT_FOUND).send(ErrorMessages.NOT_FOUND_MESSAGES.E4040002);
            }

            await JobsService.deleteJob(jobId);

            res.status(StatusCodes.OK).send(ErrorMessages.SUCCESS_MESSAGES.E2000001);
        } catch (error) {
            console.error(`An error occurred while trying to update the job: ${error}\n${error.stack}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorMessages.INTERNAL_SERVER_ERROR_MESSAGES.E5000001);
        }
    },

    getStats: async (req, res) => {
        try {
            const allJobsGroupedByStatus = await JobsService.getAllJobsGroupByStatus(req.user.userId);
            const alljobsGroupedByMonth = await JobsService.getAllJobsGroupByMonth(req.user.userId);
            const stats = PrivateMethods.defaultJobsStatsResponse(allJobsGroupedByStatus, alljobsGroupedByMonth);

            res.status(StatusCodes.OK).send(stats);
        } catch (error) {
            console.error(`An error occurred while trying to get jobs stats: ${error}\n${error.stack}`);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorMessages.INTERNAL_SERVER_ERROR_MESSAGES.E5000001);
        }
    },
};

module.exports = { ...PublicMethods };