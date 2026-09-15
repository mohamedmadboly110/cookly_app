// غلاف يمسك أي خطأ في الـ async controllers ويبعته للـ errorMiddleware
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
