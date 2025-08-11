import React from 'react'
import Body from './components/Body'
import { QuizProvider } from './context/QuizContext';

const App = () => {
  return (
    <>
    <QuizProvider>
    <Body/>
    </QuizProvider>
      
    </>
  )
}

export default App;
