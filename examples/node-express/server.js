import express from 'express';
import { LimitYourAPIClient } from 'limityourapi';

const app = express();
const limiter = new LimitYourAPIClient({
  apiKey: process.env.LIMIT_YOUR_API_KEY || 'your_api_key_here'
});

// Protect all routes globally
app.use(async (req, res, next) => {
  const result = await limiter.check({ key: req.ip, route: req.path });
  
  res.setHeader('X-RateLimit-Limit', result.limit);
  res.setHeader('X-RateLimit-Remaining', result.remaining);
  res.setHeader('X-RateLimit-Reset', result.reset);
  
  if (!result.allowed) {
    res.setHeader('Retry-After', result.retryAfter);
    return res.status(429).json({ error: 'Too Many Requests', retryAfter: result.retryAfter });
  }
  next();
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Success! Allowed by rate limiter.' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
