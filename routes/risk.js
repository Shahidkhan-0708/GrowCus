const express = require('express');
const router = express.Router();
const {handleCalculatedRisk}=require("../controllers/risk")
router.get("/calculate-risk/:id",handleCalculatedRisk)
module.exports = router;