# Routes Overview

The `/routes` directory defines the API endpoints and maps HTTP methods (GET, POST, PUT, DELETE) to their respective Controller functions.

## Design Philosophy

Routes should be entirely devoid of business logic. Their sole purpose is to:
1. Define the endpoint string (e.g., `/api/students`).
2. Attach necessary middleware (Authentication, Rate Limiting, RBAC).
3. Attach validation schemas (Zod).
4. Point to the Controller.

## Router Manifest

All routes are mounted in `app.js` under prefixes (e.g., `/auth`, `/api`, `/aria`).

### `auth.js`
Mounted at `/auth`.
- `POST /signup`: Create account.
- `POST /login`: Authenticate.

### `data.js`
Mounted at `/api/data`.
- `GET /dashboard-aggregate`: Overview stats.
- `GET /students`: List students.
- `GET /students/:id`: Single student deep-dive.

### `task.js`
Mounted at `/api/tasks`.
- `POST /`: Create task.
- `PATCH /:id/status`: Update task completion.

### `score.js`
Mounted at `/api/scores`.
- `POST /`: Add a score.
- `DELETE /:id`: Remove a score.

### `risk.js`
Mounted at `/api/risk`.
- `GET /distribution`: Get analytics for high/medium/low risk populations.

## Middleware Pipeline Example

A typical route looks like this:
```javascript
router.post(
   "/", 
   requireAuth,                       // 1. Is user logged in?
   allowRoles("teacher", "admin"),    // 2. Are they allowed?
   validate(createTaskSchema),        // 3. Is the body valid JSON?
   createTask                         // 4. Execute Controller
);
```

---

**Related:**
- [[Controllers/Overview]]
- [[API]]
