const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);

// Get current user from token (session restore)
router.get('/me', protect, async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        assignedTo: req.user.assignedTo,
    });
});

module.exports = router;
