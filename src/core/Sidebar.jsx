import React, { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const roles = localStorage.getItem("role");
  console.log(roles); 
  const allowedRoles = ["admin", "manager",];
  const menuItems = [
    { name: "Home", icon: "🏠", path: "/" },
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    ...(allowedRoles.includes(roles) ? [{ name: "Order", icon: "🛒", path: "/Order" }] : []),
    ...(allowedRoles.includes(roles)  ? [{ name: "User", icon: "🤵🏻", path: "/User" }] : []),
    { name: "Delivered order", icon: "🤵🏻", path: "/delivered" },
    { name: "Weight Management", icon: "🗂️", path: "/Weightmanagementpage" },
    { name: "Buyer Experience", icon: "💬", path: "/Buyer Experience" },
    { name: "Setting", icon: "⚙️", path: "/Settting" },
    { name: "Help & Support", icon: "⁉", path: "/Help & Supportt" },
  ];

  return (
    <div className="flex">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-30 bg-purple-800 text-white p-2 rounded-lg shadow-lg focus:outline-none"
      >
        {isOpen ? "❌" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed z-20 top-0 left-0 h-full bg-purple-800 text-white shadow-lg transition-all duration-500  ${
          isOpen ? "w-64 overflow-hidden" : "w-16"
        }`}
      >
        {/* Sidebar Header */}
        <div className="mt-5 ml-20 h-16">
          <span
            className={`text-xl font-bold transition-opacity duration-300 text-white whitespace-nowrap ${
              isOpen ? "visible" : "hidden"
            }`}
          >
            TCZ Courier
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className=" space-y-4 relative">
          {menuItems.map((item, index) => (
            <div key={index} className="relative group">
           
              <a href={item.path}  className="flex items-center gap-4 px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-500 rounded-lg text-white hover:text-white" >
                
                <span className="text-xl ">{item.icon}</span>
                 
                {isOpen && (
                  <span className="whitespace-nowrap transition-opacity duration-300">
                    {item.name}
                  </span> 
                )}
              </a>
              
              {!isOpen && (
                <span className="absolute left-full top-0 ml-2 bg-purple-500 text-white px-2 py-1 text-sm font-medium rounded-md hidden  group-hover:block ">
                  {item.name}
                </span>
              )}
            </div>
          ))}
          
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
