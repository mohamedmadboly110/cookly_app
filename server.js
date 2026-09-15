require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');
const { authLimiter, apiLimiter } = require('./middlewares/rateLimiter');

// ✅ فشل سريع لو الإعدادات الأساسية ناقصة (بدل ما يشتغل بأسرار ضعيفة)
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is missing in .env');
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error('FATAL: MONGO_URI is missing in .env');
  process.exit(1);
}

connectDB();

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// ✅ 1) Security headers (XSS, clickjacking, sniffing...)
app.use(helmet());

// ✅ 2) Rate limiting عام + أقوى على الـ auth
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Body parser مع حد أقصى لحجم البيانات
app.use(express.json({ limit: '10kb' }));

// ✅ 3) منع NoSQL Injection ($gt, $where...) في body/params/query
app.use(mongoSanitize());

// ✅ 4) منع HTTP Parameter Pollution
app.use(hpp());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ success: true, message: 'Welcome to Cookly API (secured)' }));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/reviews', reviewRoutes);

// 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// لازم بعد كل الراوتات
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);
