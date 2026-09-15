const Recipe = require('../models/Recipe');
const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @route GET /api/recipes | Public — مع فلترة وبحث
exports.getRecipes = asyncHandler(async (req, res) => {
  const { category, search, sort } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: 'i' }; // بحث غير حساس لحالة الحروف

  let query = Recipe.find(filter)
    .populate('user', 'name')
    .populate('category', 'name');

  if (sort === 'rating') query = query.sort('-averageRating');
  else if (sort === 'newest') query = query.sort('-createdAt');

  const recipes = await query;
  res.status(200).json({ success: true, results: recipes.length, data: recipes });
});

// @route GET /api/recipes/:id | Public
exports.getRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id)
    .populate('user', 'name')
    .populate('category', 'name')
    .populate({ path: 'reviews', populate: { path: 'user', select: 'name' } });

  if (!recipe) return next(new ErrorResponse('Recipe not found', 404));

  res.status(200).json({ success: true, data: recipe });
});

// @route POST /api/recipes | Private
exports.createRecipe = asyncHandler(async (req, res, next) => {
  // ✅ المستخدم من التوكن فقط - ممنوع التزوير من الـ body
  req.body.user = req.user.id;

  const recipe = await Recipe.create(req.body);
  res.status(201).json({ success: true, data: recipe });
});

// @route PATCH /api/recipes/:id | Private (owner أو admin)
exports.updateRecipe = asyncHandler(async (req, res, next) => {
  let recipe = await Recipe.findById(req.params.id);
  if (!recipe) return next(new ErrorResponse('Recipe not found', 404));

  // ✅ فحص الملكية
  if (recipe.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this recipe', 403));
  }

  // ✅ منع تغيير المالك أو المتوسط من الـ body
  delete req.body.user;
  delete req.body.averageRating;

  recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: recipe });
});

// @route DELETE /api/recipes/:id | Private (owner أو admin)
exports.deleteRecipe = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return next(new ErrorResponse('Recipe not found', 404));

  if (recipe.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this recipe', 403));
  }

  // ✅ حذف التقييمات المرتبطة (Cascade) بدل ما تفضل معلّقة
  await Review.deleteMany({ recipe: req.params.id });

  await recipe.deleteOne();
  res.status(204).json({ success: true, data: null });
});
