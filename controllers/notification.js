const Notification = require("../models/Notification")
const { asyncHandler, AppError, sendSuccess } = require("../utils/api")

const handleCreateNotification = asyncHandler(async (req, res) => {
   const { message, type, studentId } = req.body

   const notification = await Notification.create({
      message,
      type,
      studentId,
      userId: req.user.userId
   })

   return sendSuccess(res, { notification }, "Notification created", 201)
})

const handleGetNotification = asyncHandler(async (req, res) => {
   const query = req.user.role === "student"
      ? { studentId: req.user.userId }
      : { userId: req.user.userId }

   const notifications = await Notification.find(query).sort({ createdAt: -1 })

   return sendSuccess(res, { notifications }, "Notifications fetched")
})

const handlemarkAsRead = asyncHandler(async (req, res) => {
   if (req.user.role !== "student") {
      throw new AppError("Only students can mark notifications as read", 403)
   }

   const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, studentId: req.user.userId },
      { isRead: true },
      { returnDocument: "after" }
   )

   if (!notification) {
      throw new AppError("Notification not found", 404)
   }

   return sendSuccess(res, { notification }, "Notification marked as read")
})

module.exports = {
   handleCreateNotification,
   handleGetNotification,
   handlemarkAsRead
}
