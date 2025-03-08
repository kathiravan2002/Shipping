import mongoose from "mongoose";

const orderschema = mongoose.Schema({


    orderId: {type: String },

    ConsignerName: String,

    consignermobileNumber: String,

    consignerAddress: String,

    consignercity: String,

    consignerstate: String,

    consignerdistrict: String,

    consignerpincode: String,

    consignermail: String,

    productname: String,

    noofpackage: String,
    
    packageWeight: String,

    packagetype: String,

    price: String,

    instruction: String,

    Orderstatus: String,

    orderDate: {
      type: String,
      default: () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0"); 
        const month = String(today.getMonth() + 1).padStart(2, "0"); 
        const year = today.getFullYear();
        return `${day}-${month}-${year}`; 
      },
    },
      
    invoiceNo: {
        type: String},

    todayorderDate:{type: Date,
        default: Date.now,
    },

    dispatchpincode: String,

    dispatched:String,

    deliveryimage:String,

    currentRegion:{type:String},

    statusHistory: [{
      status: String,
      timestamp: {
          type: Date,
          default: Date.now
      },
      location: String,
      notes: String
  }],
  
})

const Order = mongoose.model("order", orderschema);
export default Order;