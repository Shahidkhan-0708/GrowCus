class ApiResponse {
   constructor(statusCode = 200, data = null, message = "Success") {
      this.success = statusCode < 400
      this.message = message
      this.data = data
   }
}

function sendSuccess(res, data = null, message = "Success", statusCode = 200) {
   return res.status(statusCode).json(new ApiResponse(statusCode, data, message))
}

function sendError(res, message = "Internal Server Error", statusCode = 500, details = null) {
   return res.status(statusCode).json({
      success: false,
      message,
      ...(details ? { details } : {})
   })
}

module.exports = ApiResponse
module.exports.ApiResponse = ApiResponse
module.exports.sendSuccess = sendSuccess
module.exports.sendError = sendError
