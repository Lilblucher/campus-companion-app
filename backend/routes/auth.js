const express = require('express');

const router = express.Router();

const  {login, register, logout} = require("../controllers/authController");

// Student registration
router.post('/register', register);

// Student or lecturer login
router.post('/login',  login);


//logout
router.post("/logout", logout);

module.exports = router;