import axios from "axios";
import React,{useEffect, useState} from "react";
import {useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Adduser = () => {
    const { id } = useParams(); // Get the user ID  
    const [user, setUser] = useState({
        Name : "",
        email : "",
        password : "",
        ContactNo : "",
        Dob : "",
        Doj : "",
        role : "",  
        region :"",
        status : "",
    });
    const navigate = useNavigate();
    
  // Fetch user details if `id` is present
  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://192.168.29.11:5000/api/add/${id}`);
      setUser(response.data); // Assuming `response.data` contains the user object
    } catch (error) {
      toast.error("Failed to fetch user details. Please try again.");
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser(); // Fetch user details only when updating
    }
  }, [id]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
          ...prev,
          [name]: value,
        }));
      };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateInputs = () => {
      if (!user.Name) return "Name is required.";
      if (!user.email.match(/^\S+@\S+\.\S+$/)) return "Invalid email format.";
      if (user.password.length < 6) return "Password must be at least 6 characters.";
      if (!user.ContactNo.match(/^\d{10}$/)) return "Contact number must be 10 digits.";
      return null;
    };

    const validationError = validateInputs();
    if (validationError) {
      toast.error(validationError);
      setLoading(false);
      return;
    }

    try {
      if (id) {
        // Update user
        await axios.put(
          `http://192.168.29.11:5000/api/add/${id}`,user,{
            headers : {
               "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
      });
        toast.success("User updated successfully!");
        navigate("/User");
      }
      else{
        await axios.post(`http://192.168.29.11:5000/api/add/adduser`, user,{
          headers : {
             "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
    });
         toast.success("Submitted successfully!");
         setTimeout(() => {
         navigate("/User");
         }, 500); 
       }
       
    } catch (error) {
      toast.error("Error submitting user data. Please try again.");
      console.error("Error submitting user data:", error);
    }
    };



    return (
    <>
    
      <div className="max-w-5xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg   border border-gray-300  ">
        <h2 className="text-xl font-bold mb-4">{id ? "Update User" : "Add User"}</h2>
      <hr />
      <form onSubmit={handleSubmit} className="space-y-4 mt-6"> 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="Name"
              value={user.Name}
              onChange={handleChange}
              placeholder="Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 "
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={ handleChange}
              placeholder="Email"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact No <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="ContactNo"
              value={user.ContactNo}
              onChange={handleChange}
              placeholder="Contact Number"
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth (DOB)
            </label>
            <input
              type="date"
              name="Dob"
              value={user.Dob}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Joining (DOJ)
            </label>
            <input
              type="date"
              name="Doj"
              value={user.Doj}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2"
            />
          </div>
          <div>       
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="deliveryman">Delivery man</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
             Region
            </label>
            <input
              type="text"
              name="region"
              value={user.region}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={user.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-between">
           <button 
              onClick={() => navigate("/User")}
            className="mt-3 px-5 py-2 hover:bg-purple-500 bg-gradient-to-r from-purple-600 to-green-500 text-white font-semibold rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
          Back
          </button>
          <button
            type="submit"  
            className="mt-3 px-5 py-2 hover:bg-purple-500 bg-gradient-to-r from-purple-600 to-green-500 text-white font-semibold rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
             {id ? "Update User" : "Add User"}
          </button>
         
        </div>
      </form>
    </div>
   
    </> 
);
};

export default Adduser;