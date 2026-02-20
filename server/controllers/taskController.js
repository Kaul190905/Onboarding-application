const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = Task.find({});
        } else if (req.user.role === 'teacher') {
            // Teachers see tasks they assigned or tasks assigned to their students
            query = Task.find({ assignedBy: req.user._id });
        } else {
            // Students see their own tasks
            query = Task.find({ assignedTo: req.user._id });
        }

        const tasks = await query.populate('assignedTo', 'name email').populate('assignedBy', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (Admin/Teacher only)
const createTask = async (req, res) => {
    const { title, description, assignedTo, dueDate, category } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user._id,
            dueDate,
            category
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id
// @access  Private
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if student is updating their own task or teacher/admin
        if (req.user.role === 'student' && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        task.status = req.body.status || task.status;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTaskStatus
};
