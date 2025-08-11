import React, { useContext } from 'react'
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  LogOut, 
} from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';  
import { QuizContext } from '@/context/QuizContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const {logout} = useContext(AuthContext);
  const { quizzes, addQuiz, selectedQuizId, selectQuiz } = useContext(QuizContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout;
    navigate('/')
  } 

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-background border-r transition-all duration-300 ease-in-out flex flex-col`}>
      
      {/* Header with toggle button */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold">Quiz App</h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4  cursor-pointer " />
          ) : (
            <ChevronLeft className="h-4 w-4  cursor-pointer " />
          )}
        </Button>
      </div>

      <Separator />

      {/* Middle Section */}
      <div className="p-4">
        <Button
          className="w-full justify-start gap-3 cursor-pointer"
          size={isCollapsed ? "sm" : "default"}
          onClick={addQuiz}
        >
          <Plus className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>New Quiz</span>}
        </Button>
      </div>

      {/* Display quiz like quiz 1 or its topic */}
          <div className="flex-1 overflow-y-auto px-2">
        {quizzes.map((quiz) => (
          <Button
            key={quiz.id}
            variant={quiz.id === selectedQuizId ? "secondary" : "ghost"}
            className="w-full justify-start mb-1"
            onClick={() => selectQuiz(quiz.id)}
          >
            {!isCollapsed && quiz.title}
          </Button>
        ))}
      </div>

      <Separator />


      {/* Sign Out Button */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          size={isCollapsed ? "sm" : "default"}
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
