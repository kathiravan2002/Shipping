import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import axios from "axios";
import { toast } from "react-toastify";
import apiurl from "../services/Apiendpoint";
import { Button } from "primereact/button";
import Exportdata from "./Exportdata";
import { apiaddusers, apigetFilter, apigetglobalFilter, apiupdateusers } from "../services/Apiusers/Apiusers";
import { user } from "@heroui/theme";

const Userpage = () => {
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
    pincode: "", 
    status: "",
  });

  const [availablePincodes, setAvailablePincodes] = useState([]); // Store pincodes in "pincode-officename" format

  const fetchFilterOptions = async () => {
    try {
      const response = await apigetFilter();
      const options = response || {};
      setFilterOptions(options);
    } catch (error) {
      console.log("Error fetching filter options", error);
      toast.error("Failed to fetch filter options. Please try again.");
    }
  };

  // Fetch filtered users
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

      const response = await apigetglobalFilter(queryParams);
      setTotalUsers(response || []);
    } catch (error) {
      console.log("Error fetching filtered user data", error);
      toast.error("Failed to fetch filtered users. Please try again.");
    }
  };

  // Fetch pincodes based on selected region
  const fetchPincodes = async (region) => {
    if (!region) {
      setAvailablePincodes([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=579b464db66ec23bdd0000019029558117064dd17c6931b0f89fb6ba&format=json&filters[statename]=Tamil Nadu&limit=40000`
      );
      const records = response.data.records;
      const filteredPincodes = records
        .filter(item => item.district.toLowerCase() === region.toLowerCase())
        .map(item => ({
          value: `${item.pincode}-${item.officename}`,
          label: `${item.pincode}-${item.officename}`,
        }));
      const uniquePincodes = [...new Set(filteredPincodes.map(pin => pin.value))].map(value => ({
        value,
        label: value,
      }));
      setAvailablePincodes(uniquePincodes);
      if (uniquePincodes.length === 0) {
        toast.error("No pincodes found for this region.");
      }
    } catch (error) {
      setAvailablePincodes([]);
      toast.error("Failed to fetch pincodes for the region.");
      console.error("Error fetching pincodes:", error);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchFilterOptions();
    fetchFilteredUsers(filterValues, globalFilter);
  }, []);

  // Fetch pincodes when region or role changes
  useEffect(() => {
    if (userForm.role.trim().toLowerCase() === "deliveryman" && userForm.region) {
      fetchPincodes(userForm.region);
    } else {
      setAvailablePincodes([]);
      setUserForm(prev => ({ ...prev, pincode: "" }));
    }
  }, [userForm.region, userForm.role]);

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
    setGlobalFilter("");
    fetchFilteredUsers(resetFilters, "");
  };

  const handleAddUserClick = () => {
    setIsEditMode(false);
    setUserForm({
      _id: "",
      Name: "",
      email: "",
      password: "",
      ContactNo: "",
      Dob: "",
      Doj: "",
      role: "",
      region: "",
      pincode: "", 
      status: "",
    });
    setDialogVisible(true);
  };

  const handleEditUserClick = async (userId) => {
    setIsEditMode(true);
    try {
      const response = await axios.get(`${apiurl()}/api/add/${userId}`);
      const fetchedUser = response.data;
      setUserForm({
        ...fetchedUser,
        role: fetchedUser.role ? fetchedUser.role.trim().toLowerCase() : "",
        pincode: fetchedUser.pincode || "", 
      });
      setDialogVisible(true);
    } catch (error) {
      toast.error("Failed to fetch user details. Please try again.");
      console.error("Error fetching user details:", error);
    }
  };

  const handleEdit = (rowData) => {
    setUserForm({
      ...rowData,
      role: rowData.role ? rowData.role.trim().toLowerCase() : "",
      pincode: rowData.pincode || "", 
    });
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
      // Validation for deliveryman
      if (userForm.role.trim().toLowerCase() === "deliveryman" && !userForm.pincode) {
        toast.error("Pincode must be selected for deliveryman.");
        return;
      }

      // Prepare the data to send to the backend
      const userData = { ...userForm };
      if (!isEditMode) {
        // When adding a new user, exclude the _id field to let MongoDB generate it
        delete userData._id;
      }

      if (isEditMode) {
        await apiupdateusers(userData);
        toast.success("User updated successfully!");
      } else {
        await apiaddusers(userData);
        toast.success("User added successfully!");
      }
      setDialogVisible(false);
      fetchFilteredUsers(filterValues, globalFilter);
      fetchFilterOptions();
    } catch (error) {
      toast.error("Failed to submit user data. Please try again.");
      console.error("Error submitting user data", error);
    }
  };

  const dialogFooter = (
    <div className="flex flex-col sm:flex-row justify-center gap-3 p-4 rounded-b-lg">
      <button
        onClick={() => setDialogVisible(false)}
        className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-md"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
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
          className="p-button-rounded p-button-success text-green-500"
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
        className="p-column-filter w-full"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder={`Search ${field}...`}
        disabled={!filterOptions[field]?.length}
      />
    );
  };
  console.log('pincode:',userForm.pincode);

  return (
    <>
      <div className="w-full mx-auto p-2 sm:p-4 md:p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg sm:text-3xl md:text-2xl font-semibold">User Management</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full sm:w-auto">
            <span className="p-input-icon-left">
              <InputText
                value={globalFilter}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  fetchFilteredUsers(filterValues, e.target.value);
                }}
                placeholder=" Search "
                className="w-full sm:w-24rem px-2 py-2 border rounded-lg"
              />
            </span>
            <Button
              onClick={resetAllFilters}
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-300 text-sm font-medium shadow-sm"
              icon="pi pi-filter-slash"
            />
            <button
              onClick={handleAddUserClick}
              className="flex items-center gap-2 px-2 py-2 text-purple-600 bg-purple-50 rounded-md text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </span>
            </button>
            <button>
              <Exportdata data={totalUsers} fileName="userdetails.csv" />
            </button>
            <h1 className="flex items-center gap-2 px-2 py-2 text-purple-600 bg-purple-50 rounded-md text-sm font-medium">
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
          className="p-datatable-striped text-sm text-gray-700 rounded-lg border border-gray-200"
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
            field="pincode" 
            header="Pincode"
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
          <div className="border-b pb-2">
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
            {userForm.role.trim().toLowerCase() === "deliveryman" && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Area (Pincode) <span className="text-red-500">*</span>
                </label>
                <select
                  name="pincode"
                  value={userForm.pincode}
                  onChange={handleChange}
                  className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
                >
                  <option value="">Select Pincode</option>
                  {availablePincodes.length > 0 ? (
                    availablePincodes.map(pin => (
                      <option key={pin.value} value={pin.value}>
                        {pin.label}
                      </option>
                    ))
                  ) : (
                    <option value="">No pincodes available</option>
                  )}
                </select>
              </div>
            )}
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
// import React, { useState, useEffect } from "react";
// import { Dialog } from "primereact/dialog";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { InputText } from "primereact/inputtext";
// import { MultiSelect } from "primereact/multiselect";
// import axios from "axios";
// import { toast } from "react-toastify";
// import apiurl from "../services/Apiendpoint";
// import { Button } from "primereact/button";
// import Exportdata from "./Exportdata";
// import { apiaddusers, apigetFilter, apigetglobalFilter, apiupdateusers } from "../services/Apiusers/Apiusers";

// const Userpage = () => {
//   const [dialogVisible, setDialogVisible] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [totalUsers, setTotalUsers] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [filterValues, setFilterValues] = useState({
//     Name: [],
//     role: [],
//     email: [],
//     ContactNo: [],
//     Dob: [],
//     Doj: [],
//     region: [],
//     status: [],
//   });
//   const [tempFilterValues, setTempFilterValues] = useState({
//     Name: [],
//     role: [],
//     email: [],
//     ContactNo: [],
//     Dob: [],
//     Doj: [],
//     region: [],
//     status: [],
//   });
//   const [filterOptions, setFilterOptions] = useState({
//     Name: [],
//     role: [],
//     email: [],
//     ContactNo: [],
//     Dob: [],
//     Doj: [],
//     region: [],
//     status: [],
//   });

//   const [userForm, setUserForm] = useState({
//     _id: "",
//     Name: "",
//     email: "",
//     password: "",
//     ContactNo: "",
//     Dob: "",
//     Doj: "",
//     role: "",
//     region: "",
//     status: "",
//   });

//   const fetchFilterOptions = async () => {
//     try {
//       const response = await apigetFilter();
//       const options = response || {};
//       setFilterOptions(options);
//       // console.log("Filter options loaded:", options);
//     } catch (error) {
//       console.log("Error fetching filter options", error);
//       toast.error("Failed to fetch filter options. Please try again.");
//     }
//   };

//   const fetchFilteredUsers = async (filters = {}, globalFilter = "") => {
//     try {
//       const queryParams = new URLSearchParams();
//       Object.keys(filters).forEach((key) => {
//         if (filters[key] && filters[key].length > 0) {
//           queryParams.append(key, filters[key].join(","));
//         }
//       });
//       if (globalFilter) {
//         queryParams.append("globalSearch", globalFilter);
//       }

//       const response = await apigetglobalFilter(queryParams);
//       setTotalUsers(response || []);
//     } catch (error) {
//       console.log("Error fetching filtered user data", error);
//       toast.error("Failed to fetch filtered users. Please try again.");
//     }
//   };

//   // Initial fetch on mount
//   useEffect(() => {
//     fetchFilterOptions();
//     fetchFilteredUsers(filterValues, globalFilter);
//   }, []); // Run only on mount

//   // Apply filters manually
//   const applyFilters = (field) => {
//     setFilterValues((prev) => ({ ...prev, [field]: tempFilterValues[field] }));
//     fetchFilteredUsers({ ...filterValues, [field]: tempFilterValues[field] }, globalFilter);
//   };

//   const resetAllFilters = () => {
//     const resetFilters = {
//       Name: [],
//       role: [],
//       email: [],
//       ContactNo: [],
//       Dob: [],
//       Doj: [],
//       region: [],
//       status: [],
//     };
//     setFilterValues(resetFilters);
//     setTempFilterValues(resetFilters);
//     setGlobalFilter(""); // Reset global filter as well
//     fetchFilteredUsers(resetFilters, ""); // Fetch unfiltered data
//   };
//   const handleAddUserClick = () => {
//     setIsEditMode(false);
//     setUserForm({
//       Name: "",
//       email: "",
//       password: "",
//       ContactNo: "",
//       Dob: "",
//       Doj: "",
//       role: "",
//       region: "",
//       status: "",
//     });
//     setDialogVisible(true);
//   };

//   const handleEditUserClick = async (userId) => {
//     setIsEditMode(true);
//     try {
//       const response = await axios.get(`${apiurl()}/api/add/${userId}`);
//       setUserForm(response.data);
//       setDialogVisible(true);
//     } catch (error) {
//       toast.error("Failed to fetch user details. Please try again.");
//       console.error("Error fetching user details:", error);
//     }
//   };
  

//   const handleEdit = (rowData) => {
//     setUserForm({ ...rowData });
//     setIsEditMode(true);
//     setDialogVisible(true);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       if (isEditMode) {
//         await apiupdateusers(userForm);
//         toast.success("User updated successfully!");
//       } else {
//         await apiaddusers(userForm);
//         toast.success("User added successfully!");
//       }
//       setDialogVisible(false);
//       fetchFilteredUsers(filterValues, globalFilter); // Refresh data after submit
//       fetchFilterOptions();
//     } catch (error) {
//       toast.error("Failed to submit user data. Please try again.");
//       console.error("Error submitting user data", error);
//     }
//   };

//   const dialogFooter = (
//     <div className="flex flex-col sm:flex-row justify-center gap-3 p-4 rounded-b-lg">
//       <button
//         onClick={() => setDialogVisible(false)}
//         className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-md"
//       >
//         Cancel
//       </button>
//       <button
//         onClick={handleSubmit}
//         className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
//       >
//         {isEditMode ? "Update User" : "Add User"}
//       </button>
//     </div>
//   );

//   const actionBodyTemplate = (rowData) => {
//     return (
//       <div className="flex gap-2">
//         <Button
//           icon="pi pi-pencil"
//           className="p-button-rounded p-button-success text-green-500"
//           onClick={() => handleEdit(rowData)}
//         />
//       </div>
//     );
//   };

//   const statusBodyTemplate = (rowData) => {
//     return (
//       <span
//         className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
//           rowData.status === "active" ? "bg-green-200 text-green-700" : "bg-red-100 text-red-600"
//         }`}
//       >
//         {rowData.status}
//       </span>
//     );
//   };

//   const multiSelectFilterTemplate = (options, field) => {
//     return (
//       <MultiSelect
//         value={tempFilterValues[field]} 
//         options={[...(filterOptions[field] || []).map((option) => ({
//           label: option,
//           value: option,
//         }))]}
//         onChange={(e) => {
//           setTempFilterValues((prev) => ({ ...prev, [field]: e.value || [] }));
//         }}
//         panelFooterTemplate={(props) => (
//           <div className="flex justify-between p-2 mt-2">
//             <Button
//               label="Clear"
//               onClick={() => {
//                 setTempFilterValues((prev) => ({ ...prev, [field]: [] }));
//                 setFilterValues((prev) => ({ ...prev, [field]: [] }));
//                 fetchFilteredUsers({ ...filterValues, [field]: [] }, globalFilter); 
//                 props.hide();
//               }}
//               className="p-1 text-white bg-purple-400 w-[45%]"
//             />
//             <Button
//               label="Apply"
//               onClick={() => {
//                 applyFilters(field); 
//                 props.hide();
//               }}
//               className="p-1 mx-1 text-white bg-purple-400 w-[45%]"
//             />
//           </div>
//         )}
//         placeholder="Any"
//         className="p-column-filter w-full"
//         maxSelectedLabels={3}
//         selectedItemsLabel="{0} items selected"
//         filter
//         filterPlaceholder={`Search ${field}...`}
//         disabled={!filterOptions[field]?.length}
//       />
//     );
//   };

//   return (
//     <>
//       <div className="w-full mx-auto p-2 sm:p-4 md:p-6 bg-white shadow-lg rounded-lg border border-gray-200">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <h2 className="text-lg sm:text-3xl md:text-2xl font-semibold">User Management</h2>
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full sm:w-auto">
//             <span className="p-input-icon-left">
//               <InputText
//                 value={globalFilter}
//                 onChange={(e) => {
//                   setGlobalFilter(e.target.value);
//                   fetchFilteredUsers(filterValues, e.target.value); 
//                 }}
//                 placeholder=" Search "
//                 className="w-full sm:w-24rem px-2 py-2 border rounded-lg"
//               />
//             </span>
//             <Button
//             onClick={resetAllFilters}
//             className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-300 text-sm font-medium shadow-sm"
//             icon="pi pi-filter-slash"
//           />
//             <button
//               onClick={handleAddUserClick}
//               className="flex items-center gap-2 px-2 py-2 text-purple-600 bg-purple-50 rounded-md text-sm font-medium "
//             >
//               <span className="flex items-center gap-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//                 </svg>
//                 Add User
//               </span>
//             </button>
//             <button><Exportdata data={totalUsers}  fileName="userdetails.csv"/></button>
//             <h1 className="flex items-center gap-2 px-2 py-2 text-purple-600 bg-purple-50 rounded-md text-sm font-medium ">
//               Total Users: <span className="text-xl">{totalUsers.length}</span>
//             </h1>
//           </div>
//         </div>
//         <hr className="mt-4" />
//         <DataTable
//           value={totalUsers}
//           paginator
//           rows={10}
//           scrollable
//           scrollHeight="650px"
//           showGridlines
//           rowsPerPageOptions={[10, 25, 50, 100]}
//           tableStyle={{ minWidth: "25rem" }}
//           className="p-datatable-striped text-sm text-gray-700 rounded-lg border border-gray-200"
//           emptyMessage="No users found."
//           filterDisplay="menu"
//           globalFilter={globalFilter}
//           filters={filterValues}
//         >
//           <Column header="S.No" body={(data, options) => options.rowIndex + 1} style={{ width: "4rem" }} />
//           <Column header="Actions" body={actionBodyTemplate} />
//           <Column
//             field="Name"
//             header="Name"
//             filter
//             filterElement={(options) => multiSelectFilterTemplate(options, "Name")}
//             className="font-medium text-indigo-600"
//             showFilterMenu
//             showFilterMatchModes={false}
//           />
//           <Column
//             field="role"
//             header="Role"
//             filter
//             filterElement={(options) => multiSelectFilterTemplate(options, "role")}
//             showFilterMenu
//             showFilterMatchModes={false}
//           />

//           <Column
//             field="email"
//             header="Email"
//             filter
//             filterElement={(options) => multiSelectFilterTemplate(options, "email")}
//             showFilterMenu
//             showFilterMatchModes={false}
//           />
//           <Column
//             field="password"
//             header="Password"
//             filter
//             filterElement={(options) => multiSelectFilterTemplate(options, "password")}
//             showFilterMenu
//             showFilterMatchModes={false}
//           />
//           <Column
//             field="ContactNo"
//             header="Contact No"
//             filter
//             filterElement={(options) => multiSelectFilterTemplate(options, "ContactNo")}
//             showFilterMenu
//             showFilterMatchModes={false}
//           />
//           <Column
//             field="Dob"
//             header="Date of Birth"
//             filter
//             filterElement={(options) => multiSelectFilterTemplate(options, "Dob")}
//             showFilterMenu
//             showFilterMatchModes={false}
//           />
//           <Column
//             field="Doj"
//             header="Date of Joining"
//             filter
//             filterElement={(options) => multiSelectFilterTemplate(options, "Doj")}
//             showFilterMenu
//             showFilterMatchModes={false}
//           />
//           <Column
//             field="region"
//             header="Region"
//             filter
//             filterElement={(options) => multiSelectFilterTemplate(options, "region")}
//             showFilterMenu
//             showFilterMatchModes={false}
//           />
//           <Column
//             header="Status"
//             body={statusBodyTemplate}
//             field="status"
//             filter
//             filterElement={(options) => multiSelectFilterTemplate(options, "status")}
//             showFilterMenu
//             showFilterMatchModes={false}
//           />
//         </DataTable>
//       </div>

//       <Dialog
//         header={
//           <div className="border-b pb-2">
//             <h2 className="text-xl font-semibold text-gray-800">
//               {isEditMode ? "Update User" : "Add New User"}
//             </h2>
//           </div>
//         }
//         visible={dialogVisible}
//         className="w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] max-h-[90vh] overflow-y-auto"
//         footer={dialogFooter}
//         onHide={() => setDialogVisible(false)}
//       >
//         <form className="space-y-4 mt-4 sm:mt-6 px-2 sm:px-4">
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                 Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="Name"
//                 value={userForm.Name}
//                 onChange={handleChange}
//                 placeholder="Name"
//                 className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={userForm.email}
//                 onChange={handleChange}
//                 placeholder="Email"
//                 className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={userForm.password}
//                 onChange={handleChange}
//                 placeholder="Password"
//                 className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                 Contact No <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 maxLength="10"
//                 name="ContactNo"
//                 value={userForm.ContactNo}
//                 onChange={(e) => {
//                   if (e.target.value.length <= 10) {
//                     handleChange(e);
//                   }
//                 }}
//                 placeholder="Contact Number"
//                 className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                 Date of Birth (DOB)
//               </label>
//               <input
//                 type="date"
//                 name="Dob"
//                 value={userForm.Dob}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                 Date of Joining (DOJ)
//               </label>
//               <input
//                 type="date"
//                 name="Doj"
//                 value={userForm.Doj}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
//               />
//             </div>
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                 Role
//               </label>
//               <select
//                 name="role"
//                 value={userForm.role}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
//               >
//                 <option value="">Select Role</option>
//                 <option value="admin">Admin</option>
//                 <option value="user">User</option>
//                 <option value="manager">Manager</option>
//                 <option value="subdistributor">Sub Distributor</option>
//                 <option value="deliveryman">Delivery man</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                 Region
//               </label>
//               <select
//                 name="region"
//                 value={userForm.region}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
//               >
//                 <option value="">Select Region</option>
//                 <option value="Ariyalur">Ariyalur</option>
//                 <option value="Chengalpattu">Chengalpattu</option>
//                 <option value="Chennai">Chennai</option>
//                 <option value="Coimbatore">Coimbatore</option>
//                 <option value="Cuddalore">Cuddalore</option>
//                 <option value="Dharmapuri">Dharmapuri</option>
//                 <option value="Dindigul">Dindigul</option>
//                 <option value="Erode">Erode</option>
//                 <option value="Kallakurichi">Kallakurichi</option>
//                 <option value="Kanchipuram">Kanchipuram</option>
//                 <option value="Kanniyakumari">Kanniyakumari</option>
//                 <option value="Karur">Karur</option>
//                 <option value="Krishnagiri">Krishnagiri</option>
//                 <option value="Madurai">Madurai</option>
//                 <option value="Mayiladuthurai">Mayiladuthurai</option>
//                 <option value="Nagapattinam">Nagapattinam</option>
//                 <option value="Namakkal">Namakkal</option>
//                 <option value="Perambalur">Perambalur</option>
//                 <option value="Pudukkottai">Pudukkottai</option>
//                 <option value="Ramanathapuram">Ramanathapuram</option>
//                 <option value="Ranipet">Ranipet</option>
//                 <option value="Salem">Salem</option>
//                 <option value="Sivaganga">Sivaganga</option>
//                 <option value="Tenkasi">Tenkasi</option>
//                 <option value="Thanjavur">Thanjavur</option>
//                 <option value="The Nilgiris">The Nilgiris</option>
//                 <option value="Theni">Theni</option>
//                 <option value="Thiruvallur">Thiruvallur</option>
//                 <option value="Thiruvarur">Thiruvarur</option>
//                 <option value="Tiruchirappalli">Tiruchirappalli</option>
//                 <option value="Tirunelveli">Tirunelveli</option>
//                 <option value="Tirupathur">Tirupathur</option>
//                 <option value="Tiruppur">Tiruppur</option>
//                 <option value="Tiruvannamalai">Tiruvannamalai</option>
//                 <option value="Tuticorin">Tuticorin</option>
//                 <option value="Vellore">Vellore</option>
//                 <option value="Villupuram">Villupuram</option>
//                 <option value="Virudhunagar">Virudhunagar</option>
//               </select>
//             </div>
//             <div className="col-span-1 sm:col-span-2">
//               <label className="block text-xs sm:text-sm font-medium text-gray-700">
//                 Status
//               </label>
//               <select
//                 name="status"
//                 value={userForm.status}
//                 onChange={handleChange}
//                 className="mt-1 block w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md shadow-sm focus:outline-none focus:ring-purple-700 focus:ring-2 text-xs sm:text-sm"
//               >
//                 <option value="">Select Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>
//         </form>
//       </Dialog>
//     </>
//   );
// };

// export default Userpage;
