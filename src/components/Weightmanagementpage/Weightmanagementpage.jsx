import React, { useState }  from 'react'
import Weightmanagement from '../../shared/components/Weightmanagement'

function Weightmanagementpage() {

    const [rows, setRows] = useState([
      { length: "", width: "", height: "", weight: "", packages: "" },
    ]);
    const [freightRate, setFreightRate] = useState("");
    const [taxRate, setTaxRate] = useState("");
  
    // Add a new line
    const addRow = () => {
      setRows([...rows, { length: "", width: "", height: "", weight: "", packages: "" }]);
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
    const totalTax = totalChargeableAmount / 100 * (parseFloat(taxRate) || 0);                         
    const totalWithTax = totalChargeableAmount + totalTax;
  
  return (
    <div>
      <Weightmanagement rows={rows} freightRate={freightRate} setFreightRate={setFreightRate} taxRate={taxRate} setTaxRate={setTaxRate} addRow={addRow} deleteRow={deleteRow} updateRow={updateRow} totalPackages={totalPackages} totalWeight={totalWeight} totalVolumetricWeight={totalVolumetricWeight} chargeableWeight={chargeableWeight} totalChargeableAmount={totalChargeableAmount} totalTax={totalTax} totalWithTax={totalWithTax} />
    </div>
  )
}

export default Weightmanagementpage;