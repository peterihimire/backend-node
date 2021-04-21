// const Sequelize = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   { dialect: "mysql", host: process.env.DB_HOST }
// );

// module.exports = sequelize;

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
// "DB_USER": "root",
// "DB_PASSWORD": "Eromosele2121991@",
// "DB_NAME": "sell-car",
// "DB_HOST": "localhost",
// "DB_DIALECT": "mysql",
// "JWT_KEY": "this_is_my_secretekey_123"