# Feature: Task Management

Task Management is the core engagement loop for students inside Growcus.

## Business Logic

Teachers assign Tasks to students. Each task carries an `xp` (Experience Points) value. 

### Task Lifecycle
1. **Creation**: A teacher (or admin) creates a task assigned to a specific student's `ObjectId`. Default status is `pending`.
2. **Execution**: The student sees the task on their frontend dashboard.
3. **Completion**: When the student completes the task, the frontend sends a `PATCH /api/tasks/:id/status` request with `status: "completed"`.
4. **Reward**: The backend controller updates the task. If it was marked completed, it finds the associated `User` (student) and increments their total XP/Tasks Completed metrics.

## Code References

- **Routes**: `routes/task.js`
- **Controller**: `controllers/task.js` (`createTask`, `updateTaskStatus`, `deleteTask`)
- **Model**: `models/Tasks.js`
- **Validation**: `createTaskSchema`, `updateTaskStatusSchema` (in `middlewares/schemas.js`)

## Known Limitations

- **Transactions**: Updating the Task status and incrementing the User's XP currently happen in two separate Mongoose queries. If the server crashes between these two queries, the database becomes inconsistent (Task completed, but XP not awarded). A MongoDB Session Transaction should be implemented here for production safety.

---

**Related:**
- [[Database#Tasks Model]]
- [[API#Task Management]]
