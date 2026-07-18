# Error Handling

Growcus employs a robust, centralized error-handling strategy designed to achieve two main goals:
1. Ensure the API never crashes due to unhandled promise rejections.
2. Prevent sensitive internal information (stack traces, database schema details) from leaking to the client in production.

## The Strategy

Instead of wrapping every controller function in `try...catch` blocks, Growcus uses the Express `next()` function in combination with custom error classes and an asynchronous wrapper.

## Core Components

### 1. `AppError` (`jobs/apiError.js`)
- **What it is**: A custom Javascript `Error` class.
- **Why it exists**: To differentiate between **Operational Errors** (expected errors like "User not found" or "Validation failed") and **Programming Errors** (unexpected bugs like a syntax error or a null pointer exception).
- **How it works**:
  - Accepts `message`, `statusCode`, and optional `details`.
  - Automatically sets `this.isOperational = true`.
  - Captures the exact stack trace at instantiation.

### 2. `asyncHandler` (`jobs/asyncHandler.js`)
- **What it is**: A higher-order function that wraps asynchronous Express middleware/controllers.
- **Where it is used**: Every asynchronous controller function must be wrapped in it. 
  Example: `exports.handleSignUp = asyncHandler(async (req, res, next) => { ... })`
- **How it works**: It resolves the promise returned by the controller. If the promise rejects (due to a thrown error or Mongoose failing), `.catch(next)` immediately forwards the error to the global Error Middleware.

### 3. Global Error Middleware (`middlewares/error.js`)
- **What it is**: The final destination for all errors. It is registered at the very end of `app.js` via `app.use(errorMiddleware)`.
- **Execution Flow**:
  1. Checks if the incoming error has a `statusCode`, defaults to `500`.
  2. Checks if `isOperational` is `true`.
  3. **Server-Side Logging**: Always logs the full error, route, and stack trace to the console (or a file in production) for observability.
  4. **Client-Side Response**: 
     - If the error is operational (`AppError`), it returns the safe `message` and `details` (e.g., Zod validation field arrays) to the client.
     - If the error is a programming error (e.g., a raw Mongoose CastError or TypeError), it **masks** the message and simply returns `"Internal Server Error"` to the client.

## Validation Errors

When the [[Middleware/validate|Zod Validation Middleware]] fails:
1. Zod returns a raw error array.
2. The middleware maps these into a clean `{ field, message }` array.
3. It throws `new AppError("Validation failed", 400, details)`.
4. The Global Error Middleware catches it and sends a clean `400 Bad Request` to the client containing the details.

## Common Mistakes

- **Forgetting `asyncHandler`**: If an async controller is not wrapped in `asyncHandler` and it throws an error, the Node.js process will crash with an `UnhandledPromiseRejectionWarning`, or the request will hang indefinitely.
- **Throwing raw Errors**: Doing `throw new Error("Bad stuff")` will be treated as a programming error, resulting in a generic `500 Internal Server Error` to the client. Always `throw new AppError("Message", statusCode)`.

---

**Related:**
- [[Request Flow]]
- [[Logging]]
