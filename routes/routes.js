const express = require('express');

const { login } = require('../controllers/authController');
const { getAllTopics, insertTopics } = require('../controllers/topicController');
const authenticateUser = require('../middlewares/authenticateUser');
const { updateSubTopicStatus, getProgressReport, updateTopicStatus } = require('../controllers/progressController');

const router = express.Router()

router.get('/status', (req, res) => { res.send("OK") })
router.post('/login', login)
router.get('/topics', authenticateUser, getAllTopics)
router.post('/subtopic-progress', authenticateUser, updateSubTopicStatus)
router.post('/topic-progress', authenticateUser, updateTopicStatus)
router.get('/progress-report', authenticateUser, getProgressReport)
router.get('/topics/script', insertTopics)

module.exports = router