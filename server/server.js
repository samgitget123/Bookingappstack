// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');  // Adjust the path if connectDB.js is in a different location

// Create an instance of an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors()); // Enable CORS for all routes
// Connect to the database
connectDB();

// Define a basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import and use your route files
const authRoutes = require('./routes/userRoutes'); // Adjust the path if your routes are in a different location
app.use('/', authRoutes);  // Routes for user authentication

const groundRoutes = require('./routes/groundRoutes'); // Adjust the path if necessary
app.use('/', groundRoutes); // Routes for ground management

const bookingRoutes = require('./routes/bookingRoutes'); // Adjust the path as needed
app.use('/', bookingRoutes); // Routes for booking management

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling for unhandled routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Set the port to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
