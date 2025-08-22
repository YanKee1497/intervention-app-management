const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');

// Routes publiques
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// Routes protégées
router.get('/profile', authenticateToken, AuthController.getProfile);
router.put('/availability', authenticateToken, AuthController.updateAvailability);

module.exports = router;
