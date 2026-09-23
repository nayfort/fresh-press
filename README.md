# Fresh Press

A full-stack storefront for custom printed apparel and accessories. Fresh Press combines an English and Ukrainian shopping experience with product artwork uploads, customer accounts, and persistent orders.

## Features

- Responsive catalog with search, category filters, and sorting.
- English and Ukrainian interfaces with a persistent language selector.
- Light and dark themes with system preference detection and a saved override.
- Product views, size selection, and artwork previews for each print side.
- PNG, JPEG, and WebP uploads with server-side image validation.
- Persistent favorites and shopping cart, with separate size and design variants.
- Customer registration, sign-in, profile editing, and password changes.
- Password recovery using a private, single-use recovery code.
- Checkout with delivery details, validated totals, order confirmation, and account history.
- Keyboard-accessible controls, labeled forms, and loading and error states.

## Stack

| Layer            | Technology                    |
| ---------------- | ----------------------------- |
| Interface        | React 18, React Router 7, CSS |
| Build            | Vite 7                        |
| API              | Express 5                     |
| Storage          | SQLite through better-sqlite3 |
| Image processing | Multer and Sharp              |
| Quality checks   | ESLint, Prettier, Playwright  |

## Local development

Use Node.js 22.12 or later and npm.

```bash
git clone https://github.com/nayfort/fresh-press.git
cd fresh-press
npm ci
npm run dev
```

The development command starts both the API at `http://127.0.0.1:3001` and Vite at `http://127.0.0.1:5173`. Vite proxies `/api` requests to the API. Open the Vite URL printed in the terminal.

## Commands

| Command                | Purpose                                         |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Run the web application and API together.       |
| `npm run dev:web`      | Start Vite.                                     |
| `npm run dev:api`      | Start the API with automatic restart.           |
| `npm run build`        | Generate the production frontend in `dist/`.    |
| `npm start`            | Serve the API and production frontend.          |
| `npm run lint`         | Check JavaScript and JSX.                       |
| `npm run format`       | Format source files.                            |
| `npm run format:check` | Verify formatting.                              |
| `npm test`             | Build and run browser and API regression tests. |

## Testing

Install the browser once, then run the suite:

```bash
npx playwright install chromium
npm test
```

The tests start an isolated server with a separate database. Coverage includes catalog interactions, cart variants, authentication, recovery-code rotation, artwork uploads, checkout, order access control, server-calculated totals, and layouts from 320 to 1440 pixels wide.

## Production

```bash
npm ci
npm run build
npm start
```

The Node server serves the frontend, API, and application routes from one origin. Configure the process with these environment variables:

| Variable      | Default     | Purpose                                                   |
| ------------- | ----------- | --------------------------------------------------------- |
| `HOST`        | `127.0.0.1` | Address the server binds to.                              |
| `PORT`        | `3001`      | HTTP port.                                                |
| `DATA_DIR`    | `./data`    | Directory for the database and uploaded artwork.          |
| `TRUST_PROXY` | unset       | Set to `1` when running behind one trusted reverse proxy. |

Use HTTPS for public hosting and keep `DATA_DIR` on persistent storage. Back up the database and uploads together. Runtime data is excluded from Git.

## Project structure

```text
server/
  app.js           Express middleware and route registration
  db.js            SQLite schema and connection
  index.js         Server entry point
  security.js      Password hashing, sessions, and access checks
  routes/          Account, upload, and order endpoints
shared/
  catalog.js       Product definitions shared by frontend and API
src/
  assets/          Product photography, branding, and icons
  components/      Catalog, pages, layout, and reusable UI
  context/         Account, cart, and favorites state
  lib/             API client and storage utilities
  staticData/      Product image mappings
  App.jsx          Application providers and routes
tests/             Browser and API regression tests
```

## Data and account handling

Prices and product options are validated against the shared catalog on the server. Each order stores a snapshot of its products, artwork references, delivery details, and total. Duplicate checkout submissions use an idempotency key.

Passwords use salted scrypt hashes. Sessions use HTTP-only cookies, and password changes invalidate other sessions. Recovery codes are stored as hashes and replaced after use. Uploaded images are decoded and re-encoded on the server; access to artwork and orders is checked against the owning session or account.

The cart and favorites are stored in the browser. Customer accounts, uploaded artwork, and orders are stored in SQLite and the server data directory.
