const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [120, 'Title cannot be more than 120 characters'],
    },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

// ✅ فهرس مركب: جلب وصفات مستخدم معين بسرعة
recipeSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Recipe', recipeSchema);
