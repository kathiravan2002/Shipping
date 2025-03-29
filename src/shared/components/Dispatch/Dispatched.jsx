/* eslint-disable react/prop-types */
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import Tableheadpanel from "./Tableheadpanel";
import Datatable from "./Datatable";

function Dispatched(props) {
  const {
    handleInputChange,
    handleImageUpload,
    getNextAllowedStatuses,
    CONSIGNEE_STATUS,
    updateOrder,
    formData,
    setFormData,
    dispatch,
    visible,
    setVisible,
    applyFilters,
  } = props;

  const [globalFilter, setGlobalFilter] = useState(""); 
  // State for filters
  const [filters, setFilters] = useState({
    cid: { value: null, matchMode: "in" },
    Consigneename: { value: null, matchMode: "in" },
    consigneeedistrict: { value: null, matchMode: "in" },
    cstatus: { value: null, matchMode: "in" },
    consigneepin:{ value: null, matchMode: "in"},
    consigneemobileno:{ value: null, matchMode: "in"}

  });

  const getDispatcheddate = (statusHistory) => {
    const dispatchedEntry = statusHistory.find(entry => entry.status === CONSIGNEE_STATUS.DISPATCHED);
    return dispatchedEntry ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(0, 8) : "N/A";
  };

  const getDispatchedTime = (statusHistory) => {
    const dispatchedEntry = statusHistory.find(entry => entry.status === CONSIGNEE_STATUS.DISPATCHED);
    return dispatchedEntry ? new Date(dispatchedEntry.timestamp).toLocaleString().slice(9) : "N/A";
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        icon={<Pencil />}
        onClick={() => {
          setFormData({ ...rowData, cid: rowData.cid });
          setVisible(true);
        }}
        className="p-button-text"
      />
    );
  };

  

  // Filter templates
  const multiSelectFilterTemplate = (options, field, placeholder) => {
    const uniqueValues = [...new Set(dispatch.map(item => item[field]))];
    return (
      <MultiSelect
        value={options.value}
        options={uniqueValues.map(value => ({ label: value, value }))}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder={placeholder}
        className="p-column-filter"
        maxSelectedLabels={1}
        style={{ minWidth: '12rem' }}
        filter
        filterPlaceholder={`Search ${placeholder}`}
      />
    );
  };

   // Handle global filter change
   const handleGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilter(value);
    applyFilters({ ...filters, search: value }); // Pass the search term to applyFilters
  };

  const resetFilters = () => {
    const resetFiltersState = {
      cid: { value: null, matchMode: "in" },
      Consigneename: { value: null, matchMode: "in" },
      consigneeedistrict: { value: null, matchMode: "in" },
      cstatus: { value: null, matchMode: "in" },
      consigneepin:{ value: null, matchMode: "in"},
      consigneemobileno:{ value: null, matchMode: "in"}
    };
    setFilters(resetFiltersState);
    setGlobalFilter("");
    applyFilters({}); // Reset filters on the backend as well
  };
  return (
    <div className="w-full p-4 mx-auto bg-white border border-gray-200 rounded-sm shadow-lg sm:p-6">
     <Tableheadpanel dispatch={dispatch} globalFilter={globalFilter} handleGlobalFilterChange={handleGlobalFilterChange} resetFilters={resetFilters}  />
      
      <div className="mt-4 overflow-x-auto">
        <Datatable dispatch={dispatch} visible={visible} setVisible={setVisible} handleInputChange={handleInputChange} formData={formData} updateOrder={updateOrder} 
        CONSIGNEE_STATUS={CONSIGNEE_STATUS} getNextAllowedStatuses={getNextAllowedStatuses} filters={filters} setFilters={setFilters} 
        getDispatcheddate={getDispatcheddate} getDispatchedTime={getDispatchedTime} actionBodyTemplate={actionBodyTemplate} multiSelectFilterTemplate={multiSelectFilterTemplate} 
        handleImageUpload={handleImageUpload}  />
      </div>
    </div>
  );
}

export default Dispatched;