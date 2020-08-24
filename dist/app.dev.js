"use strict";

var express = require("express");

var path = require("path");

var ejs = require("ejs");

var logger = require("morgan");

var bodyParser = require("body-parser");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var jwtMiddle = require("express-jwt"); // 验证jwt数据


var cors = require("cors"); // 服务器端处理跨域


var _require = require("./utils/config"),
    jwtSecret = _require.jwtSecret;

var _require2 = require("./models"),
    Manager = _require2.Manager,
    Product = _require2.Product;

var app = express(); // 请求日志输出

app.use(logger("dev"));
app.set("view engine", "html"); // 使用ejs模版引擎

app.set("views", path.resolve(__dirname, "views"));
app.engine("html", ejs.renderFile); // parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({
  extended: false,
  limit: "10000kb"
})); // parse application/json

app.use(bodyParser.json({
  limit: "10000kb"
}));
app.all("/api/*", cors());
app.get("/", function (req, res) {
  res.render("index", {
    t: "什么都没有！"
  });
});
app.get("/api/v3/get_data", function (req, res) {
  setTimeout(function () {
    res.send({
      code: 1
    });
  }, 10000);
});
app.use("/", express["static"]("./public"));
app.use("/api/v1/products", require("./api/v1/products"));
app.use("/api/v1/book_categories", require("./api/v1/book_categories"));
app.use("/api/v1/books", require("./api/v1/books"));
app.use("/api/v1/book_chapters", require("./api/v1/book_chapters"));
app.use("/api/v1/product_categories", require("./api/v1/product_categories"));
app.use("/api/v2/proxy", require("./api/v2/proxy")); // 对api使用jwt权限验证

app.use(jwtMiddle({
  secret: jwtSecret
}).unless({
  path: [new RegExp("/api/v1/auth/*"), new RegExp("/api/v1/common/*")]
}));
app.all("/api/v1/admin/*", function _callee(req, res, next) {
  var token, decoded, userId, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          token = req.headers.authorization.split(" ")[1]; // 获取token

          decoded = jwt.verify(token, jwtSecret);
          userId = decoded.userId;
          _context.next = 6;
          return regeneratorRuntime.awrap(Manager.findById(userId));

        case 6:
          user = _context.sent;

          if (user) {
            next();
          } else {
            res.json({
              code: "error",
              message: "管理员账号不存在！"
            });
          }

          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          res.json({
            code: "error",
            message: "管理员账号不存在！"
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); // app.use(jwt({
//   secret: jwtSecret
// }).unless({
//   path: [new RegExp('/api/v1/users/*'), new RegExp('/api/v1/common/*')],
// }));

app.use("/api/v1/common", require("./api/v1/common"));
app.use("/api/v1/admin/products", require("./api/v1/admin/products"));
app.use("/api/v1/admin/users", require("./api/v1/admin/users"));
app.use("/api/v1/admin/product_categories", require("./api/v1/admin/product_categories"));
app.use("/api/v1/admin/addresses", require("./api/v1/admin/addresses"));
app.use("/api/v1/admin/orders", require("./api/v1/admin/orders"));
app.use("/api/v1/auth", require("./api/v1/auth"));
app.use("/api/v1/users", require("./api/v1/users"));
app.use("/api/v1/shop_carts", require("./api/v1/shop_carts"));
app.use("/api/v1/orders", require("./api/v1/orders"));
app.use("/api/v1/addresses", require("./api/v1/addresses")); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err;
  res.locals.error = req.app.get("env") === "development" ? err : {}; // render the error page

  res.status(err.status || 500);
  res.json({
    code: "error",
    info: err
  });
});
var port = process.env.PORT || 3009;
app.listen(port, function () {
  console.log("server is running on port ".concat(port));
});

require("./db"); // 初始化超级管理员


function initManager() {
  var isExist, slat, pwd, admin;
  return regeneratorRuntime.async(function initManager$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Manager.count({
            userName: "admin"
          }));

        case 2:
          isExist = _context2.sent;

          if (!(isExist == 0)) {
            _context2.next = 9;
            break;
          }

          slat = bcrypt.genSaltSync(10);
          pwd = bcrypt.hashSync("admin", slat); // 对密码进行加密

          admin = new Manager({
            userName: "admin",
            password: pwd,
            nickName: "超级管理员",
            roles: "admin,system"
          });
          _context2.next = 9;
          return regeneratorRuntime.awrap(admin.save());

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
} //初始化products表


function initProducts() {
  var products;
  return regeneratorRuntime.async(function initProducts$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          products = ["IPhone 11 苹果11", "华为Mate40 pro", "小米10 Pro 至尊版"];
          _context3.next = 3;
          return regeneratorRuntime.awrap(products.map(function (p) {
            var product = new Product({
              name: p,
              descriptions: p,
              onSale: false,
              content: p,
              quantity: 10,
              price: 4899
            });
            product.save();
          }));

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
}

initManager();
initProducts();