/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import Datatable from "./Datatable";
import Tableheader from "./Tableheader";

const Orderheader = (props) => {
  const {
    rowExpansionTemplate,
    expandedRows,
    setExpandedRows,
    navigate,
    order,
    totalRecords,
    loading,
    searchQuery,
    currentPage,
    lazyState,
    onPage,
    onSort,
    onFilter,
    handleStatusChange,
    handleSearchChange,
    handleClearAllFilters,
    actionBodyTemplate,
    consignerNames,
    orderStatuses,
    consignerCities,
    OrderDate,
    OrderId,
    conrDistrict,
  } = props;

  // Declare all state hooks at the top level
  const [filterValues, setFilterValues] = useState({
    consignerNames: [],
    orderStatuses: [],
    consignerCities: [],
    orderDates: [],
    orderIds: [],
    conrDistricts: [],
    consignerPincodes: [],
  });

 

  const applyFilter = (field, value) => {
    onFilter({
      filters: {
        ...lazyState.filters,
        [field]: { value, matchMode: lazyState.filters[field]?.matchMode || "in" },
      },
    });
   
  };
  
  const clearFilter = (field) => {
    
    onFilter({
      filters: {
        ...lazyState.filters,
        [field]: { value: null, matchMode: lazyState.filters[field]?.matchMode || "in" },
      },
    });
  };

  const consignerNameFilterTemplate = () => {
    return (
      <MultiSelect
        value={filterValues.consignerNames}
        options={consignerNames?.map((name) => ({ label: name, value: name })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, consignerNames: e.value || [] }));
        }}
        panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, consignerNames: [] }));

                clearFilter("ConsignerName");
                props.hide(); 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("ConsignerName", filterValues.consignerNames);
                props.hide();
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search names..."
        disabled={!consignerNames?.length}
      />
    );
  };
  const orderStatusFilterTemplate = () => {
    return (
      <MultiSelect
        value={filterValues.orderStatuses}
        options={orderStatuses?.map((status) => ({ label: status, value: status })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, orderStatuses: e.value || [] }));
        }}
        panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, orderStatuses: [] }));

                clearFilter("Orderstatus");
                props.hide(); 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("Orderstatus", filterValues.orderStatuses);
                props.hide();
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="w-full p-multiselect"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search statuses..."
        disabled={!orderStatuses?.length}
      />
    );
  };

  const consignerCityFilterTemplate = () => {
    return (
      <MultiSelect
        value={filterValues.consignerCities}
        options={consignerCities?.map((city) => ({ label: city, value: city })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, consignerCities: e.value || [] }));
        }}
        panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, consignerCities: [] }));

                clearFilter("consignercity");
                props.hide(); 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("consignercity", filterValues.consignerCities);
                props.hide(); 
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="w-full p-multiselect"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search cities..."
        disabled={!consignerCities?.length}
      />
    );
  };

  const orderDateFilterTemplate = () => {
    return (
      <MultiSelect
        value={filterValues.orderDates}
        options={OrderDate?.map((date) => ({ label: date, value: date })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, orderDates: e.value || [] }));
        }}
        panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, orderDates: [] }));

                clearFilter("orderDate");
                props.hide(); 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("orderDate", filterValues.orderDates);
                props.hide();
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="w-full p-multiselect"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search dates..."
        disabled={!OrderDate?.length}
      />
    );
  };

  const orderIdFilterTemplate = () => {
    return (
      <MultiSelect
        value={filterValues.orderIds}
        options={OrderId?.map((id) => ({ label: id, value: id })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, orderIds: e.value || [] }));
        }}
        panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, orderIds: [] }));

                clearFilter("orderId");
                props.hide(); // 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("orderId", filterValues.orderIds);
                props.hide(); // 
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="w-full p-multiselect"
        maxSelectedLabels={1}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search order IDs..."
        disabled={!OrderId?.length}
      />
    );
  };

  const conrDistrictFilterTemplate = () => {
    return (
      <MultiSelect
        value={filterValues.conrDistricts}
        options={conrDistrict?.map((district) => ({ label: district, value: district })) || []}
        onChange={(e) => {
          setFilterValues((prev) => ({ ...prev, conrDistricts: e.value || [] }));
        }}
        orderId panelFooterTemplate={(props) => (
          <div className="flex justify-between p-2 mt-2">
            <Button 
              label="Clear" 
              onClick={() => {
                setFilterValues((prev) => ({ ...prev, conrDistricts: [] }));

                clearFilter("consignerdistrict");
                props.hide(); 
              }} 
              className="p-1 text-white bg-purple-400 w-[45%]" 
            /> 
            <Button 
              label="Apply" 
              onClick={() => {
                applyFilter("consignerdistrict", filterValues.conrDistricts);
                props.hide(); 
              }} 
              className="p-1 mx-1 text-white bg-purple-400 w-[45%]" 
            />
          </div>
        )}
        placeholder="Any"
        className="w-full p-multiselect"
        maxSelectedLabels={3}
        selectedItemsLabel="{0} items selected"
        filter
        filterPlaceholder="Search districts..."
        disabled={!conrDistrict?.length}
      />
    );
  };

  return (
    <div className="w-full p-3 mx-auto mt-2 transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-xl sm:p-5 md:p-6 lg:p-4 lg:mt-0">
      <Tableheader order={order} lazyState={lazyState} handleSearchChange={handleSearchChange} handleClearAllFilters={handleClearAllFilters} 
      handleStatusChange={handleStatusChange} navigate={navigate} searchQuery={searchQuery}/>
      <Datatable order={order} lazyState={lazyState} onPage={onPage} onSort={onSort} onFilter={onFilter} loading={loading} expandedRows={expandedRows} 
      setExpandedRows={setExpandedRows} rowExpansionTemplate={rowExpansionTemplate} 
    actionBodyTemplate={actionBodyTemplate} orderIdFilterTemplate={orderIdFilterTemplate} orderDateFilterTemplate={orderDateFilterTemplate} 
    orderStatusFilterTemplate={orderStatusFilterTemplate} consignerNameFilterTemplate={consignerNameFilterTemplate} consignerCityFilterTemplate={consignerCityFilterTemplate} 
    conrDistrictFilterTemplate={conrDistrictFilterTemplate} totalRecords={totalRecords} currentPage={currentPage}/>
    </div>
  );
};

export default Orderheader;