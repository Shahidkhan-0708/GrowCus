class AppError extends Error {
   constructor(message = "Internal Server Error", statusCode = 500, details = null) {
      super(message)

      this.name = this.constructor.name
      this.statusCode = statusCode
      this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"
      this.success = false
      this.details = details
      this.isOperational = true

      Error.captureStackTrace(this, this.constructor)
   }
}

module.exports = AppError
module.exports.AppError = AppError
