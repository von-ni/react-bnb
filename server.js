require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('./middleware/cors');

const app = express();

// connect database
connectDB();

// init middleware
app.use(cors);
app.use(express.json());

// define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/members', require('./routes/api/members'));
app.use('/api/bookings', require('./routes/api/bookings'));
app.use('/api/rooms', require('./routes/api/rooms'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening .. on port ${PORT}`));
