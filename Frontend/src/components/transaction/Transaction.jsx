import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import "./Transaction.css";

const Transaction = () => {
  const { token } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("CREDIT");
  const [description, setDescription] = useState("");
  const [customerId, setCustomerId] = useState("");

  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [editId, setEditId] = useState(null);

  const [customerBalances, setCustomerBalances] = useState({});

  const [message, setMessage] = useState("");

  const getCustomers = async () => {
    try {
      const response = await axios.get(
        "https://credit-mate.onrender.com/api/customer/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Customers:", response.data);
      setCustomers(response.data.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const getTransactions = async () => {
    try {
      const response = await axios.get(
        "https://credit-mate.onrender.com/api/transaction/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Transactions:", response.data);
      setTransactions(response.data.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getCustomers();
      getTransactions();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!customerId) {
      setMessage("Please select a customer");
      return;
    }

    if (!amount) {
      setMessage("Please enter an amount");
      return;
    }

    if (Number(amount) <= 0) {
      setMessage("Amount must be greater than 0");
      return;
    }

    if (!type) {
      setMessage("Please select transaction type");
      return;
    }

    try {
      if (editId) {
        const response = await axios.put(
          `https://credit-mate.onrender.com/api/transaction/update/${editId}`,
          {
            type,
            amount,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("Transaction updated successfully");
        console.log(response.data);
        setEditId(null);
      } else {
        const response = await axios.post(
          "https://credit-mate.onrender.com/api/transaction/create",
          {
            customerId,
            amount,
            type,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("Transaction created successfully");
        console.log(response.data);
      }

      setCustomerId("");
      setAmount("");
      setType("CREDIT");
      setDescription("");
      setShowForm(false);

      await getTransactions();
    } catch (error) {
      console.log(error.response?.data || error.message);

      setMessage(error.response?.data?.message || "Transaction failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`https://credit-mate.onrender.com/api/transaction/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Transaction deleted successfully");

      await getTransactions();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (transaction) => {
    setEditId(transaction._id);
    setAmount(transaction.amount);
    setType(transaction.type);
    setDescription(transaction.description || "");
    setCustomerId(transaction.customerId?._id || "");
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditId(null);
    setCustomerId("");
    setAmount("");
    setType("CREDIT");
    setDescription("");
    setShowForm(false);
  };

  const getCustomerBalance = async (customerId) => {
    try {
      const response = await axios.get(
        `https://credit-mate.onrender.com/api/transaction/customer/${customerId}/balance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Customer Balance:", response.data);

      setCustomerBalances((previous) => ({
        ...previous,
        [customerId]: response.data.data,
      }));
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(error.response?.data?.message || "Unable to get customer balance");
    }
  };

  const handleSendReminder = async (customerId) => {
    try {
      const response = await axios.post(
        `https://credit-mate.onrender.com/api/transaction/customer/${customerId}/send-reminder`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(response.data.message);
      console.log(response.data);
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(error.response?.data?.message || "Failed to send reminder");
    }
  };

  const groupedCustomers = {};

  transactions.forEach((transaction) => {
    const customer = transaction.customerId;

    if (!customer || !customer._id) {
      return;
    }

    const id = customer._id;

    if (!groupedCustomers[id]) {
      groupedCustomers[id] = {
        customerId: id,
        customerName: customer.name,
        customerPhone: customer.phone,
        transactions: [],
      };
    }

    groupedCustomers[id].transactions.push(transaction);
  });

  const customerList = Object.values(groupedCustomers);

  return (
    <div className="transaction-page">
      <h1 className="transaction-title">Transactions</h1>

      {message && (
        <p className="transaction-message">
          <strong>{message}</strong>
        </p>
      )}

      <button
        className="add-transaction-btn"
        onClick={() => {
          if (showForm) {
            handleCancel();
          } else {
            setShowForm(true);
          }
        }}
      >
        {showForm ? "Close" : "Add Transaction"}
      </button>

      {showForm && (
        <form className="transaction-form" onSubmit={handleSubmit}>
          <select
            className="transaction-input"
            value={customerId}
            onChange={(e) => {
              setCustomerId(e.target.value);
              setMessage("");
            }}
            disabled={editId !== null}
          >
            <option value="">Select Customer</option>

            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name} - {customer.phone}
              </option>
            ))}
          </select>

          <input
            className="transaction-input"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setMessage("");
            }}
          />

          <select
            className="transaction-input"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setMessage("");
            }}
          >
            <option value="CREDIT">Credit</option>

            <option value="DEBIT">Debit</option>
          </select>

          <input
            className="transaction-input"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="transaction-form-buttons">
            <button className="save-transaction-btn" type="submit">
              {editId ? "Update Transaction" : "Save Transaction"}
            </button>

            {editId && (
              <button
                className="cancel-transaction-btn"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <h2 className="transaction-list-title">Customer List</h2>

      {customerList.length === 0 ? (
        <p className="no-transactions">No transactions found.</p>
      ) : (
        <div className="transaction-list">
          {customerList.map((customer) => {
            const balance = customerBalances[customer.customerId];

            const latestTransaction =
              customer.transactions[customer.transactions.length - 1];

            return (
              <div className="transaction-card" key={customer.customerId}>
                <div className="transaction-info">
                  <p>
                    <strong>Customer:</strong> {customer.customerName}
                  </p>

                  <p>
                    <strong>Phone:</strong> {customer.customerPhone}
                  </p>
                </div>

                <div className="customer-transactions">
                  <h3>Transaction Details</h3>

                  {customer.transactions.map((transaction) => (
                    <div className="single-transaction" key={transaction._id}>
                      <p>
                        <strong>Type:</strong>{" "}
                        <span
                          className={
                            transaction.type === "CREDIT"
                              ? "credit-indicator"
                              : "debit-indicator"
                          }
                        >
                          {transaction.type === "CREDIT"
                            ? "🟢 CREDIT"
                            : "🔴 DEBIT"}
                        </span>
                      </p>

                      <p>
                        <strong>Amount:</strong>{" "}
                        <span
                          className={
                            transaction.type === "CREDIT"
                              ? "credit-amount"
                              : "debit-amount"
                          }
                        >
                          ₹{transaction.amount}
                        </span>
                      </p>

                      <p>
                        <strong>Description:</strong>{" "}
                        {transaction.description || "No description"}
                      </p>
                    </div>
                  ))}
                </div>

                {balance && (
                  <div className="customer-balance-summary">
                    <h3>Balance Details</h3>

                    <p>
                      <strong>Total Credit:</strong> ₹{balance.totalCredit}
                    </p>

                    <p>
                      <strong>Total Debit:</strong> ₹{balance.totalDebit}
                    </p>

                    <p>
                      <strong>Remaining Balance:</strong> ₹{balance.balance}
                    </p>
                  </div>
                )}

                <div className="customer-action-section">
                  <button
                    className="balance-btn"
                    onClick={() => getCustomerBalance(customer.customerId)}
                  >
                    {customerBalances[customer.customerId]
                      ? "🔽 Hide Balance"
                      : "💵 View Balance"}
                  </button>

                  <button
                    className="reminder-btn"
                    onClick={() => handleSendReminder(customer.customerId)}
                  >
                    📩 Send Reminder
                  </button>

                  <button
                    className="update-btn"
                    onClick={() => {
                      if (latestTransaction) {
                        handleEdit(latestTransaction);
                      }
                    }}
                  >
                    ✏️ Update
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => {
                      if (latestTransaction) {
                        handleDelete(latestTransaction._id);
                      }
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Transaction;
