// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Mongoose is now imported here

// Load environment variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/deepsearch', {
  // Removed useNewUrlParser and useUnifiedTopology as they are deprecated in Mongoose 6+
  // Removed useCreateIndex and useFindAndModify as they are deprecated in Mongoose 6+
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    // Exit process with failure if DB connection fails
    process.exit(1);
  });

// --- Routes ---
// Import routes after middleware and DB connection
const authRoutes = require('./routes/authRoutes'); // Assuming your auth routes file is authRoutes.js
const documentRoutes = require('./routes/documentRoutes'); // Your document upload routes

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// --- Error Handling Middleware ---
// This should be the last middleware in your chain
app.use((err, req, res, next) => {
  console.error('Server-wide error:', err.stack); // Log the full stack trace for debugging
  res.status(500).json({ message: 'An unexpected internal server error occurred.' });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g., from async operations not caught)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
  // Optionally, close server and exit process if this is a fatal error
  // process.exit(1);
});
