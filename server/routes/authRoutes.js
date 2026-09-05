const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { register, login, deleteAccount } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

// Requires authentication
router.delete('/account', authenticate, deleteAccount);

module.exports = router;
