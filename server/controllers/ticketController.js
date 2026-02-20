const SupportTicket = require('../models/SupportTicket');

// @desc    Submit a ticket
// @route   POST /api/tickets
// @access  Private
const submitTicket = async (req, res) => {
    const { title, description, category, priority, attachments } = req.body;

    try {
        const ticket = await SupportTicket.create({
            title,
            description,
            category,
            priority,
            submittedBy: req.user._id,
            attachments
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = SupportTicket.find({});
        } else {
            query = SupportTicket.find({ submittedBy: req.user._id });
        }

        const tickets = await query.populate('submittedBy', 'name email');
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ticket (Admin)
// @route   PATCH /api/tickets/:id
// @access  Private (Admin only)
const updateTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.status = req.body.status || ticket.status;
        ticket.adminNotes = req.body.adminNotes || ticket.adminNotes;

        const updatedTicket = await ticket.save();
        res.json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitTicket,
    getTickets,
    updateTicket
};
