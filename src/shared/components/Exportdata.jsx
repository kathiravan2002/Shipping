import React from 'react';
import { ArrowDownToLine } from 'lucide-react';

const Exportdata = ({ data, fileName }) => {
  const exportToFile = () => {
    if (!data || !data.length) {
      console.error('No data available to export.');
      return;
    }

    // Extract headers from the first data object
    const headers = Object.keys(data[0]);

    // Create CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row =>
        headers.map(header => JSON.stringify(row[header] || '')).join(',')
      ),
    ];

    // Combine rows into a single CSV string
    const csvString = csvRows.join('\n');

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={exportToFile}  className="flex items-center gap-2 px-3 py-2 text-purple-600 bg-purple-50 rounded-md text-sm">
      Download CSV <ArrowDownToLine />
    </button>
  );
};

export default Exportdata;
