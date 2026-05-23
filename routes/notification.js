const express = require('express');
const router = express.Router();
const {handleCreateNotification,handleGetNotification,handlemarkAsRead}=require("../controllers/notification")
const {requireAuth}=require("../middlewares/auth")
const {allowRoles}=require("../middlewares/role")
const {requireFields,validateObjectId}=require("../middlewares/validate")
router.post("/create-notify",requireAuth,allowRoles("teacher","admin"),requireFields(["message","type","studentId"]),validateObjectId("studentId","body"),handleCreateNotification)
router.get("/get-notifications",requireAuth,handleGetNotification)
router.put("/update-read/:id",requireAuth,validateObjectId("id"),handlemarkAsRead);
module.exports = router;
