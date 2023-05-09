const AppConstants = require('../config/constants');
const router = require('express').Router();

router.use(`/api/${AppConstants.Version}`, require('./api'));

module.exports = router;