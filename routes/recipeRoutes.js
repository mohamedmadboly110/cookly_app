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
  .post(protect, recipeController.createRecipe); 

router
  .route('/:id')
  .get(recipeController.getRecipe)
  .patch(protect, recipeController.updateRecipe)
  .delete(protect, recipeController.deleteRecipe); 

module.exports = router;
