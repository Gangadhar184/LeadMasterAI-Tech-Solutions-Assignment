const axios = require("axios");
const Question = require('../models/questions');

//OpenTDB 

const URL = 'https://opentdb.com/api.php';


// Helper to decode HTML entities for cleaner text
function decodeHtmlEntities(text) {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

//fetch the data
const fetchQuestionFromURL = async (amount = 10, type = 'multiple')=> {
    try{
        const response = await axios.get(URL, {
            params: {
                amount: amount,
                type: type
            }
        });

        //clean the data and map it 
       const apiQuestions = response.data.results.map(q => ({
            question: decodeHtmlEntities(q.question),
            correct_answer: decodeHtmlEntities(q.correct_answer),
            incorrect_answers: q.incorrect_answers.map(decodeHtmlEntities),
            category: q.category,
            difficulty: q.difficulty,
            type: q.type
}));
        return apiQuestions;
    }catch(error){
        console.error('Error fetching questions from OpenTDB:', error.message);
        throw new Error('Could not retrieve questions from external API.');
    }
}

//seed questions into local mongodb
const seedQuestions = async (questions) => {
    try {
        await Question.deleteMany({});
        await Question.insertMany(questions);
        console.log("Successfully seeded questions to database");
    } catch (error) {
        console.error("Error seeding questions to DB:", error.message);
    }
};
module.exports = {fetchQuestionFromURL, seedQuestions};
