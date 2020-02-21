const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const menuItemsRouter = require("./routes/menuItems");
const restaurantsRouter = require("./routes/restaurants");
const ordersRouter = require("./routes/orders");
const apiKeysRouter = require("./routes/apiKeys");

app.use("/menuItems", menuItemsRouter);
app.use("/restaurants", restaurantsRouter);
app.use("/orders", ordersRouter);
app.use("/apiKeys", apiKeysRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
