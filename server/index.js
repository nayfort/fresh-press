import app from './app.js';
import { db } from './db.js';

const server = app.listen(
  Number(process.env.PORT || 3001),
  process.env.HOST || '127.0.0.1',
  () =>
    console.log(
      `Fresh Press API: http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3001}`,
    ),
);
for (const signal of ['SIGTERM', 'SIGINT'])
  process.on(signal, () =>
    server.close(() => {
      db.close();
      process.exit(0);
    }),
  );
