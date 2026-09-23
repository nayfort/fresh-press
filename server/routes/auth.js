import { Router } from 'express';
import { timingSafeEqual } from 'node:crypto';
import { rateLimit } from 'express-rate-limit';
import { db } from '../db.js';
import {
  token,
  hash,
  passwordHash,
  matches,
  dummyPassword,
  publicUser,
  fail,
  clean,
  emailOf,
  validEmail,
  validPassword,
  newSession,
  requireUser,
} from '../security.js';

const router = Router();
const authLimit = rateLimit({
  windowMs: 15 * 60_000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Забагато спроб. Спробуйте пізніше.' },
});
router.get('/session', (req, res) => res.json({ user: publicUser(req.user) }));
router.post('/signup', authLimit, (req, res) => {
  const email = emailOf(req.body.email);
  if (!validEmail(email) || !validPassword(req.body.password))
    return fail(res, 'Вкажіть email і пароль від 10 до 128 символів.');
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(email))
    return fail(res, 'Цей email уже зареєстровано.');
  const recoveryCode = token();
  const id = token();
  db.prepare(
    'INSERT INTO users (id, email, password, recovery) VALUES (?, ?, ?, ?)',
  ).run(id, email, passwordHash(req.body.password), hash(recoveryCode));
  newSession(req, res, id);
  res.status(201).json({
    user: publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id)),
    recoveryCode,
  });
});
router.post('/login', authLimit, (req, res) => {
  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(emailOf(req.body.email));
  const password =
    typeof req.body.password === 'string' && req.body.password.length <= 128
      ? req.body.password
      : '';
  const valid = matches(password, user?.password || dummyPassword);
  if (!user || !valid) return fail(res, 'Неправильний email або пароль.', 401);
  newSession(req, res, user.id);
  res.json({ user: publicUser(user) });
});
router.post('/logout', (req, res) => {
  db.prepare('DELETE FROM sessions WHERE id = ?').run(req.session.id);
  req.session = null;
  newSession(req, res);
  res.json({ ok: true });
});
router.post('/recover', authLimit, (req, res) => {
  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(emailOf(req.body.email));
  const recovery = hash(clean(req.body.code));
  if (
    !user ||
    !timingSafeEqual(
      Buffer.from(user.recovery, 'hex'),
      Buffer.from(recovery, 'hex'),
    )
  )
    return fail(res, 'Неправильний email або код відновлення.');
  if (!validPassword(req.body.password))
    return fail(res, 'Пароль має містити від 10 до 128 символів.');
  const recoveryCode = token();
  db.prepare('UPDATE users SET password = ?, recovery = ? WHERE id = ?').run(
    passwordHash(req.body.password),
    hash(recoveryCode),
    user.id,
  );
  db.prepare('DELETE FROM sessions WHERE userId = ?').run(user.id);
  newSession(req, res, user.id);
  res.json({ user: publicUser(user), recoveryCode });
});
router.patch('/account', requireUser, authLimit, (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    email: rawEmail,
    password,
    currentPassword,
  } = req.body;
  const email = emailOf(rawEmail);
  if (
    !clean(firstName) ||
    !clean(lastName) ||
    clean(firstName).length > 80 ||
    clean(lastName).length > 80 ||
    clean(phone).length > 40 ||
    !validEmail(email)
  )
    return fail(res, 'Перевірте ім’я, прізвище та email.');
  if (
    db
      .prepare('SELECT id FROM users WHERE email = ? AND id != ?')
      .get(email, req.user.id)
  )
    return fail(res, 'Цей email уже використовується.');
  if (password || email !== req.user.email) {
    if (
      typeof currentPassword !== 'string' ||
      currentPassword.length > 128 ||
      !matches(currentPassword, req.user.password)
    )
      return fail(res, 'Для зміни email або пароля введіть поточний пароль.');
  }
  if (password && !validPassword(password))
    return fail(res, 'Пароль має містити від 10 до 128 символів.');
  db.prepare(
    'UPDATE users SET firstName = ?, lastName = ?, phone = ?, email = ?, password = ? WHERE id = ?',
  ).run(
    clean(firstName),
    clean(lastName),
    clean(phone),
    email,
    password ? passwordHash(password) : req.user.password,
    req.user.id,
  );
  if (password) {
    db.prepare('DELETE FROM sessions WHERE userId = ? AND id != ?').run(
      req.user.id,
      req.session.id,
    );
    newSession(req, res, req.user.id);
  }
  res.json({
    user: publicUser(
      db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id),
    ),
  });
});

export default router;
