import React, { useState } from "react";
import Login from "../Login";
import Register from "../Register";
import { Navigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className="auth-page">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {isLogin ? <Login /> : <Register />}
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Navigate to="#" onClick={toggleForm}>
          {isLogin ? "Register here" : "Login here"}
        </Navigate>
      </p>
    </div>
  );
};

export default AuthPage;
