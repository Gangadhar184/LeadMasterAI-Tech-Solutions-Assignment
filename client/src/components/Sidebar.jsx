import React, { useContext } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ChevronLeft, ChevronRight, Plus, LogOut, Trash2 } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';
import { QuizContext } from '@/context/QuizContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { logout } = useContext(AuthContext);
  const { quizzes, addQuiz, deleteQuiz, selectedQuizId, selectQuiz } = useContext(QuizContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={`
      ${isCollapsed ? 'w-12 sm:w-16' : 'w-56 sm:w-64'} 
      min-w-0 flex-shrink-0 
      bg-background border-r 
      transition-all duration-300 ease-in-out 
      flex flex-col 
      h-full overflow-hidden
      fixed left-0 top-0 bottom-0 z-10
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 sm:p-4 min-h-0">
        {!isCollapsed && (
          <h1 className="text-sm sm:text-lg font-semibold truncate mr-2">
            Quiz App
          </h1>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggle} 
          className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0"
        >
          {isCollapsed ? 
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" /> : 
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          }
        </Button>
      </div>

      <Separator />

      {/* Add Quiz */}
      <div className="p-2 sm:p-4 flex-shrink-0">
        <Button 
          className="w-full justify-start gap-2 sm:gap-3 min-w-0" 
          size={isCollapsed ? "sm" : "default"} 
          onClick={addQuiz}
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          {!isCollapsed && (
            <span className="truncate text-xs sm:text-sm">
              New Quiz
            </span>
          )}
        </Button>
      </div>

      {/* Quiz List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-1 sm:px-2 min-h-0">
        <div className="space-y-1">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="flex items-center min-w-0 gap-1">
              <Button
                variant={quiz.id === selectedQuizId ? "secondary" : "ghost"}
                className="flex-1 justify-start min-w-0 text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => selectQuiz(quiz.id)}
                title={isCollapsed ? quiz.title : undefined}
              >
                {isCollapsed ? (
                  <span className="w-2 h-2 sm:w-3 sm:h-3 bg-current rounded-full flex-shrink-0"></span>
                ) : (
                  <span className="truncate">{quiz.title}</span>
                )}
              </Button>
              {!isCollapsed && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteQuiz(quiz.id)} 
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                  title="Delete quiz"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Sign Out */}
      <div className="p-2 sm:p-4 flex-shrink-0 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 sm:gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 min-w-0"
          size={isCollapsed ? "sm" : "default"}
          onClick={handleSignOut}
        >
          <LogOut className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          {!isCollapsed && (
            <span className="truncate text-xs sm:text-sm">
              Sign Out
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
