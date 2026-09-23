import { Router } from 'express';
import { catalog, sizes } from '../../shared/catalog.js';
import { db } from '../db.js';
import { token, fail, clean, requireUser, owns } from '../security.js';

const router = Router();
router.post('/orders', (req, res) => {
  const { items, fullName, address, phone, comment, terms, requestKey } =
    req.body;
  if (
    !Array.isArray(items) ||
    !items.length ||
    items.length > 100 ||
    !clean(fullName) ||
    clean(fullName).length > 160 ||
    clean(address).length < 5 ||
    clean(address).length > 500 ||
    !/^[+\d\s()-]{7,40}$/.test(clean(phone)) ||
    clean(comment).length > 2000 ||
    terms !== true ||
    !/^[\w-]{16,80}$/.test(requestKey || '')
  )
    return fail(
      res,
      'Перевірте кошик і дані доставки та погодьтеся з умовами.',
    );
  const existing = db
    .prepare('SELECT * FROM orders WHERE sessionId = ? AND requestKey = ?')
    .get(req.session.id, requestKey);
  if (existing) return res.json({ order: JSON.parse(existing.payload) });
  const lines = [];
  for (const item of items) {
    if (!item || typeof item !== 'object')
      return fail(res, 'Некоректний товар.');
    const product = catalog.find((product) => product.id === item.id);
    const selectedSize =
      product?.type === 'apparel' ? item.selectedSize : 'One size';
    if (
      !product ||
      (product.type === 'apparel' && !sizes.includes(selectedSize)) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    )
      return fail(res, 'Некоректний товар або кількість.');
    const designs = {};
    const allowedViews =
      product.id === 2 || product.id === 3
        ? ['front', 'back', 'left_sleeve', 'right_sleeve']
        : product.id >= 7
          ? ['front']
          : ['front', 'back'];
    if (
      item.designs &&
      (typeof item.designs !== 'object' || Array.isArray(item.designs))
    )
      return fail(res, 'Некоректний дизайн.');
    for (const [view, design] of Object.entries(item.designs || {})) {
      if (!allowedViews.includes(view) || typeof design?.id !== 'string')
        return fail(res, 'Некоректний дизайн.');
      const row = db
        .prepare('SELECT * FROM uploads WHERE id = ?')
        .get(design.id);
      if (!owns(req, row)) return fail(res, 'Завантажте зображення повторно.');
      designs[view] = {
        id: row.id,
        name: row.name,
        url: `/api/uploads/${row.id}`,
      };
    }
    lines.push({ ...product, selectedSize, quantity: item.quantity, designs });
  }
  const id = token();
  const order = {
    id,
    number: `FP-${id.slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: 'Нове',
    items: lines,
    fullName: clean(fullName),
    address: clean(address),
    phone: clean(phone),
    comment: clean(comment),
    total: lines.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
  db.prepare('INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?)').run(
    id,
    req.session.id,
    req.user?.id || null,
    requestKey,
    order.createdAt,
    JSON.stringify(order),
  );
  res.status(201).json({ order });
});
router.get('/orders', requireUser, (req, res) =>
  res.json({
    orders: db
      .prepare(
        'SELECT payload FROM orders WHERE userId = ? ORDER BY createdAt DESC',
      )
      .all(req.user.id)
      .map((row) => JSON.parse(row.payload)),
  }),
);
router.get('/orders/:id', (req, res) => {
  const row = db
    .prepare('SELECT * FROM orders WHERE id = ?')
    .get(req.params.id);
  if (!owns(req, row)) return fail(res, 'Замовлення не знайдено.', 404);
  res.json({ order: JSON.parse(row.payload) });
});

export default router;
