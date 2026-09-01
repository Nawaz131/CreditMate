const express = require("express");
const customerRouter = express.Router();

const {
  createCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");

customerRouter.post("/create", authMiddleware, createCustomer);
customerRouter.get("/all", authMiddleware, getAllCustomers);
customerRouter.put("/update/:id", authMiddleware, updateCustomer);
customerRouter.delete("/delete/:id", authMiddleware, deleteCustomer);

module.exports = customerRouter;
