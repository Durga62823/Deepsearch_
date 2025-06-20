// src/services/api.js
import axios from 'axios';

// Define the base URL for your backend API.
// Use process.env.VITE_BACKEND_URL for production builds (Vite env vars start with VITE_).
// For local development, it defaults to http://localhost:5000/api
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Create a custom Axios instance with the base URL
const api = axios.create({
  baseURL: API_URL,
  // Set default headers for most requests. For file uploads, it will be overridden.
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an Axios request interceptor to automatically attach the auth token to every outgoing request
api.interceptors.request.use(config => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');
  // If a token exists, add it to the request headers under 'x-auth-token'
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config; // Return the modified config
}, error => {
  // Handle request errors (e.g., network issues before sending the request)
  return Promise.reject(error);
});

// Add an Axios response interceptor to handle token expiration and other 401 errors globally
api.interceptors.response.use(
  response => response, // If the response is successful (2xx), just return it
  async error => {
    // If the error response has a status of 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn('API Error: 401 Unauthorized. Session might be expired or invalid token.');
      // It's a 401, likely due to an invalid or expired token.
      // Clear the token and user data from localStorage to log the user out
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Also clear user data if stored separately

      // Redirect to the login page
      // Using window.location.href forces a full page reload, which ensures
      // all React components re-initialize and authentication contexts are reset.
      // This is a robust way to handle session expiration.
      if (window.location.pathname !== '/login') { // Prevent infinite redirects if already on login page
        // Use a simple alert or a more sophisticated custom modal for user notification
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login';
      }
    }
    // Re-throw the error so it can be caught by the component making the API call
    return Promise.reject(error); 
  }
);

// Export an object containing authentication-related API calls
export const authAPI = {
  // Login function: sends email and password to the login endpoint
  login: (email, password) => api.post('/auth/login', { email, password }),
  // Signup function: sends name, email, and password to the signup endpoint
  signup: (name, email, password) => api.post('/auth/signup', { name, email, password }),
};

// Export an object containing document-related API calls
export const documentAPI = {
  // Upload function:
  // Creates FormData to send the file.
  // The 'pdf' key must match the field name Multer expects on the backend.
  upload: (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    // Explicitly set 'Content-Type' to 'multipart/form-data'. While Axios often handles this
    // for FormData, explicitly setting it ensures correct header construction in all environments.
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
  },
  // Get all documents for the authenticated user
  getAll: () => api.get('/documents'),
  // Get a specific document by its ID
  getById: (id) => api.get(`/documents/${id}`),
  // Add the delete method here for deleting documents by ID
  delete: (id) => api.delete(`/documents/${id}`), // Axios DELETE request to your backend endpoint
};
