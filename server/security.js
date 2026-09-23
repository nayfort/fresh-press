import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from 'node:crypto';
import { db } from './db.js';

export const token = () => randomBytes(24).toString('hex');
export const hash = (value) => createHash('sha256').update(value).digest('hex');
export const passwordHash = (password) => {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
};
export const matches = (password, saved) => {
  const [salt, value] = saved.split(':');
  return timingSafeEqual(
    scryptSync(password, salt, 64),
    Buffer.from(value, 'hex'),
  );
};
export const dummyPassword = passwordHash(token());
export const publicUser = (user) =>
  user
    ? {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      }
    : null;
export const fail = (res, error, status = 400) =>
  res.status(status).json({ error });
export const clean = (value) => (typeof value === 'string' ? value.trim() : '');
export const emailOf = (value) => clean(value).toLowerCase();
export const validEmail = (value) =>
  value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const validPassword = (value) =>
  typeof value === 'string' && value.length >= 10 && value.length <= 128;
export function newSession(req, res, userId = null) {
  const id = token();
  const expires = Date.now() + 30 * 86400_000;
  db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(id, userId, expires);
  if (req.session && (!req.session.userId || req.session.userId === userId)) {
    db.prepare(
      'UPDATE uploads SET sessionId = ?, userId = COALESCE(userId, ?) WHERE sessionId = ?',
    ).run(id, userId, req.session.id);
    db.prepare(
      'UPDATE orders SET sessionId = ?, userId = COALESCE(userId, ?) WHERE sessionId = ?',
    ).run(id, userId, req.session.id);
  }
  if (req.session)
    db.prepare('DELETE FROM sessions WHERE id = ?').run(req.session.id);
  req.session = { id, userId, expires };
  res.cookie('freshpress_session', id, {
    httpOnly: true,
    sameSite: 'strict',
    secure: req.secure,
    maxAge: 30 * 86400_000,
    path: '/',
  });
}
export function sessionMiddleware(req, res, next) {
  const cookie = req.headers.cookie
    ?.split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith('freshpress_session='))
    ?.split('=')[1];
  req.session = cookie
    ? db
        .prepare('SELECT * FROM sessions WHERE id = ? AND expires > ?')
        .get(cookie, Date.now())
    : null;
  if (!req.session) newSession(req, res);
  req.user = req.session.userId
    ? db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId)
    : null;
  next();
}
export const requireUser = (req, res, next) =>
  req.user ? next() : fail(res, 'Увійдіть у свій акаунт.', 401);

export const owns = (req, row) =>
  row &&
  (row.sessionId === req.session.id ||
    (req.user && row.userId === req.user.id));
