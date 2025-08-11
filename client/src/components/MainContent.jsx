import React, {useEffect, useState, useContext} from 'react'
import { Button } from './ui/button';
import { QuizContext } from '@/context/QuizContext';
import api from '@/lib/api';

const MainContent = () => {
  const { selectedQuizId } = useContext(QuizContext);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (selectedQuizId) {
      api.get('/exam/questions')
        .then(res => {
          setQuestions(res.data.questions);
          setCurrentIdx(0);
        })
        .catch(err => console.error(err));
    }
  }, [selectedQuizId]);

  if (!selectedQuizId) {
    return <div className="flex-1 p-8">Select or create a quiz to start</div>;
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="flex-1 p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {currentQ && (
          <>
            <div className="text-lg font-semibold">{currentQ.question}</div>
            <div className="space-y-2">
              {currentQ.options.map((opt, i) => (
                <Button key={i} variant="outline" className="w-full">{opt}</Button>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button disabled={currentIdx === 0} onClick={() => setCurrentIdx(i => i - 1)}>Prev</Button>
              <Button disabled={currentIdx === questions.length - 1} onClick={() => setCurrentIdx(i => i + 1)}>Next</Button>
            </div>
            <Button className="mt-4">Submit</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MainContent
