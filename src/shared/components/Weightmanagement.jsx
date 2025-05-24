import { CornerDownLeft, Trash2 } from "lucide-react";

const Weightmanagement = ({rows,freightRate,setFreightRate,taxRate,setTaxRate,addRow,deleteRow,updateRow,totalPackages,totalWeight,totalVolumetricWeight,chargeableWeight,totalChargeableAmount,totalTax,totalWithTax}) => {
  

  return (
    <>
       <div className="bg-white rounded-lg space-y-6 shadow-[0_4px_12px_0_rgba(139,92,246,0.3)]">
      {/* Table Section */}
      <div className="p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left font-medium">S.No</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Length</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Width</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Height</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Gross Weight</th>
                <th className="border border-gray-300 p-2 text-left font-medium">No. of Packages</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Total Gross Weight</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Volumetric Weight</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Total Volumetric Weight</th>
                <th className="border border-gray-300 p-2 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={row.length}
                      placeholder="Length"
                      onChange={(e) => updateRow(index, "length", e.target.value)}
                      className="w-full border p-1.5 rounded text-sm focus:ring-2 focus:ring-purple-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={row.width}
                      placeholder="Width"
                      onChange={(e) => updateRow(index, "width", e.target.value)}
                      className="w-full border p-1.5 rounded text-sm focus:ring-2 focus:ring-purple-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={row.height}
                      placeholder="Height"
                      onChange={(e) => updateRow(index, "height", e.target.value)}
                      className="w-full border p-1.5 rounded text-sm focus:ring-2 focus:ring-purple-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={row.weight}
                      placeholder="Weight"
                      onChange={(e) => updateRow(index, "weight", e.target.value)}
                      className="w-full border p-1.5 rounded text-sm focus:ring-2 focus:ring-purple-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={row.packages}
                      placeholder="Packages"
                      onChange={(e) => updateRow(index, "packages", e.target.value)}
                      className="w-full border p-1.5 rounded text-sm focus:ring-2 focus:ring-purple-500"
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {(parseFloat(row.weight) || 0) * (parseFloat(row.packages) || 0)} Kg
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {(((row.length || 0) * (row.width || 0) * (row.height || 0)) / 5000).toFixed(2)} Kg
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {(
                      (((row.length || 0) * (row.width || 0) * (row.height || 0)) / 5000) *
                      (row.packages || 0)
                    ).toFixed(2)} Kg
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <button
                      className="text-red-500 hover:text-red-600 transition-colors"
                      onClick={() => deleteRow(index)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-medium">
                <td className="border border-gray-300 p-2" colSpan="5">
                  Totals
                </td>
                <td className="border border-gray-300 p-2 text-center">{totalPackages}</td>
                <td className="border border-gray-300 p-2 text-center">{totalWeight.toFixed(2)} Kg</td>
                <td className="border border-gray-300 p-2 text-center">
                  {totalVolumetricWeight.toFixed(2)} Kg
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {totalVolumetricWeight.toFixed(2)} Kg
                </td>
                <td className="border border-gray-300 p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="flex items-center justify-center px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors text-sm sm:text-base w-full sm:w-auto"
            onClick={addRow}
          >
            Add Product <CornerDownLeft className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Freight and Tax Section */}
      <div className="p-4 sm:p-6">
        <h3 className="font-semibold text-base sm:text-lg text-center mb-4">Enter Price</h3>
        <div className="grid gap-4 max-w-md mx-auto">
          {/* Freight Rate Input */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 text-sm sm:text-base">Price Per (Kg):</label>
            <div className="relative w-32 sm:w-36">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
              <input
                type="number"
                value={freightRate}
                onChange={(e) => setFreightRate(parseFloat(e.target.value))}
                className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md bg-purple-100 text-sm sm:text-base focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Tax Input */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 text-sm sm:text-base">Tax Rate (%):</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value))}
              className="w-32 sm:w-36 pl-2 pr-2 py-1.5 border border-gray-300 rounded-md bg-purple-100 text-sm sm:text-base focus:ring-2 focus:ring-purple-500"
              placeholder=""
            />
          </div>

          {/* Chargeable Weight */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 text-sm sm:text-base">Total Weight (Kg):</label>
            <p className="text-gray-700 font-medium text-sm sm:text-base">{chargeableWeight.toFixed(2)} Kg</p>
          </div>

          {/* Total Amount and Tax */}
          <div className="flex items-center justify-between">
            <label className="text-gray-700 text-sm sm:text-base">Total Amount:</label>
            <p className="text-gray-700 font-medium text-sm sm:text-base">₹{totalChargeableAmount.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-700 text-sm sm:text-base">Total Tax:</label>
            <p className="text-gray-700 font-medium text-sm sm:text-base">₹{totalTax.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <label className="font-semibold text-gray-700 text-sm sm:text-base">Total Amount (with Tax):</label>
            <p className="font-bold text-gray-800 text-sm sm:text-base">₹{totalWithTax.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Weightmanagement;