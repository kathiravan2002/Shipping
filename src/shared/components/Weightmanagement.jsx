import React, { useState } from "react";
import { CornerDownLeft } from 'lucide-react';

const Weightmanagement = () => {
    const [rows, setRows] = useState([
        { length: "", width: "", height: "", weight: "", packages: "1"},
    ]);
    const [freightRate, setFreightRate] = useState("");

    // Add a new line
    const addRow = () => {
        setRows([...rows, { length: "", width: "", height: "", weight: "", packages: "1" }]);
    };

    // Update a row's data
    const updateRow = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = parseFloat(value) || "";
        setRows(newRows);
    };

    // Calculate totals
    const totalPackages = rows.reduce((sum, row) => sum + (parseFloat(row.packages) || 0), 0);
    const totalWeight = rows.reduce((sum, row) => sum + (parseFloat(row.weight) || 0), 0);
    const totalVolumetricWeight = rows.reduce(
        (sum, row) =>
            sum + ((parseFloat(row.length) || 0) * (parseFloat(row.width) || 0) * (parseFloat(row.height) || 0)) / 5000,
        0
    );

    const chargeableWeight = Math.max(totalWeight, totalVolumetricWeight);
    const totalChargeableAmount = chargeableWeight * (parseFloat(freightRate) || 0);

    return (
        <>
        <div className="p-6 space-y-6  bg-white shadow-lg shadow-purple-300 rounded-lg">
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
                        <th className="border border-gray-300 p-2">Total Weight</th>
                        <th className="border border-gray-300 p-2">Volumetric Weight</th>
                        <th className="border border-gray-300 p-2">Total Volumetric Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">
                                <select className="border rounded p-1">
                                    <option value="cm">cm</option>
                                    <option value="in"></option>
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
                            <td className="border border-gray-300 p-2">{(row.weight || 0)*(row.packages || 0)} Kg</td>
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
                        </tr>
                    ))}
                    <tr className="bg-gray-100">
                        <td className="border border-gray-300 p-2" colSpan="5">
                            Totals
                        </td>
                        <td className="border border-gray-300 p-2">{totalPackages}</td>
                        <td className="border border-gray-300 p-2">{totalWeight.toFixed(2)*totalPackages} Kg</td>
                        <td className="border border-gray-300 p-2">
                            {totalVolumetricWeight.toFixed(2)*totalPackages} Kg
                        </td>
                        <td className="border border-gray-300 p-2">
                            {totalVolumetricWeight.toFixed(2)*totalPackages} Kg
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="flex justify-end" >
            <button className="text-blue-500 hover:underline flex justify-center" onClick={addRow}>
            Add Line <CornerDownLeft/>
            </button>
          </div>
        </div>
      {/* Freight Rate Section */ }
    <div className="p-6 space-y-6 mt-8 bg-white shadow-lg shadow-purple-300 rounded-lg">
        <div className="border-t pt-4 space-y-4">
            <div className="grid justify-self-center">
                <div>
                    <label className="block text-gray-600 ">Freight Rate Per (Kg):</label>
                    <input
                        type="number"
                        value={freightRate}
                        placeholder="Freight Rate"
                        onChange={(e) => setFreightRate(e.target.value)}
                        className="border p-2 rounded w-32"
                    />
                </div>
                <div>
                    <p>Chargeable Weight: {chargeableWeight.toFixed(2)} Kg</p>
                    <p>Volumetric Weight: {totalVolumetricWeight.toFixed(2)} Kg</p>
                    <p>Total Chargeable Amount: ${(totalChargeableAmount || 0).toFixed(2)}</p>
                </div>
            </div>
           
                

        </div>
    </div>
    </>
  );
};

export default Weightmanagement;
