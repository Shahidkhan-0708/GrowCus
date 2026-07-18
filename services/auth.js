const jwt = require("jsonwebtoken")
const { jwt: jwtConfig } = require("../config/security")

// JWT_SECRET MUST come from environment; crash on startup if missing in production.
const secret = process.env.JWT_SECRET
if (!secret && process.env.NODE_ENV === "production") {
   console.error("FATAL: JWT_SECRET environment variable is not set.")
   process.exit(1)
}

const JWT_SECRET = secret || "dev-only-insecure-fallback-change-me"

function setUser(user) {
   const payload = {
      userId: user._id,
      role: user.role,
      instituteId: user.instituteId,
   }
   try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: jwtConfig.expiresIn })
   } catch (error) {
      return null
   }
}

function getUser(token) {
   try {
      return jwt.verify(token, JWT_SECRET)
   } catch (error) {
      return null
   }
}

module.exports = { setUser, getUser }
