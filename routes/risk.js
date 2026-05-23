const express = require('express');
const router = express.Router();
const {handleCalculatedRisk}=require("../controllers/risk")
const {requireAuth}=require("../middlewares/auth")
const {allowRoles}=require("../middlewares/role")
const {validateObjectId}=require("../middlewares/validate")
router.get("/calculate-risk/:id",requireAuth,allowRoles("teacher","admin"),validateObjectId("id"),handleCalculatedRisk)
module.exports = router;
