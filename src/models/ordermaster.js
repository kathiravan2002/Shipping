import mongoose from "mongoose";

const ordermasterschema = mongoose.Schema({
   Coorderid: { 
    type: String,
    required: true  
  },
  cid : String,
  Consigneename: String,
  consigneemobileno: String,
  consigneealterno: String,
  consigneeaddress: String,
  consigneecity: String,
  consigneestate: String,
  consigneedistrict: String,
  consigneepin: String,
  typename: String,
  ptype: String,
  weight: String,
  packages: String,
  totalWeight: String,
  cpriceperkg: String, 
  cprice: String, 
  cstatus: String,
  productImage : String,
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

const Ordermaster = mongoose.model("ordermaster", ordermasterschema);
export default Ordermaster;       
