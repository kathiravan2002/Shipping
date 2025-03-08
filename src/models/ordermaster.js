import mongoose from "mongoose";


const ordermasterschema = mongoose.Schema({
   Coorderid: { 
    type: String,
    required: true  
  },
  getcurrentregion:{type:String},
  cid : String,
  Consigneename: String,
  consigneemobileno: String,
  consigneealterno: String,
  consigneeaddress: String,
  consigneecity: String,
  consigneestate: String,
  consigneeedistrict: String,
  consigneepin: String,
  typename: String,
  ptype: String,
  weight: String,
  packages: String,
  totalWeight: String,
  cpriceperkg: String, 
  cprice: String, 
  cstatus: String,
  productImage:String,
  statusHistory: [{
    status: String,
    timestamp: {
        type: String,
        default: Date.now
    },
    location: String,
    notes: String,
}],

});  
    
    const Ordermaster = mongoose.model("ordermaster", ordermasterschema);
    export default Ordermaster;