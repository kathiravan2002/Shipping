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

{
  /* <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-lg">
          <a href="#" className="flex items-start">
            <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">TCZ Courier</span>                           
          </a>

          <div className="flex-col md:flex md:flex-row items-center w-full md:w-auto md:order-2 transition-all duration-300 ">
           
            <button
              onClick={handleLoginLogout}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              type="button"
            >
              {isLoggedIn ? "Logout" : "Log In"}
            </button>

          </div>
        </div> */
}

{
  /* <ul className="flex flex-col md:flex-row md:gap-8 gap-0">
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-gray-700 rounded md:bg-transparent md:text-primary-700 md:p-0 dark:text-white"
                  aria-current="page"
                >
                  co-pilot
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Quick Action
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Recharge Wallet
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Sign In
                </a>
              </li>
            </ul> */
}
