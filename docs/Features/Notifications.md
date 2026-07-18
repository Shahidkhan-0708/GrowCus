# Feature: Notifications

The Notification system alerts users (primarily students) about important events in their academic lifecycle.

## Business Logic

Notifications in Growcus are currently database-driven (persisted in MongoDB) rather than ephemeral push notifications. 

### Lifecycle
1. **Creation**: An event occurs (e.g., a teacher creates a new task). The controller logic creates a `Notification` document tied to the `studentId`.
2. **Types**: Notifications have a `type` (`info`, `success`, `warning`, `error`) to dictate how the frontend renders them (e.g., red for error, green for success).
3. **Consumption**: The frontend periodically fetches or loads notifications on dashboard mount. 
4. *(Future)*: WebSockets (Socket.io) could be implemented to push these to the client in real-time without polling.

## Code References

- **Routes**: `routes/notification.js`
- **Controller**: `controllers/notification.js`
- **Models**: `models/Notification.js`

---

**Related:**
- [[Database#Notification Model]]
