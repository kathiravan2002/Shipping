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

    consigneeedistrict: String,

    consigneepin: String,

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
          return today.toISOString().split("T")[0]; // Extracts only 'YYYY-MM-DD'
        }
      },
      
    invoiceNo: {
        type: String},

    todayorderDate:{type: Date,
        default: Date.now,
    },

    dispatchpincode: String,

    dispatched:String,

    deliveryimage:String,

    currentRegion:String,

    statusHistory: [{
      status: String,
      timestamp: {
          type: Date,
          default: Date.now
      },
      location: String,
      notes: String
  }]
})

const Order = mongoose.model("order", orderschema);
export default Order;