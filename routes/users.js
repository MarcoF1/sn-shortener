const express = require("express");

const Users = require("../models/Users");
const v = require("./validators");

const router = express.Router();

/**
 * Get all users.
 *
 * @name GET /api/users
 */
router.get("/", [], async (req, res) => {
  try {
    // fetch all user from the DB
    let users = await Users.findAll();
    let filteredUsers = users.map((user) => user.name);

    res.status(200).json(filteredUsers).end();
  } catch (error) {
    res.status(503).json({ error: "Could not fetch users" }).end();
  }
});

/**
 * Create new user.
 *
 * @name POST /api/users
 */
router.post(
  "/",
  [v.ensureValidUsernameInBody, v.ensureValidPasswordInBody],
  async (req, res) => {
    try {
      // middleware will ensure that this statement below is nonempty!
      const username = req.body.username;
      const password = req.body.password;

      // issue a call to the DB to create a new user with the given username
      let user = await Users.addOne(username, password);
      res
        .status(201)
        .json({ user, message: "Please sign in to continue." })
        .end();
    } catch (error) {
      res
        .status(400)
        .json({ error: "Username must be unique and non-empty" })
        .end();
    }
  }
);

module.exports = router;
