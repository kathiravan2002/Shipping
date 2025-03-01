import mongoose from "mongoose";

const orderschema = mongoose.Schema({

    orderId:  {
        type : String,
    },

    ConsignerName: String,        
    consignermobileNumber: String,         
    consignerAddress: String,        
    consignermail : String,       
    consignerstate: String,          
    consignerdistrict:String,       
    consignerpincode: String,         
    productname: String,       
    noofpackage : String,       
    packageWeight: String,       
    packagetype: String,       
    price: String,        
    instruction: String,       
    Orderstatus : String,
    consignercity : String,
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
        type: String,
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
    }],
   

});

const Order = mongoose.model("Order", orderschema);
export default Order;