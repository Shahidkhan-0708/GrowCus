# Security

Growcus implements a multi-layered defense-in-depth strategy to protect student data and backend infrastructure. The security model operates at the network, framework, and application levels.

## 1. Network & Framework Security (`app.js`)

Before any request hits a business logic controller, it must pass through global middleware.

### Helmet
- **What it does**: Sets various HTTP headers (e.g., Content-Security-Policy, X-Frame-Options, X-XSS-Protection).
- **Why**: Prevents clickjacking, cross-site scripting (XSS), and MIME-sniffing attacks.

### HTTP Parameter Pollution (HPP)
- **What it does**: Ignores duplicate query string parameters.
- **Why**: If a malicious user sends `GET /api/tasks?sort=asc&sort=desc`, Express parses `req.query.sort` as an array. This can crash NoSQL database drivers. `hpp()` forces it to take the last value.

### CORS
- **What it does**: Restricts cross-origin resource sharing to the specific frontend origin (`NEXT_PUBLIC_API_URL`).

## 2. Rate Limiting (`middlewares/rateLimiter.js`)

Growcus uses tiered rate limiting via `express-rate-limit` to mitigate DoS (Denial of Service) and brute-force attacks.

- **`authLimiter`**: Strict limits (e.g., 5 requests per 15 mins) on `/auth/login` and `/auth/signup`. It acts as an **exponential backoff** mechanism to thwart credential stuffing.
- **`ariaLimiter`**: Aggressive rate limiting (per minute) on `/aria/chat` to protect Groq API credits.
- **`apiLimiter`**: General limits (e.g., 100 requests per 15 mins) for standard interactions.
- **`publicLimiter`**: Looser limits for unauthenticated open endpoints.

## 3. Data Integrity & Injection Prevention

### Zod Validation (`middlewares/validate.js`)
- **How**: All `POST` and `PUT` request bodies are validated against strict Zod schemas (`middlewares/schemas.js`).
- **Why**: 
  - Ensures data types are correct (preventing `CastErrors`).
  - `.strict()` rejects any undefined fields, completely neutralizing **MongoDB Operator Injection** (`$gt`, `$ne`) and **Prototype Pollution** attacks that rely on passing arbitrary nested objects.

### Password Hashing (`models/User.js`)
- Passwords are never stored in plain text. They are hashed using `bcryptjs` with a secure salt round before saving to MongoDB.

## 4. Secrets Management (`config/security.js`)

- **JWT Secret**: The `JWT_SECRET` is required to sign authorization tokens. To prevent developers from accidentally deploying with a weak default string, `security.js` will force the Node process to crash if `JWT_SECRET` is undefined while `NODE_ENV === 'production'`.
- **Fallback Passwords**: Legacy systems often hardcode default passwords for mocked accounts. Growcus extracts these into environment configurations.

## Known Vulnerabilities & Future Hardening

- **No Token Blacklist**: Currently, JWTs cannot be revoked before they expire. Implementing a Redis-based token blacklist upon logout would fix this.
- **File Uploads**: As of the current version, the backend does not process file uploads. If added, `multer` must be strictly configured to prevent execution of `.php` or `.js` payloads.

---

**Related:**
- [[Middleware/validate]]
- [[Authentication]]
- [[Error Handling]]
