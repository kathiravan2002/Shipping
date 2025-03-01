import React, { useState, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import axios from "axios";
import { toast } from "react-toastify";
import Apiendpoint from "../services/Apiendpoint";

const Userpage = ({ filteredUsers, selectedRole, navigate, handleRoleChange, refreshUsers }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userForm, setUserForm] = useState({
    _id: "",
    Name: "",
    email: "",
    password: "",
    ContactNo: "",
    Dob: "",
    Doj: "",
    role: "",
    region: "",
    status: "",
  });

  const handleAddUserClick = () => {
    setIsEditMode(false);
    setUserForm({
      Name: "",
      email: "",
      password: "",
      ContactNo: "",
      Dob: "",
      Doj: "",
      role: "",
      region: "",
      status: "",
    });
    setDialogVisible(true);
  };

  const handleEditUserClick = async (userId) => {
    setIsEditMode(true);
    try {
      const response = await axios.get(`${Apiendpoint}/api/add/${userId}`);
      setUserForm(response.data);
      setDialogVisible(true);
    } catch (error) {
      toast.error("Failed to fetch user details. Please try again.");
      console.error("Error fetching user details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateInputs = () => {
      if (userForm.password.length < 6) return "Password must be at least 6 characters.";
      if (!userForm.ContactNo.match(/^\d{10}$/)) return "Contact number must be 10 digits.";
      return null;
    };

    const validationError = validateInputs();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload = { ...userForm };
    if (!isEditMode) {
      delete payload._id;
    }

    try {
      if (isEditMode) {
        await axios.put(
          `${Apiendpoint}/api/add/${userForm._id}`,
          payload,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
          }
        );
        toast.success("User updated successfully!");
      } else {
        await axios.post(
          `${Apiendpoint}/api/add/adduser`,
          payload,
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
          }
        );
        toast.success("User added successfully!");
      }
      setDialogVisible(false);
      refreshUsers();
    } catch (error) {
      toast.error("Error submitting user data. Please try again.");
      console.error("Error submitting user data:", error);
    }
  };

  const dialogFooter = (
    <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 bg-gray-50 rounded-b-lg">
      <button
        onClick={() => setDialogVisible(false)}
        className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-md"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
      >
        {isEditMode ? "Update User" : "Add User"}
      </button>
    </div>
  );

  return (
    <>
      <div className="w-full mx-auto p-2 sm:p-4 md:p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg sm:text-3xl md:text-2xl font-semibold">User Management</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full sm:w-auto">
            <h1 className="text-lg sm:text-xl font-medium">Filter by</h1>
            <select
              className="w-full sm:w-auto px-2 py-2  border rounded-md  sm:text-base bg-purple-700 text-white"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
              <option value="subdistributor">Distributor</option>
              <option value="deliveryman">Deliveryman</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          <button
              onClick={handleAddUserClick}
              className="w-full sm:w-auto px-2 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </span>
            </button>
          </div>
        </div>
        <hr className="mt-4" />
        <div className="mt-4 overflow-x-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
          <div className="min-w-[768px] bg-white shadow-lg rounded-lg border border-gray-200">
            <table className="w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {["No", "Name", "Email", "Password", "ContactNo", "Dob", "Doj", "Role", "Region", "Status", "Action"].map((header) => (
                    <th key={header} className="px-2 sm:px-4 py-2 text-left font-semibold text-gray-600 uppercase whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{index + 1}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-indigo-600">{user.Name}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{user.email}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{user.password}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{user.ContactNo}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{user.Dob}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{user.Doj}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap capitalize">{user.role}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">{user.region}</td>
                       <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-200 text-green-700' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm"
                          onClick={() => handleEditUserClick(user._id)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-6 sm:py-10">
                      <div className="flex flex-col items-center">
                        <p className="text-gray-600 mt-4 font-semibold text-lg sm:text-2xl">No User List Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog
        header={<div className="border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditMode ? "Update User" : "Add New User"}
          </h2>
        </div>}
        visible={dialogVisible}
        className="w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] max-h-[90vh] overflow-y-auto"
        footer={dialogFooter}
        onHide={() => setDialogVisible(false)}
      >
        <form className="space-y-4 mt-4 sm:mt-6 px-2 sm:px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Name"
                value={userForm.Name}
                onChange={handleChange}
                placeholder="Name"
                className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleChange}
                placeholder="Email"
                className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleChange}
                placeholder="Password"
                className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Contact No <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                maxLength="10"
                name="ContactNo"
                value={userForm.ContactNo}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    handleChange(e);
                  }
                }}
                placeholder="Contact Number"
                className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Date of Birth (DOB)
              </label>
              <input
                type="date"
                name="Dob"
                value={userForm.Dob}
                onChange={handleChange}
                className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Date of Joining (DOJ)
              </label>
              <input
                type="date"
                name="Doj"
                value={userForm.Doj}
                onChange={handleChange}
                className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={userForm.role}
                onChange={handleChange}
                className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="subdistributor">Sub Distributor</option>
                <option value="deliveryman">Delivery man</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Region
              </label>
              <select
                name="region"
                value={userForm.region}
                onChange={handleChange}
                className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
              >
                <option value="">Select Region</option>
                <option value="Ariyalur">Ariyalur</option>
                <option value="Chengalpattu">Chengalpattu</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Cuddalore">Cuddalore</option>
                <option value="Dharmapuri">Dharmapuri</option>
                <option value="Dindigul">Dindigul</option>
                <option value="Erode">Erode</option>
                <option value="Kallakurichi">Kallakurichi</option>
                <option value="Kanchipuram">Kanchipuram</option>
                <option value="Kanniyakumari">Kanniyakumari</option>
                <option value="Karur">Karur</option>
                <option value="Krishnagiri">Krishnagiri</option>
                <option value="Madurai">Madurai</option>
                <option value="Mayiladuthurai">Mayiladuthurai</option>
                <option value="Nagapattinam">Nagapattinam</option>
                <option value="Namakkal">Namakkal</option>
                <option value="Perambalur">Perambalur</option>
                <option value="Pudukkottai">Pudukkottai</option>
                <option value="Ramanathapuram">Ramanathapuram</option>
                <option value="Ranipet">Ranipet</option>
                <option value="Salem">Salem</option>
                <option value="Sivaganga">Sivaganga</option>
                <option value="Tenkasi">Tenkasi</option>
                <option value="Thanjavur">Thanjavur</option>
                <option value="The Nilgiris">The Nilgiris</option>
                <option value="Theni">Theni</option>
                <option value="Thiruvallur">Thiruvallur</option>
                <option value="Thiruvarur">Thiruvarur</option>
                <option value="Tiruchirappalli">Tiruchirappalli</option>
                <option value="Tirunelveli">Tirunelveli</option>
                <option value="Tirupathur">Tirupathur</option>
                <option value="Tiruppur">Tiruppur</option>
                <option value="Tiruvannamalai">Tiruvannamalai</option>
                <option value="Tuticorin">Tuticorin</option>
                <option value="Vellore">Vellore</option>
                <option value="Villupuram">Villupuram</option>
                <option value="Virudhunagar">Virudhunagar</option>
              </select>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={userForm.status}
                onChange={handleChange}
                className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default Userpage;