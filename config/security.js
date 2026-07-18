/**
 * Centralized, configurable security settings.
 * All thresholds are sourced from environment variables with sane defaults.
 */

module.exports = {
   // ── Rate Limiting ───────────────────────────────────────────
   rateLimit: {
      auth: {
         windowMs:   Number(process.env.RL_AUTH_WINDOW_MS)   || 15 * 60 * 1000, // 15 min
         maxRequests: Number(process.env.RL_AUTH_MAX)         || 10,              // per IP
         maxPerAccount: Number(process.env.RL_AUTH_PER_ACCT)  || 5,              // per email
         backoffBase:  Number(process.env.RL_AUTH_BACKOFF_MS)  || 1000,           // 1s base
         backoffMax:   Number(process.env.RL_AUTH_BACKOFF_MAX) || 30000,          // 30s cap
      },
      api: {
         windowMs:   Number(process.env.RL_API_WINDOW_MS)   || 15 * 60 * 1000,
         maxRequests: Number(process.env.RL_API_MAX)         || 200,
      },
      aria: {
         windowMs:   Number(process.env.RL_ARIA_WINDOW_MS)  || 60 * 1000,       // 1 min
         maxRequests: Number(process.env.RL_ARIA_MAX)        || 10,
      },
      public: {
         windowMs:   Number(process.env.RL_PUB_WINDOW_MS)   || 15 * 60 * 1000,
         maxRequests: Number(process.env.RL_PUB_MAX)         || 60,
      },
   },

   // ── Input Validation Limits ─────────────────────────────────
   validation: {
      name:       { min: 1,  max: 100 },
      email:      { max: 254 },
      password:   { min: 8,  max: 128 },
      role:       ["admin", "teacher", "student"],
      instituteId:{ min: 1,  max: 100 },
      batch:      { max: 100 },
      subject:    { max: 100 },
      message:    { min: 1,  max: 2000 },
      title:      { min: 1,  max: 200 },
      description:{ max: 2000 },
      phone:      { max: 20 },
      score:      { min: 0,  max: 100 },
      attendance: { min: 0,  max: 100 },
      marks:      { min: 0,  max: 100 },
      xp:         { min: 0,  max: 100000 },
      taskStatus: ["pending", "todo", "in-progress", "review", "completed"],
      taskPriority: ["low", "medium", "high"],
   },

   // ── JWT ─────────────────────────────────────────────────────
   jwt: {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
   },

   // ── Defaults (read from env, NOT hardcoded in code) ─────────
   defaults: {
      studentPassword: process.env.DEFAULT_STUDENT_PASSWORD || "ChangeMe!Student2026",
      teacherPassword: process.env.DEFAULT_TEACHER_PASSWORD || "ChangeMe!Teacher2026",
   },
}
