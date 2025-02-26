import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, loginWithGoogle } from "../../src/firebaseConfig"; // Fix the import path
import { onAuthStateChanged } from "firebase/auth";
// import "../../styles/LandingPage.css";

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
      <button onClick={loginWithGoogle}>Login with Google</button>
    </div>
  );
};

export default LandingPage;
