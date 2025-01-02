const mongoose = require("mongoose")
// const { v4: uuidv4 } = require('uuid');
let orderCounter = 0; 
const orderschema = mongoose.Schema({

    orderId: {
        type: String,
        
        default: function () {
            // let orderCounter = 0;
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, ''); // Format date as YYYYMMDD
            const paddedCounter = orderCounter.toString().padStart(3, '0'); // Pad the counter to 3 digits
            orderCounter += 1; // Increment the counter
            return `ORD${formattedDate}${paddedCounter}`; // Example: ORD20241224001
        },
        unique: true, // Ensures no duplicate order IDs
    },

    ConsignerName: String,

    consignermobileNumber: String,

    consignerAddress: String,

    consignerstate: String,

    consignerdistrict: String,

    consignerpincode: String,

    Consigneename: String,

    consigneemobileno: String,

    consigneealterno: String,

    consigneeaddress: String,

    consigneestate: String,

    consigneedistrict: String,

    consigneepin: String,

    productname: String,

    packageWeight: String,

    packagetype: String,

    price: String,

    instruction: String

})

const order = mongoose.model("order", orderschema);
module.exports = order;