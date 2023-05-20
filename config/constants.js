'use strict';

const serviceName = 'data';

const Constants = {
    Version: 'v1',
    Port: process.env.PORT || 4000,
    ServiceDetails: {
        Name: serviceName
    },
    RouteKeys: {
        auth: '/auth',
        jobs: '/jobs',
    }
}

module.exports = Constants;