
import React, { createContext, useState } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]); // sidebar list
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  const addQuiz = () => {
    const newQuiz = {
      id: Date.now().toString(),
      title: `Quiz ${quizzes.length + 1}`,
      createdAt: new Date(),
    };
    setQuizzes([newQuiz, ...quizzes]);
    setSelectedQuizId(newQuiz.id);
  };

  const selectQuiz = (id) => {
    setSelectedQuizId(id);
  };

  return (
    <QuizContext.Provider value={{ quizzes, selectedQuizId, addQuiz, selectQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};
