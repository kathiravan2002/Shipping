/* eslint-disable react/prop-types */
import { Search } from "lucide-react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export default function MyorderHeader({searchQuery, handleSearchChange, handleClearAllFilters, myorder}) {

    return(
        <>
             <header className="flex flex-col justify-between gap-4 mb-4 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-semibold">My Region Orders</h3>
                </div>
                <div className="flex justify-center flex-1 gap-10">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                    <InputText
                      type="text"
                      placeholder="Search for Order ID or Consigneer Name"
                      className="w-full py-2 pl-10 pr-4 text-sm border rounded-md"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div>
                    <Button
                      icon="pi pi-filter-slash"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 transition-all duration-300 bg-purple-100 rounded-lg shadow-sm hover:bg-purple-200"
                      onClick={handleClearAllFilters}
                    />
                  </div>
                  
                </div>
                <h1 className="justify-end text-purple-500 flext">Total My order :<span className="text-lg"> {myorder.length}</span></h1>
        
              </header>
        </>
    )
}