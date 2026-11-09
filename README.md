# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Requirements

- Node.js 24 LTS (`>=24.15.0`, see `.nvmrc`). Netlify reads `.nvmrc` for both the build and the Functions runtime. Node 26 is not used yet because Netlify Functions run on AWS Lambda, where Node 26 is still a preview runtime.
- Yarn 1 (`corepack enable`). The project uses `yarn.lock`, and `package.json` `resolutions` pin Vue core and framework build packages; use `yarn`, not npm/pnpm.
- Nuxt 4 directory layout: client code lives in `app/`, server code in `server/` (shared DB helper in `server/utils/db.ts`).

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## API Security

All `/api/*` routes are protected by `server/middleware/auth.ts`. A request is allowed if either:

- it includes an `x-api-key` header matching `API_KEY`, or
- it comes from the app itself: a valid signed `ehs_app` cookie (set when the app page loads, signed with `APP_SESSION_SECRET`) **and** a same-origin request.

Everything else receives `401 Unauthorized`. Copy `.env.example` to `.env` and set `API_KEY` and `APP_SESSION_SECRET` (e.g. `openssl rand -hex 32`).

### External endpoints (API key only)

```bash
# Read all students (not paginated)
curl -H "x-api-key: $API_KEY" https://<host>/api/external/students

# Insert or update students, matched on submissionIdUnique
curl -X POST -H "x-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '[{"submissionIdUnique":"123","SubmissionID":"ABC","FirstName":"Jane","LastName":"Doe","FullName":"Jane Doe"}]' \
  https://<host>/api/external/students/upsert
# => { "matched": 0, "modified": 0, "inserted": 1, "errors": [] }
```

Only provided fields are updated (`$set`), so omitted fields such as `CheckIn` or `TestSession` are left untouched.

```bash
# Delete students by submissionIdUnique
curl -X POST -H "x-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '["123","456"]' \
  https://<host>/api/external/students/delete
# => { "requested": 2, "deleted": 1, "notFound": ["456"] }
```
