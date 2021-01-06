var express = require("express");
var router = express.Router();

/* GET Manager page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Sigma Nu URL Shortner" });
});

module.exports = router;
