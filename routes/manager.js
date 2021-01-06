var express = require("express");
var router = express.Router();

const v = require("./validators");
const Shorts = require("../models/Shorts");

/* GET Manager page. */
router.get("/", async function (req, res, next) {
  if (req.session.uid) {
    const allShorts = await Shorts.findAll();
    let allShortsList = [];
    allShorts.forEach((short) => {
      allShortsList.push(short.shortName);
    });
    res.render("index", { shorts: allShorts });
  } else {
    res.render("signIn");
  }
});

module.exports = router;
