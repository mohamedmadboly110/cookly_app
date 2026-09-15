// كلاس موحّد للأخطاء عشان الـ errorMiddleware يفهم statusCode
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
