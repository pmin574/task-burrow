import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, loginWithGoogle } from "../../src/firebaseConfig"; // Adjust path if needed
import { onAuthStateChanged } from "firebase/auth";
import GoogleButton from "react-google-button";
//import "../../styles/LandingPage.css";  // Ensure you have your CSS styles

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/tasks"); // Redirect logged-in users
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="landing-container">
      <h1>Welcome to Task Burrow</h1>
      <GoogleButton onClick={loginWithGoogle} />
    </div>
  );
};

export default LandingPage;
