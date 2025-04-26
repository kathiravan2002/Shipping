/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import { toast } from "react-toastify";
import { Button } from "primereact/button";
import Datatable from "./DataTable";
import Adduser from "./Adduser";
import Tableheadpanel from "./Tableheadpanel";
import { apigetFilter, apigetglobalFilter, apiSaveusers, apiupdateusers } from "../../services/Apiusers/apiusers";

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
    status: "",
  });

  const fetchFilterOptions = async () => {
    try {
      const response = await apigetFilter();
      const options = response || {};
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

      const response = await apigetglobalFilter(queryParams);
      setTotalUsers(response || []);
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
        await apiupdateusers(userForm);
        toast.success("User updated successfully!");
      } else {
        await apiSaveusers(userForm);
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
    <div className="flex flex-col justify-center gap-3 p-4 rounded-b-lg sm:flex-row">
      <button onClick={() => setDialogVisible(false)}
        className="w-full px-6 py-2 font-semibold text-gray-700 transition-all duration-300 bg-gray-200 rounded-lg shadow-md sm:w-auto hover:bg-gray-300"
      >
        Cancel
      </button>
      <button onClick={handleSubmit}
        className="w-full px-6 py-2 font-semibold text-white transition-all duration-300 bg-purple-600 rounded-lg shadow-md sm:w-auto hover:from-purple-700 hover:to-indigo-700"
      >
        {isEditMode ? "Update User" : "Add User"}
      </button>
    </div>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button icon="pi pi-pencil" className="text-green-500 p-button-rounded p-button-success" onClick={() => handleEdit(rowData)} />
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
        <Tableheadpanel
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          fetchFilteredUsers={fetchFilteredUsers}
          resetAllFilters={resetAllFilters}
          handleAddUserClick={handleAddUserClick}
          totalUsers={totalUsers}
          filterValues={filterValues}
        />
        <hr className="mt-4" />
        <Datatable
          totalUsers={totalUsers}
          globalFilter={globalFilter}
          filterValues={filterValues}
          actionBodyTemplate={actionBodyTemplate}
          multiSelectFilterTemplate={multiSelectFilterTemplate}
          statusBodyTemplate={statusBodyTemplate}
        />
      </div>

      <Adduser
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
        userForm={userForm}
        handleChange={handleChange}
        isEditMode={isEditMode}
        dialogFooter={dialogFooter}
      />
    </>
  );
};

export default Userpage;