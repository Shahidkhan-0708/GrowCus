const AppError = require("../jobs/apiError")
const mongoose = require("mongoose")

function validate(schema, source = "body") {
   return (req, res, next) => {
      const data = req[source]

      if (!schema) {
         return next(new AppError("Invalid validation schema", 500))
      }

      if (typeof schema.safeParse === "function") {
         const result = schema.safeParse(data)

         if (!result.success) {
            const details = result.error.issues.map((issue) => ({
               field: issue.path.join("."),
               message: issue.message
            }))

         return next(new AppError("Validation failed", 400, details))
         }
         req[source] = result.data
         return next()
      }

      if (typeof schema.parse === "function") {
         try {
            req[source] = schema.parse(data)
            return next()
         } catch (error) {
            return next(new AppError("Validation failed", 400, error.errors || error.issues || error.message))
         }
      }

      if (typeof schema.validate === "function") {
         const { error, value } = schema.validate(data, {
            abortEarly: false,
            stripUnknown: true
         })

         if (error) {
            const details = error.details.map((detail) => ({
               field: detail.path.join("."),
               message: detail.message
            }))

            return next(new AppError("Validation failed", 400, details))
         }

         req[source] = value
         return next()
      }

      return next(new AppError("Invalid validation schema", 500))
   }
}

function requireFields(fields, source = "body") {
   return (req, res, next) => {
      const data = req[source] || {}
      const missing = fields.filter((field) => data[field] === undefined || data[field] === null || data[field] === "")

      if (missing.length > 0) {
         return next(new AppError("Missing required fields", 400, missing))
      }
      return next()
   }
}

function validateObjectId(paramName = "id", source = "params") {
   return (req, res, next) => {
      const data = req[source] || {}
      const value = data[paramName]

      if (!value || !mongoose.Types.ObjectId.isValid(value)) {
         return next(new AppError(`Invalid ${paramName}`, 400))
      }

      return next()
   }
}

module.exports = {
   validate,
   requireFields,
   validateObjectId
}
