import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "../styles/LoginButtons.css"; // Import custom styles
import googleLogo from "../assets/google-logo.png"; // Replace with actual path
import microsoftLogo from "../assets/microsoft-logo.png"; // Replace with actual path

const LoginButtons = ({ onGoogleLogin, onMicrosoftLogin }) => {
  return (
    <div className="login-buttons">
      <button className="login-btn google-btn" onClick={onGoogleLogin}>
        <img src={googleLogo} alt="Google Logo" />
        Login with Google
      </button>
      <button className="login-btn microsoft-btn" onClick={onMicrosoftLogin}>
        <img src={microsoftLogo} alt="Microsoft Logo" />
        Login with Microsoft
      </button>
    </div>
  );
};

export default LoginButtons;
