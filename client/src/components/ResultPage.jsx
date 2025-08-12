import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultPage = () => {
  const { state } = useLocation(); // Contains { score, totalQuestions, results }
  
  if (!state) {
    return <div>No results found.</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      <p className="text-lg mb-6">
        Score: <span className="font-bold">{state.score}</span> / {state.totalQuestions}
      </p>
      
      <div className="space-y-4">
        {state.results.map((r, idx) => (
          <div key={idx} className={`p-4 rounded-lg border ${r.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <p><strong>Q{idx + 1}:</strong> {r.questionText || ''}</p>
            <p>Your Answer: {r.selectedAnswer}</p>
            <p>Correct Answer: {r.correctAnswer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPage;
