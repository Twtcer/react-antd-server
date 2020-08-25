"use strict";

var mongoose = require("mongoose");

var _require = require("./models"),
    Book = _require.Book,
    BookCategory = _require.BookCategory;

mongoose // .connect("mongodb://LandWind:27170/cat-shop", {
.connect("mongodb://localhost:27017/cat-shop", {
  // useNewUrlParser: true,
  // useUnifiedTopology:true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  serverSelectionTimeoutMS: 10000
}).then(function (res) {
  // console.log(res);
  console.log("数据库连接成功");
})["catch"](function (err) {
  console.log(err);
});