import React from 'react'
import Body from './components/Body'
import { QuizProvider } from './context/QuizContext';
import { AuthProvider } from './context/AuthContext'

const App = () => {
  return (
    <>
   <AuthProvider>
      <QuizProvider>
        <Body />
      </QuizProvider>
    </AuthProvider>
      
    </>
  )
}

export default App;
