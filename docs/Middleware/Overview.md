# Middleware Overview

The `/middlewares` directory contains functions that intercept the request/response lifecycle. They enforce rules, format data, or handle errors before the Controller is reached.

## Middleware Manifest

### `auth.js` (`requireAuth`)
- Extracts the JWT from the `Authorization` header.
- Decodes it using the `auth` service.
- Injects the resulting user profile into `req.user`.
- Rejects missing/invalid tokens with `401 Unauthorized`.

### `role.js` (`allowRoles`)
- Expects `req.user` to exist (meaning `requireAuth` must run first).
- Compares `req.user.role` against an array of permitted roles (e.g., `['admin', 'teacher']`).
- Rejects unauthorized access with `403 Forbidden`.

### `validate.js` & `schemas.js`
- **Zod Schemas**: `schemas.js` exports strict Zod object definitions for every endpoint.
- **Validator**: `validate(schema)` takes the request body, runs `safeParse`, and strips out malicious or extra fields. If validation fails, it throws a `400 Bad Request` `AppError` containing exactly which fields failed.

### `rateLimiter.js`
- Utilizes `express-rate-limit`.
- Defines `authLimiter`, `apiLimiter`, and `ariaLimiter`.
- Uses values from `config/security.js` to protect against brute force and DDoS.

### `error.js`
- The global error trap. Detailed in [[Error Handling]].

---

**Related:**
- [[Request Flow]]
- [[Security]]
