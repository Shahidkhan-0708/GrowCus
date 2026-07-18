const express = require("express")
const { createReport } = require("../controllers/report")
const { validate, validateObjectId } = require("../middlewares/validate")
const { createReportSchema } = require("../middlewares/schemas")

const router = express.Router()

router.post("/report", validate(createReportSchema), validateObjectId("instituteId", "body"), createReport)

module.exports = router
