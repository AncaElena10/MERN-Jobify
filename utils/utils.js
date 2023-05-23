const mongoose = require('mongoose');

const PublicMethods = {
    checkPermissions: (reqUser, resourceUserId) => {
        return (reqUser.userId === resourceUserId.toString()) ? true : false;
    },

    convertQueryParamsToLowerCase: (queryParams) => {
        const queryParamsLowerCase = {};
        Object.keys(queryParams).forEach((key) => {
            queryParamsLowerCase[key.toLowerCase()] = queryParams[key];
        });

        return queryParamsLowerCase;
    },

    createFilteringAndSortingQuery: (status, jobType, sort, search, userId) => {
        const queryObject = {
            filter: {
                createdBy: new mongoose.Types.ObjectId(userId),
            },
            sort: '',
        };

        // in case status is 'all', do not send it
        if (status && status.toLowerCase() !== 'all') {
            queryObject.filter.status = status.toLowerCase();
        }

        // in case jobType is 'all', do not send it
        if (jobType && jobType.toLowerCase() !== 'all') {
            queryObject.filter.jobType = jobType.toLowerCase();
        }

        // search for position
        if (search) {
            queryObject.filter.position = { $regex: search, $options: 'i' };
        }

        // sort by createdAt
        if (sort) {
            switch (sort.toLowerCase()) {
                case 'latest':
                    queryObject.sort = '-createdAt';
                    break;
                case 'oldest':
                    queryObject.sort = 'createdAt';
                    break;
                case 'a-z':
                    queryObject.sort = 'position';
                    break;
                case 'z-a':
                    queryObject.sort = '-position';
                    break;
                default:
                    break;
            }
        }

        return queryObject;
    }
};

module.exports = { ...PublicMethods };