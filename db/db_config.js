const sqlite3 = require('sqlite3');

let sqlDb;

// name the columns of our tables for localization
const columnNames = {
  userId: "id",
  userName: "name",
  shortName: "shortName",
  shortCreator: "creator",
  shortURL: "url",
};
Object.freeze(columnNames);

function createDb() {
  console.log("created our db!");
  sqlDb = new sqlite3.Database('shortdb.db', function() {
    createUserTable();
    createShortsTable();
  });
};

function createUserTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS users (
    ${columnNames.userId} INTEGER PRIMARY KEY AUTOINCREMENT,
    ${columnNames.userName} TEXT NOT NULL UNIQUE
  )`);
};

function createShortsTable() {
  sqlDb.run(`CREATE TABLE IF NOT EXISTS shorts (
    ${columnNames.shortName} TEXT PRIMARY KEY,
    ${columnNames.shortURL} TEXT NOT NULL,
    ${columnNames.shortCreator} INTEGER NOT NULL,
    FOREIGN KEY(${columnNames.shortCreator})
    REFERENCES users(${columnNames.userId})
  )`);
};

// Helper wrapper functions that return promises that resolve when sql queries are complete.

function run(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.run(sqlQuery, (err) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve();
      }
    })
  });
};

function get(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.get(sqlQuery, (err, row) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(row);
      }
    })
  });
};

function all(sqlQuery) {
  return new Promise((resolve, reject) => {
    sqlDb.all(sqlQuery, (err, rows) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  });
};

createDb();

module.exports = {
  columnNames,
  get,
  all,
  run,
};