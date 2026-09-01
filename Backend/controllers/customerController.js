const Customer = require("../models/customerModel");
const Transaction = require("../models/transactionModel");

const createCustomer = async (req, res) => {
    try {
        const { name, phone, address } = req.body;

        if (!name || !phone) {
            return res.status(400).json({
                message: "name and phone are required",
            });
        }

        const customer = await Customer.create({
            shopkeeperId: req.user.id,
            name,
            phone,
            address,
        });

        return res.status(201).json({
            message: "Customer created successfully",
            data: customer,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error creating customer",
            error: error.message,
        });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        const shopkeeperId = req.user.id;

        const customers = await Customer.find({
            shopkeeperId,
        });


        return res.status(200).json({
            message: "Customer fetched successfully",
            data: customers,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address } = req.body;

        const updatedCustomer = await Customer.findOneAndUpdate(
            {
                _id: id,
                shopkeeperId: req.user.id,
            },
            {
                name,
                phone,
                address,
            },
            {
                new: true,
            }
        );

        if (!updatedCustomer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }

        return res.status(200).json({
            message: "Customer updated successfully",
            data: updatedCustomer,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const transactions = await Transaction.find({
            customerId: id,
            shopkeeperId: req.user.id,
        });

        if (transactions.length > 0) {
            return res.status(400).json({
                message: "Cannot delete customer because transactions exist",
            });
        }

        const deletedCustomer = await Customer.findOneAndDelete({
            _id: id,
            shopkeeperId: req.user.id,
        });

        if (!deletedCustomer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }

        return res.status(200).json({
            message: "Customer deleted successfully",
            data: deletedCustomer,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer,
};