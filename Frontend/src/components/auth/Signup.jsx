import { useState } from "react";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "https://credit-mate.onrender.com/api/user/signup",
        {
          name,
          shopName,
          email,
          password,
          phone,
        }
      );

      console.log(response.data);

      setMessage("Signup successful!");

      // Clear form
      setName("");
      setShopName("");
      setEmail("");
      setPassword("");
      setPhone("");
    } catch (error) {
      console.log(error.response?.data || error.message);

      setError(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-card">

        {/* LEFT SIDE */}
        <div className="signup-left">

          <h1>Welcome!</h1>

          <p>
            Create your account and manage your shop
            transactions easily.
          </p>

          <div className="signup-feature">
            <span>✓</span>
            <p>Manage customers</p>
          </div>

          <div className="signup-feature">
            <span>✓</span>
            <p>Track credit & debit</p>
          </div>

          <div className="signup-feature">
            <span>✓</span>
            <p>View customer balance</p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="signup-right">

          <h2>Create Account</h2>

          <p className="signup-subtitle">
            Enter your details to get started
          </p>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Shop Name</label>

              <input
                type="text"
                placeholder="Enter shop name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Phone</label>

              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="signup-btn"
            >
              Create Account
            </button>

          </form>

          <p className="login-text">
            Already have an account?
            <a href="/login"> Login</a>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Signup;