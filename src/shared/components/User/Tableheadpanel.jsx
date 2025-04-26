/* eslint-disable react/prop-types */
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Exportdata from "./Exportdata";

export default function Tableheadpanel ({globalFilter, setGlobalFilter, fetchFilteredUsers, resetAllFilters, handleAddUserClick, totalUsers, filterValues}) {
    return(

        <>
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
        </>
    )
}