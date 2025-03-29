import React from 'react';
import { ArrowDownToLine } from 'lucide-react';

const Exportdata = ({ data, fileName }) => {
  const exportToFile = () => {
    if (!data || !data.length) {
      console.error('No data available to export.');
      return;
    }

   
    const headers = Object.keys(data[0]);

    
    const csvRows = [
      headers.join(','), 
      ...data.map(row =>
        headers.map(header => JSON.stringify(row[header] || '')).join(',')
      ),
    ];

    
    const csvString = csvRows.join('\n');

    
    const blob = new Blob([csvString], { type: 'text/csv' });

    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={exportToFile}  className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-purple-600 rounded-md bg-purple-50 ">
      Download CSV <ArrowDownToLine />
    </button>
  );
};

export default Exportdata;
