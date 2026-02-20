const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['file', 'link'], required: true },
    url: { type: String, required: true },
    mimeType: { type: String }
});

const supportTicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved'],
        default: 'open'
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attachments: [attachmentSchema],
    adminNotes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
