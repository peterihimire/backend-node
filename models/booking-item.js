const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const BookingItem = sequelize.define("bookingItem", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  // quantity: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  // },
});

module.exports = BookingItem;
