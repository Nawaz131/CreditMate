const express = require("express");

const customerRouter = require("./customer.router");
const userRouter = require("./user.router");
const transaction = require("./transaction.router");
const transactionRouter = require("./transaction.router");

const mainRouter = express.Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/customer", customerRouter);
mainRouter.use("/transaction", transactionRouter);

module.exports = mainRouter;