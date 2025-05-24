import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginbgg from "/assets/images/loginbgg.jpeg";
import { apilogin } from "../shared/services/Authentication/Apilogin";
import { Eye, EyeOff } from 'lucide-react';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("authToken") ? true : false
  );
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await apilogin({ email, password });
      console.log("Login response:", data);

      if (data.message === "Login successful") {
        toast.success("Login successfully!");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", data.role);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("Region", data.region);
        setIsLoggedIn(true);
        if (data.role === "manager" || data.role === "admin") {
          navigate("/dashboard");
        } else if (data.role === "user") {
          navigate("/Addorder");
        } else if (data.role === "subdistributor") {
          navigate("/dispatched");
        } else if (data.role === "deliveryman") {
          navigate("/outfordelivery");
        } else {
          navigate("/Order");
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover"
      style={{ backgroundImage: `url("${loginbgg}")` }}
    >
      <div className="p-8 lg:p-8 shadow-lg rounded-lg w-full max-w-md lg:max-w-[30rem] backdrop-blur-sm bg-white/10">
        <form onSubmit={handleLogin}>
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div
              className="absolute bottom-24 right-10 flex items-center text-gray-700 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={25} /> : <EyeOff size={25} />}
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;