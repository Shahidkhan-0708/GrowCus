const express = require("express")
const { createReport } = require("../controllers/report")
const { requireFields, validateObjectId } = require("../middlewares/validate")

const router = express.Router()

router.post("/report", requireFields(["instituteId", "generatedBy", "types", "data"]), validateObjectId("instituteId", "body"), createReport)

module.exports = router
