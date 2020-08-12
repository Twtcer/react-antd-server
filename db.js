const mongoose = require("mongoose");
const { Book, BookCategory } = require("./models");

mongoose
  // .connect("mongodb://LandWind:27170/cat-shop", {
      .connect("mongodb://localhost:27017/cat-shop", {
    // useNewUrlParser: true,
    // useUnifiedTopology:true,
    useUnifiedTopology: true, 
    useNewUrlParser: true,
     useFindAndModify: false,
     serverSelectionTimeoutMS: 10000
  })
  .then(res => {
    // console.log(res);
    console.log("数据库连接成功");
  })
  .catch(err => {
    console.log(err);
  });
