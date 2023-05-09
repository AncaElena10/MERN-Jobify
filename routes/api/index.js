const router = require('express').Router();
const gatherController = require('../../controllers/gather.controller');
const authController = require('../../controllers/auth.controller');
const jobsController = require('../../controllers/jobs.controller');

router.get('/gather', gatherController.getAll);

// user
router.post('/register', authController.register);
router.post('/login', authController.login);
router.patch('/updateUser', authController.update);

// jobs
router.get('/', jobsController.getAll);
router.post('/', jobsController.create);
router.get('/stats', jobsController.getStats);
router.delete('/:id', jobsController.delete);
router.patch('/:id', jobsController.update);

module.exports = router;