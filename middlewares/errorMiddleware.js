
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    error = { message: 'Resource not found (invalid ID)', statusCode: 404 };
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(', ');
    error = { message: `Duplicate field value: ${fields}. Please use another value`, statusCode: 400 };
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join('. ');
    error = { message, statusCode: 400 };
  }

  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Not authorized, token failed', statusCode: 401 };
  }
  if (err.name === 'TokenExpiredError') {
    error = { message: 'Token expired, please login again', statusCode: 401 };
  }

  console.error(err);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
