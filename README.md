# N1 Shop: Neon database and authentication

The storefront uses Neon PostgreSQL through the server-only Drizzle client. Neon Managed Better Auth owns credentials and sessions. The application schema contains profiles, carts, and cart items; it does not duplicate authentication tables.

## Environment

Keep credentials in the existing ignored `.env` file. The application reads `DATABASE_URL`, `NEON_AUTH_BASE_URL`, and `NEON_AUTH_COOKIE_SECRET` (at least 32 characters). Never prefix these values with `NEXT_PUBLIC_`. `.env.example` is only a names-only template; do not copy it over an existing `.env`.

The checked-in `.env` currently contains `DATABASE_URL` only. Add the two Managed Better Auth variables to the existing `.env` from Neon Console; its current contents were not changed or printed. Generate `NEON_AUTH_COOKIE_SECRET` as a random value of at least 32 characters and keep it private.

In Neon Console, enable Managed Better Auth and email/password sign-in on the intended branch. Add the application origin to trusted origins. Enable email verification if required; email codes work with the shared or custom provider, while verification links require a custom email provider. Configure email delivery and reset callbacks for the application's `/reset-password` route. Until the two auth variables and provider settings are present, auth routes return an unavailable state and `/account` and `/cart` redirect to `/login`; public storefront routes remain available.

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

- `/login` and `/register` are separate forms using the official `@neon/auth` Next.js client. Login return paths are limited to same-origin relative URLs.
- `/verify-email` accepts the Managed Better Auth verification code when email-code verification is enabled.
- `/forgot-password` and `/reset-password` proxy requests to Managed Better Auth.
- `/account` is protected by Next.js 16 `proxy.ts` and rechecks the session server-side. Session failures resolve to unauthenticated state.
- `/api/profile` derives identity from the validated session, supports idempotent ensure/sync and display-name updates in both Neon Auth and N1, and rejects cross-origin writes.
- `/api/cart` derives ownership from the validated session and rejects cross-origin mutations; it never accepts a profile ID.
- `/api/neon/health` is a read-only database connectivity endpoint.

On an auth error, review Neon Console email sign-in, trusted origins, verification mode, and email delivery settings. The app never logs provider errors, passwords, or reset tokens.

## Cart catalog boundary

Cart persistence and ownership constraints are ready for UUID `product_variant_id` values. The current storefront catalog has no persisted product-variant IDs, so it deliberately does not add the illustrative products to a customer cart. Existing browser storage is left untouched and is no longer read as an account cart. Checkout is not implemented.

## Verification state

The initial migration is already applied per the project setup. Do not rerun `db:migrate` for this task. Authentication flows still need development verification after Neon Auth environment values and email delivery are configured. No production build is run for the identity task.
