# Services Overview

The `/services` directory contains the core business logic of the application. Extracting logic from Controllers into Services makes the code more reusable, testable, and maintainable.

## Design Philosophy

- **Controllers** should only care about HTTP (parsing `req`, sending `res`).
- **Services** should not know about HTTP. They take plain arguments (like `userId`, `taskData`), interact with models or external APIs, and return raw data or throw an `AppError`.

## Service Manifest

### `auth.js`
- **`setUser(user)`**: Generates a JWT using `jsonwebtoken`. Extracts `_id`, `email`, `role`, and `instituteId` to pack into the token payload.
- **`getUser(token)`**: Verifies and decodes a JWT using the `JWT_SECRET`.

### `studentData.js`
- **`formatStudentData(studentId, instituteId)`**: A complex aggregation service. It queries a student's basic profile, then fetches all their `Tasks`, calculates their `Riskscore`, and compiles all recent test `Scores`. Used heavily by the dashboard controllers.

### `taskData.js`
- Utility functions for manipulating task arrays and formatting them before returning to the frontend.

## Empty/Placeholder Services
- `aria.js`
- `notification.js`
- `report.js`
- `whatsapp.js`

*Note: Several service files are currently empty placeholders in the codebase. Their intended business logic (e.g., Groq API calls for Aria) is currently sitting inside the `controllers/` directory and should be refactored into these services in future updates.*

---

**Related:**
- [[Controllers/Overview]]
- [[Architecture]]
