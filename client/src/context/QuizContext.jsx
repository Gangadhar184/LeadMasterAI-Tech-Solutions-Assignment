import React, { createContext, useState, useEffect } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]); 
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  // Load quizzes from localStorage
  useEffect(() => {
    const storedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const storedSelectedId = localStorage.getItem("selectedQuizId");

    setQuizzes(storedQuizzes);
    if (storedSelectedId && storedQuizzes.some(q => q.id === storedSelectedId)) {
      setSelectedQuizId(storedSelectedId);
    } else {
      setSelectedQuizId(null);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
    localStorage.setItem("selectedQuizId", selectedQuizId || "");
  }, [quizzes, selectedQuizId]);

  const addQuiz = () => {
    const newQuiz = {
      id: Date.now().toString(),
      title: `Quiz ${quizzes.length + 1}`,
      createdAt: new Date(),
    };
    setQuizzes([newQuiz, ...quizzes]);
    setSelectedQuizId(newQuiz.id);
  };

  const deleteQuiz = (id) => {
    const updatedQuizzes = quizzes.filter(q => q.id !== id);
    setQuizzes(updatedQuizzes);

    // If deleted quiz was selected, reset selection
    if (id === selectedQuizId) {
      setSelectedQuizId(updatedQuizzes.length ? updatedQuizzes[0].id : null);
    }
  };

  const selectQuiz = (id) => {
    setSelectedQuizId(id);
  };

  return (
    <QuizContext.Provider value={{ quizzes, selectedQuizId, addQuiz, deleteQuiz, selectQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};
