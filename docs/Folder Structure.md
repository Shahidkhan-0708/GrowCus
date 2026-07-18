# Folder Structure

Growcus uses a feature-by-layer directory structure. Here is a comprehensive map of where things live and why.

## Root Directory

```text
/
├── app.js               - The main Express application entry point.
├── .env                 - Local environment variables (git-ignored).
├── package.json         - Node.js dependencies and run scripts.
├── README.md            - Top-level project documentation.
├── DESIGN.md            - Frontend design system guidelines.
└── docs/                - This Obsidian knowledge base!
```

## Backend Directories

### `/config`
Contains configuration files for integrations and global settings.
- **[[Configuration#Security|security.js]]**: Centralized security settings, thresholds, and default overrides.
- **[[Configuration#Redis|redis.js]]**: Connection logic and wrappers for the Redis caching client.

### `/controllers`
Houses the logic that handles incoming HTTP requests and returns responses.
- **[[Controllers/data|data.js]]**: Master controller for dashboard aggregates, students, and generic tasks.
- **[[Controllers/auth|auth.js]]**: Login and signup orchestration.
- **[[Controllers/risk|risk.js]]**: Calculates risk scores based on student performance.
- *(See [[Controllers/Overview]] for full list)*

### `/db`
Database connection files.
- **`db.js`**: Connects Mongoose to the MongoDB URI specified in `.env`.

### `/jobs`
Contains background tasks, wrappers, and custom classes.
- **`apiError.js`**: Custom error class (`AppError`) used to distinguish operational errors from programming bugs.
- **`apiResponse.js`**: Standardized JSON response formatters (`sendSuccess`, `sendError`).
- **`asyncHandler.js`**: Wrapper to catch async promise rejections and pass them to Express error middleware.

### `/middlewares`
Functions that intercept the request/response lifecycle.
- **[[Middleware/auth|auth.js]]**: Validates JWT tokens and injects `req.user`.
- **[[Middleware/role|role.js]]**: Role-based access control (RBAC).
- **[[Middleware/schemas|schemas.js]]**: Strict Zod schemas for all request bodies.
- **[[Middleware/validate|validate.js]]**: Middleware that applies Zod schemas and validates Object IDs.
- **[[Middleware/error|error.js]]**: Global error handling to prevent stack trace leaks.
- **[[Middleware/rateLimiter|rateLimiter.js]]**: Tiered IP and Account-based rate limiters.

### `/models`
Mongoose schema definitions. These represent collections in the MongoDB database.
- **[[Models/User|User.js]]**: Defines the structure for Admins, Teachers, and Students.
- **[[Models/Tasks|Tasks.js]]**: Defines academic tasks assigned to students.
- *(See [[Database]] for the complete ERD)*

### `/routes`
Express routers that map URLs and HTTP methods to their corresponding controller functions.
- **[[Routes/auth|auth.js]]**: Maps `/auth/login` and `/auth/signup`.
- *(See [[Routes/Overview]] for full list)*

### `/services`
Core business logic and external integrations.
- **`auth.js`**: JWT generation and verification logic.
- **`studentData.js`**: Utilities for formatting student data and generating dashboard queries.
- **`taskData.js`**: Utilities for formatting task arrays.

### `/utility` (and `/utils`)
Small helper functions.
- **`updateDashBoardStat.js`**: Background updater to sync dashboard averages.
- **`api.js`**: Re-exports `asyncHandler`, `AppError`, and response formatters from `/jobs`.

## Frontend Directory

### `/frontend`
The complete Next.js React application.
- **`/src/app`**: Next.js App Router pages (`layout.tsx`, `page.tsx`).
- **`/src/components`**: Reusable React components (`Sidebar.tsx`, `Aria.tsx`).
- **`/src/contexts`**: React context providers (e.g., `AuthContext.tsx`).

---

**Related:**
- [[Architecture]]
- [[Development Workflow]]
