const express = require("express");

const transactionRouter = express.Router();

const {
    createTransaction,
    getAllTransactions,
    getCustomerTransactions,
    getCustomerBalance,
    updateTransaction,
    deleteTransaction,
    sendCustomerReminder,
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");


transactionRouter.post("/create", authMiddleware, createTransaction);

transactionRouter.get("/all", authMiddleware, getAllTransactions);

transactionRouter.get("/customer/:customerId", authMiddleware, getCustomerTransactions);

transactionRouter.get("/customer/:customerId/balance",authMiddleware, getCustomerBalance);

transactionRouter.put("/update/:transactionId", authMiddleware, updateTransaction);

transactionRouter.delete("/delete/:transactionId", authMiddleware, deleteTransaction);

transactionRouter.post("/customer/:customerId/send-reminder", authMiddleware, sendCustomerReminder);



module.exports = transactionRouter;