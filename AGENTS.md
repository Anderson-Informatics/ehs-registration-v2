# AGENTS.md

## Stack

- Nuxt 4 (client-only SPA, `ssr: false`), Vuetify 3, Pinia 4, Mongoose 8, deployed on Netlify (Nitro `netlify` preset).
- Node 24 LTS (`.nvmrc`), Yarn 1 (`corepack enable`). Always use `yarn`; `package.json` `resolutions` pin Vue core and framework build packages.
- Client code in `app/`; server code in `server/` (`server/utils/*` is auto-imported, e.g. `ConnectDB`, API auth helpers).

## Commands

- Install: `yarn install`
- Dev: `yarn dev`
- Build: `yarn build` (Netlify output check: `NITRO_PRESET=netlify yarn build`)
- Typecheck: `npx nuxi typecheck`
- Lint: `yarn lint` (existing code has many pre-existing style lint errors)

## API security

- `server/middleware/auth.ts` guards `/api/*`: valid `x-api-key` (`API_KEY`) or signed `ehs_app` cookie (`APP_SESSION_SECRET`) + same-origin. `/api/external/*` requires the API key.

## Dependency policy

- Prefer versions published at least 7 days ago; pin via exact versions / `resolutions` when caret ranges would pull newer releases.
