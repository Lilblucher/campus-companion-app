const express = require('express');

const router = express.Router();

// Student registration
router.post('/register', (req, res) => {
    res.json({
        message: 'Register route is working'
    });
});

// Student or lecturer login
router.post('/login', (req, res) => {
    res.json({
        message: 'Login route is working'
    });
});

module.exports = router;