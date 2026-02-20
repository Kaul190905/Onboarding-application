const express = require('express');
const router = express.Router();
const { createPoll, getPolls, votePoll } = require('../controllers/pollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPolls)
    .post(protect, authorize('admin', 'teacher'), createPoll);

router.route('/:id/vote')
    .post(protect, votePoll);

module.exports = router;
