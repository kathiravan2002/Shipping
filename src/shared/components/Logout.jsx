import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Logout()  {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      const expiresIn = decoded.exp - now;

      if (expiresIn <= 0) {
        localStorage.clear();
        navigate("/login");
        toast.error("Session expired. Please log in again.");
      } else {
        const timer = setTimeout(() => {
          localStorage.clear();
          navigate("/login");
          toast.error("Session expired. Please log in again.");
        }, expiresIn * 1000);

        return () => clearTimeout(timer);
      }
    } catch (err) {
      localStorage.clear();
      navigate("/login");
      toast.error("Session expired. Please log in again.");
    }
  }, [navigate]);
};

export default Logout;