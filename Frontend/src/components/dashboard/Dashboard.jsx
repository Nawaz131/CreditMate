import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../authContext";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout, token } = useAuth();

    const [customers, setCustomers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const getCustomers = async () => {
        try {
            const response = await axios.get(
                "https://credit-mate.onrender.com/api/customer/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            setCustomers(response.data.data || []);
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    const getTransactions = async () => {
        try {
            const response = await axios.get(
                "https://creditmate-backend.onrender.com/api/transaction/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setTransactions(response.data.data);
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        if (token) {
            getCustomers();
            getTransactions();
        }
    }, [token]);

    const totalCredit = transactions
        .filter(
            (transaction) =>
                transaction.type === "CREDIT"
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

    const totalDebit = transactions
        .filter(
            (transaction) =>
                transaction.type === "DEBIT"
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

    const balance = totalCredit - totalDebit;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>Welcome to CreditMate</h1>
                    <p>Manage your customers and transactions</p>
                </div>

                
            </div>

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <div className="card-icon">👥</div>
                    <h3>Total Customers</h3>
                    <h2>{customers.length}</h2>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon">💰</div>
                    <h3>Total Transactions</h3>
                    <h2>{transactions.length}</h2>
                </div>

                <div className="dashboard-card credit-card">
                    <div className="card-icon">🟢</div>
                    <h3>Total Credit</h3>
                    <h2>₹{totalCredit}</h2>
                </div>

                <div className="dashboard-card debit-card">
                    <div className="card-icon">🔴</div>
                    <h3>Total Debit</h3>
                    <h2>₹{totalDebit}</h2>
                </div>

                <div className="dashboard-card balance-card">
                    <div className="card-icon">💵</div>
                    <h3>Current Balance</h3>
                    <h2>₹{balance}</h2>
                </div>

            </div>

            <div className="dashboard-actions">

                <button
                    className="action-btn"
                    onClick={() => navigate("/customers")}
                >
                    👥 Customers
                </button>

                <button
                    className="action-btn"
                    onClick={() => navigate("/transaction")}
                >
                    💰 Transactions
                </button>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
};

export default Dashboard;