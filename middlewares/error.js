/**
 * Global error handler.
 *
 * Rules:
 * 1. Log full stack + details server-side.
 * 2. Never send stack traces, file paths, or raw DB errors to the client.
 * 3. Only operational (AppError) messages are forwarded; everything else
 *    becomes a generic "Internal Server Error".
 */

function errorMiddleware(err, req, res, next) {
   const statusCode = err.statusCode || 500
   const isOperational = err.isOperational === true

   // ── Server-side logging (full detail) ────────────────────────
   if (statusCode >= 500 || !isOperational) {
      console.error("──── Unhandled Error ────")
      console.error(`Route:   ${req.method} ${req.originalUrl}`)
      console.error(`Message: ${err.message}`)
      console.error(`Stack:   ${err.stack}`)
      if (err.details) console.error("Details:", JSON.stringify(err.details))
      console.error("─────────────────────────")
   }

   // ── Client response (safe) ───────────────────────────────────
   const clientMessage = isOperational
      ? err.message
      : "Internal Server Error"

   const responseBody = {
      success: false,
      message: clientMessage,
   }

   // Only include validation details for 400-level operational errors
   if (isOperational && err.details && statusCode >= 400 && statusCode < 500) {
      responseBody.details = err.details
   }

   res.status(statusCode).json(responseBody)
}

module.exports = { errorMiddleware }
