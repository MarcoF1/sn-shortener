const db = require('../db/db_config');

/**
 * @typeof Short
 * 
 * @prop {string} name - some string, valid in a URL path
 * @prop {string} url - link to an external source
 * @prop {number} creatorID - id associated with creator
 */

/**
 * @class Shorts
 * 
 * Stores all Shorts.
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Shorts {
  /**
   * Add a Short.
   * 
   * @param {string} shortName - Short name
   * @param {string} url - Short url
   * @param {number} creatorID - Short creator id
   * @return {Short} - created short
   */
  static async addOne(shortName, url, creatorID) {
    // first insert the short into the DB and wait for completion
    // and then fetch the new short from the DB
    return db.run(`INSERT INTO shorts VALUES ('${shortName}', '${url}', ${creatorID})`)
              .then(() => {
                return Shorts.findOne(shortName);
              });
  }

  /**
   * Find a Short by Name.
   * 
   * @param {string} shortName - name of Short to find
   * @return {Short | undefined} - found Short
   */
  static async findOne(shortName) {
    return db.get(`SELECT * FROM shorts WHERE ${db.columnNames.shortName} = '${shortName}'`);
  }

  /**
   * Return an array of all of the Shorts.
   * 
   * @return {Short[]}
   */
  static async findAll() {
    return db.all(`SELECT * FROM shorts`);
  }

  /**
   * Update a Short.
   * 
   * @param {string} shortName - name of Short to update
   * @param {string} url - new URL
   * @return {Short | undefined} - updated Short
   */
  static async updateOne(shortName, url) {
    // first update the short and wait for completion
    // then fetch the updated short
    return db.run(`UPDATE shorts 
        SET ${db.columnNames.shortURL} = '${url}' 
        WHERE ${db.columnNames.shortName} = '${shortName}'`)
        .then( () => {
          return Shorts.findOne(shortName);
        });
  }

  /**
   * Delete a Short.
   * 
   * @param {string} shortName - name of Short to delete
   * @return {Short | undefined} - deleted Short
   */
  static async deleteOne(shortName) {
    // first fetch the short from the DB
    // and then delete it form the DB, waiting for completion
    return Shorts.findOne(shortName)
          .then( (short) => {
            db.run(`DELETE FROM shorts WHERE ${db.columnNames.shortName} = '${shortName}'`);
            return short;
          });
  }
}

module.exports = Shorts;
