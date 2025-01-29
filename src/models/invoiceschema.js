import mongoose from "mongoose";


const invoiceschema = new mongoose.Schema({
  invoiceNumber: { 
    type: String,
    required: true 
  },

  date: {
     type: Date,
     default: Date.now
  },
  senderDetails: {
    name: String,
    address: String,
    phone: String,
  },
  recipientDetails: {
    name: String,
    address: String,
    phone: String,
  },
  items: [
    {
      description: String,
      quantity: Number,
      price: Number,
      total: Number,
    },
  ],
  totalAmount: { type: Number, required: true },
});

 const Invoice= mongoose.model('Invoice', invoiceschema);
 export default Invoice;
