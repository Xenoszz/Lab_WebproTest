const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 4664;

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Allow Frontend on port 3000 to access this API
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const mongoURI = ' ';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Schema and Model for User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  following: { type: String, required: true },
  followers: { type: String, required: true },
  likes: { type: String, required: true },
  description: { type: String, required: true },
  urlprofile: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// API to create a new user
app.post('/api/create', async (req, res) => {
  const { username, name, following, followers, likes, description, urlprofile } = req.body;

  try {
    const newUser = new User({ username, name, following, followers, likes, description, urlprofile });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// API to fetch all users or filter by username
app.get('/api/users', async (req, res) => {
  const search = req.query.search || ''; // Get search query, default to empty string

  try {
    const users = await User.find({
      username: { $regex: search, $options: 'i' }, // Case-insensitive partial match
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
