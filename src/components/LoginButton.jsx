import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "../styles/LoginButtons.css"; // Import custom styles
import googleLogo from "../assets/google-logo.png"; // Replace with actual path

const LoginButtons = ({ onGoogleLogin }) => {
  return (
    <div className="login-buttons">
      <button className="login-btn google-btn" onClick={onGoogleLogin}>
        <img src={googleLogo} alt="Google Logo" />
        Login with Google
      </button>
    </div>
  );
};

export default LoginButtons;
