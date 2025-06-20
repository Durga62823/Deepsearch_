const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure correct path to your User model

// Signup Controller
exports.signup = async (req, res) => {
  try {
    // Ensure 'name' is destructured here, as your User model likely requires it
    const { name, email, password } = req.body;

    // 1. Validate input - including 'name' as it's typically required for user registration
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create and save the user - ensure 'name' is passed to the User constructor
    const newUser = new User({
      name, // Add 'name' here
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // 5. Respond with success
    res.status(201).json({ message: 'User registered successfully.' }); // More descriptive message

  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Internal server error during signup.' }); // More specific error message
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = {
      user: {
        id: user._id // This is the user ID that will be in the JWT payload
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // CRITICAL: Ensure both 'token' and 'user' object are sent in the response
    // The 'user' object should contain properties like id, email, and name
    res.status(200).json({ token, user: { id: user._id, email: user.email, name: user.name } }); 

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
};
