import React, { useState } from "react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", icon: "🏠", path: "/" },
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Order", icon: "🛒", path: "/Order" },
    { name: "Returns", icon: "↪️", path: "/Returns" },
    { name: "Weight Management", icon: "🗂️", path: "/Weightmanagementpage" },
    { name: "Buyer Experience", icon: "🤵🏻", path: "/Buyer Experience" },
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
        className={`fixed z-20 top-0 left-0 h-full bg-purple-800 text-white shadow-lg transition-all duration-500 ${isOpen ? "w-64" : "w-16"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-center h-16">
          <span
            className={`text-xl font-bold transition-opacity duration-300 text-white ${isOpen ? "opacity-100" : "opacity-0"
              }`}
          >
            Shiprocket
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4 space-y-4">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="flex items-center gap-4 px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-600 rounded-lg text-white hover:text-black"
            >
              {/* Icon */}
              <span className="text-xl">{item.icon}</span>
              {/* Label */}
              <span
                className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                  }`}
              >
                {item.name}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;

// import React, { useState } from "react";

// function Sidebar() {
//   const [isHovered, setIsHovered] = useState(false);

//   const menuItems = [
//     { name: "Home", icon: "🏠", path: "/" },
//     { name: "Dashboard", icon: "📊", path: "/dashboard" },
//     { name: "Order", icon: "🛒", path: "/Order" },
//     { name: "Returns", icon: "↪️", path: "/Returns" },
//     // { name: "Delivery Boost", icon: "🚀", path: "/Delivery Boost" },
//     // { name: "Quick-Instant Delivery", icon: "📍", path: "/Quick-Instant Delivery" },
//     { name: "Weight Management", icon: "🗂️", path: "/Weightmanagementpage" },
//     { name: "Buyer Experience", icon: "🤵🏻", path: "/Buyer Experience" },
//     // { name: "Setup & Manage", icon: "🏗", path: "/Setup & Manage" },
//     // { name: "Tools", icon: "🛠", path: "/Tools" },
//     // { name: "Apps", icon: "📱", path: "/Apps" },
//     // { name: "Billing", icon: "📑", path: "/Billing" },
//     { name: "Settting", icon: "⚙️", path: "/Settting" },
//     { name: "Help & Support", icon: "⁉", path: "/Help & Supportt" },
//   ];

//   return (
//     <div
//       className={`fixed z-20 top-0 left-0 h-full bg-purple-800 text-white shadow-lg transition-all duration-500 ${isHovered ? "w-64" : "w-16"
//         }`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Sidebar Header */}
//       <div className="flex items-center justify-center h-16">
//         <span
//           className={`text-xl font-bold transition-opacity duration-300 text-white ${isHovered ? "opacity-100" : "opacity-0"
//             }`}
//         >
//           Shiprocket
//         </span>
//       </div>

//       {/* Navigation Menu */}
//       <nav className="mt-4 space-y-4">
//         {menuItems.map((item, index) => (
//           <a
//             key={index}
//             href={item.path}
//             className="flex items-center gap-4 px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-600 rounded-lg text-white hover:text-black"
//           >
//             {/* Icon */}
//             <span className="text-xl">{item.icon}</span>
//             {/* Label */}
//             <span
//               className={`whitespace-nowrap transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
//                 }`}
//             >
//               {item.name}
//             </span>
//           </a>
//         ))}
//       </nav>
//     </div>
//   );
// }

// export default Sidebar;
