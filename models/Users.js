const db = require('../db/db_config');

/**
 * @typeof User
 * 
 * @prop {string} name - name of the user
 * @prop {number} id - id of the user
 */

/**
 * @class Users
 * 
 * Stores all Users.
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Users {
  /**
   * Add a User.
   * 
   * @param {string} name - User name
   * @return {User} - created user
   */
  static async addOne(name) {
    // first insert the user into the db then fetch the user from the DB
    return db.run(`INSERT INTO users (${db.columnNames.userName}) VALUES ('${name}')`)
              .then(() => Users.findOne(name));
  }

  /**
   * Find a User by Name.
   * @param {string} name - name of User to find
   * @return {User | undefined} - found User
   */
  static async findOne(name) {
    return db.get(`SELECT * FROM users WHERE ${db.columnNames.userName} = '${name}'`);
  }

  /**
   * Return an array of all of the Users.
   * @return {User[]}
   */
  static async findAll() {
    return db.all(`SELECT * FROM users`);
  }
}

module.exports = Users;
