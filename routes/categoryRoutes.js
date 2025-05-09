const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticateJWT = require('../middlewares/authenticateJWT');

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID (with products populated)
router.get('/:id', categoryController.getCategoryById);

// Create a category (Admin only)
router.post('/', authenticateJWT, categoryController.createCategory); // Add isAdmin check

// Update category by ID (Admin only)
router.put('/:id', authenticateJWT, categoryController.updateCategory);

// Delete category by ID (Admin only)
router.delete('/:id', authenticateJWT, categoryController.deleteCategory);

module.exports = router;
