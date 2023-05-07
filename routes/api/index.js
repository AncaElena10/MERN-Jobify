const router = require('express').Router();
const gatherController = require('../../controllers/gather.controller');

router.get('/gather', gatherController.getAll);

module.exports = router;