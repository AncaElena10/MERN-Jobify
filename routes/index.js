const AppConstants = require('../config/constants');
const router = require('express').Router();

router.use(`/${AppConstants.ServiceDetails.Name}`, require('./api'));

module.exports = router;