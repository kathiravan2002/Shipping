import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
   
  },
  date: {
    type: Date,
    default: Date.now,
  },
  billFrom: {
    companyName: String,
      
    
    address: String,
      
    
    phoneNumber: String,
      
    
  },
  billTo: {
    customerName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  termsAndConditions: {
    type: String,
    default: 'Payment is due upon receipt of the invoice.',
  },
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
