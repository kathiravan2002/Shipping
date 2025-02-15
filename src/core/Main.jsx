import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";  
import Header from "./Header";


function Main() {

  // const [isLoggedIn, setIsLoggedIn] = useState(
  //     // localStorage.getItem("isLoggedIn") === "true"
  //     localStorage.getItem("authToken") ? true : false
  //   );
   
  //   const handleLogout = () => {
  //     localStorage.removeItem("isLoggedIn");
  //     localStorage.removeItem("role");
  //     localStorage.removeItem("authToken");
  //     localStorage.removeItem("Region");
  //     localStorage.removeItem('tokenExpiresAt');
  //     setIsLoggedIn(false);
  //       // window.location.href = "/login";
  //     toast.success("Logout successfully!"); 
    
  //   };
  

  return (
    <div>
       {/* <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} /> */}
      <Sidebar /> 
      <main className="w-full pt-[90px] pl-20 pr-5 ">
        <Outlet />
 
      </main>
    </div>
  );
}

export default Main;
