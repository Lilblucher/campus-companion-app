const express = require('express');

const router = express.Router();

// Get the currently logged-in student's profile
router.get('/me', (req, res) => {
    res.json({
        message: 'Get my profile route is working'
    });
});

// Update the currently logged-in student's profile
router.put('/me', (req, res) => {
    res.json({
        message: 'Update my profile route is working'
    });
});

// Request a change of lab group
router.post('/me/group-request', (req, res) => {
    res.json({
        message: 'Group change request route is working'
    });
});

// Request a correction of student number
router.post('/me/student-number-correction', (req, res) => {
    res.json({
        message: 'Student number correction route is working'
    });
});

// Get all students - lecturer access
router.get('/', (req, res) => {
    res.json({
        message: 'Get all students route is working'
    });
});

// Add a new student - lecturer access
router.post('/', (req, res) => {
    res.json({
        message: 'Add student route is working'
    });
});

// Get one student by student ID
router.get('/:studentId', (req, res) => {
    res.json({
        message: 'Get student by ID route is working',
        studentId: req.params.studentId
    });
});

// Update a student - lecturer access
router.put('/:studentId', (req, res) => {
    res.json({
        message: 'Update student route is working',
        studentId: req.params.studentId
    });
});

// Delete a student - lecturer access
router.delete('/:studentId', (req, res) => {
    res.json({
        message: 'Delete student route is working',
        studentId: req.params.studentId
    });
});

module.exports = router;