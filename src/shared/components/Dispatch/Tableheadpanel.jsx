/* eslint-disable react/prop-types */
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import Exportdata from "../User/Exportdata";

export default function Tableheadpanel ({dispatch,globalFilter,handleGlobalFilterChange,resetFilters}) {

    return (
        <>
         <div className="flex justify-between">
                <h1 className="mb-4 text-2xl font-bold">Dispatched Orders</h1>
                <div className="flex flex-col items-start justify-between w-full gap-4 sm:flex-row sm:items-center sm:w-auto">
                 <span className="p-input-icon-left">
                 <InputText
                    value={globalFilter}
                    onChange={handleGlobalFilterChange}
                    placeholder="Search "
                    className="px-2 py-2 border rounded-lg lg:w-full sm:w-24rem"
                  />
                    </span>
        
                    <Button
                    onClick={resetFilters}
                    className="px-3 py-2 text-sm font-medium text-purple-700 transition-all duration-300 bg-purple-100 rounded-lg shadow-sm hover:bg-purple-200"
                    icon="pi pi-filter-slash"
                  />
                  
                  
                  <button className=""><Exportdata data={dispatch} fileName="dispatchorders.csv"/></button>
                  <h1 className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-purple-600 rounded-md bg-purple-50 ">
                  Total Dispatched: <span className="text-xl">{dispatch.length}</span>
                </h1>
                </div>
              </div>
        </>
    )
}