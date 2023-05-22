const Job = require('../models/job');

const PublicMethods = {
    insertJob: async (body) => {
        try {
            return await Job.model.create(body);
        } catch (error) {
            console.log(`Error occured while trying to insert job into db: ${error}\n ${error.stack}`);
        }
    },

    getJobById: async (id) => {
        try {
            return await Job.model.findOne({ _id: id });
        } catch (error) {
            console.log(`Error occured while trying to get job by id from db: ${error}\n ${error.stack}`);
        }
    },

    deleteAllJobs: async () => {
        try {
            return await Job.model.deleteMany({});
        } catch (error) {
            console.log(`Error occured while trying to delete all jobs: ${error}\n ${error.stack}`);
        }
    },

    deleteJob: async (id) => {
        try {
            return await Job.model.deleteOne({ _id: id });
        } catch (error) {
            console.log(`Error occured while trying to delete the job: ${error}\n ${error.stack}`);
        }
    },

    updateJob: async (body, id) => {
        try {
            return await Job.model.updateOne({ _id: id }, { $set: body });
        } catch (error) {
            console.log(`Error occured while trying to update the job: ${error}\n ${error.stack}`);
        }
    },

    getAllJobs: async (id) => {
        try {
            return await Job.model.find({ createdBy: id });
        } catch (error) {
            console.log(`Error occured while trying to get all jobs from db: ${error}\n ${error.stack}`);
        }
    }
}

module.exports = { ...PublicMethods };