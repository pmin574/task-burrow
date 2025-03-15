import React from "react";
import { TypeAnimation } from "react-type-animation";
import "../styles/LandingHeader.css";

const LandingHeader = () => {
  return (
    <>
      <h1 className="typing-text">
        <TypeAnimation
          sequence={[
            "Data Driven Analytics",
            5000, // Show for 2 seconds
            "AI-Powered Solutions",
            5000,
            "Your Tasks, Simplified",
            5000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity} // Loop infinitely
        />
      </h1>
      <h2 className="call-to-action">
        {" "}
        Welcome to TaskBurrow. Sign up or Log in to Start Your Adventure.
      </h2>
    </>
  );
};

export default LandingHeader;
