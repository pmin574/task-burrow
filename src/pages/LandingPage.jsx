import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, loginWithGoogle } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion"; // Import Framer Motion
import LoginButtons from "../components/LoginButton";
import LandingHeader from "../components/LandingHeader"; // Import the new component

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/task-burrow/dashboard"); // Updated navigation path
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="container text-center mt-5">
      {/* Animated Typing Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }} // Starts faded & moved up
        whileInView={{ opacity: 1, y: 0 }} // Fades in & moves down
        transition={{ duration: 1, ease: "easeOut" }} // Smooth animation
        viewport={{ once: true }} // Only animates once on scroll
      >
        <LandingHeader />
      </motion.div>

      {/* Login Buttons with scroll reveal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // Starts faded & moved down
        whileInView={{ opacity: 1, y: 0 }} // Fades in & moves up
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }} // Slight delay
        viewport={{ once: true }} // Only animates once
      >
        <LoginButtons onGoogleLogin={loginWithGoogle} />
      </motion.div>
    </div>
  );
};

export default LandingPage;
