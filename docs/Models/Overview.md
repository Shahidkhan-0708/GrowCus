# Models Overview

The `/models` directory defines the Mongoose schemas that map directly to MongoDB collections. They dictate the shape, constraints, and relationships of the persistent data.

## Design Philosophy

- **Referencing over Embedding**: Growcus heavily favors referencing other documents (using `ObjectId` and `.populate()`) rather than embedding arrays of sub-documents. This keeps documents small and avoids the 16MB BSON limit for highly active students.
- **Timestamps**: All schemas should include `{ timestamps: true }` to automatically manage `createdAt` and `updatedAt`.

## Model Manifest

### `User.js`
The master collection for all human entities (Admin, Teacher, Student). Distinguished by the `role` field. Handles password hashing on save.

### `Tasks.js`
Academic assignments created by teachers. Points to an `assignedTo` (User ObjectId). 

### `Score.js`
Individual test or subject scores. Points to a `studentId`.

### `DashboardStat.js`
A cached, pre-calculated snapshot of the institute's performance (Total tasks, avg scores). Exists to prevent expensive real-time DB aggregations on every page load.

### `Riskscore.js`
Records the algorithmically determined risk level of a student failing.

### `Notification.js`
Stores alerts to be displayed in the frontend dashboard UI for specific students or teachers.

---

**Related:**
- [[Database]]
- [[Controllers/Overview]]
