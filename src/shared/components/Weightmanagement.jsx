import React, { useState } from "react";
import { CornerDownLeft } from 'lucide-react';

const Weightmanagement = () => {
  const [rows, setRows] = useState([
    { length: "", width: "", height: "", weight: "", packages: "1" },
  ]);
  const [freightRate, setFreightRate] = useState("");

  // Add a new line
  const addRow = () => {
    setRows([...rows, { length: "", width: "", height: "", weight: "", packages: "1" }]);
  };

  // Delete a row
  const deleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Update a row's data
  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = parseFloat(value) || "";
    setRows(newRows);
  };

  // Calculate totals
  const totalPackages = rows.reduce((sum, row) => sum + (parseFloat(row.packages) || 0), 0);
  const totalWeight = rows.reduce((sum, row) => sum + (parseFloat(row.weight) || 0) * (parseFloat(row.packages) || 0), 0);
  const totalVolumetricWeight = rows.reduce((sum, row) =>
    sum + ((parseFloat(row.length) || 0) * (parseFloat(row.width) || 0) * (parseFloat(row.height) || 0)) / 5000 * (parseFloat(row.packages) || 0),
    0
  );

  const chargeableWeight = Math.max(totalWeight, totalVolumetricWeight);
  const totalChargeableAmount = chargeableWeight * (parseFloat(freightRate) || 0);

  return (
    <>
      <div className="p-6 space-y-6 bg-white shadow-lg shadow-violet-400 rounded-lg">
        {/* Table Section */}
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2">Unit of Measure</th>
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
                <td className="border border-gray-300 p-2">
                  <select className="border rounded p-1">
                    <option value="cm">cm</option>
                  </select>
                </td>
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
                  ).toFixed(2)}{" "}
                  Kg
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => deleteRow(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100">
              <td className="border border-gray-300 p-2" colSpan="5">
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
            Add Line <CornerDownLeft className="ml-2" />
          </button>
        </div>
      </div>

      {/* Freight Rate Section */}
      <div className="p-6 mt-8 bg-white shadow-lg shadow-violet-400 rounded-lg space-y-6">
        <h3 className="font-semibold text-lg text-center">Enter Freight Rate to move this Cargo</h3>
        <div className="grid justify-self-center">
          {/* Freight Rate Input */}
          <div className="flex items-center">
            <label className="text-gray-700 mr-2">Freight Rate Per (Kg):</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
              <input
                type="number"
                value={freightRate}
                onChange={(e) => setFreightRate(parseFloat(e.target.value))}
                className="pl-8 pr-2 py-1 border border-gray-300 rounded-md bg-purple-100 w-32"
              />
            </div>
          </div>

          {/* Chargeable Rate */}
          <div className="flex justify-between items-center">
            <label className="text-gray-700">Chargeable Rate (Kg):</label>
            <p className="text-gray-700 font-medium">{chargeableWeight.toFixed(2)} Kg</p>
          </div>

          {/* Total Chargeable Amount */}
          <div className="flex justify-between items-center pt-4">
            <label className="font-semibold text-gray-700">Total Chargeable Amount:</label>
            <p className="font-bold text-gray-800">${totalChargeableAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Weightmanagement;
