// require dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const busboy = require("connect-busboy");
const busboyBodyParser = require("busboy-body-parser");

// use a .env file to hide environmental variables
require("dotenv").config();

const app = express();
app.use(busboy());

// set localhost port
let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.use(cors());
app.use(express.json());
app.use(busboyBodyParser());

// use mongoose to connect to MongoDB and alert the terminal when
// connection is made successfully
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  //console.log("MongoDB database connection established successfully");
});

// define api routes (partitioned by file)
const filesRouter = require("./routes/files");
const menuItemsRouter = require("./routes/menuItems");
const restaurantsRouter = require("./routes/restaurants");
const ordersRouter = require("./routes/orders");
const userRouter = require("./routes/users");
const creditCardRouter = require("./routes/creditCards");

app.use("/api/files", filesRouter);
app.use("/api/menuItems", menuItemsRouter);
app.use("/api/restaurants", restaurantsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", userRouter);
app.use("/api/creditCards", creditCardRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port);

module.exports = app;
