const express = require('express');
const router = express.Router();
const {handleCreateNotification,handleGetNotification,handlemarkAsRead}=require("../controllers/notification")
const {requireAuth}=require("../middlewares/auth")
const {allowRoles}=require("../middlewares/role")
const { validate, validateObjectId } = require("../middlewares/validate");
const { createNotificationSchema } = require("../middlewares/schemas");
router.post("/create-notify", requireAuth, allowRoles("teacher","admin"), validate(createNotificationSchema), validateObjectId("studentId","body"), handleCreateNotification)
router.get("/get-notifications",requireAuth,handleGetNotification)
router.put("/update-read/:id",requireAuth,validateObjectId("id"),handlemarkAsRead);
module.exports = router;
