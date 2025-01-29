// const mongoose = require("mongoose");
import mongoose from "mongoose";
let orderCounter = 0;
const orderschema = mongoose.Schema({
    orderId: {
        type: String,
        
        default: function () {
   
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, ''); // Format date as YYYYMMDD
            const paddedCounter = orderCounter.toString().padStart(3, '1'); // Pad the counter to 3 digits
            orderCounter += 1; // Increment the counter
            return `ORD${formattedDate}${paddedCounter}`; // Example: ORD20241224001
        },
        unique: true, // Ensures no duplicate order IDs
    },

    ConsignerName: String,

    consignermobileNumber: String,

    consignerAddress: String,

    consignermail : String,

    consignerstate: String,
    
    consignerdistrict:String,

    consignerpincode: String,
   
    Consigneename: String,
    
    consigneemobileno: String,

    consigneealterno: String,

    consigneeaddress: String,

    consigneestate: String,

    consigneedistrict: String,

    consigneepin: String,

    productname: String,

    noofpackage : String,

    packageWeight: String,

    packagetype: String,

    price: String,

    instruction: String,

    orderDate: {
        type: Date,
        default: Date.now
    }

})

const Order = mongoose.model("order", orderschema);
export default Order;