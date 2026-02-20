const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = User.find({}).select('-password');
        } else if (req.user.role === 'teacher') {
            // Teachers see themselves + their assigned students
            query = User.find({
                $or: [
                    { _id: req.user._id },
                    { assignedTo: req.user._id.toString() }
                ]
            }).select('-password');
        } else {
            // Students see only themselves
            query = User.find({ _id: req.user._id }).select('-password');
        }

        const users = await query;
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a user
// @route   PATCH /api/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.assignedTo !== undefined) {
            user.assignedTo = req.body.assignedTo;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            assignedTo: updatedUser.assignedTo,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    updateUser,
    deleteUser
};
