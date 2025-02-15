import React from "react";
import { CornerDownLeft, Trash2 } from "lucide-react";

const Weightmanagement = ({rows,freightRate,setFreightRate,taxRate,setTaxRate,addRow,deleteRow,updateRow,totalPackages,totalWeight,totalVolumetricWeight,chargeableWeight,totalChargeableAmount,totalTax,totalWithTax}) => {
  

  return (
    <>
      <div className="p-6 space-y-6 bg-white shadow-lg shadow-violet-400 rounded-lg">
        {/* Table Section */}
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2">S.No</th>
              <th className="border border-gray-300 p-2">Length</th>
              <th className="border border-gray-300 p-2">Width</th>
              <th className="border border-gray-300 p-2">Height</th>
              <th className="border border-gray-300 p-2">Gross Weight</th>
              <th className="border border-gray-300 p-2">No. of Packages</th>
              <th className="border border-gray-300 p-2">Total Gross Weight</th>
              <th className="border border-gray-300 p-2">Volumetric Weight</th>
              <th className="border border-gray-300 p-2">Total Volumetric Weight</th>
              <th className="border border-gray-300 p-2">Action</th>
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
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={row.width}
                    placeholder="Width"
                    onChange={(e) => updateRow(index, "width", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={row.height}
                    placeholder="Height"
                    onChange={(e) => updateRow(index, "height", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={row.weight}
                    placeholder="Weight"
                    onChange={(e) => updateRow(index, "weight", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={row.packages}
                    placeholder="Packages"
                    onChange={(e) => updateRow(index, "packages", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  {(parseFloat(row.weight) || 0) * (parseFloat(row.packages) || 0)} Kg
                </td>
                <td className="border border-gray-300 p-2">
                  {(((row.length || 0) * (row.width || 0) * (row.height || 0)) / 5000).toFixed(2)} Kg
                </td>
                <td className="border border-gray-300 p-2">
                  {(
                    (((row.length || 0) * (row.width || 0) * (row.height || 0)) / 5000) *
                    (row.packages || 0)
                  ).toFixed(2)} Kg
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    className="text-red-500 hover:underline hover:text-red-600"
                    onClick={() => deleteRow(index)}
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100">
              <td className="border border-gray-300 p-2" colSpan="6">
                Totals
              </td>
              <td className="border border-gray-300 p-2">{totalPackages}</td>
              <td className="border border-gray-300 p-2">{totalWeight.toFixed(2)} Kg</td>
              <td className="border border-gray-300 p-2">
                {totalVolumetricWeight.toFixed(2)} Kg
              </td>
              <td className="border border-gray-300 p-2">
                {totalVolumetricWeight.toFixed(2)} Kg
              </td>
              <td className="border border-gray-300 p-2"></td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end">
          <button
            className="text-white border p-2 rounded bg-purple-500 flex items-center"
            onClick={addRow}
          >
            Add Product <CornerDownLeft className="ml-2" />
          </button>
        </div>
      </div>

      {/* Freight and Tax Section */}
      <div className="p-6 mt-8 bg-white shadow-lg shadow-violet-400 rounded-lg space-y-6">
        <h3 className="font-semibold text-lg text-center">Enter price </h3>
        <div className="grid justify-self-center">
          {/* Freight Rate Input */}
          <div className="flex items-center">
            <label className="text-gray-700 mr-2">Price Per (Kg):</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
              <input
                type="number"
                value={freightRate}
                onChange={(e) => setFreightRate(parseFloat(e.target.value))}
                className="pl-8 pr-2 py-1 border border-gray-300 rounded-md bg-purple-100 w-32"
              />
            </div>
          </div>

          {/* Tax Input */}
          <div className="flex items-center mt-4">
            <label className="text-gray-700 mr-2">Tax Rate (%):</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) / 100)}
              className="pl-2 pr-2 py-1 border border-gray-300 rounded-md bg-purple-100 w-32"
              placeholder=""
            />
          </div>

          {/* Chargeable Rate */}
          <div className="flex justify-between items-center mt-4">
            <label className="text-gray-700">Chargeable Weight (Kg):</label>
            <p className="text-gray-700 font-medium">{chargeableWeight.toFixed(2)} Kg</p>
          </div>

          {/* Total Amount and Tax */}
          <div className="flex justify-between items-center mt-4">
            <label className="text-gray-700">Total Amount:</label>
            <p className="text-gray-700 font-medium">₹{totalChargeableAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center">
            <label className="text-gray-700">Total Tax:</label>
            <p className="text-gray-700 font-medium">₹{totalTax.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center pt-4">
            <label className="font-semibold text-gray-700">Total Amount (with Tax):</label>
            <p className="font-bold text-gray-800">₹{totalWithTax.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Weightmanagement;