const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./DB/database.sqlite",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Authenticated successfully.");

    await sequelize.sync();
    console.log("Database synced successfully.");

    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
