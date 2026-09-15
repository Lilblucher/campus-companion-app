const express = require('express');

const router = express.Router();

// Push offline operations from Android to the server
router.post('/push', (req, res) => {
    res.json({
        message: 'Sync push route is working'
    });
});

// Pull changes from the server to Android
router.get('/pull', (req, res) => {
    res.json({
        message: 'Sync pull route is working'
    });
});

module.exports = router;