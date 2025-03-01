import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { House } from "lucide-react";

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
      <nav className="bg-white border-gray-200 dark:bg-gray-800 shadow sm:block fixed top-0 w-full pl-20 py-4 px-5 z-20 ">
        <div className="flex justify-between items-center">
   
          <h2 className="lg:text-2xl text-base font-bold">TCZ Courier</h2>

          
          <div className="flex space-x-2">
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
             {/* <button
              onClick={() => navigate("/Addorder")}
              className=" flex justify-between px-4 py-2 rounded-md before:ease relative  overflow-hidden  bg-purple-700 text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-purple-500 hover:before:-translate-x-40"
              type="button"
            >
             <Plus/> Add Order
            </button> */}
             <button
              onClick={() => navigate("/")}
              className=" lg:px-2 lg:py-2 lg:text-base text-sm p-2 rounded-md before:ease relative  overflow-hidden  bg-purple-700 text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-purple-500 hover:before:-translate-x-40"
              type="button"
            >
             <House/>
            </button>
            

            <button
              onClick={() => navigate("/Addorder")}
              className=" lg:px-2 lg:py-2 lg:text-base text-sm p-2 rounded-md before:ease relative  overflow-hidden  bg-purple-700 text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-purple-500 hover:before:-translate-x-40"
              type="button"
            >
              Add Order
            </button>
            
            <button
              onClick={handleLoginLogout}
              className="lg:px-2 lg:py-2 lg:text-base text-sm p-2 rounded-md before:ease relative  overflow-hidden  bg-purple-700 text-white shadow-2xl transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:shadow-purple-500 hover:before:-translate-x-40"
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
