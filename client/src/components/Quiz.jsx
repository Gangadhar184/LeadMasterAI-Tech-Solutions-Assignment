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
    <div className='flex '>
    
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar}  />
  
    <Outlet/>
  
    <MainContent/>
    </div>
   
  )
}

export default Quiz;
