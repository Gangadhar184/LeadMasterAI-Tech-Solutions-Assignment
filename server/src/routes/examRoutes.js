const express = require("express");
const {userAuth} = require("../middlewares/auth")
const {startExam, submitExam} = require("../controllers/examController");

const examRouter = express.Router();

examRouter.get('/questions',userAuth  ,  startExam);
examRouter.post('/submit',userAuth,  submitExam);

module.exports = examRouter;
