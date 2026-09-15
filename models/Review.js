const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please add a rating between 1 and 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      trim: true,
      maxlength: [500, 'Comment cannot be more than 500 characters'],
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// منع أكتر من تقييم لنفس المستخدم على نفس الوصفة
reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });

reviewSchema.statics.getAverageRating = async function (recipeId) {
  const obj = await this.aggregate([
    { $match: { recipe: recipeId } },
    { $group: { _id: '$recipe', averageRating: { $avg: '$rating' } } },
  ]);

  try {
    await this.model('Recipe').findByIdAndUpdate(recipeId, {
      averageRating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.recipe);
});

// ✅ post hook على findOneAndDelete (تعملت deleteReview)
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) await doc.constructor.getAverageRating(doc.recipe);
});

module.exports = mongoose.model('Review', reviewSchema);
