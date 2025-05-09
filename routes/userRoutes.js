const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authenticateJWT');

router.get('/profile', authenticateJWT, userController.getProfile);
router.post('/cart', authenticateJWT, userController.addToCart);
router.delete('/cart/:productId', authenticateJWT, userController.removeFromCart);

module.exports = router;
