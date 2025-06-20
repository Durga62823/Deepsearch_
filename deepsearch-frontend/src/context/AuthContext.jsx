// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  // State to hold the current authenticated user's data
  const [user, setUser] = useState(null);
  // State to indicate if the authentication check (e.g., from localStorage) is complete
  const [loading, setLoading] = useState(true);

  // Log initial state
  console.log('AuthContext: Initializing, user:', user, 'loading:', loading);

  // useEffect to check for existing token and user data in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user'); // User data could include email, ID, name etc.

    console.log('AuthContext useEffect: Checking localStorage...');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Basic validation for parsed user object, e.g., check if it has an 'id' or 'email'
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
          console.log('AuthContext useEffect: User found in localStorage:', parsedUser);
        } else {
          // If userData is not valid, clear it
          console.warn('AuthContext useEffect: Invalid user data in localStorage, clearing it.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (e) {
        // Handle case where userData is not valid JSON
        console.error("AuthContext useEffect: Failed to parse user data from localStorage:", e);
        // Clear invalid data to prevent persistent errors
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null); // Ensure user is null if data is bad
      }
    } else {
      console.log('AuthContext useEffect: No token or user data found in localStorage.');
      setUser(null); // Explicitly set user to null if no data
    }
    setLoading(false); // Set loading to false once initial check is done
    console.log('AuthContext useEffect: Initial check complete, loading set to false.');
  }, []); // Empty dependency array ensures this runs only once on mount

  // Log state whenever it changes (for debugging purposes)
  useEffect(() => {
    console.log('AuthContext State Changed: user:', user, 'loading:', loading);
  }, [user, loading]);


  // Function to handle user login
  // Stores token and user data in localStorage and updates state
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data as a string
    setUser(userData);
    console.log('AuthContext: User logged in:', userData);
  };

  // Function to handle user logout
  // Removes token and user data from localStorage and clears state
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    console.log('AuthContext: User logged out.');
  };

  // The AuthContext.Provider makes the 'user', 'login', 'logout', and 'loading' values
  // available to any component that consumes this context.
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
