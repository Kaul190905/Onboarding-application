const Poll = require('../models/Poll');

// @desc    Create a poll
// @route   POST /api/polls
// @access  Private (Admin/Teacher only)
const createPoll = async (req, res) => {
    const { title, description, options, targetAudience, expiresAt } = req.body;

    try {
        const poll = await Poll.create({
            title,
            description,
            options: options.map(opt => ({ text: opt })),
            createdBy: req.user._id,
            createdByRole: req.user.role,
            targetAudience,
            expiresAt
        });

        res.status(201).json(poll);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get polls
// @route   GET /api/polls
// @access  Private
const getPolls = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = Poll.find({});
        } else if (req.user.role === 'teacher') {
            query = Poll.find({
                $or: [
                    { createdBy: req.user._id },
                    { createdByRole: 'admin', targetAudience: 'students-and-staff' }
                ]
            });
        } else {
            // Students
            query = Poll.find({
                $or: [
                    { targetAudience: 'students' },
                    { targetAudience: 'students-and-staff' }
                ]
            });
        }

        const polls = await query.populate('createdBy', 'name email');
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Vote in a poll
// @route   POST /api/polls/:id/vote
// @access  Private
const votePoll = async (req, res) => {
    const { optionId } = req.body;

    try {
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        if (poll.status === 'closed') {
            return res.status(400).json({ message: 'Poll is closed' });
        }

        // Check if user already voted
        const hasVoted = poll.options.some(opt => opt.votes.includes(req.user._id));
        if (hasVoted) {
            return res.status(400).json({ message: 'You have already voted' });
        }

        const option = poll.options.id(optionId);
        if (!option) {
            return res.status(400).json({ message: 'Invalid option' });
        }

        option.votes.push(req.user._id);
        await poll.save();

        res.json({ message: 'Vote recorded' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPoll,
    getPolls,
    votePoll
};
