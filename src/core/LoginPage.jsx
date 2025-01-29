import React, { useState  } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginPage({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();
    try {

      
      const response = await fetch("http://192.168.29.11:5000/api/login/user", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" ,
     
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-lg rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Password</label>
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
