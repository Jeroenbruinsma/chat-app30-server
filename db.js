const Sequelize = require("sequelize");

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:secret@localhost:5432/postgres";

const db = new Sequelize(databaseUrl);

db.sync({ force: false })
  .then(() => console.log("database synced"))
  .catch(error => console.log("got an error", error));

module.exports = db;
