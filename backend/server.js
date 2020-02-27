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
const reviewRouter = require("./routes/reviews");
const userRouter = require('./routes/users');

app.use("/menuItems", menuItemsRouter);
app.use("/restaurants", restaurantsRouter);
app.use("/orders", ordersRouter);
app.use("/apiKeys", apiKeysRouter);
app.use("/reviews", reviewRouter);
app.use('/users', userRouter);


/////////////////////////////////////////////////////////////////////////
// Use multer for uploading images.
// Read: https://medium.com/@alvenw/how-to-store-images-to-mongodb-with-node-js-fb3905c37e6d
//
//app.post(‘/api/photo’,function(req,res){
// var newItem = new Item();
// newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
// newItem.img.contentType = ‘image/png’;
// newItem.save();
//});
//
//app.use(multer({ dest: ‘./uploads/’,
// rename: function (fieldname, filename) {
//   return filename;
// },
//}));
//
/////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
