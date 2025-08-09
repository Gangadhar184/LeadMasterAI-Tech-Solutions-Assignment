const { fetchQuestionFromURL } = require("../services/questionService");
const Question = require("../models/questions");
const Result = require("../models/results");

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const startExam = async (req, res) => {
    try {
        // First try to get random 10 from DB
        let questions = await Question.aggregate([{ $sample: { size: 10 } }]);

        // If DB is empty, fetch from API and store
        if (!questions || questions.length === 0) {
            const fetched = await fetchQuestionFromURL(10);
            if (!fetched || fetched.length === 0) {
                return res.status(404).json({ message: "No questions found" });
            }
            await Question.insertMany(fetched);
            questions = fetched;
        }

        //(without revealing correct_answer)
        const safeQuestions = questions.map(q => {
            const options = shuffleArray([q.correct_answer, ...q.incorrect_answers]);
            return {
                id: q._id,
                question: q.question,
                options,
                category: q.category,
                difficulty: q.difficulty,
                type: q.type
            };
        });

        res.status(200).json({ questions: safeQuestions });
    } catch (error) {
        res.status(500).json({
            message: 'Server error while fetching questions.',
            error: error.message
        });
    }
};

const submitExam = async (req, res) => {
    try {
        const { userAnswers } = req.body;

        if (!userAnswers || !Array.isArray(userAnswers)) {
            return res.status(400).json({ message: 'No answers provided.' });
        }

        const questionIds = userAnswers.map(a => a.questionId);
        const questionsFromDB = await Question.find({ _id: { $in: questionIds } }).lean();

        const correctAnswersMap = new Map(
            questionsFromDB.map(q => [q._id.toString(), q.correct_answer])
        );

        let score = 0;
        const results = userAnswers.map(userAnswer => {
            const correctAnswer = correctAnswersMap.get(userAnswer.questionId);
            const isCorrect = correctAnswer === userAnswer.selectedAnswer;
            if (isCorrect) score++;

            return {
                questionId: userAnswer.questionId,
                selectedAnswer: userAnswer.selectedAnswer,
                correctAnswer,
                isCorrect
            };
        });

        const newResult = new Result({
            user: req.user._id,
            score,
            totalQuestions: userAnswers.length,
            results
        });
        await newResult.save();

        res.status(200).json({
            score,
            totalQuestions: userAnswers.length,
            results,
            message: 'Exam submitted successfully!'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error during exam submission.',
            error: error.message
        });
    }
};

module.exports = { startExam, submitExam };
