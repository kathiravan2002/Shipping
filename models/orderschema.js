const mongoose = require("mongoose")

const orderschema = mongoose.Schema({

    orderId: {
        type: String,

    },

    orderDate: String,
    
    customerName: String,

    contact: String,

    productName: String,

    

    amountPaid: String,
    
    status: String,



})

const order = mongoose.model("order", orderschema);
module.exports = order;