const clearDb = 'NO';
const { clear } = require("console");
// config/db.js
const pouchDB = require("pouchdb");
pouchDB.plugin(require('pouchdb-find'));

// Create a new database instance
const db = new pouchDB("exercises");
db.createIndex({
  index: {fields: ['name']}
});

if (clearDb == 'YES') {
    db.destroy().then(function (response) {
        console.log("Database Destroyed");
      }).catch(function (err) {
        console.log(err);
      });
};

// Export the database instance
module.exports = db;