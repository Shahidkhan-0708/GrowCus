# Dependencies

Here is a breakdown of the critical npm packages used by the Growcus backend, why they exist, and where they are used.

## Core Framework
- **`express`**: The core web framework. Handles routing, middleware, and request/response lifecycles.
- **`mongoose`**: ODM (Object Data Modeling) library for MongoDB. Used to define schemas, models, and perform database queries.

## Security & Validation
- **`zod`**: Schema declaration and validation library. Replaced manual input checking. Used in `middlewares/schemas.js` to rigidly validate all POST/PUT bodies.
- **`helmet`**: Secures Express apps by setting various HTTP headers (XSS protection, Clickjacking protection).
- **`hpp`**: Express middleware to protect against HTTP Parameter Pollution attacks.
- **`bcryptjs`**: Cryptography library used in `models/User.js` to hash and compare user passwords.
- **`express-rate-limit`**: Basic rate-limiting middleware used in `middlewares/rateLimiter.js` to prevent brute-force attacks.

## Authentication
- **`jsonwebtoken` (JWT)**: Used in `services/auth.js` to sign and verify stateless access tokens.

## External Services
- **`groq-sdk`**: The official Node.js client for Groq. Used in `controllers/aria.js` to communicate with the Llama-3 AI model for the Aria Chat assistant.
- **`redis`**: The official Node.js client for Redis. Used in `config/redis.js` for caching dashboard analytics.

## Utilities
- **`dotenv`**: Loads environment variables from a `.env` file into `process.env`.
- **`cors`**: Middleware to enable Cross-Origin Resource Sharing, allowing the Next.js frontend to communicate with the Express API.

## Alternatives Considered
- *Joi or Yup* instead of *Zod*: Zod was chosen due to its modern API, excellent strict-mode parsing, and seamless typescript-like syntax.
- *Bcrypt* instead of *Bcryptjs*: `bcryptjs` is implemented in pure JavaScript, making it easier to install across different operating systems (Windows, Linux, Mac) without needing C++ compilation tools.

---

**Related:**
- [[Architecture]]
- [[Security]]
