const express = require('express');

const Shorts = require('../models/Shorts');
const v = require('./validators');

const router = express.Router();

/**
 * Create a short.
 * 
 * @name POST /api/shorts
 * @param {string} name - name of short (link will be /:short)
 * @param {string} url - link short points to
 * @return {Short} - the created short
 * @throws {401} - If an auth user tries to create a short
 * @throws {409} - If auth user tries to create a short that already exists
 * @throws {400} - if name is already taken
 */
router.post(
  '/', 
  [
    v.ensureUserLoggedIn,
    v.ensureValidShortNameInBody,
    v.ensureValidShortUrlInBody
  ],
  async (req, res) => {
  try {
    // middleware will make sure that there is a 
    // valid user logged in, and that the short
    // name and URL and non-empty and valid!
    const loggedInUserId = req.session.uid;
    const shortName = req.body.shortName;
    const shortUrl = req.body.url;
    
    // check that a short with this name does not 
    // already exist in our DB
    let short = await Shorts.findOne(shortName);
    if (short) {
      res.status(409).json({
        error: `Short URL ${shortName} already exists`,
      }).end();
      return; 
    }

    // issue a request to add this short to our DB
    short = await Shorts.addOne(shortName, shortUrl, loggedInUserId);
    res.status(201).json(short).end();

  } catch (error) {
    res.status(503).json({ error: `Could not add the short: ${error}` }).end();
  }
});

/**
 * List all shorts.
 * 
 * @name GET /api/shorts
 * @return {Short[]} - list of shorts
 */
router.get(
  '/', 
  [],
  async (req, res) => {
  try {
    // fetch all the shorts from our DB
    const allShorts = await Shorts.findAll();
    res.status(200).json(allShorts).end();

  } catch (error) {
    res.status(503).json({ error: `Could not fetch all shorts: ${error}` }).end();
  }
});

/**
 * Update a short.
 * 
 * @name PUT /api/shorts/:name
 * :name is the name of the short
 * The ? ensures the we hit this route even when the specified name is empty!
 * @param {string} url - the new URL to point to
 * @return {Short} - the updated short
 * @throws {401} - If an unauth user tries to update a short
 * @throws {403} - If auth user tries to update a short they didn't create
 * @throws {404} - if short does not exist
 */
router.put(
  '/:name?', 
  [
    v.ensureUserLoggedIn,
    v.ensureValidShortNameParam,
    v.ensureValidShortUrlInBody
  ],
  async (req, res) => {
  try {
    // middleware will ensure that a valid user is logged in
    // and will check that the short name and url are non-empty 
    // and valid for us!
    const loggedInUserId = req.session.uid;
    const shortName = req.params.name;
    const shortUrl = req.body.url;

    // ensure that the given short exists in our DB
    const short = await Shorts.findOne(shortName);
    if (!short) {
      res.status(404).json({
        error: `Short with name ${shortName} does not exist`,
      }).end();
      return;
    }

    // ensure that the logged in user is the creator of the short
    if (short.creator !== loggedInUserId) {
      res.status(403).json({
        error: 'You cannot update a short you did not create!'
      }).end();
      return;
    }

    // issue an unpdate request for the short in our DB
    const updatedShort = await Shorts.updateOne(shortName, shortUrl);
    res.status(200).json(updatedShort).end();

  } catch (error) {
    res.status(503).json({ error: `Could not update the short: ${error}` }).end();
  }
});

/**
 * Delete a short.
 * 
 * @name DELETE /api/shorts/:name
 * :name is the name of the short
 * The ? ensures the we hit this route even when the specified name is empty!
 * @return {Short} - the deleted short
 * @throws {401} - if unauth user tries to delete a short
 * @throws {404} - if short does not exist
 */
router.delete(
  '/:name?',
  [
    v.ensureUserLoggedIn,
    v.ensureValidShortNameParam,
  ],
  async (req, res) => {
  try {
    // middleware will ensure that a valid user is logged in
    // and will check that the short name is non-empty and valid for us!
    const loggedInUserId = req.session.uid;
    const shortName = req.params.name;

    // ensure that this short already exists in our database
    const short = await Shorts.findOne(shortName);
    if (!short) {
      res.status(404).json({
        error: `Short with name ${shortName} does not exist`,
      }).end();
      return;
    }

    // ensure that the logged in user is the creator of the short
    if (short.creator !== loggedInUserId) {
      res.status(403).json({
        error: 'You cannot update a short you did not create!'
      }).end();
      return;
    }

    // issue a delete request for this short to our DB
    const deletedShort = await Shorts.deleteOne(shortName);
    res.status(200).json(deletedShort).end();

  } catch (error) {
    res.status(503).json({ error: `Could not delete the short: ${error}` }).end();
  }
});

module.exports = router;
