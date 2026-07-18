# Caching

Growcus employs Redis to cache computationally expensive queries, specifically for the institute-wide analytics dashboard.

## Overview

The database aggregates millions of student scores and task completions to calculate averages and risk scores. Hitting the database on every `/api/data/dashboard-aggregate` request would cripple the server. Redis acts as an in-memory key-value store to cache these results.

## Implementation (`config/redis.js`)

- **Redis Client**: Uses the `redis` npm package to connect to the `REDIS_URL`.
- **Wrapper Functions**:
  - `getCache(key)`: Fetches a key, automatically parses the JSON, and returns the object.
  - `setCache(key, value, expirationInSeconds)`: Stringifies the value and stores it in Redis with a TTL (Time To Live).

## Caching Strategy

The platform primarily uses a **Cache-Aside** (lazy loading) strategy.

### Example Execution Flow
1. User requests dashboard data.
2. The controller checks Redis via `getCache('dashboard:instituteId')`.
3. **Cache Hit**: Data is returned immediately (response time ~5ms).
4. **Cache Miss**: 
   - Controller queries MongoDB (using complex `.aggregate()` pipelines).
   - The result is stored via `setCache('dashboard:instituteId', data, 3600)` (cached for 1 hour).
   - Data is returned to the user.

## Cache Invalidation

Currently, caches are time-based (TTL of 1 hour for dashboards).
For real-time accuracy, specific mutations (like `POST /api/tasks` or `POST /api/scores`) should ideally trigger an explicit cache invalidation or update using `redis.del()`. 

## Fallback

Redis is treated as an enhancement, not a strict dependency. If the Redis server is unreachable, the wrapper functions swallow the connection error and return `null`, allowing the system to gracefully degrade and fall back to querying MongoDB directly.

---

**Related:**
- [[Configuration]]
- [[Controllers/data]]
- [[Database]]
