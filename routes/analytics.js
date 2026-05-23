const express = require("express")
const { getAnalyticsOverview, getAnalyticsStats } = require("../controllers/analytics")

const router = express.Router()

router.get("/", getAnalyticsOverview)
router.get("/ana-stat", getAnalyticsStats)

module.exports = router
