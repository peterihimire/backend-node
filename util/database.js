const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "sell-car",
  "root",
  "Eromosele2121991@",
  { dialect: "mysql", host: "localhost" }
);

module.exports = sequelize;

// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "room-reservation",
//   password: "Eromosele2121991@",
// });
// module.exports = pool.promise();
