const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateJWT = require('../middlewares/authenticateJWT');
const authorizeRoles = require('../middlewares/authorizeRoles')

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authenticateJWT, authorizeRoles('admin', 'developer'),productController.createProduct); // Add admin check
router.put('/:id', authenticateJWT,authorizeRoles('admin', 'developer'), productController.updateProduct);
router.delete('/:id', authenticateJWT, authorizeRoles('admin', 'developer'),productController.deleteProduct);

module.exports = router;
