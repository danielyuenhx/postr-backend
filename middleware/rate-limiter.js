import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

export default apiLimiter;
