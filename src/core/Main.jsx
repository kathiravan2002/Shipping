import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";  


function Main() {


  return (
    <div>
      <Sidebar /> 
      <main className="w-full pt-[90px] pl-20 pr-5 ">
        <Outlet />
      
      </main>
    </div>
  );
}

export default Main;
