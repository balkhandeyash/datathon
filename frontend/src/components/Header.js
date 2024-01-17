// Header.js

import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <>
      <div className="header">
        <div className="logo">
          <img src="logo192.png" alt="Logo" />
          <span>SecureNet</span>
        </div>
        <div className="navigation">
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="user-options">
          <div className="login-signup">
            <Link to="#">Login</Link>
            <Link to="/register">Register</Link>
          </div>
          <div className="dropdown">
            <button className="dropbtn">&#9660;</button>
            <div className="dropdown-content">
              <Link to="#">Option 1</Link>
              <Link to="#">Option 2</Link>
              <Link to="#">Option 3</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
