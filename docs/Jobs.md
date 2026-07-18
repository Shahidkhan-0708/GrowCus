# Jobs & Utilities

The `/jobs` and `/utility` (or `/utils`) directories contain standalone background workers, helper functions, and shared classes that don't fit neatly into the Controller/Service paradigm.

## `/jobs` Directory

### 1. `apiError.js`
- **Purpose**: Defines the `AppError` class which extends the native JS `Error`.
- **Usage**: Used throughout controllers and validation middleware to throw operational errors (e.g., `throw new AppError("Invalid email", 400)`). It flags the error with `isOperational = true`.

### 2. `apiResponse.js`
- **Purpose**: Standardizes all JSON responses sent to the frontend.
- **Usage**: Exports `sendSuccess(res, data, message, statusCode)` and `sendError(...)`. Ensures every response adheres to `{ success: boolean, message: string, data: any }`.

### 3. `asyncHandler.js`
- **Purpose**: Eliminates the need for `try/catch` blocks in every Express controller.
- **How it works**: Wraps an async function and automatically catches any rejected promises, forwarding them to the Express error middleware via `next(err)`.

## `/utility` Directory

### 1. `updateDashBoardStat.js`
- **Purpose**: A background function/helper that recalculates the aggregate statistics (total students, total tasks, average score) for an entire institute.
- **When it executes**: Typically invoked after a major database mutation (e.g., a new student is created, or scores are mass-updated) to ensure the `DashboardStat` collection remains somewhat eventually consistent.
- **Note**: This is a heavy operation. In production, this should ideally be moved to an actual message queue (like BullMQ or RabbitMQ) rather than blocking the main Node thread.

### 2. `api.js`
- **Purpose**: A centralized barrel file that re-exports standard utilities (like the ones from `/jobs`) to simplify import paths across the app.

---

**Related:**
- [[Error Handling]]
- [[Database#DashboardStat Model]]
