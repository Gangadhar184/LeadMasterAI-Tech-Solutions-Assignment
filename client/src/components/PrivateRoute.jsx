import React,{useContext} from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
   
    return <div>Loading...</div>;
  }

  if (!user) {
    // If no user, redirect to signup/login page
    return <Navigate to="/" replace />;
  }

  // If user exists, render the protected page
  return children;
};

export default PrivateRoute;
