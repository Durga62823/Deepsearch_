// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Mongoose is now imported here

// Load environment variables
dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/deepsearch', {
 
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);

    process.exit(1);
  });


const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes'); 

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

app.use((err, req, res, next) => {
  console.error('Server-wide error:', err.stack); 
  res.status(500).json({ message: 'An unexpected internal server error occurred.' });
});

module.exports = app; 

// Handle unhandled promise rejections (e.g., from async operations not caught)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
  // Optionally, close server and exit process if this is a fatal error
  // process.exit(1);
});
