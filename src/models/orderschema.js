import mongoose from "mongoose";

const orderschema = mongoose.Schema({


    orderId: {type: String, },

    ConsignerName: String,

    consignermobileNumber: String,

    consignerAddress: String,

    consignercity: String,

    consignerstate: String,

    consignerdistrict: String,

    consignerpincode: String,

    consignermail: String,

    Consigneename: String,

    consigneemobileno: String,

    consigneealterno: String,

    consigneeaddress: String,

    consigneecity: String,

    consigneestate: String,

    consigneedistrict: String,

    consigneepin: String,

    productname: String,

    noofpackage: String,
    
    packageWeight: String,

    packagetype: String,

    price: String,

    instruction: String,

    Orderstatus: String,

    orderDate: {type: Date,
        default: Date.now,
    },

    invoiceNo: {
        type: String},

    dispatchpincode: String,

    deliveryimage:String,
})

const Order = mongoose.model("order", orderschema);
export default Order;