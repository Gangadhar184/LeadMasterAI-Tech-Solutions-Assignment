import React, { useState } from 'react'
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { Outlet } from 'react-router-dom';

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
    <Outlet/>
    <MainContent/>
    </>
   
  )
}

export default Quiz;
