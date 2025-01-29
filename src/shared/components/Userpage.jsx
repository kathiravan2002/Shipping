import axios from "axios";
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Userpage = () => {
    const [user,setUser]= useState([]);
    const navigate = useNavigate();
    const edituser = ({ _id }) => {
        navigate(`/Adduser/${_id}`); // Redirect to Add user page with the user ID
      };
   
  const getuser =async() =>{
    try{
        const userdata = await axios.get("http://192.168.29.11:5000/api/add/getuser",{
          headers : {
             "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
    });
        console.log(userdata.data);
        setUser(userdata.data || []);
    }
    catch(error){
        console.log("Error fetching user data",error);
    }
  };
   useEffect(()=>{
    getuser();
   },[]);

  return (
    <>
      <div className="w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-sm border border-gray-200">
        <div className="flex justify-between ">
          <h2 className="text-xl sm:text-2xl font-medium">User List</h2>
          <button
            onClick={() => navigate("/Adduser")}
            className="px-4 py-2 bg-purple-700 text-white rounded-md text-sm   hover:bg-purple-800 transition-all duration-300"
          >
            +Add User
          </button>
        </div>
        <hr className="mt-4" />

        <div className="mt-4 overflow-x-auto">
          <div className="min-w-full bg-white shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
        
                {["No","Name","Email","Password","ContactNo","Dob","Doj","Role","Region","Status","Action"].map((header)=>(
                    <th key={header} className="px-4 py-2 text-left font-medium text-gray-500 uppercase" >
                        {header}
                    </th>
                ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {user?.length >0 ? (user.map((user, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-indigo-600">{user.Name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.password}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.ContactNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.Dob}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.Doj}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.role}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{user.region}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><button className="text-white font-medium bg-green-500 rounded-lg px-2 ">{user.status}</button></td>
                    <td className="px-4 py-3 whitespace-nowrap space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" onClick={()=>edituser({ _id: user._id})}>Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))
                ):(
                <tr>
                    <td colSpan="9" className="text-center py-10">
                        <div className="flex flex-col items-center">
                                     
                        <p className="text-gray-600 mt-4 font-semibold text-2xl">
                            Add User List 
                        </p>
                                        
                        </div>
                    </td>
                </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default Userpage;
