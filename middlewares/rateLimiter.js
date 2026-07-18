/**
 * Tiered rate-limiting middleware.
 *
 * - authLimiter:    strict per-IP + per-account with exponential backoff
 * - apiLimiter:     moderate for authenticated endpoints
 * - ariaLimiter:    tight for AI chat (expensive downstream calls)
 * - publicLimiter:  moderate for unauthenticated / open endpoints
 */

const rateLimit = require("express-rate-limit")
const { rateLimit: rl } = require("../config/security")

// ── In-memory per-account failure tracker (auth routes) ─────────
const accountFailures = new Map() // email -> { count, nextAllowedAt }

function getAccountKey(email) {
   return (email || "").toLowerCase().trim()
}

function recordAccountFailure(email) {
   const key = getAccountKey(email)
   const entry = accountFailures.get(key) || { count: 0, nextAllowedAt: 0 }
   entry.count += 1

   // Exponential backoff: base * 2^(failures-1), capped
   const delay = Math.min(
      rl.auth.backoffBase * Math.pow(2, entry.count - 1),
      rl.auth.backoffMax
   )
   entry.nextAllowedAt = Date.now() + delay
   accountFailures.set(key, entry)
}

function resetAccountFailures(email) {
   accountFailures.delete(getAccountKey(email))
}

function isAccountLocked(email) {
   const key = getAccountKey(email)
   const entry = accountFailures.get(key)
   if (!entry) return { locked: false }

   if (entry.count >= rl.auth.maxPerAccount && Date.now() < entry.nextAllowedAt) {
      const retryAfter = Math.ceil((entry.nextAllowedAt - Date.now()) / 1000)
      return { locked: true, retryAfter }
   }

   // Window has passed — reset
   if (Date.now() >= entry.nextAllowedAt) {
      accountFailures.delete(key)
      return { locked: false }
   }

   return { locked: false }
}

// Cleanup stale entries every 30 min
setInterval(() => {
   const now = Date.now()
   for (const [key, entry] of accountFailures) {
      if (now > entry.nextAllowedAt + 60000) {
         accountFailures.delete(key)
      }
   }
}, 30 * 60 * 1000)

// ── Per-IP rate limiters ────────────────────────────────────────

const authLimiter = rateLimit({
   windowMs: rl.auth.windowMs,
   max: rl.auth.maxRequests,
   standardHeaders: true,
   legacyHeaders: false,
   message: {
      success: false,
      message: "Too many authentication attempts. Please try again later.",
   },
})

const apiLimiter = rateLimit({
   windowMs: rl.api.windowMs,
   max: rl.api.maxRequests,
   standardHeaders: true,
   legacyHeaders: false,
   message: {
      success: false,
      message: "Rate limit exceeded. Please slow down.",
   },
})

const ariaLimiter = rateLimit({
   windowMs: rl.aria.windowMs,
   max: rl.aria.maxRequests,
   standardHeaders: true,
   legacyHeaders: false,
   message: {
      success: false,
      message: "Aria AI rate limit reached. Please wait a moment.",
   },
})

const publicLimiter = rateLimit({
   windowMs: rl.public.windowMs,
   max: rl.public.maxRequests,
   standardHeaders: true,
   legacyHeaders: false,
   message: {
      success: false,
      message: "Rate limit exceeded.",
   },
})

module.exports = {
   authLimiter,
   apiLimiter,
   ariaLimiter,
   publicLimiter,
   recordAccountFailure,
   resetAccountFailures,
   isAccountLocked,
}
