/* eslint-disable react/prop-types */
import { Search } from "lucide-react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import Exportdata from "../User/Exportdata";

export default function Tableheader ({order, lazyState, handleSearchChange, handleClearAllFilters, handleStatusChange, navigate, searchQuery}) {

    return (
        <>
         <header className="flex flex-col justify-between gap-4 mb-6 sm:gap-6 md:flex-row md:items-center">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">Order List</h1>
          <Button
            icon="pi pi-list-check"
            label="My Order"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 transition-all duration-300 bg-purple-100 rounded-lg shadow-sm hover:bg-purple-200"
            onClick={() => navigate("/Myorder")}
          />
        </div>
        <div className="flex justify-center flex-1 w-full sm:w-auto">
          <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg">
            <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <InputText
              type="text"
              placeholder="Search for Order ID or Consigneer Name"
              className="w-full py-2 pl-10 pr-4 text-sm transition-all duration-200 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button
            icon="pi pi-filter-slash"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 transition-all duration-300 bg-purple-100 rounded-lg shadow-sm hover:bg-purple-200"
            onClick={handleClearAllFilters}
          />
          <Button
            icon="pi pi-plus"
            label="Add Order"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 transition-all duration-300 bg-purple-100 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700"
            onClick={() => navigate("/Addorder")}
          />
          <Dropdown
            value={lazyState.status}
            options={[
              { label: "All Orders", value: " " },
              { label: "Placed Order", value: "Order Placed" },
              { label: "Partial Order", value: "Partial" },
              { label: "Delivered Order", value: "Delivered" },
            ]}
            onChange={handleStatusChange}
            placeholder="Select Order Status"
            className="border-gray-300 rounded-lg shadow-sm p-dropdown bg-gray-50"
          />
          <Exportdata data={order} fileName="orders.csv" />
        </div>
      </header>
        </>
    )
}