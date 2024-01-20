import "./App.css";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [token, setToken] = useState(null);

  return (
    <>
      <div className="App">
        <Router>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <LandingPage />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Register />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Login setToken={setToken} />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                token ? (
                  <ProtectedRoute
                    element={
                      <>
                        <Dashboard />
                      </>
                    }
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
          <Footer />
        </Router>
      </div>
    </>
  );
}

export default App;
