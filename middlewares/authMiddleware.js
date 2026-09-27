const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');


exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new ErrorResponse('Not authorized to access this route', 401));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    
    const msg = err.name === 'TokenExpiredError' ? 'Token expired, please login again' : 'Not authorized, token failed';
    return next(new ErrorResponse(msg, 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) return next(new ErrorResponse('User no longer exists', 401));

  req.user = user;
  next();
});


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role '${req.user.role}' is not authorized to access this route`, 403)
      );
    }
    next();
  };
};
