const mongoose = require('mongoose');
const validator = require('validator');

const PrivateConstans = {
    JobSchema: new mongoose.Schema({
        company: {
            type: String,
            require: [true, 'Please provide company'],
            maxLength: 50,
        },
        position: {
            type: String,
            require: [true, 'Please provide position'],
            maxLength: 100,
        },
        status: {
            type: String,
            enum: ['interview', 'declined', 'pending'],
            default: 'pending',
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'remote', 'intership'],
            default: 'full-time',
        },
        jobLocation: {
            type: String,
            default: '',
            maxLength: 20,
            // required: [true, 'Please provide job location'],
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'user',
            required: [true, 'Please provide user'],
        },
    }, { timestamps: true })
};

const PublicConstants = {
    model: mongoose.model('Job', PrivateConstans.JobSchema),
};

module.exports = { ...PublicConstants };