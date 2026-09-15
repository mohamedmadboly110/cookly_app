const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// @route POST /api/auth/register  | Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorResponse('Please provide name, email and password', 400));
  }

  // رسالة أوضح بدل ما نستنى خطأ الـ index المكرر
  const exists = await User.findOne({ email });
  if (exists) return next(new ErrorResponse('Email is already registered', 400));

  // ✅ منع تسجيل مستخدم بـ role=admin من الـ body
  const user = await User.create({ name, email, password });

  sendTokenResponse(user, 201, res);
});

// @route POST /api/auth/login  | Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @route GET /api/auth/me  | Private
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

// @route POST /api/auth/updatepassword  | Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Please provide current and new password', 400));
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
