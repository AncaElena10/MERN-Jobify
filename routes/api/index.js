const router = require('express').Router();

const gatherController = require('../../controllers/gather.controller');
const authController = require('../../controllers/auth.controller');
const jobsController = require('../../controllers/jobs.controller');

const authMiddleware = require('../../middleware/app.middleware');

router.get('/gather', gatherController.getAll);

// user
// public APIs - do not require the token
router.post('/register', authController.register);
router.post('/login', authController.login);
// private APIs - require the token
router.patch('/updateUser', authMiddleware.auth, authController.update);

// jobs
// private APIs - require the token
router.get('/', authMiddleware.auth, jobsController.getAll);
router.post('/', authMiddleware.auth, jobsController.create);
router.get('/stats', authMiddleware.auth, jobsController.getStats);
router.delete('/:id', authMiddleware.auth, jobsController.delete);
router.patch('/:id', authMiddleware.auth, jobsController.update);

module.exports = router;