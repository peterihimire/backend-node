const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Booking = sequelize.define("booking", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Booking;
