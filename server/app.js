import express from 'express';
import multer from 'multer';
import { rateLimit } from 'express-rate-limit';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './db.js';
import { sessionMiddleware, fail } from './security.js';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/uploads.js';
import orderRoutes from './routes/orders.js';

const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
});
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'HEAD'].includes(req.method)) {
    const origin = req.get('origin');
    if (
      req.get('sec-fetch-site') === 'cross-site' ||
      (origin && origin !== `${req.protocol}://${req.get('host')}`)
    ) {
      return res
        .status(403)
        .json({ error: 'Запит з іншого сайту заборонено.' });
    }
  }
  next();
});
app.use(express.json({ limit: '100kb' }));
app.use(
  '/api',
  rateLimit({
    windowMs: 60_000,
    limit: 240,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Забагато запитів. Спробуйте за хвилину.' },
  }),
);
app.use('/api', sessionMiddleware, authRoutes, uploadRoutes, orderRoutes);
app.use('/api', (req, res) => fail(res, 'Сторінку не знайдено.', 404));
if (existsSync(join(root, 'dist/index.html'))) {
  app.use(express.static(join(root, 'dist')));
  app.get('/{*path}', (req, res) =>
    res.sendFile(join(root, 'dist/index.html')),
  );
}
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error instanceof multer.MulterError)
    return fail(res, 'Оберіть один файл до 8 МБ.');
  if (error.type === 'entity.parse.failed')
    return fail(res, 'Некоректні дані запиту.');
  console.error(error.message);
  fail(res, 'Не вдалося виконати запит. Спробуйте ще раз.', 500);
});

export default app;
