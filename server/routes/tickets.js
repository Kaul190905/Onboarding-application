const express = require('express');
const router = express.Router();
const { submitTicket, getTickets, updateTicket } = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTickets)
    .post(protect, submitTicket);

router.route('/:id')
    .patch(protect, authorize('admin'), updateTicket);

module.exports = router;
