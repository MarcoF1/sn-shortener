const { Pool } = require("pg");

production = false;

// Connect to the db using a pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: production ? { rejectUnauthorized: false } : false,
  database: "shortdb",
});

// name the columns of our tables for localization
const columnNames = {
  userId: "id",
  userName: "name",
  userPassword: "password",
  shortName: "shortName",
  shortCreator: "creator",
  shortURL: "url",
};
Object.freeze(columnNames);

async function createDb() {
  // create user and shorts tables
  await createUserTable();
  await createShortsTable();
  // create super user
  await createSuperUser();
  console.log("created our db!");
}

async function createUserTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    ${columnNames.userId} SERIAL UNIQUE,
    ${columnNames.userName} TEXT NOT NULL UNIQUE,
    ${columnNames.userPassword} TEXT NOT NULL
    )`);
}

async function createShortsTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS shorts (
    ${columnNames.shortName} TEXT PRIMARY KEY,
    ${columnNames.shortURL} TEXT NOT NULL,
    ${columnNames.shortCreator} INTEGER NOT NULL,
    FOREIGN KEY(${columnNames.shortCreator})
    REFERENCES users(${columnNames.userId})
  )`);
}

async function createSuperUser() {
  // create super user if doesn't exist
  let currentUsers = await get("SELECT * FROM users");

  if (!currentUsers) {
    console.log("adding super user");
    run(
      `INSERT INTO users (${columnNames.userName}, ${columnNames.userPassword}) VALUES ('admin', 'marvincute')`
    );
  } else {
    console.log("super user already exists");
  }
}

// Helper wrapper functions that return promises that resolve when sql queries are complete.

function run(sqlQuery) {
  return new Promise((resolve, reject) => {
    pool.query(sqlQuery, (err) => {
      if (err !== undefined) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function get(sqlQuery) {
  return new Promise((resolve, reject) => {
    pool.query(sqlQuery, (err, result) => {
      if (err !== undefined) {
        reject(err);
      } else {
        const results = { results: result ? result.rows[0] : null };
        resolve(results.results);
      }
    });
  });
}

function all(sqlQuery) {
  return new Promise((resolve, reject) => {
    pool.query(sqlQuery, (err, result) => {
      if (err !== undefined) {
        reject(err);
      } else {
        const results = { results: result ? result.rows : null };
        resolve(results.results);
      }
    });
  });
}

createDb();

module.exports = {
  columnNames,
  get,
  all,
  run,
};
