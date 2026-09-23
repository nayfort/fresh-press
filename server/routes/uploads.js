import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { join } from 'node:path';
import { rateLimit } from 'express-rate-limit';
import { db, dataDir } from '../db.js';
import { token, fail, owns } from '../security.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
});
router.post(
  '/uploads',
  rateLimit({ windowMs: 60_000, limit: 20 }),
  upload.single('image'),
  async (req, res) => {
    if (!req.file) return fail(res, 'Оберіть зображення PNG, JPEG або WebP.');
    const id = token();
    try {
      const image = sharp(req.file.buffer, { limitInputPixels: 40_000_000 });
      const metadata = await image.metadata();
      if (!['png', 'jpeg', 'webp'].includes(metadata.format))
        return fail(res, 'Підтримуються PNG, JPEG та WebP.');
      await image
        .rotate()
        .resize({
          width: 4000,
          height: 4000,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png()
        .toFile(join(dataDir, 'uploads', `${id}.png`));
      const decodedName = Buffer.from(req.file.originalname, 'latin1').toString(
        'utf8',
      );
      const name = (
        decodedName.includes('�') ? req.file.originalname : decodedName
      ).slice(0, 160);
      db.prepare('INSERT INTO uploads VALUES (?, ?, ?, ?)').run(
        id,
        req.session.id,
        req.user?.id || null,
        name,
      );
      res.status(201).json({ id, name, url: `/api/uploads/${id}` });
    } catch {
      fail(res, 'Не вдалося прочитати зображення. Оберіть інший файл.');
    }
  },
);
router.get('/uploads/:id', (req, res) => {
  const row = db
    .prepare('SELECT * FROM uploads WHERE id = ?')
    .get(req.params.id);
  if (!owns(req, row)) return fail(res, 'Зображення не знайдено.', 404);
  res.sendFile(join(dataDir, 'uploads', `${row.id}.png`));
});

export default router;
