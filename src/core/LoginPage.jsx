/* eslint-disable react/prop-types */
import { useState  } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import loginbgg from "/assets/images/loginbgg.jpeg"
import { apilogin } from "../shared/services/Apiauthentication/Apilogin";


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
      const data = await apilogin(  { email, password });
      console.log(data)
      console.log("Login successful:", data);

      if (data.message === "Login successful") {
        toast.success("Login successfully!");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", data.role);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("Region",data.region);
        
        setIsLoggedIn(true); 
        if (data.role === "manager" || data.role === "admin")
          navigate("/dashboard");
        else if (data.role === "user") navigate("/Addorder");
        else if(data.role ==="subdistributor") navigate("/dispatched");
        else if(data.role === "deliveryman") navigate("/outfordelivery");
        else navigate("/Order");
      
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }


    // if (data.user.status === "inactive") {
    //       alert("Your account is inactive. Please contact support.");
    //       return;
    //     }

  };

  return (
 
    <div className="flex items-center justify-center min-h-screen bg-cover" style={{backgroundImage:`url(${loginbgg})`}}>
      <form
        onSubmit={handleLogin}
        className="p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="mb-4 text-2xl font-bold text-gray-100">Login</h2>
        <div className="mb-4">
          <label className="block mb-1 text-gray-100">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-100">Password</label>
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
          className="w-full py-2 text-white bg-blue-500 rounded-md"
        >
          Login
        </button>
      </form>
    </div>
    
  );
}

export default LoginPage;
