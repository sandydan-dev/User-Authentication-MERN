const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: String,
    enum: ["user", "admin", "employee"],
    default: "user",
  },
});

module.exports = User;
