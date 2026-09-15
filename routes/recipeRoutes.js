const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const reviewRouter = require('./reviewRoutes');
const { protect } = require('../middlewares/authMiddleware');

// Nested route: /api/recipes/:recipeId/reviews
router.use('/:recipeId/reviews', reviewRouter);

router
  .route('/')
  .get(recipeController.getRecipes)
  .post(protect, recipeController.createRecipe); // ✅ الحماية شغالة

router
  .route('/:id')
  .get(recipeController.getRecipe)
  .patch(protect, recipeController.updateRecipe)   // ✅ + فحص الملكية جواه
  .delete(protect, recipeController.deleteRecipe); // ✅ + فحص الملكية جواه

module.exports = router;
