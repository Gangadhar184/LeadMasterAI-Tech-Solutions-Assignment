const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
     correct_answer : {
        type: String,
        required: true,
        trim: true

    },
    incorrect_answers: {
        type: [String],
        required: true,
        validate: [arr => arr.length === 3, "Must have exactly 3 incorrect answers"]
    },
    category: {
        type: String,
        trim: true,
    },
    difficulty: {
        type: String,
        enum : ['easy', 'medium', 'hard'],
        trim: true,
    },
    type: {
        type: String, 
        trim: true
    }
})
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
