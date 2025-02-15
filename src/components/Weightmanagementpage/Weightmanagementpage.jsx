import React, { useState } from 'react'
import Weightmanagement from '../../shared/components/Weightmanagement'

function Weightmanagementpage() {

  const [rows, setRows] = useState([
    { length: "", width: "", height: "", weight: "", packages: "1" },
  ]);
  const [freightRate, setFreightRate] = useState("");
  const [taxRate, setTaxRate] = useState("");

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
  const totalWeight = rows.reduce(
    (sum, row) => sum + (parseFloat(row.weight) || 0) * (parseFloat(row.packages) || 0),
    0
  );
  const totalVolumetricWeight = rows.reduce(
    (sum, row) =>
      sum +
      ((parseFloat(row.length) || 0) * (parseFloat(row.width) || 0) * (parseFloat(row.height) || 0)) /
      5000 *
      (parseFloat(row.packages) || 0),
    0
  );

  const chargeableWeight = Math.max(totalWeight, totalVolumetricWeight);
  const totalChargeableAmount = chargeableWeight * (parseFloat(freightRate) || 0);
  const totalTax = totalChargeableAmount * (parseFloat(taxRate) / 100 || 0);                        //mrng work change the totaltax 
  const totalWithTax = totalChargeableAmount + totalTax;

  return (
    <div><Weightmanagement totalWithTax={totalWithTax} totalTax={totalTax}  totalChargeableAmount={totalChargeableAmount} chargeableWeight={chargeableWeight} taxRate={taxRate}  freightRate={freightRate} updateRow={updateRow} deleteRow={deleteRow} addRow={addRow}  rows={rows} totalPackages={totalPackages}  totalWeight={totalWeight} totalVolumetricWeight={totalVolumetricWeight}/></div>
  )
}

export default Weightmanagementpage;