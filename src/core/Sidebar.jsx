
import React, { useState } from "react";
import dashboard from "/assets/images/statisctics.png";
import user from "/assets/images/add-group.png";
import order from "/assets/images/grid.png";
import subdist from "/assets/images/order-processing.png";
import outfordel from "/assets/images/delivery-van.png";
import weight from "/assets/images/scales.png"


function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const roles = localStorage.getItem("role");
  console.log(roles); 
  const allowedRoles = ["admin", "manager"];
  const allowedsubdist = ["admin", "manager", "subdistributor"];
  const allowedRolesuser = ["admin", "manager", "user"];
  const allowedRoledeliver = ["admin", "manager", "deliveryman", "subdistributor"];
  
  const menuItems = [
    ...(allowedRoles.includes(roles) ? [{ name: "Dashboard", image: dashboard, path: "/dashboard" }] : []),
    ...(allowedRoles.includes(roles) ? [{ name: "User", image: user, path: "/User" }] : []),
    ...(allowedRolesuser.includes(roles) ? [{ name: "Order", image: order, path: "/Order" }] : []),
    ...(allowedsubdist.includes(roles) ? [{ name: "Dispatched", image: subdist, path: "/dispatched" }] : []),
    ...(allowedRoledeliver.includes(roles) ? [{ name: "Out for Delivery", image: outfordel, path: "/outfordelivery" }] : []),
    ...(allowedRolesuser.includes(roles) ? [{ name: "Weight Management", image:weight, path: "/Weightmanagementpage" }] : []),
  ];

  return (
    <div className="flex">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-30 lg:bg-purple-800 lg:text-white   text-2xl  p-2 rounded-lg  focus:outline-none transition-all duration-300"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <div
        className={`fixed z-20 top-0 left-0 h-full bg-purple-800 text-white shadow-lg transition-all duration-300 
          ${isOpen ? "w-64 overflow-hidden" : "w-16 md:w-16"} 
          ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 md:translate-x-0 md:w-16"}
          md:block`}      >
        <div className="mt-5 ml-20 h-16">
          <span
            className={`text-xl font-bold transition-opacity duration-300 text-white whitespace-nowrap ${
              isOpen ? "visible" : "hidden"
            }`}
          >
            TCZ Courier
          </span>
        </div>

        <nav className="space-y-4 relative">
          {menuItems.map((item, index) => (
            <div key={index} className="relative group">
              <a
                href={item.path}
                className="flex items-center gap-4 px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-500 rounded-lg text-white hover:text-white"
              >
                 <img 
                  src={item.image} 
                  alt={`${item.name} icon`}
                  className="w-6 h-6 object-contain"
                />
                {isOpen && (
                  <span className="whitespace-nowrap transition-opacity duration-300">
                    {item.name}
                  </span>
                )}
              </a>
              {!isOpen && (
                <span className="absolute left-full top-0 ml-2 bg-purple-500 text-white px-2 py-1 text-sm font-medium rounded-md hidden group-hover:block">
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

// import React, { useState } from "react";
// // import dashboard from "/assests/images/statisctics.png"

// function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const roles = localStorage.getItem("role");
//   console.log(roles); 
//   const allowedRoles = ["admin", "manager",];
//   const allowedsubdist =["admin", "manager","subdistributor",];
//   const allowedRolesuser=["admin", "manager","user"]
//   const allowedRoledeliver=["admin", "manager","deliveryman","subdistributor",]
//   const menuItems = [
//     // { name: "Home", icon: "🏠", path: "/" },
//     ...(allowedRoles.includes(roles)  ? [{ name: "Dashboard", icon: "📊", path: "/dashboard" }]:[]),
//     ...(allowedRoles.includes(roles)  ? [{ name: "User", icon: "🤵🏻", path: "/User" }] : []),
//     ...(allowedRolesuser.includes(roles) ? [{ name: "Order", icon: "🛒", path: "/Order" }] : []),
//    ...(allowedsubdist.includes(roles) ? [{ name: "Sub Distributor", icon:"📦" , path:"/dispatched"}]:[]),
//    ...(allowedRoledeliver.includes(roles) ? [ {name: "Out for Delivery", icon:"📭" ,path:"/outfordelivery"}]:[]),
//   //  ...(allowedRoledeliver.includes(roles) ? [  { name: "Delivered order", icon: "🚚", path: "/delivered" }]:[]),
//     ...(allowedRolesuser.includes(roles) ? [  { name: "Weight Management", icon: "🗂️", path: "/Weightmanagementpage" }]:[]),
//     // { name: "Buyer Experience", icon: "💬", path: "/Buyer Experience" },
//     // { name: "Setting", icon: "⚙️", path: "/Settting" },
//     // { name: "Help & Support", icon: "⁉", path: "/Help & Supportt" },
//   ];

  

//   return (
//     <div className="flex">
//       {/* Toggle Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed top-4 left-4 z-30 bg-purple-800 text-white p-2 rounded-lg shadow-lg focus:outline-none"
//       >
//         {isOpen ? "☰" : "☰"}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed z-20 top-0 left-0 h-full bg-purple-800 text-white shadow-lg transition-all duration-500  ${
//           isOpen ? "w-64 overflow-hidden" : "w-16"
//         }`}
//       >
//         {/* Sidebar Header */}
//         <div className="mt-5 ml-20 h-16">
//           <span
//             className={`text-xl font-bold transition-opacity duration-300 text-white whitespace-nowrap ${
//               isOpen ? "visible" : "hidden"
//             }`}
//           >
//             TCZ Courier
//           </span>
//         </div>

//         {/* Navigation Menu */}
//         <nav className=" space-y-4 relative">
//           {menuItems.map((item, index) => (
//             <div key={index} className="relative group">
           
//               <a href={item.path}  className="flex items-center gap-4 px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-purple-500 rounded-lg text-white hover:text-white" >
                
//                 <span className="text-xl ">{item.icon}</span>
                 
//                 {isOpen && (
//                   <span className="whitespace-nowrap transition-opacity duration-300">
//                     {item.name}
//                   </span> 
//                 )}
//               </a>
              
//               {!isOpen && (
//                 <span className="absolute left-full top-0 ml-2 bg-purple-500 text-white px-2 py-1 text-sm font-medium rounded-md hidden  group-hover:block ">
//                   {item.name}
//                 </span>
//               )}
//             </div>
//           ))}
          
//         </nav>
//       </div>
//     </div>
//   );
// }

// export default Sidebar;
