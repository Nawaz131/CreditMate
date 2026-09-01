import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Customer from "./components/customer/Customer";
import Transaction from "./components/transaction/Transaction";

const AppRoutes = () => {
  return (
    <Routes>


      <Route
        path="/"
        element={<Navigate to="/signup" replace />}
      />


      <Route
        path="/signup"
        element={<Signup />}
      />


      <Route
        path="/login"
        element={<Login />}
      />


      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Customer />
          </ProtectedRoute>
        }
      />


      <Route
        path="/transaction"
        element={
          <ProtectedRoute>
            <Transaction />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;