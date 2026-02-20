const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTaskStatus } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTasks)
    .post(protect, authorize('admin', 'teacher'), createTask);

router.route('/:id')
    .patch(protect, updateTaskStatus);

module.exports = router;
