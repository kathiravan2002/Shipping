import mongoose from "mongoose";
import Adduser from "../models/adduserschema.js";

const orderschema = mongoose.Schema({

    orderId:  String,

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

    Orderstatus : String,

    consignercity : String,

    consigneecity : String,


    orderDate: {
        type: String ,
        default: () => {
            const today = new Date();
            return today.toISOString().split("T")[0];
        } 
    },
    invoiceNo: {
        type :String
    },
   
    todayorderDate : {
        type: Date,
        default:Date.now,
    },

    dispatchpincode : String,
    
    dispatched: String,

    deliveryimage : String,

    currentRegion : String,
    
    statusHistory: [{
        status: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        location: String,
        notes: String
    }]

    
        
   

});

const Order = mongoose.model("order", orderschema);
export default Order;