const express = require("express");
const router = express.Router();

router.get("/portfolio", (req, res) => {
  res.render("layouts/portfolioPage");
});

module.exports = router;
