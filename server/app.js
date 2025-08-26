// server/app.js
// Main Express app: loads routes and starts server
const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const userRoutes     = require('./routes/users');
const projectRoutes  = require('./routes/projects');
const resumeRoutes   = require('./routes/resumes');
const contactsRoutes = require('./routes/contacts');
const postRoutes     = require('./routes/posts');
const profileRoutes  = require('./routes/profiles');
const commentsRoutes = require("./routes/comments");


const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/profiles', profileRoutes);
app.use("/api/comments", commentsRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
