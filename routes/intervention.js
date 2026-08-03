const express = require('express');
const router = express.Router();
const {
   handleCreateIntervention,
   handleGetInterventions,
   handleGetInterventionsByStudent,
   handleUpdateInterventionStatus,
   handleDeleteIntervention
} = require("../controllers/intervention")
const { requireAuth } = require("../middlewares/auth")
const { allowRoles } = require("../middlewares/role")

router.post("/create", requireAuth, allowRoles("teacher", "admin"), handleCreateIntervention)
router.get("/list", requireAuth, handleGetInterventions)
router.get("/student/:studentId", requireAuth, allowRoles("teacher", "admin"), handleGetInterventionsByStudent)
router.put("/update-status/:id", requireAuth, allowRoles("teacher", "admin"), handleUpdateInterventionStatus)
router.delete("/delete/:id", requireAuth, allowRoles("teacher", "admin"), handleDeleteIntervention)

module.exports = router;