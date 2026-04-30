const express = require('express');
const router = express.Router();
const {handleCreateNotification,handleGetNotification,handlemarkAsRead}=require("../controllers/notification")
const {verifyToken}=require("../middlewares/auth")
router.post("/create-notify",verifyToken,handleCreateNotification)
router.get("/get-notifications",verifyToken,handleGetNotification)
router.put("/update-read/:id",verifyToken,handlemarkAsRead);
module.exports = router;