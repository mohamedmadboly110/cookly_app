const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// القراءة للجميع، الكتابة للأدمن فقط
router
  .route('/')
  .get(categoryController.getCategories)
  .post(protect, restrictTo('admin'), categoryController.createCategory);

router
  .route('/:id')
  .patch(protect, restrictTo('admin'), categoryController.updateCategory)
  .delete(protect, restrictTo('admin'), categoryController.deleteCategory);

module.exports = router;
