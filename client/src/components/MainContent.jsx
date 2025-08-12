import React, { useEffect, useState, useContext } from 'react';
import { Button } from './ui/button';
import { QuizContext } from '@/context/QuizContext';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const MainContent = () => {
  const { selectedQuizId } = useContext(QuizContext);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch questions + progress
  useEffect(() => {
    if (!selectedQuizId) return;

    setLoading(true);
    setError(null);

    api.get('/exam/questions', { params: { quizId: selectedQuizId } })
      .then(res => {
        const { questions: qList, progress } = res.data;

        setQuestions(qList || []);

        setAnswers(
          (qList || []).map(q => ({
            questionId: q._id,
            selectedAnswer: progress?.selectedAnswers?.[q._id] || null
          }))
        );

        setCurrentIdx(progress?.currentIndex || 0);
        setTimeLeft(progress?.timeLeft ?? 600);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch questions');
        setQuestions([]);
        setAnswers([]);
      })
      .finally(() => setLoading(false));
  }, [selectedQuizId]);

  // Countdown timer (sync to backend)
  useEffect(() => {
    if (!selectedQuizId || questions.length === 0) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, selectedQuizId, questions.length]);

  // Auto-save progress on changes
  useEffect(() => {
    if (!selectedQuizId || questions.length === 0) return;

    const saveData = {
      quizId: selectedQuizId,
      currentIndex: currentIdx,
      selectedAnswers: answers.reduce((acc, a) => {
        if (a.selectedAnswer) acc[a.questionId] = a.selectedAnswer;
        return acc;
      }, {}),
      timeLeft
    };

    api.post('/exam/save-progress', saveData).catch(err =>
      console.error("Save progress error:", err)
    );
  }, [currentIdx, answers, timeLeft, selectedQuizId, questions.length]);

  const handleOptionSelect = (answer) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[currentIdx].selectedAnswer = answer;
      return updated;
    });
  };

  const handleSubmit = () => {
    const filteredAnswers = answers
      .filter(a => a.selectedAnswer !== null && a.selectedAnswer !== undefined)
      .map(a => ({
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer
      }));

    if (filteredAnswers.length === 0) {
      alert("Please answer at least one question before submitting!");
      return;
    }

    api.post('/exam/submit', {
      userAnswers: filteredAnswers,
      quizId: selectedQuizId
    })
      .then(res => navigate('/result', { state: res.data }))
      .catch(err => {
        console.error("Submit error:", err.response?.data || err.message);
        alert("Failed to submit quiz. Please try again.");
      });
  };

  if (!selectedQuizId) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="font-light text-2xl sm:text-3xl lg:text-4xl text-muted-foreground">
            Start the Quiz
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="font-light text-xl sm:text-2xl text-muted-foreground">
            Loading questions...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-xl sm:text-2xl mb-4 break-words">
            Error: {error}
          </div>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="font-light text-xl sm:text-2xl text-muted-foreground">
            No questions available for this quiz.
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="flex-1 bg-background relative min-h-screen overflow-auto">
      {/* Timer - Responsive positioning */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-3 sm:absolute sm:top-4 sm:right-6 sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:px-0 sm:py-0">
        <div className="flex justify-between items-center sm:justify-end">
          <div className="text-sm sm:hidden text-muted-foreground">
            {currentIdx + 1}/{questions.length}
          </div>
          <div className="text-base sm:text-lg font-bold">
            ⏳ {minutes}:{seconds}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {currentQ && (
            <>
              {/* Question Info */}
              <div className="text-xs sm:text-sm text-muted-foreground">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span>Question {currentIdx + 1} of {questions.length}</span>
                  <span className="hidden sm:inline">|</span>
                  <span className="break-all">Quiz ID: {selectedQuizId.slice(-8)}</span>
                </div>
              </div>

              {/* Question */}
              <div className="text-base sm:text-lg lg:text-xl font-semibold break-words">
                Q{currentIdx + 1}: {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-3 sm:space-y-4">
                {currentQ.options.map((opt, i) => (
                  <Button
                    key={i}
                    variant={answers[currentIdx]?.selectedAnswer === opt ? "secondary" : "outline"}
                    className="w-full text-left justify-start p-3 sm:p-4 h-auto min-h-[3rem] text-sm sm:text-base break-words whitespace-normal"
                    onClick={() => handleOptionSelect(opt)}
                  >
                    <span className="text-left">{opt}</span>
                  </Button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <div className="flex gap-2 sm:gap-3">
                  <Button 
                    disabled={currentIdx === 0} 
                    onClick={() => setCurrentIdx(i => i - 1)}
                    className="flex-1 sm:flex-none"
                  >
                    Previous
                  </Button>
                  <Button 
                    disabled={currentIdx === questions.length - 1} 
                    onClick={() => setCurrentIdx(i => i + 1)}
                    className="flex-1 sm:flex-none"
                  >
                    Next
                  </Button>
                </div>

                {/* Submit Button */}
                <Button 
                  className="w-full sm:w-auto sm:ml-auto" 
                  onClick={handleSubmit}
                  variant="default"
                >
                  Submit Quiz
                </Button>
              </div>

              {/* Progress indicator for mobile */}
              <div className="sm:hidden">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  Progress: {currentIdx + 1} of {questions.length} questions
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
