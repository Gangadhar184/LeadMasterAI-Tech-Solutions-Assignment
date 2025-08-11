import React, { useState } from 'react'
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const Quiz = () => {

  const [isCollapsed, setIsCollapsed]  = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <>
     <div>
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar}  />
    </div>
    <MainContent/>
    </>
   
  )
}

export default Quiz;
