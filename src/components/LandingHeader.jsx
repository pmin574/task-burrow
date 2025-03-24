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
            "Streamlined Productivity and Collaboration",
            5000,
            "Your Tasks, Simplified",
            5000,
            "A Modern Solution for Daily Productivity",
            5000,
            "Secure and Scalable Task Management",
            5000,
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity} // Loop infinitely
        />
      </h1>
      <h2 className="call-to-action">
        {" "}
        Welcome to TaskBurrow. Log in to Start.
      </h2>
    </>
  );
};

export default LandingHeader;
