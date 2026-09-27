const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router
  .route('/')
  .get(reviewController.getReviews)
  .post(protect, reviewController.createReview); 

router
  .route('/:id')
  .patch(protect, reviewController.updateReview)
  .delete(protect, reviewController.deleteReview);

module.exports = router;
