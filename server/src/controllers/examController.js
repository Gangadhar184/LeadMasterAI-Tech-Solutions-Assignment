const { fetchQuestionFromURL } = require("../services/questionService");
const Question = require("../models/questions");
const Result = require("../models/results");
const QuizSession = require("../models/quizSession");

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const startExam = async (req, res) => {
    try {
        const { quizId } = req.query;
        
        if (!quizId) {
            return res.status(400).json({ message: "Quiz ID is required" });
        }

        const searchCriteria = { 
            quizId: quizId,
            ...(req.user?._id && { userId: req.user._id })
        };

        let existingSession = await QuizSession.findOne(searchCriteria);

        // ====== Restore existing session with elapsed time ======
        if (existingSession && existingSession.questionIds && existingSession.questionIds.length > 0) {
            // Calculate time left based on last update
            const elapsed = Math.floor((Date.now() - new Date(existingSession.lastUpdated)) / 1000);
            const remainingTime = Math.max(existingSession.timeLeft - elapsed, 0);

            // Update DB if time changed
            if (remainingTime !== existingSession.timeLeft) {
                existingSession.timeLeft = remainingTime;
                existingSession.lastUpdated = new Date();
                await existingSession.save();
            }

            // Fetch questions
            const questions = await Question.find({ 
                _id: { $in: existingSession.questionIds } 
            }).lean();
            
            if (questions.length > 0) {
                const safeQuestions = questions.map(q => {
                    const options = shuffleArray([q.correct_answer, ...q.incorrect_answers]);
                    return {
                        _id: q._id,
                        question: q.question,
                        options,
                        category: q.category,
                        difficulty: q.difficulty,
                        type: q.type
                    };
                });

                return res.status(200).json({ 
                    questions: safeQuestions,
                    progress: {
                        currentIndex: existingSession.currentIndex || 0,
                        selectedAnswers: existingSession.selectedAnswers || {},
                        timeLeft: remainingTime
                    }
                });
            }
        }

        // ====== Create new session if none exists ======
        let questions = await Question.aggregate([{ $sample: { size: 10 } }]);

        if (!questions || questions.length < 5) {
            try {
                const fetched = await fetchQuestionFromURL(10);
                
                if (!fetched || fetched.length === 0) {
                    return res.status(404).json({ message: "No questions found from external source" });
                }
                
                const insertedQuestions = await Question.insertMany(fetched);
                questions = insertedQuestions;
            } catch (apiError) {
                console.error('❌ Error fetching from API:', apiError);
                return res.status(500).json({ message: "Failed to fetch questions from external API" });
            }
        }

        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: "No questions available" });
        }

        const sessionData = {
            quizId: quizId,
            questionIds: questions.map(q => q._id),
            currentIndex: 0,
            selectedAnswers: {},
            timeLeft: 600, // 10 minutes
            isCompleted: false,
            createdAt: new Date(),
            lastUpdated: new Date()
        };

        if (req.user && req.user._id) {
            sessionData.userId = req.user._id;
        }

        const newSession = new QuizSession(sessionData);
        await newSession.save();
        
        const safeQuestions = questions.map(q => {
            const options = shuffleArray([q.correct_answer, ...q.incorrect_answers]);
            return {
                _id: q._id,
                question: q.question,
                options,
                category: q.category,
                difficulty: q.difficulty,
                type: q.type
            };
        });

        res.status(200).json({ 
            questions: safeQuestions,
            progress: {
                currentIndex: 0,
                selectedAnswers: {},
                timeLeft: 600
            }
        });
    } catch (error) {
        console.error("❌ Error in startExam:", error);
        res.status(500).json({
            message: 'Server error while fetching questions.',
            error: error.message
        });
    }
};


// const saveProgress = async (req, res) => {
//     try {
//         const { quizId, currentIndex, selectedAnswers } = req.body;
        
//         if (!quizId) {
//             return res.status(400).json({ message: 'Quiz ID is required' });
//         }

//         const searchCriteria = {
//             quizId: quizId,
//             ...(req.user?._id && { userId: req.user._id })
//         };

//         await QuizSession.updateOne(
//             searchCriteria,
//             { 
//                 $set: { 
//                     currentIndex: currentIndex || 0,
//                     selectedAnswers: selectedAnswers || {},
//                     lastUpdated: new Date()
//                 }
//             }
//         );

//         res.status(200).json({ message: 'Progress saved successfully' });
//     } catch (error) {
//         console.error('❌ Error saving progress:', error);
//         res.status(500).json({ message: 'Failed to save progress', error: error.message });
//     }
// };
const saveProgress = async (req, res) => {
    try {
        const { quizId, currentIndex, selectedAnswers, timeLeft } = req.body;
        
        if (!quizId) {
            return res.status(400).json({ message: 'Quiz ID is required' });
        }

        const searchCriteria = {
            quizId: quizId,
            ...(req.user?._id && { userId: req.user._id })
        };

        await QuizSession.updateOne(
            searchCriteria,
            { 
                $set: { 
                    currentIndex: currentIndex || 0,
                    selectedAnswers: selectedAnswers || {},
                    timeLeft: timeLeft ?? 600,
                    lastUpdated: new Date()
                }
            }
        );

        res.status(200).json({ message: 'Progress saved successfully' });
    } catch (error) {
        console.error('❌ Error saving progress:', error);
        res.status(500).json({ message: 'Failed to save progress', error: error.message });
    }
};

const submitExam = async (req, res) => {
    try {
        const { userAnswers, quizId } = req.body;

        if (!userAnswers || !Array.isArray(userAnswers) || userAnswers.length === 0) {
            return res.status(400).json({ message: 'No answers provided or format invalid.' });
        }

        if (!quizId) {
            return res.status(400).json({ message: 'Quiz ID is required.' });
        }

        const questionIds = userAnswers.map(a => a.questionId).filter(Boolean);
        if (questionIds.length === 0) {
            return res.status(400).json({ message: 'No valid question IDs provided.' });
        }

        const questionsFromDB = await Question.find({ _id: { $in: questionIds } }).lean();
        
        if (questionsFromDB.length === 0) {
            return res.status(404).json({ message: 'No matching questions found in DB.' });
        }

        let score = 0;
        const detailedResults = userAnswers.map(ans => {
            const q = questionsFromDB.find(q => q._id.toString() === ans.questionId);
            const correctAnswer = q?.correct_answer;
            const isCorrect = ans.selectedAnswer === correctAnswer;
            if (isCorrect) score++;
            return {
                questionId: ans.questionId,
                questionText: q?.question || '',
                selectedAnswer: ans.selectedAnswer,
                correctAnswer,
                isCorrect
            };
        });

        const resultData = {
            score,
            totalQuestions: userAnswers.length,
            results: detailedResults,
            quizId: quizId
        };

        if (req.user && req.user._id) {
            resultData.user = req.user._id;
        }

        const result = new Result(resultData);
        await result.save();

        const deleteCriteria = { 
            quizId: quizId, 
            ...(req.user?._id && { userId: req.user._id })
        };
        
        await QuizSession.deleteOne(deleteCriteria);

        res.json({
            message: 'Exam submitted successfully',
            score,
            totalQuestions: userAnswers.length,
            results: detailedResults
        });

    } catch (err) {
        console.error("❌ Error in submitExam:", err);
        console.error("❌ Error stack:", err.stack);
        res.status(500).json({ message: 'Server error while submitting exam.', error: err.message });
    }
};

module.exports = { startExam, submitExam, saveProgress };
