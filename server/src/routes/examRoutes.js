const express = require("express");
const {userAuth} = require("../middlewares/auth")
const {startExam, submitExam, saveProgress} = require("../controllers/examController");

const examRouter = express.Router();

examRouter.get('/questions', userAuth, startExam);
examRouter.post('/submit', userAuth, submitExam);
// ADD THIS NEW ROUTE
examRouter.post('/save-progress', userAuth, saveProgress);

module.exports = examRouter;
