# Feature: Analytics Dashboard

The Analytics Dashboard provides educational institutes with a real-time, high-level overview of student performance.

## Business Logic

Instead of calculating the institute average on every page load (which involves querying thousands of tasks and scores), the backend uses a dedicated aggregate collection (`DashboardStat`) backed by Redis.

### Data Points Tracked
- Total active students.
- Total tasks completed vs pending.
- Institute-wide average score.
- Risk distribution (Number of High, Medium, Low risk students).

### Updating the Dashboard
Whenever a significant event occurs (e.g., a teacher uploads new scores, or a student finishes a task), the background utility `utility/updateDashBoardStat.js` is triggered. This re-runs the heavy Mongoose `.aggregate()` pipelines and updates the `DashboardStat` document.

### Fetching the Dashboard
When the frontend requests the dashboard:
1. The controller (`controllers/data.js`) checks Redis (`config/redis.js`).
2. If cached, it returns immediately.
3. If not, it fetches from `DashboardStat` in MongoDB, stores it in Redis for 1 hour, and returns it.

## Code References

- **Routes**: `routes/data.js`
- **Controller**: `controllers/data.js` (`dashboardAggregates`)
- **Model**: `models/DashboardStat.js`
- **Helper**: `utility/updateDashBoardStat.js`

---

**Related:**
- [[Caching]]
- [[Jobs]]
