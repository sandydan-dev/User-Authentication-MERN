const e = require("express");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const cookieParser = require("cookie-parser");

// db
const { sequelize, connectDB } = require("./config/db");

const userRouter = require("./router/userRouter");

connectDB()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["token"],
  })
);
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Expose-Headers", "token");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
