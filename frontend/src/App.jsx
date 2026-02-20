import { useState, useEffect } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState(null); //  important change
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");


    if (token) {
      setPage("dashboard");
    } else {
      setPage("login");  // default if no token
    }
  }, []);

  if (!page) return null; // avoid flicker

  if (page === "register") return <Register setPage={setPage} />;
  if (page === "login") return <Login setPage={setPage} setEmail={setEmail} />;
  if (page === "otp") return <VerifyOTP email={email} setPage={setPage} />;
  if (page === "dashboard") return <Dashboard setPage={setPage} />;

  return null;
}

export default App;
