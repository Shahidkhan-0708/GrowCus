const { createClient } = require("redis")

const redisClient = createClient({
   url: process.env.REDIS_URL || "redis://localhost:6379"
})

let connectPromise = null
const memoryCache = new Map()

redisClient.on("error", (err) => {
   console.error("Redis error:", err.message)
})

async function ensureRedis() {
   if (redisClient.isOpen) return true

   if (!connectPromise) {
      connectPromise = redisClient.connect().catch(() => false)
   }

   return connectPromise
}

async function get(key) {
   const connected = await ensureRedis()
   if (!connected) return memoryCache.get(key) || null
   return redisClient.get(key)
}

async function set(key, value, options) {
   const connected = await ensureRedis()
   if (!connected) {
      memoryCache.set(key, value)
      return "OK"
   }

   return redisClient.set(key, value, options)
}

async function del(key) {
   const connected = await ensureRedis()
   if (!connected) {
      memoryCache.delete(key)
      return 1
   }

   return redisClient.del(key)
}

async function addRedis() {
   await set("name", "shahid")
   return get("name")
}

module.exports = {
   get,
   set,
   del,
   addRedis,
   rawClient: redisClient
}
