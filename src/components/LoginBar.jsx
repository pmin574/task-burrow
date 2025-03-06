import React from "react";
import { GoogleLoginButton, MicrosoftLoginButton, AppleLoginButton } from "react-social-login-buttons";
import "../styles/LoginBar.css"; // Import the CSS file

const LoginBar = ({ onGoogleLogin, onMicrosoftLogin, onAppleLogin }) => {
  return (
    <div className="login-bar">
      <GoogleLoginButton onClick={onGoogleLogin} text="GOOGLE"/>
      <MicrosoftLoginButton onClick={onMicrosoftLogin} text="MICROSOFT" />
      <AppleLoginButton onClick={onAppleLogin} text="APPLE" />
    </div>
  );
};

export default LoginBar;
