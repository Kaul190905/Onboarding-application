const mongoose = require('mongoose');

const pollOptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const pollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    options: [pollOptionSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdByRole: {
        type: String,
        enum: ['admin', 'teacher'],
        required: true
    },
    targetAudience: {
        type: String,
        enum: ['students', 'students-and-staff'],
        default: 'students'
    },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    },
    expiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Poll', pollSchema);
