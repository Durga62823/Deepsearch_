// src/App.jsx
import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Layout from './components/layout/Layout'; // Main layout component
import LoginPage from './pages/LoginPage';         // Login page
import SignupPage from './pages/SignupPage';       // Signup page
import DashboardPage from './pages/DashboardPage'; // User dashboard page
import DocumentViewPage from './pages/DocumentViewPage'; // Page to view a single document
import { AuthContext } from './context/AuthContext'; // Authentication context for user state


// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext); // Get user and loading state from AuthContext
  const location = useLocation(); // Hook to get current location for redirection

  console.log(`PrivateRoute: Path: ${location.pathname}, User: ${user ? user.email : 'null'}, Loading: ${loading}`);

  // While authentication status is loading, display a loading message
  if (loading) {
    console.log('PrivateRoute: Still loading authentication status...');
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)]">
        <p className="text-xl text-gray-700">Loading application...</p>
      </div>
    );
  }

  // If user is not authenticated, redirect to the login page
  if (!user) {
    console.log('PrivateRoute: User not authenticated, redirecting to /login');
    // Navigate to login, preserving current path in state for potential redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the children (the protected component)
  console.log('PrivateRoute: User authenticated, rendering children.');
  return children;
};

// Main App component defines the application's layout and routes
function App() {
  return (
    <Routes>
      {/* Public Routes - these routes do not require authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Layout wrapper for all other routes */}
      {/* Routes nested inside this will inherit the Layout component */}
      <Route path="/" element={<Layout />}>
        {/* Protected Routes - these will render inside the Layout's Outlet */}
        {/* They are wrapped with PrivateRoute to ensure authentication */}
        <Route 
          path="dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage /> {/* DashboardPage is protected */}
            </PrivateRoute>
          } 
        />
        <Route 
          path="documents/:id" 
          element={
            <PrivateRoute>
              <DocumentViewPage /> {/* DocumentViewPage is protected */}
            </PrivateRoute>
          } 
        />
        
        {/* Default route for the root path ('/') */}
        {/* If no other route matches and path is '/', navigate to /login */}
        <Route index element={<Navigate to="/login" replace />} />
        
        {/* Fallback for any other unmatched routes */}
        {/* Redirects any unknown paths back to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
