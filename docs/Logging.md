# Logging

Growcus handles operational logging through a dedicated middleware, keeping track of incoming requests, response times, and server exceptions.

## Overview

All incoming requests are intercepted by the `logger` middleware before hitting the core application logic. Wait, currently, the app uses a custom logging function in `middlewares/logger.js`.

## Custom Logger (`middlewares/logger.js`)

- **What it does**: Logs the HTTP Method, URL path, and timestamp of every request.
- **Where it is used**: Added near the top of `app.js` (`app.use(logger)`).
- **Execution Flow**:
  1. A request comes in.
  2. The logger records `[${new Date().toISOString()}] ${req.method} ${req.url}`.
  3. `next()` is called to continue the request.

## Error Logging

In addition to standard request logging, the application handles error logging differently via the `errorMiddleware` in `middlewares/error.js`.

- **Operational Errors**: Only the client-facing error message is logged or passed along.
- **Programming / Unhandled Errors**: If the error is an unexpected `500` or lacks `isOperational: true`, the middleware logs the **full stack trace**, the request body, and specific route parameters to the server console.

## Production Considerations

- **Current Limitation**: The application relies entirely on `console.log` and `console.error`. In production, this output is typically piped by process managers like PM2 or Docker into local files or services.
- **Future Improvement**: A more robust library like `winston` or `morgan` is recommended for production. This would allow log levels (e.g., `info`, `warn`, `error`) and integration with log aggregation services like Datadog or ELK stack.

---

**Related:**
- [[Error Handling]]
- [[Middleware/Overview]]
