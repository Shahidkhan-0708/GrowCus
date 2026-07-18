# Utilities

The `/utility` (or `/utils`) directory contains small, reusable helper functions that do not contain core business logic and do not directly map to HTTP requests.

## Utility Manifest

### `updateDashBoardStat.js`
- **Purpose**: A script/function designed to recalculate the `DashboardStat` collection.
- **Why it exists**: Instead of making the frontend wait for a 5-second aggregation query, this utility runs in the background to update the cached metrics.
- **Where it is used**: Called after major data mutations in controllers (e.g., uploading bulk scores).

### `api.js`
- **Purpose**: A barrel file.
- **What it does**: Re-exports standard API responses (`sendSuccess`, `sendError`), the `AppError` class, and the `asyncHandler` wrapper from the `/jobs` directory.
- **Why**: Allows controllers to import multiple utilities from a single path (`require('../../utils/api')`) rather than importing them individually.

---

**Related:**
- [[Jobs]]
- [[Architecture]]
