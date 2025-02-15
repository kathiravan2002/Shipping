import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginbgg from "/images/loginbgg.jpeg";

function LoginPage({ setIsLoggedIn, onLogout }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const expiresAt = localStorage.getItem("tokenExpiresAt");
      if (expiresAt && Date.now() >= parseInt(expiresAt)) {
        onLogout();
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000);
    checkTokenExpiry();

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://192.168.29.12:5000/api/login/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("Login successful:", data);

      if (response.ok) {
        toast.success("Login successfully!");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", data.role);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("Region", data.region);
        localStorage.setItem("tokenExpiresAt", data.expiresAt);

        setIsLoggedIn(true);
        navigate("/dashboard");
        // if (data.role === "admin") {
        //   navigate("/dashboard");
        // }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };


  return (
   
      <div className="min-h-screen flex items-center justify-center bg-cover "  style={{ backgroundImage: `url(${loginbgg})` }}>
        <form
          onSubmit={handleLogin}
          className="p-8 shadow-lg rounded-lg w-96 "
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-100 text-center">Login</h2>
          <div className="mb-4">
            <label className="block text-gray-100 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-100 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Login
          </button>
        </form>
      </div>

  );
}

export default LoginPage;
