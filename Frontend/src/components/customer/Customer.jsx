import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import "./Customer.css";

const Customer = () => {
  const { token } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState("");

  const getCustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/customer/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCustomers(response.data.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getCustomers();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!name.trim()) {
      setMessage("Customer name is required");
      return;
    }

    if (!phone.trim()) {
      setMessage("Customer phone is required");
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      setMessage("Phone number must be 10 digits");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `http://localhost:3000/api/customer/update/${editId}`,
          {
            name,
            phone,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setMessage("Customer updated successfully");
      } else {
        await axios.post(
          "http://localhost:3000/api/customer/create",
          {
            name,
            phone,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setMessage("Customer created successfully");
      }

      setName("");
      setPhone("");
      setEditId(null);
      setShowForm(false);

      getCustomers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) {
        return;
    }
    
    setMessage("");

    try {
      await axios.delete(`http://localhost:3000/api/customer/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Customer deleted successfully");

      getCustomers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Cannot delete customer");
    }
  };

  const handleEdit = (customer) => {
    setEditId(customer._id);
    setName(customer.name);
    setPhone(customer.phone);
    setShowForm(true);
    setMessage("");
  };

  const getCustomerBalance = async (customerId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/transaction/balance/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBalance(response.data.data);
      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to get customer balance",
      );
    }
  };

  return (
    <div className="customer-page">
      <h1 className="customer-title">Customers</h1>

    {message && (<p className="customer-message"> <strong>{message}</strong></p>)}

      <button
        className="add-customer-btn"
        onClick={() => {
          if (showForm) {
            setShowForm(false);
            setEditId(null);
            setName("");
            setPhone("");
          } else {
            setShowForm(true);
            setMessage("");
          }
        }}
      >
        {showForm ? "Close" : "Add Customer"}
      </button>

      {showForm && (
        <form className="customer-form" onSubmit={handleSubmit}>

          <input
            className="customer-input"
            type="text"
            placeholder="Customer name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setMessage("");
            }}
          />


          <input
            className="customer-input"
            type="text"
            placeholder="Customer phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setMessage("");
            }}
          />


          <button className="save-customer-btn" type="submit">
            {editId ? "Update Customer" : "Save Customer"}
          </button>
        </form>
      )}

     

      <h2 className="customer-list-title">Customer List</h2>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        customers.map((customer) => (
          <div className="customer-card" key={customer._id}>
            <p>
              <strong>Name:</strong> {customer.name}
            </p>

            <p>
              <strong>Phone:</strong> {customer.phone}
            </p>

            <button className="balance-btn" onClick={() => getCustomerBalance(customer._id)}>
              View Balance
            </button>

            <button className="update-btn" onClick={() => handleEdit(customer)}>Update</button>

            <button className="delete-btn" onClick={() => handleDelete(customer._id)}>Delete</button>

            <hr />
          </div>
        ))
      )}

      {balance && (
        <div className="balance-card">
          <h2>Customer Balance</h2>

          <p>
            <strong>Customer ID:</strong> {balance.customerId}
          </p>

          <p>
            <strong>Total Credit:</strong> ₹{balance.totalCredit}
          </p>

          <p>
            <strong>Total Debit:</strong> ₹{balance.totalDebit}
          </p>

          <h3>Balance: ₹{balance.balance}</h3>
        </div>
      )}
    </div>
  );
};

export default Customer;
