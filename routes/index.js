const express = require("express");

const Shorts = require("../models/Shorts");
const v = require("./validators");

const router = express.Router();

/**
 * Serves homepage.
 * @name GET /
 */
router.get("/", [], async (req, res) => {
  res.redirect("https://sigmanu.mit.edu");
});

router.get("/.well-known/acme-challenge/:content", function (req, res) {
  res.send("xxxxxxxxxxxx-yyyy.zzzzzzzzzzzzzzzzzzz").end();
});

/**
 * Access short URL.
 *
 * Note that the ? after shortName makes the shotName param
 * accessible from within this route **even when it is empty**
 * which makes sure that do hit this route
 *
 * @name GET /:name
 */
router.get("/:name?", [v.ensureValidShortNameParam], async (req, res, next) => {
  try {
    // middleware will check that the param is non-empty!
    const shortName = req.params.name;

    // fetch short from DB and ensure it exists
    const short = await Shorts.findOne(shortName);

    if (!short) {
      // res
      //   .status(404)
      //   .json({
      //     error: `Short URL ${shortName} not found.`,
      //   })
      //   .end();
      res.render("error", { name: shortName });
    }

    // if the destination URL of the short is specified,
    // then navigate to it by redirecting
    if (short.url) {
      res.redirect(short.url).end();
    } else {
      next();
    }
  } catch (error) {
    // res
    //   .status(503)
    //   .json({ error: "Could not navigate to desination URL of this short" })
    //   .end();
    res.render("error", { name: req.params.name }).end();
  }
});

module.exports = router;
