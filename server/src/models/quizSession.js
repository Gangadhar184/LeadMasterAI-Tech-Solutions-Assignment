const mongoose = require('mongoose');

// Schema to track which questions belong to which quiz session
const quizSessionSchema = new mongoose.Schema({
    quizId: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    questionIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    }],
    currentIndex: {
        type: Number,
        default: 0
    },
    selectedAnswers: {
        type: Object,
        default: {}
    },
    timeLeft: {
        type: Number, // in seconds
        default: 600  // 10 minutes
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
});

quizSessionSchema.index({ quizId: 1, userId: 1 });

module.exports = mongoose.model('QuizSession', quizSessionSchema);
