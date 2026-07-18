# Configuration & Environment Variables

The Growcus platform relies heavily on configuration files and environment variables to maintain behavioral flexibility without requiring code changes across different environments (Development vs. Production).

## 1. Environment Variables (`.env`)

Environment variables are loaded into the Node.js process using the `dotenv` package at the very top of `app.js`.

### Required Variables

| Variable | Purpose | Required? | Default / Example | Used In |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | The HTTP port the Express server binds to. | No | `5000` | `app.js` |
| `MONGO_URL` | The MongoDB connection string. | **Yes** | `mongodb://127.0.0.1:27017/growcus` | `db/db.js` |
| `JWT_SECRET` | Cryptographic key used to sign Auth tokens. | **Yes** | *None (crashes if missing in Prod)* | `services/auth.js`, `config/security.js` |
| `GROQ_API_KEY` | External API key for Llama-3 AI integrations. | **Yes** (for Aria) | `gsk_...` | `controllers/aria.js` |
| `REDIS_URL` | The connection string for the Redis caching server. | No | `redis://localhost:6379` | `config/redis.js` |

### Security / Rate Limiting Overrides

By default, rate limits are defined in code. However, they can be overridden in the `.env` file via the following variables parsed by `config/security.js`:
- `RL_AUTH_WINDOW_MS`: Window size for auth limits in ms.
- `RL_AUTH_MAX`: Max auth attempts per window.
- `RL_API_MAX`: Max general API requests per 15 min.
- `RL_ARIA_MAX`: Max AI requests per minute.

## 2. Configuration Layer (`/config`)

Instead of scattering `process.env` calls throughout the codebase, Growcus uses centralized configuration files.

### `config/security.js`
- **Purpose**: The single source of truth for all security thresholds, default values, and validation boundaries.
- **Why it exists**: Prevents magic numbers and scattered hardcoded credentials. It makes auditing and adjusting security parameters trivial.
- **What it configures**:
  - Zod validation bounds (e.g., max string lengths, min password lengths).
  - Rate limiting thresholds.
  - Safe default fallback passwords for auto-generated students/teachers.
  - Strict enforcement of `JWT_SECRET` in production environments (`NODE_ENV === 'production'`).

### `config/redis.js`
- **Purpose**: Initializes and manages the connection to the Redis server.
- **How it works**: Uses the `redis` npm package to create a client. It exports helper functions (`getCache`, `setCache`) that abstract away stringification and error handling.
- **Fallback Mechanism**: If `REDIS_URL` is unavailable or the Redis server is offline, the application should gracefully degrade (cache misses) rather than crashing the primary Node process.

---

**Related:**
- [[Security]]
- [[Caching]]
- [[Development Workflow]]
