/* eslint-disable react/prop-types */
import {  House, MoreVertical } from "lucide-react"; // Added MoreVertical for three-dot menu
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import login from "/assets/images/user.png";
import account from "/assets/images/user-avatar.png";
import home from "/assets/images/home.png"
import { apigetName } from "../shared/services/Apiauthentication/Apilogin";

function Header({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const dropdownRef = useRef(null); 
  const mobileMenuRef = useRef(null); // Ref for mobile menu



  const fetchUserName = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apigetName ();
      // console.log("API Response:", data);
      setUsername(data.Name || "");
    } catch (err) {
      console.error("Error fetching user name:", err);
      setError(err.message);
      setUsername("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserName();
      
    } else {
      setUsername("");
      setError(null);
    }

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoggedIn]);

  

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      onLogout(); 
      navigate("/login"); 
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false); 
    } else {
      navigate("/login");
      setIsMobileMenuOpen(false);
    }
  };

  const handleHome = () => {
    navigate("/");
    setIsMobileMenuOpen(false); // Close mobile menu
  };

  const handleAddOrder = () => {
    navigate("/Addorder");
    setIsMobileMenuOpen(false); // Close mobile menu
  };

  return (
    <header>
      <nav className="fixed top-0 z-20 w-full px-5 py-4 pl-20 bg-white border-gray-200 shadow dark:bg-gray-800 sm:block">
        <div className="flex items-center justify-between">
          
          <h2 className="text-xl font-bold lg:text-2xl">TCZ Courier</h2>

          <div className="flex items-center space-x-2 lg:space-x-4">
          
            <div className="items-center hidden lg:flex lg:space-x-4">
              <button
                onClick={handleHome}
                className="px-2 py-0 text-purple-700 rounded-md hover:bg-gray-200 lg:py-2 lg:px-2"
                type="button"
              >
                <img
                        src={home} 
                        alt="home Icon"
                        className="w-7 h-7 "
                      />
              </button>

              {/* <button
                onClick={handleAddOrder}
                className="flex justify-between px-2 py-1 text-white bg-purple-700 rounded-md lg:py-2 lg:px-4"
                type="button"
              >
                <Plus /> Add Order
              </button> */}

              <div className="relative" ref={dropdownRef}>
                {isLoggedIn && !loading && username ? (
                  <div className="flex items-center">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center px-2 py-1 rounded-md lg:py-2 lg:px-4 hover:bg-gray-200 focus:outline-none"
                      type="button"
                    >
                      <img
                        src={login} 
                        alt="Profile Icon"
                        className="mr-2 w-7 h-7"
                      />
                      {/* welcome, {username}! */}
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 z-10 w-48 bg-purple-700 border border-gray-200 rounded-md shadow-lg mt-36">
                        <ul className="py-1">
                          <li>
                            <button
                              // onClick={handleMyAccount}
                              className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-purple-500"
                            >
                              <span className="mr-2"><img src={account} alt="account" className="w-5 h-5"/></span> {username}
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={handleLoginLogout}
                              className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-purple-500"
                            >
                              <span className="mr-2">↩</span> Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center px-2 py-1 rounded-md lg:py-2 lg:px-4 hover:bg-gray-200 focus:outline-none"
                  type="button"
                >
                  <img
                    src={login} 
                    alt="Profile Icon"
                    className="mr-2 w-7 h-7"
                  />
                  {/* welcome, {username}! */}
                </button>
                )}
              </div>
            </div>

            {/* Three-dot menu for mobile screens (below lg) */}
            <div className="lg:hidden ">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white bg-purple-700 rounded-md focus:outline-none"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {isMobileMenuOpen && (
                <div
                  ref={mobileMenuRef}
                  className="absolute z-10 w-48 bg-purple-800 border border-gray-200 rounded-md shadow-lg right-5"
                >
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={handleHome}
                        className="flex items-center w-full px-4 py-2 mt-5 text-left text-white hover:bg-purple-500"
                      >
                        <House className="w-5 h-5 mr-2" /> Home
                      </button>
                    </li>
                    {/* <li>
                      <button
                        onClick={handleAddOrder}
                        className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-purple-500"
                      >
                        <Plus className="w-5 h-5 mr-2" /> Add Order
                      </button>
                    </li> */}
                    {isLoggedIn && !loading && username ? (
                      <>
                        <li>
                          <button
                            className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-purple-500"
                          >
                            <img
                              src={account}
                              alt="Profile Icon"
                              className="w-5 h-5 mr-2"
                            />
                            {username}
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={handleLoginLogout}
                            className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-purple-500"
                          >
                            <span className="mr-2">↩</span> Logout
                          </button>
                        </li>
                      </>
                    ) : (
                      <li>
                        <button
                          onClick={handleLoginLogout}
                          className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-purple-500"
                        >
                          <img
                            src={user}
                            alt="Login Icon"
                            className="w-5 h-5 mr-2"
                          />
                          Log In
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            {error && (
              <span className="text-sm text-red-500">Error: {error}</span>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;



// import { Plus, House } from "lucide-react";
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import login from "/assets/images/login.png";
// import account from "/assets/images/user-avatar.png" 

// function Header({ isLoggedIn, onLogout }) {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
//   const dropdownRef = useRef(null); 

//   useEffect(() => {
//     if (isLoggedIn) {
//       fetchUserName();
//     } else {
//       setUsername("");
//       setError(null);
//     }

   
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isLoggedIn]);
  

//   const fetchUserName = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem("authToken");
//       console.log("Fetching username with token:", token);
//       if (!token) {
//         throw new Error("No token found in localStorage");
//       }

//       const response = await fetch("http://192.168.29.71:5000/api/add/login/getname", {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`API error: ${response.status} - ${errorText}`);
//       }
//       const data = await response.json();
//       console.log("API Response:", data);
//       setUsername(data.Name || "");
//     } catch (err) {
//       console.error("Error fetching user name:", err);
//       setError(err.message);
//       setUsername("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLoginLogout = () => {
//     if (isLoggedIn) {
//       onLogout(); 
//       navigate("/login"); 
//       setIsDropdownOpen(false); 
//     } else {
//       navigate("/login");
//     }
//   };


//   const handleMyAccount = () => {
//     navigate("/my-account"); 
//     setIsDropdownOpen(false); 
//   };

//   return (
//     <header>
//       <nav className="fixed top-0 z-20 w-full px-5 py-4 pl-20 bg-white border-gray-200 shadow dark:bg-gray-800 sm:block">
//         <div className="flex items-center justify-between">
//           <h2 className="text-base font-medium lg:text-2xl">TCZ Courier</h2>

//           <div className="flex items-center space-x-2 lg:space-x-4">
//             <button
//               onClick={() => navigate("/")}
//               className="px-2 py-0 text-white bg-purple-700 rounded-md lg:py-2 lg:px-4"
//               type="button"
//             >
//               <House />
//             </button>

//             <button
//               onClick={() => navigate("/Addorder")}
//               className="flex justify-between px-2 py-1 text-white bg-purple-700 rounded-md lg:py-2 lg:px-4"
//               type="button"
//             >
//               <Plus /> Add Order
//             </button>

//             <div className="relative" ref={dropdownRef}>
//               {isLoggedIn && !loading && username ? (
//                 <div className="flex items-center">
//                   <button
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     className="flex items-center px-2 py-1 text-white bg-purple-700 rounded-md lg:py-2 lg:px-4 hover:bg-purple-800 focus:outline-none"
//                     type="button"
//                   >
//                     <img
//                       src={login} 
//                       alt="Profile Icon"
//                       className="w-5 h-5 mr-2"
//                     />
//                    welcome, {username}!
//                   </button>

//                   {isDropdownOpen && (
//                     <div className="absolute right-0 z-10 w-48 bg-purple-700 border border-gray-200 rounded-md shadow-lg mt-36">
//                       <ul className="py-1">
//                         <li>
//                           <button
//                             onClick={handleMyAccount}
//                             className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-purple-500"
//                           >
//                             <span className="mr-2"><img src={account} alt="account" className="w-5 h-5"/></span> My Account
//                           </button>
//                         </li>
//                         <li>
//                           <button
//                             onClick={handleLoginLogout}
//                             className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-purple-500"
//                           >
//                             <span className="mr-2">↩</span> Logout
//                           </button>
//                         </li>
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <button
//                   onClick={handleLoginLogout}
//                   className="flex items-center px-2 py-1 text-white bg-purple-700 rounded-md lg:py-2 lg:px-4"
//                   type="button"
//                 >
//                   <img
//                     src={login}
//                     alt="Login Icon"
//                     className="w-5 h-5 mr-2"
//                   />
                 
//                 </button>
//               )}
//               {error && (
//                 <span className="text-sm text-red-500">Error: {error}</span>
//               )}
//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

// export default Header;


// import { Plus, House } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import login from "/assets/images/user-interface.png"; // Adjust the path as needed

// function Header({ isLoggedIn, onLogout }) {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null); // Add error state for debugging

//   useEffect(() => {
//     if (isLoggedIn) {
//       fetchUserName();
//     } else {
//       setUsername("");
//       setError(null); // Clear error when logging out
//     }
//   }, [isLoggedIn]);

//   const fetchUserName = async () => {
//     setLoading(true);
//     setError(null); // Clear previous errors
//     try {
//       const token = localStorage.getItem("authToken"); // Use "authToken" as set in LoginPage
//       console.log("Fetching username with token:", token);
//       if (!token) {
//         throw new Error("No token found in localStorage");
//       }

//       const response = await fetch("http://192.168.29.71:5000/api/add/login/getname", {
//         headers: {
//           "Authorization": `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error(`API error: ${response.status} - ${await response.text()}`);
//       }
//       const data = await response.json();
//       console.log("API Response:", data);
//       setUsername(data.Name || "");
//     } catch (err) {
//       console.error("Error fetching user name:", err);
//       setError(err.message);
//       setUsername(""); // Clear username on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLoginLogout = () => {
//     if (isLoggedIn) {
//       onLogout();
//     } else {
//       navigate("/login");
//     }
//   };

//   return (
//     <header>
//       <nav className="fixed top-0 z-20 w-full px-5 py-4 pl-20 bg-white border-gray-200 shadow dark:bg-gray-800 sm:block">
//         <div className="flex items-center justify-between">
//           <h2 className="text-base font-medium lg:text-2xl">TCZ Courier</h2>

//           <div className="flex space-x-2 lg:space-x-4">
//             <button
//               onClick={() => navigate("/")}
//               className="px-2 py-0 text-white bg-purple-700 rounded-md lg:py-2 lg:px-4"
//               type="button"
//             >
//               <House />
//             </button>

//             <button
//               onClick={() => navigate("/Addorder")}
//               className="flex justify-between px-2 py-1 text-white bg-purple-700 rounded-md lg:py-2 lg:px-4"
//               type="button"
//             >
//               <Plus /> Add Order
//             </button>

//             <div className="flex items-center space-x-2">
//               {isLoggedIn && !loading && username && (
//                 <span className="text-violet-600">Welcome, {username}!</span>
//               )}
//               {error && (
//                 <span className="text-sm text-red-500">Error: {error}</span> // Display error if any
//               )}
//               <button
//                 onClick={handleLoginLogout}
//                 className="flex items-center px-2 py-1 text-white rounded-md lg:py-2 lg:px-4"
//                 type="button"
//               >
//                 {isLoggedIn ? (
//                   <>
//                     <img
//                       src={login}
//                       alt="Logout Icon"
//                       className="w-5 h-5 mr-2"
//                     />
                   
//                   </>
//                 ) : (
//                   <>
//                     <img
//                       src={login}
//                       alt="Login Icon"
//                       className="w-5 h-5 mr-2"
//                     />
                    
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

// export default Header;



// import { Plus, House } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import login from "/assets/images/user-interface.png"

// function Header({ isLoggedIn, onLogout }) {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");


//   useEffect(() => {
//     if (isLoggedIn) {
//       fetchUserName();
//     } else {
//       setUsername(""); 
//     }
//   }, [isLoggedIn]); 
  

//   const fetchUserName = async () => {
//     try {
//       const token = localStorage.getItem("token"); 
//       const response = await fetch("http://192.168.29.71:5000/api/add/login/getname", {
//         headers: {
//           "Authorization": `Bearer ${token}`, 
//         },
//       });
//       if (!response.ok) {
//         throw new Error("Failed to fetch user data");
//       }
//       const data = await response.json();
      
//       setUsername(data.Name || ""); 
//     } catch (err) {
//       console.error("Error fetching user name:", err);
//     }
//   };

//   const handleLoginLogout = () => {
//     if (isLoggedIn) {
//       onLogout();
//     } else {
//       navigate("/login");
//     }
//   };

//   return (
//     <header>
//       <nav className="fixed top-0 z-20 w-full px-5 py-4 pl-20 bg-white border-gray-200 shadow dark:bg-gray-800 sm:block">
//         <div className="flex items-center justify-between ">

//           <h2 className="text-base font-medium lg:text-2xl">TCZ Courier</h2>


//           <div className="flex space-x-2 lg:space-x-4">
//             {/* {isLoggedIn ? <button
//               onClick={() => navigate("/")}
//               className="px-4 py-2 text-white bg-purple-700 rounded-md"
//               type="button"
//             >
//              Home
//             </button> : <button
//               onClick={() => navigate("/Dashboard")}
//               className="px-4 py-2 text-white bg-purple-700 rounded-md"
//               type="button"
//             >
//               Dashboard
//             </button>} */}

//             <button
//               onClick={() => navigate("/")}
//               className="px-2 py-0 text-white bg-purple-700 rounded-md lg:py-2 lg:px-4"
//               type="button"
//             >
//               <House />
//             </button>

//             <button
//               onClick={() => navigate("/Addorder")}
//               className="flex justify-between px-2 py-1 text-white bg-purple-700 rounded-md lg:py-2 lg:px-4"
//               type="button"
//             >
//               <Plus /> Add Order
//             </button>

//             {/* <button
//               onClick={() => navigate("/Dashboard")}
//               className="px-4 py-2 text-white bg-purple-700 rounded-md"
//               type="button"
//             >
//               Dashboard
//             </button> */}

//             <div className="flex items-center space-x-2">
//               {isLoggedIn && username && (
//                 <span className="text-white">Welcome, {data.Name}!</span>
//               )}
//               <button
//                 onClick={handleLoginLogout}
//                 className="flex items-center px-2 py-1 text-white bg-purple-700 rounded-md lg:py-2 lg:px-4"
//                 type="button"
//               >
//                 {isLoggedIn ? (
//                   <>
//                     <img
//                       src={login}
//                       alt="Logout Icon"
//                       className="w-5 h-5 mr-2"
//                     />
//                     Logout
//                   </>
//                 ) : (
//                   <>
//                     <img
//                       src={login}
//                       alt="Login Icon"
//                       className="w-10 h-8 mr-2"
//                     />
//                     Log In
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

// export default Header;

