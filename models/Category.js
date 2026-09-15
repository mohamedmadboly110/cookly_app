const mongoose = require('mongoose');

// slugify بسيط بدون مكتبة خارجية
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      default: 'default-category.jpg',
    },
  },
  { timestamps: true }
);

// ✅ توليد الـ slug تلقائياً من الاسم
categorySchema.pre('save', function () {
  if (this.isModified('name')) this.slug = slugify(this.name);
});

module.exports = mongoose.model('Category', categorySchema);
