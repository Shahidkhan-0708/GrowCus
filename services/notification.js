const Notification = require("../models/Notification")

/**
 * Create a new notification document.
 * @param {{ message: string, type: string, studentId: string, userId: string }} data
 * @returns {Promise<object>} The created notification
 */
async function createNotification({ message, type, studentId, userId }) {
   return Notification.create({ message, type, studentId, userId })
}

/**
 * Fetch notifications for a user, sorted newest-first.
 * Students see notifications addressed to them; teachers/admins see ones they sent.
 * @param {{ userId: string, role: string }} user
 * @returns {Promise<object[]>} Formatted notification list
 */
async function getNotificationsForUser(user) {
   const query = user.role === "student"
      ? { studentId: user.userId }
      : { userId: user.userId }

   const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .lean()

   return notifications.map((n) => ({
      id: String(n._id),
      type: n.type,
      title: n.type.charAt(0).toUpperCase() + n.type.slice(1),
      message: n.message,
      timestamp: n.createdAt,
      isRead: n.isRead
   }))
}

/**
 * Mark a single notification as read.
 * Only the target student should call this.
 * @param {string} notificationId
 * @param {string} studentId
 * @returns {Promise<object|null>} Updated notification or null if not found
 */
async function markNotificationAsRead(notificationId, studentId) {
   return Notification.findOneAndUpdate(
      { _id: notificationId, studentId },
      { isRead: true },
      { returnDocument: "after" }
   )
}

module.exports = {
   createNotification,
   getNotificationsForUser,
   markNotificationAsRead
}
