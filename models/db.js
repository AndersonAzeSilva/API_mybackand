const initializeDb = require('../config/dbConfig');

let db;
initializeDb().then(connection => {
  db = connection;
});

function query(sql, params) {
  return db.execute(sql, params);
}

module.exports = { query };
