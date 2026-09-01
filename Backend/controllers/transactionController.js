const Transaction = require("../models/transactionModel");
const Customer = require("../models/customerModel");
const sendSMS = require("../services/sendSMS");

const createTransaction = async (req, res) => {
    try {
        const { customerId, type, amount, description } = req.body;

        if (!customerId || !type || amount === undefined) {
            return res.status(400).json({
                message: "customerId, type and amount are required",
            });
        }

        if (!["CREDIT", "DEBIT"].includes(type)) {
            return res.status(400).json({
                message: "Type must be CREDIT or DEBIT",
            });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0",
            });
        }

        const customer = await Customer.findOne({
            _id: customerId,
            shopkeeperId: req.user.id,
        });

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }

        const transaction = await Transaction.create({
            customerId,
            shopkeeperId: req.user.id,
            type,
            amount: Number(amount),
            description,
        });

        return res.status(201).json({
            message: "Transaction created successfully",
            data: transaction,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            shopkeeperId: req.user.id,
        }).populate("customerId");

        return res.status(200).json({
            message: "Transactions fetched successfully",
            data: transactions,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getCustomerTransactions = async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await Customer.findOne({
            _id: customerId,
            shopkeeperId: req.user.id,
        });

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }

        const transactions = await Transaction.find({
            customerId,
            shopkeeperId: req.user.id,
        });

        return res.status(200).json({
            message: "Customer transactions fetched successfully",
            data: transactions,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getCustomerBalance = async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await Customer.findOne({
            _id: customerId,
            shopkeeperId: req.user.id,
        });

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }

        const transactions = await Transaction.find({
            customerId,
            shopkeeperId: req.user.id,
        });

        let totalCredit = 0;
        let totalDebit = 0;

        transactions.forEach((transaction) => {
            if (transaction.type === "CREDIT") {
                totalCredit += Number(transaction.amount);
            }

            if (transaction.type === "DEBIT") {
                totalDebit += Number(transaction.amount);
            }
        });

        const balance = totalCredit - totalDebit;

        return res.status(200).json({
            message: "Customer balance fetched successfully",
            data: {
                customerId,
                totalCredit,
                totalDebit,
                balance,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { type, amount, description } = req.body;

        const transaction = await Transaction.findOne({
            _id: transactionId,
            shopkeeperId: req.user.id,
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }

        if (type !== undefined) {
            if (!["CREDIT", "DEBIT"].includes(type)) {
                return res.status(400).json({
                    message: "Type must be CREDIT or DEBIT",
                });
            }

            transaction.type = type;
        }

        if (amount !== undefined) {
            if (Number(amount) <= 0) {
                return res.status(400).json({
                    message: "Amount must be greater than 0",
                });
            }

            transaction.amount = Number(amount);
        }

        if (description !== undefined) {
            transaction.description = description;
        }

        await transaction.save();

        return res.status(200).json({
            message: "Transaction updated successfully",
            data: transaction,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params;

        const transaction = await Transaction.findOneAndDelete({
            _id: transactionId,
            shopkeeperId: req.user.id,
        });

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found",
            });
        }

        return res.status(200).json({
            message: "Transaction deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const sendCustomerReminder = async (req, res) => {
    try {
        const { customerId } = req.params;

        // Find customer
        const customer = await Customer.findOne({
            _id: customerId,
            shopkeeperId: req.user.id,
        });

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }

        // Get customer transactions
        const transactions = await Transaction.find({
            customerId,
            shopkeeperId: req.user.id,
        });

        let totalCredit = 0;
        let totalDebit = 0;

        transactions.forEach((transaction) => {
            if (transaction.type === "CREDIT") {
                totalCredit += Number(transaction.amount);
            }

            if (transaction.type === "DEBIT") {
                totalDebit += Number(transaction.amount);
            }
        });

        // Calculate balance
        const balance = totalCredit - totalDebit;

        // Check pending balance
        if (balance <= 0) {
            return res.status(400).json({
                message: "Customer has no pending balance",
            });
        }

        // Create SMS message
        const message = `Hello ${customer.name}, your remaining balance is ₹${balance}`;

        // Send SMS through TextBee
        await sendSMS(
            customer.phone,
            message
        );

        // Success response
        return res.status(200).json({
            message: `Reminder sent successfully to ${customer.name}`,
            data: {
                customer: customer.name,
                phone: customer.phone,
                balance,
                sms: message,
            },
        });

    } catch (error) {
        console.error("SMS Reminder Error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getCustomerTransactions,
    getCustomerBalance,
    updateTransaction,
    deleteTransaction,
    sendCustomerReminder,
};