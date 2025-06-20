// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // Required to load process.env.JWT_SECRET if not already loaded

dotenv.config(); // Ensure environment variables are loaded for this file

module.exports = (req, res, next) => {
  // Get token from header (using 'x-auth-token')
  const token = req.header('x-auth-token');

  console.log("Received token:", token); // Debug log to see the token

  // If no token is provided, deny access
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' }); // Return JSON response
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // IMPORTANT: Attach user data to the request object.
    // Based on `authController.js` (auth-controller-corrected-v2), your JWT payload is structured as { user: { id: '...' } }.
    // So, req.user should be assigned the 'user' object from the decoded payload.
    req.user = decoded.user; // Correctly attaches { id: 'userId' } to req.user

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Log the actual error for server-side debugging
    console.error('Token verification failed:', err.message);

    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired, please log in again' }); // Return JSON response
    }
    // For any other JWT verification error (e.g., JsonWebTokenError for invalid signature)
    res.status(401).json({ msg: 'Token is not valid' }); // Return JSON response
  }
};
