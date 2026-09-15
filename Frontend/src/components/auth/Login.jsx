import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      const response = await axios.post(
        "https://creditmate-backend.onrender.com/api/user/login",
        {
          email,
          password,
        }
      );

      console.log("Login response:", response.data);

      login(response.data.token);

      navigate("/dashboard");

    } catch (error) {
      console.log(
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        <h1>Login</h1>

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;