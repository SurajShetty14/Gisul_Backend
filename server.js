const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const User = require('./User');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.JWT_SECRET, // Use a strong secret in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// Test route
app.get('/', (req, res) => {
  res.send('Signup backend is running!');
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { email, username, phone, password } = req.body;

    // Basic validation
    if (!email || !username || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      username,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Basic validation
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Email/Username and password are required.' });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Set session
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;

    res.status(200).json({ message: 'Login successful!', token, session: req.session });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed.' });
    }
    res.clearCookie('connect.sid'); // Default session cookie name
    res.json({ message: 'Logged out successfully.' });
  });
});

// Get user profile
app.get('/profile', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      gender: user.gender,
      country: user.country,
      language: user.language,
      timezone: user.timezone
    });
  } catch (err) {
    console.error('Profile read error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/profile', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { fullName, phone, gender, country, language, timezone } = req.body;

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (gender !== undefined) user.gender = gender;
    if (country !== undefined) user.country = country;
    if (language !== undefined) user.language = language;
    if (timezone !== undefined) user.timezone = timezone;

    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      profile: {
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        phone: user.phone,
        gender: user.gender,
        country: user.country,
        language: user.language,
        timezone: user.timezone
      }
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ Connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/protected', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({ message: 'You are authenticated!', user: req.session });
});
