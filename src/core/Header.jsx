import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      onLogout();
    } else {
      navigate("/login");
    }
  };
 
  return (
    <header>
      <nav className="bg-white border-gray-200 dark:bg-gray-800 shadow sm:block fixed top-0 w-full pl-20 py-4 px-5">
        <div className="flex justify-between items-center">
   
          <h2 className="text-2xl font-medium">TCZ Courier</h2>

          
          <div className="flex space-x-4">
            {/* {isLoggedIn ? <button
              onClick={() => navigate("/")}
              className="bg-purple-700 text-white px-4 py-2 rounded-md"
              type="button"
            >
             Home
            </button> : <button
              onClick={() => navigate("/Dashboard")}
              className="bg-purple-700 text-white px-4 py-2 rounded-md"
              type="button"
            >
              Dashboard
            </button>} */}

            <button
              onClick={() => navigate("/Dashboard")}
              className="bg-purple-700 text-white px-4 py-2 rounded-md"
              type="button"
            >
              Dashboard
            </button>
            
            <button
              onClick={handleLoginLogout}
              className="bg-purple-700 text-white px-4 py-2 rounded-md"
              type="button"
            >
              {isLoggedIn ? "Logout" : "Log In"}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;

