# Controllers Overview

The `/controllers` directory contains the functions responsible for handling HTTP requests, orchestrating business logic, and returning HTTP responses. Controllers bridge the gap between the Routes and the Models/Services.

## Design Philosophy

Controllers in Growcus are designed to:
1. Extract and validate parameters (from `req.params`, `req.query`, `req.user`).
2. Delegate core business logic or database interactions (often directly invoking Mongoose models in this iteration).
3. Send a standardized response using `sendSuccess` or throw an `AppError`.

Every async controller **must** be wrapped in `asyncHandler` to prevent unhandled promise rejections.

## Controller Manifest

### `auth.js`
Handles user sign up and login. Incorporates the local memory rate limiting variables to track failed login attempts for brute force mitigation.

### `data.js`
The central hub for aggregate and dashboard data.
- **`dashboardAggregates`**: Fetches total tasks, students, and calculates averages. Interacts with Redis caching.
- **`getAllStudents`**: Retrieves students based on institute and role.
- **`getStudentDetails`**: Deep dive into a single student, pulling their tasks, scores, and risk profiles.

### `task.js`
Handles the lifecycle of academic tasks.
- Creating tasks, updating task statuses (e.g., pending -> completed), and managing student XP points upon completion.

### `score.js`
Manages the CRUD operations for student test/exam scores, which feed into the analytics engine.

### `risk.js`
Contains the algorithmic logic to calculate a student's `Riskscore`. Evaluates multiple factors (grades, attendance, task completion rate) to categorize a student as low, medium, or high risk for intervention.

### `aria.js`
The entry point for the AI Assistant. It takes the student's message, compiles context, and streams the prompt to the Groq API.

## Common Mistakes
- **Leaking DB queries**: Returning `.find()` directly without `.lean()` or `.populate()`, leading to bloated JSON responses.
- **Missing `asyncHandler`**: Not wrapping the export in `asyncHandler(async (req, res, next) => { ... })`.

---

**Related:**
- [[Architecture]]
- [[Routes/Overview]]
