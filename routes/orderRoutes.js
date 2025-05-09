const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateJWT = require('../middlewares/authenticateJWT');

router.post('/', authenticateJWT, orderController.createOrder);
router.get('/user', authenticateJWT, orderController.getUserOrders);
router.get('/:id', authenticateJWT, orderController.getOrderById);
router.post('/verify', authenticateJWT, orderController.verifyPayment);

module.exports = router;
