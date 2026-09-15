const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

// @route GET /api/categories | Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({ success: true, results: categories.length, data: categories });
});

// @route POST /api/categories | Private (admin)
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

// @route PATCH /api/categories/:id | Private (admin)
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) return next(new ErrorResponse('Category not found', 404));

  res.status(200).json({ success: true, data: category });
});

// @route DELETE /api/categories/:id | Private (admin)
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new ErrorResponse('Category not found', 404));

  // ✅ ماينفعش تحذف فئة فيها وصفات
  const recipeCount = await Recipe.countDocuments({ category: req.params.id });
  if (recipeCount > 0) {
    return next(
      new ErrorResponse(`Cannot delete category with ${recipeCount} recipe(s). Delete them first`, 400)
    );
  }

  await category.deleteOne();
  res.status(204).json({ success: true, data: null });
});
