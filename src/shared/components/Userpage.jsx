import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import axios from "axios";
import { toast } from "react-toastify";
import Apiendpoint from "../services/Apiendpoint/Apiendpoint";
import { Button } from "primereact/button";
import Exportdata from "./Exportdata";
import apiurl from "../services/Apiendpoint/Apiendpoint";

const Userpage = ({ filteredUsers, selectedRole, navigate, handleRoleChange, refreshUsers }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [totalUsers, setTotalUsers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterValues, setFilterValues] = useState({
    Name: [],
    role: [],
    email: [],
    ContactNo: [],
    Dob: [],
    Doj: [],
    region: [],
    status: [],
  });
  const [tempFilterValues, setTempFilterValues] = useState({
    Name: [],
    role: [],
    email: [],
    ContactNo: [],
    Dob: [],
    Doj: [],
    region: [],
    status: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    Name: [],
    role: [],
    email: [],
    ContactNo: [],
    Dob: [],
    Doj: [],
    region: [],
    status: [],
  });

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

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(`${Apiendpoint}/api/add/get/filter`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const options = response.data || {};
      setFilterOptions(options);
      console.log("Filter options loaded:", options);
    } catch (error) {
      console.log("Error fetching filter options", error);
      toast.error("Failed to fetch filter options. Please try again.");
    }
  };

  const fetchFilteredUsers = async (filters = {}, globalFilter = "") => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key].length > 0) {
          queryParams.append(key, filters[key].join(","));
        }
      });
      if (globalFilter) {
        queryParams.append("globalSearch", globalFilter);
      }

      const response = await axios.get(
        `${apiurl()}/api/add/getuser?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setTotalUsers(response.data || []);
    } catch (error) {
      console.log("Error fetching filtered user data", error);
      toast.error("Failed to fetch filtered users. Please try again.");
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchFilterOptions();
    fetchFilteredUsers(filterValues, globalFilter);
  }, []); // Run only on mount

  // Apply filters manually
  const applyFilters = (field) => {
    setFilterValues((prev) => ({ ...prev, [field]: tempFilterValues[field] }));
    fetchFilteredUsers({ ...filterValues, [field]: tempFilterValues[field] }, globalFilter);
  };

  const resetAllFilters = () => {
    const resetFilters = {
      Name: [],
      role: [],
      email: [],
      ContactNo: [],
      Dob: [],
      Doj: [],
      region: [],
      status: [],
    };
    setFilterValues(resetFilters);
    setTempFilterValues(resetFilters);
    setGlobalFilter(""); // Reset global filter as well
    fetchFilteredUsers(resetFilters, ""); // Fetch unfiltered data
  };
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

  const handleEdit = (rowData) => {
    setUserForm({ ...rowData });
    setIsEditMode(true);
    setDialogVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${Apiendpoint}/api/add/${userForm._id}`, userForm, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("User updated successfully!");
      } else {
        await axios.post(`${Apiendpoint}/api/add/adduser`, userForm, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("User added successfully!");
      }
      setDialogVisible(false);
      fetchFilteredUsers(filterValues, globalFilter); // Refresh data after submit
      fetchFilterOptions();
    } catch (error) {
      toast.error("Failed to submit user data. Please try again.");
      console.error("Error submitting user data", error);
    }
  };

  const dialogFooter = (
    <div className="flex flex-col justify-center gap-3 p-4 rounded-b-lg sm:flex-row">
      <button
        onClick={() => setDialogVisible(false)}
        className="w-full px-6 py-2 font-semibold text-gray-700 transition-all duration-300 bg-gray-200 rounded-lg shadow-md sm:w-auto hover:bg-gray-300"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="w-full px-6 py-2 font-semibold text-white transition-all duration-300 bg-purple-600 rounded-lg shadow-md sm:w-auto hover:from-purple-700 hover:to-indigo-700"
      >
        {isEditMode ? "Update User" : "Add User"}
      </button>
    </div>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="text-green-500 p-button-rounded p-button-success"
          onClick={() => handleEdit(rowData)}
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
          rowData.status === "active" ? "bg-green-200 text-green-700" : "bg-red-100 text-red-600"
        }`}
      >
        {rowData.status}
      </span>
    );
  };

  const multiSelectFilterTemplate = (options, field) => {
    return (
      <MultiSelect
        value={tempFilterValues[field]} 
        options={[...(filterOptions[field] || []).map((option) => ({
          label: option,
          value: option,
        }))]}
        onChange={(e) => {
          setTempFilterValues((prev) => ({ ...prev, [field]: e.value || [] }));
        }}
        panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button
              label="Clear"
              onClick={() => {
                setTempFilterValues((prev) => ({ ...prev, [field]: [] }));
                setFilterValues((prev) => ({ ...prev, [field]: [] }));
                fetchFilteredUsers({ ...filterValues, [field]: [] }, globalFilter); 
                props.hide();
              }}
              className="p-1 text-white bg-purple-400 w-[45%]"
            />
            <Button
              label="Apply"
              onClick={() => {
                applyFilters(field); 
                props.hide();
              }}
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]"
            />
          </div>
        )}
        placeholder="Any"
        className="w-full p-column-filter"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder={`Search ${field}...`}
        disabled={!filterOptions[field]?.length}
      />
    );
  };

  return (
    <>
      <div className="w-full p-2 mx-auto bg-white border border-gray-200 rounded-lg shadow-lg sm:p-4 md:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-lg font-semibold sm:text-3xl md:text-2xl">User Management</h2>
          <div className="flex flex-col items-start justify-between w-full gap-4 sm:flex-row sm:items-center sm:w-auto">
            <span className="p-input-icon-left">
              <InputText
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  fetchFilteredUsers(filterValues, e.target.value); 
                }}
                placeholder=" Search "
                className="w-full px-2 py-2 border rounded-lg sm:w-24rem"
              />
            </span>
            <Button
            onClick={resetAllFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 transition-all duration-300 bg-purple-100 rounded-lg shadow-sm hover:bg-purple-200"
            icon="pi pi-filter-slash"
          />
            <button
              onClick={handleAddUserClick}
              className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-purple-600 rounded-md bg-purple-50 "
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </span>
            </button>
            <button><Exportdata data={totalUsers}  fileName="userdetails.csv"/></button>
            <h1 className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-purple-600 rounded-md bg-purple-50 ">
              Total Users: <span className="text-xl">{totalUsers.length}</span>
            </h1>
          </div>
        </div>
        <hr className="mt-4" />
        <DataTable
          value={totalUsers}
          paginator
          rows={10}
          scrollable
          scrollHeight="650px"
          showGridlines
          rowsPerPageOptions={[10, 25, 50, 100]}
          tableStyle={{ minWidth: "25rem" }}
          className="text-sm text-gray-700 border border-gray-200 rounded-lg p-datatable-striped"
          emptyMessage="No users found."
          filterDisplay="menu"
          globalFilter={globalFilter}
          filters={filterValues}
        >
          <Column header="S.No" body={(data, options) => options.rowIndex + 1} style={{ width: "4rem" }} />
          <Column header="Actions" body={actionBodyTemplate} />
          <Column
            field="Name"
            header="Name"
            filter
            filterElement={(options) => multiSelectFilterTemplate(options, "Name")}
            className="font-medium text-indigo-600"
            showFilterMenu
            showFilterMatchModes={false}
          />
          <Column
            field="role"
            header="Role"
            filter
            filterElement={(options) => multiSelectFilterTemplate(options, "role")}
            showFilterMenu
            showFilterMatchModes={false}
          />

          <Column
            field="email"
            header="Email"
            filter
            filterElement={(options) => multiSelectFilterTemplate(options, "email")}
            showFilterMenu
            showFilterMatchModes={false}
          />
          <Column
            field="password"
            header="Password"
            filter
            filterElement={(options) => multiSelectFilterTemplate(options, "password")}
            showFilterMenu
            showFilterMatchModes={false}
          />
          <Column
            field="ContactNo"
            header="Contact No"
            filter
            filterElement={(options) => multiSelectFilterTemplate(options, "ContactNo")}
            showFilterMenu
            showFilterMatchModes={false}
          />
          <Column
            field="Dob"
            header="Date of Birth"
            filter
            filterElement={(options) => multiSelectFilterTemplate(options, "Dob")}
            showFilterMenu
            showFilterMatchModes={false}
          />
          <Column
            field="Doj"
            header="Date of Joining"
            filter
            filterElement={(options) => multiSelectFilterTemplate(options, "Doj")}
            showFilterMenu
            showFilterMatchModes={false}
          />
          <Column
            field="region"
            header="Region"
            filter
            filterElement={(options) => multiSelectFilterTemplate(options, "region")}
            showFilterMenu
            showFilterMatchModes={false}
          />
          <Column
            header="Status"
            body={statusBodyTemplate}
            field="status"
            filter
            filterElement={(options) => multiSelectFilterTemplate(options, "status")}
            showFilterMenu
            showFilterMatchModes={false}
          />
        </DataTable>
      </div>

      <Dialog
        header={
          <div className="pb-2 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              {isEditMode ? "Update User" : "Add New User"}
            </h2>
          </div>
        }
        visible={dialogVisible}
        className="w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] max-h-[90vh] overflow-y-auto"
        footer={dialogFooter}
        onHide={() => setDialogVisible(false)}
      >
        <form className="px-2 mt-4 space-y-4 sm:mt-6 sm:px-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Name"
                value={userForm.Name}
                onChange={handleChange}
                placeholder="Name"
                className="block w-full px-2 py-1 mt-1 text-xs border border-gray-300 rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleChange}
                placeholder="Email"
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleChange}
                placeholder="Password"
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
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
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Date of Birth (DOB)
              </label>
              <input
                type="date"
                name="Dob"
                value={userForm.Dob}
                onChange={handleChange}
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Date of Joining (DOJ)
              </label>
              <input
                type="date"
                name="Doj"
                value={userForm.Doj}
                onChange={handleChange}
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Role
              </label>
              <select
                name="role"
                value={userForm.role}
                onChange={handleChange}
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
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
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Region
              </label>
              <select
                name="region"
                value={userForm.region}
                onChange={handleChange}
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
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
              <label className="block text-xs font-medium text-gray-700 sm:text-sm">
                Status
              </label>
              <select
                name="status"
                value={userForm.status}
                onChange={handleChange}
                className="block w-full px-2 py-1 mt-1 text-xs border rounded-md shadow-sm sm:px-3 sm:py-2 focus:outline-none focus:ring-purple-700 focus:ring-2 sm:text-sm"
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


// import React from "react";

// const Userpage = (props) => {
   
//  const {user,edituser,navigate} = props;

//   return (
//     <>
//       <div className="w-full p-4 mx-auto bg-white border border-gray-200 rounded-sm shadow-lg sm:p-6">
//         <div className="flex justify-between ">
//           <h2 className="text-xl font-medium sm:text-2xl">User List</h2>
//           <button
//             onClick={() => navigate("/Adduser")}
//             className="px-4 py-2 text-sm text-white transition-all duration-300 bg-purple-700 rounded-md hover:bg-purple-800"
//           >
//             +Add User
//           </button>
//         </div>
//         <hr className="mt-4" />

//         <div className="mt-4 overflow-x-auto">
//           <div className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
//             <table className="min-w-full text-sm divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
        
//                 {["No","Name","Email","Password","ContactNo","Dob","Doj","Role","Region","Status","Action"].map((header)=>(
//                     <th key={header} className="px-4 py-2 font-medium text-left text-gray-500 uppercase" >
//                         {header}
//                     </th>
//                 ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {user?.length >0 ? (user.map((user, index) => (
//                   <tr key={index}>
//                     <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
//                     <td className="px-4 py-3 text-indigo-600 whitespace-nowrap">{user.Name}</td>
//                     <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
//                     <td className="px-4 py-3 whitespace-nowrap">{user.password}</td>
//                     <td className="px-4 py-3 whitespace-nowrap">{user.ContactNo}</td>
//                     <td className="px-4 py-3 whitespace-nowrap">{user.Dob}</td>
//                     <td className="px-4 py-3 whitespace-nowrap">{user.Doj}</td>
//                     <td className="px-4 py-3 whitespace-nowrap">{user.role}</td>
//                     <td className="px-4 py-3 whitespace-nowrap">{user.region}</td>
//                     <td className="px-4 py-3 whitespace-nowrap"><button className="px-2 font-medium text-white bg-green-500 rounded-lg ">{user.status}</button></td>
//                     <td className="px-4 py-3 space-x-2 whitespace-nowrap">
//                       <button className="text-blue-600 hover:text-blue-900" onClick={()=>edituser({ _id: user._id})}>Edit</button>
//                       {/* <button className="text-red-600 hover:text-red-900">Delete</button> */}
//                     </td>
//                   </tr>
//                 ))
//                 ):(
//                 <tr>
//                     <td colSpan="9" className="py-10 text-center">
//                         <div className="flex flex-col items-center">
                                     
//                         <p className="mt-4 text-2xl font-semibold text-gray-600">
//                             Add User List 
//                         </p>
                                        
//                         </div>
//                     </td>
//                 </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
        
//       </div>
//     </>
//   );
// };

// export default Userpage;
