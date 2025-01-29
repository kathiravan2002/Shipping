import React from "react";
import { useNavigate } from "react-router-dom";

function Home({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLoggedIn) {
      onLogout();
    } else {
      navigate("/login");
    }
  };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="absolute top-5 right-5">
        {/* <button
           onClick={handleClick}
           className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
           {isLoggedIn ? "Logout" : "Log In"}
        </button> */}
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Welcome to TCZ Courier Service</h1>
        <p className="mt-2 text-gray-600">Fast and Reliable Delivery Service</p>
      </div>
    );
  }
  
        
export default Home;
