const express = require("express");
const router = express.Router();

router.get("/about", (req, res) => {
  res.render("layouts/aboutPage");
});

module.exports = router;
