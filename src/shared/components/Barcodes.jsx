import React from "react";
import { Barcode } from "lucide-react";

const Barcodes = ({ barcode, orderId }) => {
  const downloadBarcode = (barcodeBase64, orderId) => {
    if (!barcodeBase64) {
      alert("No barcode available for download.");
      return;
    }

    // Convert Base64 to Blob
    const base64Data = barcodeBase64.split(",")[1]; // Remove "data:image/png;base64,"
    const binaryData = atob(base64Data);
    const byteArray = new Uint8Array(binaryData.length);

    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: "image/png" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `barcode_${orderId}.png`; // Set file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };
  

  return (
    <div className="flex flex-col items-center">
      {barcode ? (
        <>
          {/* Display the barcode image */}
          {/* <img
            src={barcode}
            alt={`Barcode for Order ID: ${orderId}`}
            className="w-32 h-16 object-contain"
          /> */}

          {/* Download button */}
          <button
            onClick={() => downloadBarcode(barcode, orderId)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            <Barcode size = {15} />
          </button>
        </>
      ) : (
        <p className="text-gray-500">No Barcode Available</p>
      )}
    </div>
  );
};

export default Barcodes;
