# N1 Shop: Neon database and authentication

The storefront uses Neon PostgreSQL through the server-only Drizzle client. Neon Managed Better Auth owns credentials and sessions. The application schema contains profiles, carts, and cart items; it does not duplicate authentication tables.

## Environment

Keep credentials in the existing ignored `.env` file. The application reads `DATABASE_URL`, `NEON_AUTH_BASE_URL`, and `NEON_AUTH_COOKIE_SECRET` (at least 32 characters). Never prefix these values with `NEXT_PUBLIC_`. `.env.example` is only a names-only template; do not copy over an existing `.env`.

Enable Managed Better Auth on the intended Neon branch and configure email sign-in, verification, password reset email delivery, and the application origin in Neon Console. The auth endpoint and cookie secret must be configured in the local environment before starting the app.

## Drizzle migrations

```powershell
npm run db:generate
npm run db:check
npm run db:migrate
npm run db:studio
```

Review generated SQL before applying it. `DATABASE_URL` in `drizzle.config.ts` is the only migration target; verify that it identifies the intended development branch before running `db:migrate`. The migration history lives in `drizzle/`.

For a read-only connectivity check, use `npm run db:smoke`; it executes `SELECT 1` and performs no writes.

## Authentication routes

- `/login` and `/register` use the official `@neon/auth` Next.js client.
- `/verify-email` accepts the Managed Better Auth verification code when email-code verification is enabled.
- `/forgot-password` and `/reset-password` proxy requests to Managed Better Auth.
- `/account` is protected by Next.js 16 `proxy.ts` and rechecks the session server-side.
- `/api/profile` and `/api/cart` derive ownership from the server-validated session; they do not accept a profile ID.
- `/api/neon/health` is a read-only database connectivity endpoint.

## Cart catalog boundary

Cart persistence and ownership constraints are ready for UUID `product_variant_id` values. The current storefront catalog has no persisted product-variant IDs, so it deliberately does not add the illustrative products to a customer cart. Existing browser storage is left untouched and is no longer read as an account cart. Checkout is not implemented.

## Verification state

Migration SQL is generated and statically reviewed. No migration was applied, no database query or authentication flow was executed, and no build or test was run as part of the current source implementation.
