import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const dataDir = resolve(process.env.DATA_DIR || join(root, 'data'));
mkdirSync(join(dataDir, 'uploads'), { recursive: true });
export const db = new Database(join(dataDir, 'fresh-press.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, recovery TEXT NOT NULL,
 firstName TEXT NOT NULL DEFAULT '', lastName TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, userId TEXT REFERENCES users(id), expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS uploads (id TEXT PRIMARY KEY, sessionId TEXT NOT NULL, userId TEXT, name TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY, sessionId TEXT NOT NULL, userId TEXT REFERENCES users(id), requestKey TEXT NOT NULL,
 createdAt TEXT NOT NULL, payload TEXT NOT NULL, UNIQUE(sessionId, requestKey)
);
`);
