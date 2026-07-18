# Environment Variables

Environment variables are defined in the `.env` file at the root of the backend directory. They control the runtime behavior, secrets, and integration endpoints.

## List of Variables

### Core Configuration

| Variable | Required? | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `5000` | The port the Express application listens on. |
| `NODE_ENV` | No | `development` | Determines whether to run in development or production mode (affects logging and strict security checks). |

### Database & Caching

| Variable | Required? | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `MONGO_URL` | **Yes** | `mongodb://127.0.0.1:27017/growcus` | Connection string for Mongoose to connect to MongoDB. |
| `REDIS_URL` | No | `redis://localhost:6379` | Connection string for the Redis caching server. |

### Security & Authentication

| Variable | Required? | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `JWT_SECRET` | **Yes** | *None* | A long, random cryptographic string used to sign JSON Web Tokens. Must be kept secret. |
| `DEFAULT_STUDENT_PASS`| No | `student123` | Default password used when seeding or bulk-creating students. |
| `DEFAULT_TEACHER_PASS`| No | `teacher123` | Default password used when seeding or bulk-creating teachers. |

### Third-Party Integrations

| Variable | Required? | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `GROQ_API_KEY` | **Yes** | *None* | Authentication key for Groq's API, powering the Aria AI Assistant (Llama-3). |

### Rate Limiting Overrides

*(These are optional; the application falls back to internal safe defaults defined in `config/security.js` if omitted)*

| Variable | Required? | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `RL_AUTH_WINDOW_MS` | No | `900000` | Time window (in ms) for auth rate limiting (default 15m). |
| `RL_AUTH_MAX` | No | `5` | Maximum login/signup attempts per IP in the auth window. |
| `RL_API_MAX` | No | `100` | Maximum general API hits per 15 minutes. |
| `RL_ARIA_MAX` | No | `10` | Maximum requests to the AI per minute. |

## Usage in Code

Environment variables are parsed via the `dotenv` package in `app.js`:
```javascript
const path = require("path");
require('dotenv').config({ path: path.join(__dirname, ".env") });
```

They are subsequently wrapped and exported in `config/security.js` to ensure the rest of the application is not directly coupled to `process.env`.

---

**Related:**
- [[Configuration]]
- [[Development Workflow]]
- [[Security]]
