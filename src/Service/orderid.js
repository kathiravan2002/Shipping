export const generateOrderId = () => {
     
    const timestamp = moment().tz('Asia/Kolkata').format('YYYYMMDDHHmmss'); // Example: 20250121123045
    
    return `ORD-${timestamp}`; // Prefix with "ORD-"
};

export const generateInvoiceId = () => {
    
    const timestamp = moment().tz('Asia/Kolkata').format('YYYYMMDDHHmmss'); // Example: 20250121123045
     
    return `INV-${timestamp}`; // Prefix with "ORD-"
};