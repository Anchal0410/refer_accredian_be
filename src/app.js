const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const referralRoutes = require('./routes/referral.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/referrals', referralRoutes);

// Basic route for testing
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;