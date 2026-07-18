# Feature: Authentication

The Authentication feature secures the platform and ensures that users can only access data belonging to their specific institute and role.

## Business Logic

Growcus supports three distinct user roles:
1. **Admin**: Can view system-wide stats and manage teachers/students.
2. **Teacher**: Can create tasks, input scores, and view analytics for their assigned students.
3. **Student**: Can view their own dashboard, complete tasks, and interact with the Aria AI.

### Signup Flow
1. User provides `name`, `email`, `password`, `role`, and `instituteId`.
2. Backend strictly validates this via Zod `signupSchema`.
3. If the user doesn't exist, they are created. Password is encrypted.
4. A JWT is issued.

### Login Flow
1. User provides `email` and `password`.
2. Backend rate limits the attempt (max 5 per 15 minutes by default).
3. If valid, a JWT is issued.

## Code References

- **Routes**: `routes/auth.js`
- **Controller**: `controllers/auth.js` (`handleSignUp`, `handleLogin`)
- **Service**: `services/auth.js` (`setUser`, `getUser`)
- **Model**: `models/User.js`
- **Middleware**: `middlewares/auth.js` (`requireAuth`), `middlewares/role.js` (`allowRoles`)

## Security Context

- Passwords are never returned in API payloads (Mongoose models should exclude them via `.select('-password')` or controller mapping).
- The JWT payload only contains non-sensitive identifiers (`_id`, `role`, `instituteId`).

---

**Related:**
- [[Authentication]]
- [[Security]]
