const mongoose = require('mongoose');

// 
const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // Reference to the Question model
        required: true,
    },
    selectedAnswer: {
        type: String,
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
    }
});

// The main schema for an exam result.
const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    results: [answerSchema], // array of the answers provided
    submittedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Result', resultSchema);
