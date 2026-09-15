const rateLimit = require('express-rate-limit');

// عام لكل الـ API
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ أقوى على الـ auth عشان يمنع brute-force attacks
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true, // المحاولات الناجحة مش بتتحسب
  message: { success: false, message: 'Too many login attempts, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
