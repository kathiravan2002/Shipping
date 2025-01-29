const generateOrderId = () => {
    const timestamp = Date.now().toString(36); // Convert current time to base-36
    const randomString = Math.random().toString(36).substring(2, 8); // Generate random base-36 string
    return `ORD-${timestamp}-${randomString}`; // Prefix with "ORD-"
};

const generateInvoiceId = () => {
    const timestamp = Date.now().toString(36); // Convert current time to base-36
    const randomString = Math.random().toString(36).substring(2, 8); // Generate random base-36 string
    return `INV-${timestamp}-${randomString}`; // Prefix with "INV-"
};

module.exports = { generateOrderId, generateInvoiceId };
