const mongoose = require('mongoose');

// Answer schema for individual question results
const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    questionText: {
        type: String,
        required: false // Store question text for reference
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

// The main schema for an exam result
const resultSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        // required: false // Made optional to support guest users
    },
    quizId: {
        type: String, // Store reference to the frontend quiz ID
        required: false
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    results: [answerSchema],
    submittedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Result', resultSchema);
