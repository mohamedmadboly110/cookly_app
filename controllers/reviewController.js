const Review = require('../models/Review');
const Recipe = require('../models/Recipe');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @route GET /api/reviews أو /api/recipes/:recipeId/reviews
exports.getReviews = asyncHandler(async (req, res) => {
  const filter = req.params.recipeId ? { recipe: req.params.recipeId } : {};
  const reviews = await Review.find(filter).populate('user', 'name');
  res.status(200).json({ success: true, results: reviews.length, data: reviews });
});

// @route POST /api/recipes/:recipeId/reviews | Private
exports.createReview = asyncHandler(async (req, res, next) => {
  // التأكد إن الوصفة موجودة أصلاً
  const recipe = await Recipe.findById(req.params.recipeId);
  if (!recipe) return next(new ErrorResponse('Recipe not found', 404));

  // ✅ منع التقييم المكرر برسالة واضحة (قبل ما Mongo ترمي خطأ الـ index)
  const alreadyReviewed = await Review.findOne({ recipe: req.params.recipeId, user: req.user.id });
  if (alreadyReviewed) {
    return next(new ErrorResponse('You already reviewed this recipe. Use PATCH to update it', 400));
  }

  req.body.recipe = req.params.recipeId;
  req.body.user = req.user.id;

  const review = await Review.create(req.body);
  res.status(201).json({ success: true, data: review });
});

// @route PATCH /api/reviews/:id | Private (owner)
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorResponse('Review not found', 404));

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this review', 403));
  }

  delete req.body.user;   // ممنوع نقل الملكية
  delete req.body.recipe;

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

// @route DELETE /api/reviews/:id | Private (owner أو admin)
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorResponse('Review not found', 404));

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this review', 403));
  }

  await review.deleteOne(); // post hook هيحدّث averageRating تلقائياً
  res.status(204).json({ success: true, data: null });
});
