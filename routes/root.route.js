const express = require("express");
const orderRouter = require("./ordersRoute/order.route");
const partsRouter = require("./partsRoute/parts.route");
const reviewRouter = require("./reviewRoute/review.route");
const usersRouter = require("./usersRouter/users.route");
const routes = express.Router();


routes.use("/reviews", reviewRouter);
routes.use("/parts", partsRouter);
routes.use("/users", usersRouter);
routes.use("/orders", orderRouter);


module.exports = routes;
