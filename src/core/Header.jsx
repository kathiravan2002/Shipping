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
      <nav className="fixed top-0 z-20 w-full px-5 py-4 pl-20 bg-white border-gray-200 shadow sm:block">
        <div className="flex items-center justify-between">
          
          <h2 className="text-xl font-bold lg:text-2xl">TCZ Courier</h2>

          <div className="flex items-center space-x-2 lg:space-x-4">
          
            <div className="items-center hidden lg:flex lg:space-x-4">
              <button onClick={handleHome} className="px-2 py-0 text-purple-700 rounded-md hover:bg-gray-200 lg:py-2 lg:px-2" type="button" >
                <img src={home} alt="home Icon" className="w-7 h-7 " />
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
                      <img src={login} alt="Profile Icon" className="mr-2 w-7 h-7" />
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
